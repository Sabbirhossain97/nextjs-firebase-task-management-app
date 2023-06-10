import { NextResponse } from "next/server";

export default function middleware(request) {
  const req = request;
  let verify = req.cookies.get("isLoggedIn");

  if (req.nextUrl.pathname.startsWith("/Home")) {
    if (verify?.value) {
      const url = request.nextUrl.clone();
      url.pathname = "/Home";
      return NextResponse.rewrite(url);
    } else {
      return NextResponse.redirect("http://localhost:3000/Login");
    }
  }
  if (req.nextUrl.pathname.startsWith("/Register")) {
    if (verify?.value) {
      return NextResponse.redirect("http://localhost:3000/Home");
    } else {
      const url = request.nextUrl.clone();
      url.pathname = "/Register";
      return NextResponse.rewrite(url);
    }
  }
  if (
    req.nextUrl.pathname.startsWith("/Login") |
    req.nextUrl.pathname.startsWith("/")
  ) {
    if (verify?.value) {
      return NextResponse.redirect("http://localhost:3000/Home");
    }
  }
}

export const config = {
  matcher: ["/", "/Home", "/Register", "/Login"],
};
