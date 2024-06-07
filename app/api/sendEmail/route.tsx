
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


// // Configure Nodemailer
// const transporter = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: Number(process.env.MAIL_PORT),
//   secure: process.env.NODE_ENV !== "production", // Use `true` for port 465, `false` for all other ports
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASSWORD,
//   },
// });

// // emailService.js
// export function sendEmail( from: string, to: string,subject: string,text: string, callback: { (): void; (): void; }) {
//   const mailOptions = {
//     from: from,
//     to: to,
//     subject: subject,
//     text: text,
//   };

//   transporter.sendMail(mailOptions, function (error: any, info: { response: string; }) {
//     if (error) {
//       console.error("Error sending email notification: ", error);
//     } else {
//       console.log("Email notification sent: " + info.response);
//       // Call the callback function if provided
//       if (callback) {
//         callback();
//       }
//     }
//   });
// }
