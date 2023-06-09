import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);

    if (connection.readyState == 1) {
      console.log("connected to database!");
      // await mongoose.model("Todo").findOne()
      // await mongoose.model("User").findOne();
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export default connectMongo;
