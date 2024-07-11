import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Only GET requests allowed" },
      { status: 405 }
    );
  }

  const url = "https://www.delicious-vicious.com/productos"; // Replace with your desired URL

  // Timeout in milliseconds (2 minutes)
  const timeout = 120000;

  try {
    // Launch a new browser instance
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Set a timeout for the page.goto and networkidle2
    const responsePromise = page.goto(url, {
      waitUntil: "networkidle2",
      timeout: timeout,
    });

    // Create a timeout promise to handle long-loading pages
    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), timeout)
    );

    // Race between the responsePromise and the timeoutPromise
    await Promise.race([responsePromise, timeoutPromise]);

    // Optionally take a screenshot
    const screenshot = await page.screenshot({ encoding: "base64" });

    // Close the browser
    await browser.close();

    // Return a success response
    return NextResponse.json({
      message: "URL visited successfully",
    });
  } catch (error: any) {
    console.error("Error visiting URL:", error);
    if (error.message === "Timeout") {
      return NextResponse.json(
        { message: "Request timed out" },
        { status: 408 }
      ); // 408 Request Timeout
    } else {
      return NextResponse.json(
        { message: "An error occurred", error: error.message },
        { status: 500 }
      );
    }
  }
}
