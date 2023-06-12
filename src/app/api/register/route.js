import User from "../../../../models/user";
const bcrypt = require("bcryptjs");

export async function POST(request) {
  try {
    const response = await request.json();
    const { name, email, password } = response;
    const encryptedPass = await bcrypt.hash(password, 10);

    const user = new User({
      name: name,
      email: email,
      password: encryptedPass,
    });

    const registeredUser = await User.findOne({ email });
    if (registeredUser) {
      return new Response(404);
    } else {
      user.save();
      return new Response(200);
    }
  } catch (err) {
    console.log(err);
    return new Response(404);
  }
}
