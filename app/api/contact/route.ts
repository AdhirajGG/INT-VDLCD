// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  // 1) Parse incoming JSON
  let body: { name?: string;  phone?: string; message?: string };
  try {
    body = await request.json();
  } catch (parseErr) {
    console.error("[CONTACT_POST] JSON parse error:", parseErr);
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const { name,  phone, message } = body;

  // 2) Validate inputs
  if (!name  || !phone || !message) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  if (!/^[A-Za-z\s]+$/.test(name)) {
    return NextResponse.json(
      { error: "Name must contain only letters and spaces." },
      { status: 400 }
    );
  }

  // if (!/^\S+@\S+\.\S+$/.test(email)) {
  //   return NextResponse.json(
  //     { error: "Invalid email format." },
  //     { status: 400 }
  //   );
  // }

  // Simple phone validation (at least 5 digits)
  if (!/^[0-9\s+()\-]{5,20}$/.test(phone)) {
    return NextResponse.json(
      { error: "Invalid phone number format." },
      { status: 400 }
    );
  }

  // 3) Ensure environment variables are set
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASS = process.env.ADMIN_EMAIL_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASS) {
    console.error(
      "[CONTACT_POST] Missing SMTP credentials. " +
        `ADMIN_EMAIL=${ADMIN_EMAIL}, ADMIN_EMAIL_PASSWORD=${ADMIN_PASS}`
    );
    return NextResponse.json(
      { error: "Server is not configured correctly (email credentials missing)." },
      { status: 500 }
    );
  }

  try {
    // 4) Save to database
    await prisma.contactSubmission.create({
      data: {
        name,
        phone,
        message,
      },
    });
  } catch (dbErr: any) {
    console.error("[CONTACT_POST] Database error:", dbErr);
    return NextResponse.json(
      { error: "Failed to save contact information." },
      { status: 500 }
    );
  }

  try {
    // 5) Create a transporter with explicit Gmail SMTP settings
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // TLS
      auth: {
        user: ADMIN_EMAIL,
        pass: ADMIN_PASS,
      },
    });

    // 6) Verify the connection configuration before sending
    await transporter.verify();

    // 7) Build the email
    const mailOptions = {
      from: ADMIN_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Phone: ${phone}
        Message: ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p>Sent from VDLCD website at ${new Date().toLocaleString()}</p>
      `,
    };

    // 8) Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("[CONTACT_POST] Email sent:", info.messageId);

    return NextResponse.json({ success: true });
  } catch (emailErr: any) {
    console.error("[CONTACT_POST] Error sending email:", emailErr);
    return NextResponse.json(
      { error: "Failed to send notification email." },
      { status: 500 }
    );
  }
}