"use client";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { MdOutlineClose } from "react-icons/md";
import Image from "next/image";
import axios from "axios";
import moment from "moment/moment";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [todo, setTodo] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editText, setEditText] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [completedTodo, setCompletedTodo] = useState(null);
  const handleTodo = async () => {
    if (todo === "") {
      return;
    } else {
      try {
        setLoading(true);
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
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/allTasks");
        setData(response.data);
      } catch (err) {
        console.log("error fetching documents from db", err);
      }
    };
    fetchTasks();
  }, [loading]);

  const deleteTodo = async (id) => {
    try {
      setLoading(true);
      const response = await axios
        .delete(`/api/deleteTask/${id}`)
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (key) => {
    const result = data.filter((item, id) => {
      if (id === key) {
        return item;
      }
    });
    setEditText("");
    setCurrentItem(result);
  };

  const editTodo = async (id) => {
    try {
      setLoading(true);
      const response = await axios
        .put(`/api/editTask/${id}`, editText, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setEditText("");
      setEdit(!edit);
    }
  };

  const clearAllTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/clearAll");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const connectToDB = async () => {
      const response = await axios.get("/api/connect");
    };
    connectToDB();
  }, []);

  const handleCheckedItem = (key) => {
    const getAttr = document.getElementById(key).checked;
    if (getAttr) {
      const result = data.filter((item, id) => {
        if (id === key) {
          return item;
        }
      });
      console.log(result);
      setCompletedTodo(result);
    } else {
      setCompletedTodo(null);
    }
  };
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 ">
        <div className="h-auto transition-all ease-in-out duration-200 w-11/12 md:w-3/4 lg:w-2/3 xl:w-2/3 2xl:w-1/3 bg-slate-900/40 rounded-lg p-10 shadow-xl">
          <div className="mt-3 text-sm text-white flex justify-between items-center">
            <p className=" font-semibold">{moment().format("MMMM Do YYYY")}</p>
            <p className=" font-semibold">{moment().format("h:mm a")}</p>
          </div>
          <p className="text-xl font-semibold mt-6 text-white border-l-4 border-cyan-700 pl-3">
            To-do List
          </p>
          <div className="w-full mt-8 flex flex-row text-sm text-center justify-center ">
            <div className="w-full">
              <input
                className=" w-full text-gray-400  font-semibold outline-none p-2 bg-inherit border-b border-cyan-600 placeholder-gray-400 placeholder:text-[14px]"
                placeholder="What needs to be done today?"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                required
              />
            </div>
            <button
              onClick={handleTodo}
              className="w-[80px] text-md  h-8 mt-2 bg-cyan-700 hover:bg-cyan-600 text-center transition text-white rounded-md ml-3"
            >
              Add
            </button>
          </div>
          {data ? (
            data.length > 0 ? (
              <motion.div
                className="mt-6 h-[50px]  flex justify-between items-end"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex flex-row border border-cyan-700 rounded h-8 ">
                  <p className="cursor-pointer text-sm font-semibold p-1 px-2 bg-cyan-700 hover:bg-cyan-500 transition">
                    All tasks
                  </p>
                  <p className="cursor-pointer text-sm font-semibold p-1 px-2 py-1 hover:bg-cyan-500 transition">
                    Completed tasks
                  </p>
                </div>
              </motion.div>
            ) : (
              ""
            )
          ) : (
            ""
          )}

          <div className="mt-6">
            <ul className=" max-h-[800px]   ">
              {data ? (
                data.length === 0 ? (
                  <motion.div
                    className="rounded sm:w-full md:w-48 md:h-48 py-20 mt-2 md:mt-10 flex flex-col justify-center items-center text-center opacity-100 mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Image
                      src={"/emptytodo.png"}
                      alt="emptytodo"
                      width={200}
                      height={200}
                      priority
                    />
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
                        transition={{ delay: 0.0 }}
                      >
                        <div className="flex gap-2">
                          <div className="w-11/12 h-10 bg-transparent transition border border-cyan-600 rounded-[7px] flex justify-start items-center px-3">
                            <div className="flex items-center mr-1">
                              <input
                                id={key}
                                type="checkbox"
                                onChange={() => {
                                  handleCheckedItem(key);
                                }}
                                className="w-3 h-3 text-green-600 bg-gray-100 border-gray-300"
                              />
                            </div>
                            {edit && item._id === currentItem[0]._id ? (
                              <input
                                onChange={(e) => {
                                  setEditText(e.target.value);
                                }}
                                className="w-full text-sm text-gray-400 outline-none  font-semibold p-1 bg-inherit  border-cyan-700 placeholder-gray-400 placeholder:text-[12px]"
                                placeholder="Edit item..."
                                autoFocus={true}
                              />
                            ) : (
                              <motion.p
                                className={`decoration-white ${
                                  completedTodo
                                    ? completedTodo[0]._id === item._id
                                      ? "line-through"
                                      : ""
                                    : ""
                                }
                                }  text-[13px] mt-0.5 ml-2 text-gray-300 font-semibold`}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: 5 }}
                                transition={{ delay: 0.5 }}
                              >
                                {item.task}
                              </motion.p>
                            )}
                            {/*  */}
                          </div>
                          <motion.button
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 5 }}
                            transition={{ delay: 0.5 }}
                            onClick={() => deleteTodo(item._id)}
                            className="w-[50px] h-10  scale-95 bg-transparent duration-200 ease-in-out border hover:bg-cyan-700 border-cyan-500 rounded-[7px] flex justify-center text-sm text-[#5b7a9d] font-semibold items-center "
                          >
                            <AiFillDelete className="text-xl text-white" />
                          </motion.button>
                          <AnimatePresence>
                            {currentItem ? (
                              editText !== "" &&
                              item._id === currentItem[0]._id ? (
                                <motion.span
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  transition={{ delay: 0.25 }}
                                  onClick={() => editTodo(item._id)}
                                  key={key}
                                  className="cursor-pointer w-[50px] h-10 scale-95 bg-transparent border hover:bg-cyan-700 border-cyan-500 rounded-[7px] flex justify-center text-sm text-[#5b7a9d] font-semibold items-center "
                                >
                                  <BsCheckLg className="text-xl text-green-500 hover:text-green-400" />
                                </motion.span>
                              ) : (
                                ""
                              )
                            ) : (
                              ""
                            )}
                          </AnimatePresence>
                          <div>
                            <AnimatePresence>
                              {edit && item._id === currentItem[0]?._id ? (
                                <motion.button
                                  onClick={() => {
                                    setEdit(!edit);
                                    setEditText("");
                                  }}
                                  className="cursor-pointer w-[50px] h-10 transition scale-95 bg-transparent border hover:bg-cyan-700 border-cyan-500 rounded-[7px] flex justify-center text-sm text-[#5b7a9d] font-semibold items-center "
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, x: 5 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  <MdOutlineClose className="text-xl text-red-500" />
                                </motion.button>
                              ) : (
                                <motion.button
                                  onClick={() => {
                                    setEdit(!edit);
                                    handleEdit(key);
                                  }}
                                  className="cursor-pointer w-[50px] h-10 scale-95  bg-transparent border hover:bg-cyan-700 border-cyan-500 rounded-[7px] flex justify-center text-sm text-[#5b7a9d] font-semibold items-center "
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, x: 5 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  <motion.span
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: 5 }}
                                    transition={{ delay: 0.5 }}
                                  >
                                    <BiEditAlt className="text-xl text-white" />
                                  </motion.span>
                                </motion.button>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                )
              ) : (
                ""
              )}
            </ul>

            {data.length > 0 ? (
              <motion.div
                className="text-sm mt-4 flex justify-end border-t-1 border-cyan-700 py-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: 0.5 }}
              >
                <p
                  onClick={clearAllTasks}
                  className="cursor-pointer font-semibold px-2 py-2 rounded-md border border-cyan-500 transition hover:bg-cyan-600"
                >
                  Clear all
                </p>
              </motion.div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
