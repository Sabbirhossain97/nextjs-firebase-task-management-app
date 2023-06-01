"use client";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import moment from "moment/moment";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
export default function Home() {
  const [todo, setTodo] = useState("");
  const [data, setData] = useState([]);
  const [complete, setComplete] = useState(null);
  const handleTodo = async () => {
    try {
      const getData = await axios
        .post("/api/newtask", todo, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    } finally {
      setTodo("");
      fetchTasks();
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/allTasks");
      setData(response.data);
    } catch (err) {
      console.log("error fetching documents from db", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(`/api/deleteTask/${id}`);
    } catch (err) {
      console.log(err);
    } finally {
      fetchTasks();
    }
  };

  const handleCheckbox = (id) => {
    const result = data.filter((elm, index) => {
      if (index === id) {
        return elm;
      }
    });
    setComplete(result);
    console.log(complete);
  };
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 ">
        <div className="h-auto w-96 transition-all ease-in-out duration-200 md:w-1/2 xl:w-1/3 bg-slate-900/40 rounded-lg p-10 shadow-xl">
          <div className="mt-3 text-sm text-white flex justify-between items-center">
            <p className=" font-semibold">{moment().format("MMMM Do YYYY")}</p>
            <p className=" font-semibold">{moment().format("h:mm a")}</p>
          </div>
          <p className="text-xl font-semibold mt-2 text-white">To-do List</p>
          <div className="w-full mt-4 flex flex-row text-sm text-center justify-center ">
            <div className="w-10/12">
              <input
                className="w-full text-gray-400  font-semibold rounded-md p-2 bg-inherit border border-cyan-700 placeholder-gray-400 placeholder:text-[12px]"
                placeholder="What needs to be done today?"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                required
              />
            </div>
            <button
              onClick={handleTodo}
              className="w-1/5 bg-cyan-700 text-center hover:bg-cyan-600 text-gray-200  rounded-md ml-3"
            >
              Add
            </button>
          </div>
          <ul className="my-4 ">
            {data ? (
              data.length === 0 ? (
                <motion.div
                  className="rounded sm:w-full md:w-48 md:h-48 py-20 mt-2 md:mt-10 flex flex-col justify-center items-center text-center opacity-100 mx-auto"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ delay: 0.5 }}
                >
                  <img src="/emptytodo.png" />
                  <div className="py-4">Add some todo</div>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {data.map((item, key) => (
                    <motion.li
                      className=" mt-4"
                      key={key}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex gap-2">
                        <div className="w-11/12 h-10 bg-transparent border border-cyan-600 rounded-[7px] flex justify-start items-center px-3">
                          <span>
                            <input
                              type="checkbox"
                              value=""
                              onChange={() => handleCheckbox(key)}
                              className="cursor-pointer w-4 h-4 mt-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                          </span>
                          <p
                            className={`
                              
                             decoration-white text-[12px] mt-0.5 ml-2 text-gray-300 font-semibold`}
                          >
                            {item.task}
                          </p>
                        </div>
                        <span
                          onClick={() => deleteTodo(item._id)}
                          className="cursor-pointer w-[50px] h-10 transition scale-95 bg-transparent border hover:scale-100 border-cyan-500 rounded-[7px] flex justify-center text-sm text-[#5b7a9d] font-semibold items-center "
                        >
                          <AiFillDelete className="text-lg text-gray-200" />
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              )
            ) : (
              ""
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
