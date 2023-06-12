import User from "../../../../models/user";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const response = await request.json();
    const { email, password } = response;
    const user = await User.findOne({ email });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found", status: 404 })
      );
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
      return new NextResponse(
        JSON.stringify({ name: user.name, token: token, status: 200 })
      );
    } else {
      return new NextResponse(
        JSON.stringify({ message: "Wrong password!", status: 400 })
      );
    }
  } catch (err) {
    console.log(err);
    return new NextResponse("Error signing in!");
  }
}
