import { NextResponse } from "next/server";
import Todo from "../../../../models/todo";
import connectMongo from "../../../../database/connection";

export async function POST(request) {
  try {
    connectMongo();
    const response = await request.json();
    const todo = new Todo({
      task: response,
    });
    todo.save();
    return new NextResponse(todo);
  } catch (error) {
    console.log("error saving data to mongoDB");
  }
}
