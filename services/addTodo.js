import { db } from "../server/firebase";
import toast from "react-hot-toast";
import { addDoc, collection, updateDoc, getDocs, query, where, doc } from "firebase/firestore";

export const addTodos = async (user, todo) => {

    const todoRef = collection(db, 'todos');
    const querySnapshot = await getDocs(query(todoRef, where('userId', '==', user.uid)));
    if (!querySnapshot.empty) {
        querySnapshot.forEach(async (todoDoc) => {
            const existingTodosRef = doc(db, 'todos', todoDoc.id);
            const existingTodoData = todoDoc.data();
            if (!existingTodoData.todos.some(todoItem => todoItem.id === todo.id)) {
                const updatedTodos = [...existingTodoData.todos, todo];
                try {
                    await updateDoc(existingTodosRef, { todos: updatedTodos });
                } catch (error) {
                    toast.error('Error adding todo item', error);
                }
            }
        });
    } else {
        const payload = {
            todos: [todo],
            username: user.displayName,
            userId: user.uid
        };
        try {
            await addDoc(todoRef, payload);
            toast.success('new task added!');
        } catch (error) {
            toast.error('Error adding todo item', error);
        }
    }
};