import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

//Middleware to protect customer area and admin area depending on logged in user role
export async function middleware(req: NextRequest) {
  console.log("middleware");

  const token = await getToken({ req });
  console.log("token", token);

  //If not admin role, rewrite to show admin login page
  //if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "admin") {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token)
      return NextResponse.rewrite(new URL("/auth-admin/loggain", req.url));

    if (token?.role !== "admin")
      return NextResponse.rewrite(
        new URL(
          "/auth-admin/error?error=Du saknar behörighet.&errorTitle=Åtkomst nekad",
          req.url
        )
      );
  }

  //If not logged in, redirect to login page
  if (req.nextUrl.pathname.startsWith("/minasidor") && !token) {
    return NextResponse.redirect(new URL("/loggain", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/minasidor/:path*"],
};
