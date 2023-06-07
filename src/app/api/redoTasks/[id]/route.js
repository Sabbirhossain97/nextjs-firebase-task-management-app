import Todo from "../../../../../models/todo";

export async function PUT(request, context) {
  try {
    const { id } = context.params;
    const completedTask = await request.json();
    await Todo.findByIdAndUpdate(id, {
      completed: false,
    });
    return new Response("successfully updated todo!");
  } catch (err) {
    return new Response(err, "error updating todo!");
  }
}
