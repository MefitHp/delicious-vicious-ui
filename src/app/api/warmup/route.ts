import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  return NextResponse.json({ status: 200, message: "Server is warm" });
}
