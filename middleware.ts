import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Only protect /admin routes
const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // Only run for /admin routes
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    // If no token or not admin, redirect to home
    if (!token || token.user?.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }


  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: ["/admin/:path*"],
};
