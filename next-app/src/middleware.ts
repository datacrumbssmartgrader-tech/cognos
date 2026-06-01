import { NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect /api/admin/* routes
  if (pathname.startsWith("/api/admin")) {
    const token = request.cookies.get("rw_session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No session" },
        { status: 401 }
      );
    }

    const payload = await verifyTokenEdge(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Optional: Check role for specific routes
    // For now, just verify admin role exists (we can extend this later)
    if (payload.role !== "admin" && payload.role !== "user") {
      return NextResponse.json(
        { error: "Unauthorized - Invalid role" },
        { status: 403 }
      );
    }

    // Attach user info to request headers (can be accessed in route handlers)
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.id);
    requestHeaders.set("x-user-name", payload.name);
    requestHeaders.set("x-user-role", payload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*", "/admin/:path*"],
};
