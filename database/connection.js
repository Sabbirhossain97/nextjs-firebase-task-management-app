import mongoose from "mongoose";

const connectMongo = async () => await mongoose.connect(process.env.MONGO_URI);

export default connectMongo;
