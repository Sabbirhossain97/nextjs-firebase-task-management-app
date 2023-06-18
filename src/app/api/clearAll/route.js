import Todo from "../../../models/todo";

export async function GET() {
  try {
    const response = await Todo.deleteMany({});
    return new Response(response);
  } catch (err) {
    return new Response("error deleting all documents!");
  }
}
