import React, { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { BsCircle } from "react-icons/bs";
import moment from "moment";
import { deleteTodo } from "../services/deleteTodo";
import { BsDot } from "react-icons/bs";
import { CgUndo } from "react-icons/cg";
import { editTodo } from "../services/editTodo";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function AllTasks({ user, todoList, setLoading }) {
  const [editText, setEditText] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [completedTodo, setCompletedTodo] = useState(null);
  const [edit, setEdit] = useState(false);
  const [check, setCheck] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleEditTodo = (todoId) => {
    try {
      setLoading(true);
      editTodo(user, todoId, { title: editText })
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setEditText("");
      setEdit(!edit);
    }
  };

  const showTooltip = () => {
    setIsTooltipVisible(true);
  };

  const hideTooltip = () => {
    setIsTooltipVisible(false);
  };

  const handleDeleteTodo = async (user, id) => {
    try {
      setLoading(true);
      deleteTodo(user, id)
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  console.log(isTooltipVisible)

  const handleEdit = (key) => {
    const result = todoList.filter((item, id) => {
      if (id === key) {
        return item;
      }
    });
    setEditText("");
    setCurrentItem(result);
  };

  const handleCheckedItem = (key) => {
    const getAttr = document.getElementById(key);
    if (getAttr) {
      const result = todoList.filter((item, id) => {
        if (id === key) {
          return item;
        }
      });
      const [properties] = result;
      const id = properties?.id;
      completedTasks(id);
      setCompletedTodo(result);
    } else {
      setCompletedTodo(null);
    }
  };

  const completedTasks = async (id) => {
    try {
      setLoading(true);
      await axios.put(
        `/api/completedTasks/${id}`,
        {
          time: moment().startOf("minute").fromNow(),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <ul className=" transition duration-300 ease-out">
        {todoList ? (
          todoList.length === 0 ? (
            <motion.div
              className="rounded sm:w-full md:w-48 md:h-48 py-20 mt-2 md:mt-10 flex flex-col justify-center items-center text-center opacity-100 mx-auto"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ delay: 0 }}
            >
              <Image
                src={"/emptytodo.png"}
                alt="emptytodo"
                width={200}
                height={200}
                priority={true}
                blurDataURL={"/emptytodo.png"}
              />
              <div className="py-4">Add some tasks</div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {todoList.map((item, key) => (
                <motion.li
                  className=" mt-4"
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ delay: 0 }}
                >
                  <div className="flex gap-2">
                    <span
                      onMouseEnter={showTooltip}
                      onMouseLeave={hideTooltip}
                      data-tooltip-id="my-tooltip-1" data-tip="React-tooltip" className="inline-flex items-center">
                      <BsDot className={`text-2xl ${item.priority === "high" ? "text-red-500" : item.priority === "low" ? "text-green-400" : "text-yellow-500"}`} />
                    </span>
                <ReactTooltip
                      id="my-tooltip-1"
                      place="top-end"
                      variant="info"
                      style={{
                        position: 'absolute',
                        backgroundColor: 'rgb(8,145,178)',
                        }}
                      scrollHide={false}
                      resizeHide={false}
                    >
                      <div
                        onMouseEnter={showTooltip}
                        onMouseLeave={hideTooltip}
                      >
                        <span>{`${item.priority} priority`}</span>
                        <div className="mt-2">
                          <p>Change?</p>
                          <div className="flex gap-2 mt-2">
                            <button className="px-2 py-1 bg-green-500 rounded-md">Low</button>
                            <button className="px-2 py-1 bg-yellow-500 rounded-md">Medium</button>
                            <button className="px-2 py-1 bg-red-500 rounded-md">High</button>
                          </div>
                        </div>
                      </div>
                    </ReactTooltip> 
                    
                    <div className="relative w-11/12 h-auto p-2 bg-transparent transition border border-cyan-600 rounded-[7px] flex justify-start items-center px-3">
                      <div className="flex items-center mr-1">
                        <span
                          className="cursor-pointer"
                          id={key}
                          onClick={() => {
                            handleCheckedItem(key);
                            setCheck(true);
                          }}
                          title="mark as complete"
                        >
                          {check && item.id === completedTodo[0].id ? (
                            <motion.span
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              transition={{ delay: 0.25 }}
                            >
                              <BsCheckLg className="text-green-500" />
                            </motion.span>
                          ) : (
                            <BsCircle className="text-sm  transition text-cyan-500 hover:ring-1 ring-cyan-500 rounded-full" />
                          )}
                        </span>
                      </div>
                      {edit && item.id === currentItem[0].id ? (
                        <input
                          onChange={(e) => {
                            setEditText(e.target.value);
                          }}
                          className="w-full text-sm h-auto text-gray-400 outline-none px-2 font-semibold bg-inherit  border-cyan-700 placeholder-gray-400 placeholder:text-[12px]"
                          placeholder="Edit todo..."
                          autoFocus={true}
                        />
                      ) : (
                        <motion.p
                          className={`decoration-white ${completedTodo
                            ? completedTodo[0].id === item.id
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
                          {item.title}
                        </motion.p>
                      )}
                    </div>
                    <motion.button
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 5 }}
                      transition={{ delay: 0.5 }}
                      onClick={() => handleDeleteTodo(user, item.id)}
                      className="cursor-pointer scale-100 h-10"
                    >
                      <AiFillDelete className="text-xl text-red-600 hover:text-red-400 transition duration-300" />
                    </motion.button>
                    <AnimatePresence>
                      {currentItem ? (
                        editText !== "" && item.id === currentItem[0].id ? (
                          <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ delay: 0.25 }}
                            onClick={() => handleEditTodo(item.id)}
                            key={key}
                            className="cursor-pointer scale-100 h-10"
                          >
                            <BsCheckLg className="text-xl text-green-500 hover:text-green-400" />
                          </motion.button>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                    </AnimatePresence>
                    <div>
                      <AnimatePresence>
                        {edit && item.id === currentItem[0]?.id ? (
                          <motion.button
                            onClick={() => {
                              setEdit(!edit);
                              setEditText("");
                            }}
                            className="cursor-pointer scale-100 h-10"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 5 }}
                            transition={{ delay: 0.5 }}
                          >
                            <CgUndo className="text-2xl text-cyan-500 hover:text-cyan-700 transition duration-300" />
                          </motion.button>
                        ) : (
                          <motion.button
                            onClick={() => {
                              setEdit(!edit);
                              handleEdit(key);
                            }}
                            className="cursor-pointer scale-100 h-10 "
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
                              <BiEditAlt className="text-xl text-cyan-500 hover:text-cyan-700 transition duration-300" />
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
    </>
  );
}
