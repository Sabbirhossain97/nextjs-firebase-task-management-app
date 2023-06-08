import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { MdOutlineClose } from "react-icons/md";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ClearAll from "./ClearAll";

export default function AllTasks({ data, loading, setLoading }) {
  const [editText, setEditText] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [completedTodo, setCompletedTodo] = useState(null);
  const [edit, setEdit] = useState(false);

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

  const deleteTodo = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/deleteTask/${id}`);
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

  const handleCheckedItem = (key) => {
    const getAttr = document.getElementById(key).checked;
    if (getAttr) {
      const result = data.filter((item, id) => {
        if (id === key) {
          return item;
        }
      });
      const [properties] = result;
      const id = properties?._id;
      completedTasks(id);
      setCompletedTodo(result);
    } else {
      setCompletedTodo(null);
    }
  };

  const completedTasks = async (id) => {
    try {
      setLoading(true);
      await axios.put(`/api/completedTasks/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const clearAllTasks = async () => {
    try {
      setLoading(true);
      await axios.get("/api/clearAll");
      setToggle(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ul className=" max-h-[800px] transition duration-300 ease-out">
        {data ? (
          data.length === 0 ? (
            <motion.div
              className="rounded sm:w-full md:w-48 md:h-48 py-20 mt-2 md:mt-10 flex flex-col justify-center items-center text-center opacity-100 mx-auto"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ delay: 0.25 }}
            >
              <Image
                src={"/emptytodo.png"}
                alt="emptytodo"
                width={200}
                height={200}
                priority
              />
              <div className="py-4">Add some tasks</div>
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
                  transition={{ delay: 0.25 }}
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
                          transition={{ delay: 0.25 }}
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
                        editText !== "" && item._id === currentItem[0]._id ? (
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
      {data.length > 0 ? <ClearAll clearall={clearAllTasks} /> : ""}
    </>
  );
}
