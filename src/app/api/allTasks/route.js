import Todo from "../../../../models/todo";

export async function POST(request) {
  const response = await request.json();
  const getTasks = await Todo.find({ user_id: response?.userId });
  return new Response(JSON.stringify(getTasks));
}
