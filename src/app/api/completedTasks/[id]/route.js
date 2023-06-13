import Todo from "../../../../../models/todo";
import moment from "moment";

export async function PUT(request, context) {
  try {
    const time = moment().format("MMMM Do YYYY, h:mm:ss a");
    const { id } = context.params;
    const completedTask = await request.json();
    await Todo.findByIdAndUpdate(id, {
      completed: true,
      comnpletedAt: time,
    });
    return new Response("successfully updated todo!");
  } catch (err) {
    return new Response(err, "error updating todo!");
  }
}
