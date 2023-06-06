import Todo from "../../../../../models/todo";

export async function PUT(request, context) {
  try {
    const { id } = context.params;
    const updatedTask = await request.json();
    const updateTodo = await Todo.findByIdAndUpdate(id, {
      task: updatedTask,
    });
    return new Response("ok");
  } catch (err) {
    return new Response("error updating item!");
  }
}
