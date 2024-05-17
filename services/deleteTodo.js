import { db } from '../server/firebase';
import { collection, doc, getDocs, where, query, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export const deleteTodo = async (user, todoItemId) => {
    if (!user) {
        return
    }
    try {
        const todoRef = collection(db, 'todos');
        const querySnapshot = await getDocs(query(todoRef, where('userId', '==', user.uid)));
        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (todoDoc) => {
                const existingTodoRef = doc(db, 'todos', todoDoc.id);
                const existingTodoData = todoDoc.data();
                const filteredTodos = existingTodoData.todos.filter((todo) => todo.id !== todoItemId);
                try {
                    await updateDoc(existingTodoRef, { todos: filteredTodos });
                    toast.success('Todo deleted successfully');
                } catch (error) {
                    toast.error('Error deleting todo from todo List',);
                }
            });
        } else {
            toast.error('Todo document not found for the user!');
        }
    } catch (error) {
        toast.error('Error removing todo from todo list');
    }
};