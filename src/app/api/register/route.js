import User from "../../../../models/user";
const bcrypt = require("bcryptjs")

export async function POST(request) {
  try {
    const response = await request.json();
    const { name, email, password } = response;
    const encryptedPass = await bcrypt.hash(password,10);

    const user = new User({
      name: name,
      email: email,
      password: encryptedPass,
    });
    user.save();
    return new Response(user);
  } catch (err) {
    console.log(err);
  }
}
