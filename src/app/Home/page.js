"use client";
import { useEffect, useState } from "react";
import moment from "moment/moment";
import { motion } from "framer-motion";
import AllTasks from "../../../components/AllTasks";
import CompletedTasks from "../../../components/CompletedTasks";
import Header from "../common/header";
import User from "../../../components/User";
import { AiOutlineSend } from "react-icons/ai";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import ClearAll from "../../../components/ClearAll";
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: "high",
        userId: currentUser.uid,
      }
      addTodos(currentUser, payload)
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
        <div className="h-[700px] mt-10 transition-all w-11/12 md:w-3/4 lg:w-2/3 xl:w-2/3 2xl:w-1/3  bg-slate-900  rounded-lg p-10 drop-shadow-md shadow-cyan-800">
          <div className="mt-3 text-sm  text-white flex justify-between items-center">
            <p className=" font-semibold">{moment().format("MMMM Do YYYY")}</p>
            <p className=" font-semibold">{currentTime}</p>
          </div>

          <form
            onSubmit={handleTodo}
            className="w-full mt-16 flex flex-row text-sm text-center justify-center "
          >
            <div className="w-full">
              <input
                className=" w-full  text-gray-400  font-semibold outline-none p-2 bg-inherit border-b  border-cyan-600 placeholder-teal-700 dark:placeholder-gray-400 placeholder:text-[14px]"
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
          {todoList ? (
            <motion.div
              className="mt-6 h-[50px]  flex justify-between items-end"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex flex-row border  border-cyan-700 rounded h-8 ">
                <p
                  onClick={() => setToggle(false)}
                  className={`cursor-pointer text-sm font-semibold p-1 px-3 ${toggle ? "" : " bg-cyan-700"
                    } hover:bg-cyan-500  transition`}
                >
                  Current tasks
                </p>
                <p
                  onClick={() => setToggle(true)}
                  className={`cursor-pointer text-sm font-semibold p-1 px-2 py-1 ${toggle ? " bg-cyan-700 text-white" : ""
                    } hover:bg-cyan-500   transition`}
                >
                  Completed tasks
                </p>
              </div>
            </motion.div>
          ) : (
            ""
          )}
          <SimpleBar className="h-[300px] mt-4">
            <div className=" mt-6">
              {toggle ? (
                <CompletedTasks user={user} undo={undo} setUndo={setUndo} />
              ) : (
                <AllTasks
                  user={currentUser}
                  todoList={todoList}
                  loading={loading}
                  setLoading={setLoading}
                />
              )}
            </div>
          </SimpleBar>
          {todoList.length > 0 ? (
            // <ClearAll
            //   clearall={clearAllTasks}
            //   toggle={toggle}
            //   loading={loading}
            // />
            ""
          ) : (
            ""
          )}
        </div>
      </motion.div>
    </div>
  );
}
