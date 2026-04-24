import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:3001";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/items`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "API indisponível" },
      { status: 503 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "API indisponível" },
      { status: 503 },
    );
  }
}
