import User from "../../../../models/user";
const jwt = require("jsonwebtoken");

export async function POST(request) {
  const token = await request.json();

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = user.email;
    const loggedInUser = await User.findOne({ email: userEmail });
    return new Response(JSON.stringify(loggedInUser));
  } catch (err) {
    console.log(err);
  }
}
