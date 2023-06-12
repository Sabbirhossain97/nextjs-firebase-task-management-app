import Todo from "../../../../models/todo";

export async function GET() {
  try {
    const response = await Todo.deleteMany({})
    console.log("successfully deleted all documents!");
    return new Response(response);
  } catch (err) {
    console.log("error deleting all documents");
    return new Response("error deleting all documents!");

  }
}
