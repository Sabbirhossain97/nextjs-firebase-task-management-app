import { db } from '../server/firebase';
import { collection, doc, getDocs, where, query, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export const deleteCompletedTodos = async (user) => {
    if (!user) {
        return;
    }
    try {
        const todoRef = collection(db, 'todos');
        const querySnapshot = await getDocs(query(todoRef, where('userId', '==', user.uid)));
        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (todoDoc) => {
                const existingTodoRef = doc(db, 'todos', todoDoc.id);
                const existingTodoData = todoDoc.data();
                const filteredTodos = existingTodoData.todos.filter((todo) => todo.status !== "completed");
                try {
                    await updateDoc(existingTodoRef, { todos: filteredTodos });
                    toast.success('Cleared all completed tasks');
                } catch (error) {
                    toast.error('Error deleting completed todos from todo List');
                }
            });
        } else {
            toast.error('Todo document not found for the user!');
        }
    } catch (error) {
        toast.error('Error removing completed todos from todo list');
    }
};