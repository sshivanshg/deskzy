import { NextResponse } from "next/server";

const ADMIN_PASSPHRASE = "shivansh1234";
const COOKIE_NAME = "deskzy-admin-unlocked";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { password?: string };
    const password = body.password?.trim() ?? "";
    if (password !== ADMIN_PASSPHRASE) {
      return NextResponse.json(
        { error: "Invalid admin passphrase" },
        { status: 401 },
      );
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return res;
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}

