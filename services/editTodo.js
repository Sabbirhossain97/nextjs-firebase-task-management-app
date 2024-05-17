import { db } from '../server/firebase';
import toast from "react-hot-toast";
import { collection, getDocs, query, doc, where, updateDoc } from 'firebase/firestore'

export const editTodo = async (user, todoId, updates) => {
    try {
        const todoRef = collection(db, 'todos');
        const userQuerySnapshot = await getDocs(query(todoRef, where('userId', '==', user.uid)));
        if (userQuerySnapshot.empty) {
            console.error('No matching documents found.');
            return;
        }

        const userDocSnapshot = userQuerySnapshot.docs[0];
        const userData = userDocSnapshot.data();
        const todos = userData.todos || [];

        const todoIndex = todos.findIndex(todo => todo.id === todoId);

        if (todoIndex === -1) {
            toast.error('Todo not found.');
            return;
        }
        const updatedTodo = {
            ...todos[todoIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        const updatedTodos = [...todos];
        updatedTodos[todoIndex] = updatedTodo;
        const userDocRef = doc(db, 'todos', userDocSnapshot.id);
        await updateDoc(userDocRef, { todos: updatedTodos });

        toast.success('Todo updated successfully');
    } catch (error) {
        toast.error('Error updating todo:', error);
    }
};