"use client";
import { useEffect, useState } from "react";
import moment from "moment/moment";
import { motion } from "framer-motion";
import AllTasks from "../../../components/AllTasks";
import Header from "../common/header";
import User from "../../../components/User";
import { AiOutlineSend } from "react-icons/ai";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import useAuth from "../../../helpers/hooks/useAuth";
import { addTodos } from "../../../services/addTodo";
import { v4 as uuidv4 } from 'uuid';
import { db } from "../../../server/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function Home() {
  const [todo, setTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [undo, setUndo] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const currentUser = useAuth()
  const currentDate = moment().format("MMMM Do YYYY")

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().format('h:mm a'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTodo = (e) => {
    e.preventDefault()
    if (currentUser) {
      const payload = {
        id: uuidv4(),
        title: todo,
        status: "pending",
        createdAt: `${currentDate + " " + currentTime}`,
        updatedAt: `${currentDate + " " + currentTime}`,
        priority: "high",
        userId: currentUser.uid,
      }
      try {
        addTodos(currentUser, payload)
      }
      catch (error) {
        console.error(error)
      } finally {
        setTodo("")
      }
    }
  }

  useEffect(() => {
    const getWishlistData = async () => {
      if (!currentUser) {
        setTodoList([])
        return
      }
      try {
        if (!db) {
          console.error('Firestore is not initialized.');
          return;
        }
        const todosRef = collection(db, 'todos');
        if (!todosRef) {
          console.error('todo collection does not exist.');
          return;
        }
        const q = query(todosRef, where('userId', '==', currentUser.uid));
        onSnapshot(q, (snapshot) => {
          const todosData = [];
          snapshot.forEach((doc) => {
            todosData.push({ id: doc.id, ...doc.data() });
          });
          if (todosData.length > 0) {
            const { todos } = todosData?.[0];
            setTodoList(todos);
          } else {
            setTodoList([]);
          }
        });
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };
    getWishlistData();
  }, [currentUser]);

  return (
    <div>
      <motion.div
        className="relative transition-[height] flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gradient-to-br from-slate-800 to-slate-900 border-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0 }}
      >
        <Header />
        <User
          currentUser={currentUser}
        />
        <div className="h-[700px] mt-10 transition-all w-11/12 md:w-3/4 lg:w-2/3 xl:w-2/3 2xl:w-1/2  bg-slate-900  rounded-lg p-10 drop-shadow-md shadow-cyan-800">
          <div className="mt-3 text-sm  text-white flex justify-between items-center">
            <p className=" font-semibold">{currentDate}</p>
            <p className=" font-semibold">{currentTime}</p>
          </div>

          <form
            onSubmit={handleTodo}
            className="w-full mt-16 flex flex-row text-sm text-center justify-center "
          >
            <div className="w-full">
              <input
                className=" w-full text-gray-400  font-semibold outline-none p-2 bg-inherit border-b  border-cyan-600 placeholder-teal-700 dark:placeholder-gray-400 placeholder:text-[14px]"
                placeholder="What needs to be done today?"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="flex justify-center items-center w-[60px] text-md  h-8 mt-2 bg-cyan-600 hover:bg-cyan-500 text-center transition text-white rounded-md ml-3"
            >
              <AiOutlineSend className="text-lg text-white" />
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-10">
            <p className="text-gray-400">
              Total
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 5 }}
                transition={{ delay: 0.25 }}
                className="ml-2 px-3 py-[1px] text-sm text-white bg-cyan-500 rounded-md">{todoList.length}
              </motion.span>
            </p>
            <p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 5 }}
              transition={{ delay: 0.25 }}
              className="text-gray-400">
              Pending
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 5 }}
                transition={{ delay: 0.25 }}
                className="ml-2 px-3 py-[1px] text-sm text-white bg-cyan-500 rounded-md">{todoList.length - todoList.filter((todo) => todo.status === "completed").length}
              </motion.span>
            </p>
            <p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 5 }}
              transition={{ delay: 0.25 }} className="text-gray-400">
              Completed
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 5 }}
                transition={{ delay: 0.25 }}
                className="ml-2 px-3 py-[1px] text-sm text-white bg-cyan-500 rounded-md">{todoList.filter((todo) => todo.status === "completed").length}
              </motion.span>
            </p>

          </div>
          <SimpleBar className="h-[400px] mt-2">
            <div className="mt-4">
              <AllTasks
                user={currentUser}
                todoList={todoList}
                loading={loading}
                setLoading={setLoading}
              />
            </div>
          </SimpleBar>
        </div>
      </motion.div>
    </div>
  );
}
