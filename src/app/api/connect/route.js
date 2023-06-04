import connectMongo from "../../../../database/connection";

export async function GET() {
  connectMongo();
  return new Response("connected to mongodb!");
}
