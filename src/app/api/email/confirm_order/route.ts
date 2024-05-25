import { Resend } from "resend";
import { render } from "@react-email/render";
import EmailTemplate from "@/components/EmailTemplate";

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
      html: render(EmailTemplate({ nombre: body.nombre })),
    });

    console.log({ response });
    return Response.json({
      error: null,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return Response.error();
  }
}
