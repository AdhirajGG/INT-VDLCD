// //app/api/contact/route.ts
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

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();
  
  // Validate inputs
  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }
  
  if (!/^[A-Za-z\s]+$/.test(name)) {
    return NextResponse.json({ error: "Name must contain only letters" }, { status: 400 });
  }
  
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
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

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CONTACT_POST]", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}