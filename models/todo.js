import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  task: String,
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: Date,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default Todo;
