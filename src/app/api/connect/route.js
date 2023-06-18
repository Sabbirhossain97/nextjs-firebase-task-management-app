import connectMongo from "../../../database/connection";

export async function GET() {
      try {
        connectMongo();
        return new Response("connected to mongodb!");
      } catch (err) {
        console.log(err);
        return new Response("error connecting to database");
      }

}