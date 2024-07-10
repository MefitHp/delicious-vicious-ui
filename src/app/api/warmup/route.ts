import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  const url = "https://www.delicious-vicious.com/productos";

  // Create a timeout promise
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), 20000)
  );

  try {
    // Race between the fetch request and the timeout promise
    await Promise.race([fetch(url), timeout]);

    return NextResponse.json({ status: 200, message: "Server is warm" });
  } catch (error: any) {
    if (error.message === "Timeout") {
      return NextResponse.json({
        status: 200,
        message: "Request is still processing",
      });
    }
    return NextResponse.json({ status: 500, message: "An error occurred" });
  }
}
