
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { NextResponse } from "next/server";


export async function POST(request: { json: () => PromiseLike<{ from: any; to: any; subject: any; text: any; }> | { from: any; to: any; subject: any; text: any; }; }) {
  const { from, to, subject, text } = await request.json();
  
  console.log("Data Recieved:", from);
  try {
    

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    } as SMTPTransport.Options);

    // let toAddresses = to;
    // if (!Array.isArray(to)) {
    //   toAddresses = [to];
    // }

    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      text: text,
      html: "<p><b>Hello</b> to myself!</p>",
    };

    await transporter.sendMail(mailOptions);
    console.log("Email notification sent");
    return NextResponse.json({
      status: 200,
      message: "Email notification sent successfully.",
    });
  } catch (error) {
    console.error("Error sending email notification:", error);
    return NextResponse.json({
      status: 500,
      message: "Failed to send email notification.",
      error: error,
    });
  }
}

// import nodemailer from "nodemailer";
// import SMTPTransport from "nodemailer/lib/smtp-transport";
// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     const { from, to, subject, text } = req.body;

//     const transporter = nodemailer.createTransport({
//       host: process.env.MAIL_HOST,
//       port: Number(process.env.MAIL_PORT),
//       secure: false,
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASSWORD,
//       },
//     } as SMTPTransport.Options);

//     const mailOptions = {
//       from: from,
//       to: to,
//       subject: subject,
//       text: text,
//       html: "<p><b>Hello</b> to myself!</p>",
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("Email notification sent");
//     return res.status(200).json({
//       status: 200,
//       message: "Email notification sent successfully.",
//     });
//   } catch (error) {
//     console.error("Error sending email notification:", error);
//     return res.status(500).json({
//       status: 500,
//       message: "Failed to send email notification.",
//       error: error,
//     });
//   }
// }
