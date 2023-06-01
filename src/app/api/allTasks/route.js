import Todo from "../../../../models/todo";

export async function GET() {
   const getTasks = await Todo.find({})
   return new Response(JSON.stringify(getTasks))
}