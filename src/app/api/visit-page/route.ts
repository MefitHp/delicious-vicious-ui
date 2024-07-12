import { NextRequest, NextResponse } from "next/server";
import { visitPage } from "./visitPage"; // Update with the correct path to the visitPage function

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Only GET requests allowed" },
      { status: 405 }
    );
  }

  const url = "https://delicious-vicious-admin.onrender.com/signin"; // Replace with your desired URL

  // Timeout in milliseconds (3 minutes for Puppeteer)
  const puppeteerTimeout = 180000;

  // Call the visitPage function asynchronously
  (async () => {
    await visitPage(url, puppeteerTimeout).catch((error: any) =>
      console.error("Background task error:", error)
    );
  })();

  // Return a quick response within 25 seconds
  return NextResponse.json({
    message: "Visit task started",
  });
}
