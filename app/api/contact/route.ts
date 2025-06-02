
// import { NextRequest, NextResponse } from "next/server";
// import nodemailer from "nodemailer";

// export async function POST(req: NextRequest) {
//   const { name, email } = await req.json();
  
//   // Validate inputs
//   if (!name || !email) {
//     return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
//   }
  
//   if (!/^[A-Za-z\s]+$/.test(name)) {
//     return NextResponse.json({ error: "Name must contain only letters" }, { status: 400 });
//   }
  
//   if (!/^\S+@\S+\.\S+$/.test(email)) {
//     return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: process.env.ADMIN_EMAIL,
//         pass: process.env.ADMIN_EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.ADMIN_EMAIL,
//       to: process.env.ADMIN_EMAIL,
//       subject: "New Consultation Request",
//       html: `
//         <h3>New Consultation Request</h3>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
//         <hr>
//         <p>This request was submitted from the VDLCD website.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("[CONTACT_POST]", error);
//     return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
//   }
// }

// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  // 1) Parse incoming JSON
  let body: { name?: string; email?: string };
  try {
    body = await req.json();
  } catch (parseErr) {
    console.error("[CONTACT_POST] JSON parse error:", parseErr);
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const { name, email } = body;

  // 2) Validate inputs
  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 }
    );
  }

  if (!/^[A-Za-z\s]+$/.test(name)) {
    return NextResponse.json(
      { error: "Name must contain only letters and spaces." },
      { status: 400 }
    );
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format." },
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
    // 4) Create a transporter with explicit Gmail SMTP settings
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // TLS
      auth: {
        user: ADMIN_EMAIL,
        pass: ADMIN_PASS,
      },
    });

    // 5) Verify the connection configuration before sending
    await transporter.verify();
  } catch (verifyErr: any) {
    console.error("[CONTACT_POST] SMTP verification failed:", verifyErr);
    return NextResponse.json(
      {
        error:
          "SMTP configuration problem. " +
          "Check your Gmail credentials (maybe you need an App Password).",
      },
      { status: 500 }
    );
  }

  try {
    // 6) Build the email
    const mailOptions = {
      from: ADMIN_EMAIL,
      to: ADMIN_EMAIL, // send the notification to yourself
      subject: "New Consultation Request",
      html: `
        <h3>New Consultation Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p>This request was submitted from the VDLCD website.</p>
      `,
    };

    // 7) Send the email
    const info = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: ADMIN_EMAIL, pass: ADMIN_PASS },
    }).sendMail(mailOptions);

    console.log("[CONTACT_POST] Email sent:", info.messageId);
    return NextResponse.json({ success: true });
  } catch (sendErr: any) {
    console.error("[CONTACT_POST] Error sending email:", sendErr);
    // Don’t expose full SMTP stack to client—just log internally and return a generic message.
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
