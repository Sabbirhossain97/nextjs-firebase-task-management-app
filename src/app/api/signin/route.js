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
      const token = jwt.sign({}, process.env.JWT_SECRET);
      console.log(token)
       return new NextResponse(JSON.stringify({name: user.name, token: token}))
    } else {
      return new NextResponse(
        JSON.stringify({ message: "Wrong password!", status: 400 })
      );
    }

   
  } catch (err) {
    console.log(err);
  }
}
