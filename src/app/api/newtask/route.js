import { NextResponse } from "next/server";
import Todo from "../../../../models/todo";

export async function POST(request) {
  try {
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
