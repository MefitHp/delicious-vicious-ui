import { NextResponse } from "next/server";

// Helper function to fetch with a timeout
async function fetchWithTimeout(url: string, timeout: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve("Timeout"), timeout);

    fetch(url)
      .then((response) => response.text())
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function GET(req: Request): Promise<NextResponse> {
  const url = "https://delicious-vicious-admin.onrender.com/api/graphql";

  // Create a timeout promise to ensure the total execution doesn't exceed 25 seconds
  const totalTimeout = new Promise(
    (_, reject) => setTimeout(() => reject(new Error("Total Timeout")), 25000) // Set to 25 seconds for safety
  );

  try {
    const result = await Promise.race([
      fetchWithTimeout(url, 20000), // 20 seconds for the fetch request
      totalTimeout, // 25 seconds for the total execution
    ]);

    if (result === "Timeout") {
      return NextResponse.json({
        status: 200,
        message: "Request is still processing",
      });
    }

    return NextResponse.json({ status: 200, message: "Server is warm" });
  } catch (error: any) {
    if (error.message === "Total Timeout") {
      return NextResponse.json({
        status: 204,
        message: "Total execution timeout",
      });
    }
    return NextResponse.json({ status: 500, message: "An error occurred" });
  }
}
