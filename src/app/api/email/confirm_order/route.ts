import { Resend } from "resend";
import { render } from "@react-email/render";
import EmailTemplate from "@/components/EmailTemplate";
import { NextResponse } from "next/server";

// To handle a POST request to /api
export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const response = await resend.emails.send({
      from: "Delicious Vicious <info@delicious-vicious.com>",
      to: body.email,
      subject: "Confirmación de orden",
      html: render(EmailTemplate(body)),
    });

    console.log({ response });
    return NextResponse.json({
      error: null,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error Handled" },
      { status: 500 }
    );
  }
}
