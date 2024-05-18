import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BsCircle } from "react-icons/bs";
import { deleteTodo } from "../services/deleteTodo";
import { CgUndo } from "react-icons/cg";
import { editTodo } from "../services/editTodo";

export default function AllTasks({ user, todoList, setLoading }) {

  const [currentItem, setCurrentItem] = useState(null);
  const [edit, setEdit] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(null);
  const [updates, setUpdates] = useState({
    title: "",
    status: "pending",
    priority: "high"
  })

  const handleEditTodo = (todoId) => {
    try {
      setLoading(true);
      editTodo(user, todoId, updates)
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setEdit(false);
      setUpdates({
        title: "",
        status: "pending",
        priority: "high"
      })
    }
  };

  useEffect(() => {
    if (currentTodoId !== null) {
      handleEditTodo(currentTodoId);
      setCurrentTodoId(null);
    }
  }, [updates]);


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

  const handleEdit = (todoId) => {
    const result = todoList.filter((item) => {
      if (item.id === todoId) {
        return item;
      }
    });
    setCurrentItem(result);
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
            <>
              <AnimatePresence>
                {todoList.filter((todo) => todo.status === "pending").length === 0 ?
                  <motion.h1
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ delay: 0 }}
                    className="flex justify-center flex-col gap-4 items-center text-center py-4">
                    <span className="border-2 p-1 rounded-full border-green-600">
                      <BsCheckLg className="text-7xl text-green-500" />
                    </span>
                    You have completed all tasks for today!
                  </motion.h1> :
                  todoList.filter((todo) => todo.status === "pending").map((item, key) => (
                    <>
                      <motion.li
                        className="transition duration-300 mt-4"
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ delay: 0 }}
                      >
                        <div className="flex gap-2">
                          <div className={`${item.status === "completed" && 'border-gray-600'} relative w-11/12 h-auto p-2 bg-transparent transition border border-cyan-600 rounded-md flex justify-start items-center px-3`}>
                            <div className="flex items-center ">
                              <button
                                data-tooltip-id="my-tooltip-2"
                                className="cursor-pointer"
                                id={item.id}
                                onClick={() => {
                                  setUpdates((prevUpdates) => {
                                    return { ...prevUpdates, title: item.title, status: 'completed' };
                                  });
                                  setCurrentTodoId(item.id);
                                }}
                              >
                                {item.status === "completed" ? (
                                  <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ delay: 0.25 }}
                                  >
                                    <BsCheckLg className="text-green-500 text-xl" />
                                  </motion.span>
                                ) : (
                                  <BsCircle className="text-sm transition text-cyan-500 hover:ring-1 ring-cyan-500 rounded-full" />
                                )}
                              </button>

                            </div>
                            {edit && item.id === currentItem[0].id ? (
                              <input
                                defaultValue={item.title}
                                onChange={(e) => {
                                  setUpdates((prevUpdates) => {
                                    const newUpdates = { ...prevUpdates, title: e.target.value, status: item.status, priority: item.priority }
                                    return newUpdates
                                  })
                                }}
                                className="w-full text-sm h-auto text-white outline-none px-2 font-semibold bg-inherit  border-cyan-700 placeholder-gray-400 "
                                placeholder="Edit todo..."
                                autoFocus={true}
                              />
                            ) : (
                              <motion.p
                                className={`${item.status === "completed" ? 'line-through text-gray-400' : ""} decoration-white decoration-3 text-[13px] mt-0.5 ml-2 text-gray-300 font-semibold`}
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
                          {item.status !== 'completed' &&
                            <>
                              <AnimatePresence>
                                {currentItem ? (
                                  edit && updates.title !== "" && item.id === currentItem[0].id ? (
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
                                        setEdit(false);
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
                                        setEdit(true);
                                        handleEdit(item.id);
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
                            </>
                          }
                        </div>
                      </motion.li>
                    </>
                  ))}
              </AnimatePresence>
              {/* completed todo lists */}
              <AnimatePresence>
                {todoList.filter((todo) => todo.status === "completed").length > 0 &&
                  <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 0 }}
                    transition={{ delay: 0 }}
                    className="mt-4 text-white">Completed
                  </motion.h1>
                }
                {todoList.filter((todo) => todo.status === "completed").map((item) => (
                  <motion.li
                    className="transition duration-300 mt-4 flex gap-2"
                    key={item.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ delay: 0 }}
                  >
                    <div className={`${item.status === "completed" && 'border-gray-600 '} relative w-11/12 h-auto p-2 bg-transparent transition border border-cyan-600 rounded-md flex justify-start items-center px-3`}>
                      <p className={`${item.status === "completed" ? 'line-through text-gray-400' : ""} decoration-white decoration-3 text-md mt-0.5 text-gray-300 font-semibold`}>
                        {item.title}
                      </p>
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
                  </motion.li>
                ))}
              </AnimatePresence>

            </>
          )
        ) : (
          ""
        )}
      </ul>
    </>
  );
}
