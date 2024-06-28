import { Resend } from "resend";
import { render } from "@react-email/render";
import EmailTemplate from "@/components/EmailTemplate";
import { NextResponse } from "next/server";

// To handle a POST request to /api
export async function POST(req: Request) {
  const body = await req.json();

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const response = await resend.emails.send({
      from: "Delicious Vicious <info@delicious-vicious.com>",
      to: body.email,
      subject: "Confirmación de orden",
      html: render(EmailTemplate(body)),
    });

    return NextResponse.json({
      error: null,
      success: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { error: "Internal Server Error Handled", details: error.message },
        { status: 500 }
      );
    }
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Internal Server Error Handled", details: error },
      { status: 500 }
    );
  }
}
