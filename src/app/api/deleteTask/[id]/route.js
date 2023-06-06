import Todo from "../../../../../models/todo";

export async function DELETE(request, context) {
  const { id } = context.params;
  const deleteTodo = await Todo.findByIdAndDelete({ _id: id });
  return new Response(JSON.stringify("ok"));
}
