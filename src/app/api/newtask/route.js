import { NextResponse } from "next/server";
import Todo from "../../../../models/todo";

export async function POST(request) {
  try {
    const response = await request.json();

    const todo = new Todo({
      user_id: response?.userId,
      task: response?.newTask,
    });
    todo.save();

    return new NextResponse("ok");
  } catch (error) {
    console.log("error saving data to mongoDB");
  }
}
