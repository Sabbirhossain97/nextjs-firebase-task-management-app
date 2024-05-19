import { NextResponse } from "next/server";

// let authToken = Cookies.get("authToken");

export default function middleware(request) {
  const req = request;
  
  // if (req.nextUrl.pathname.startsWith("/Home")) {
  //   if (authToken) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = "/Home";
  //     return NextResponse.rewrite(url);
  //   } else {
  //     return NextResponse.redirect("http://localhost:3000/Login");
  //   }
  // }
  // if (req.nextUrl.pathname.startsWith("/Register")) {
  //   if (authToken) {
  //     return NextResponse.redirect("http://localhost:3000/Home");
  //   } else {
  //     const url = request.nextUrl.clone();
  //     url.pathname = "/Register";
  //     return NextResponse.rewrite(url);
  //   }
  // }
  // if (
  //   req.nextUrl.pathname.startsWith("/Login")
  // ) {
  //   if (authToken) {
  //     return NextResponse.redirect("http://localhost:3000/Home");
  //   }
  // }
}

export const config = {
  matcher: ["/Home", "/Register", "/Login"],
};
