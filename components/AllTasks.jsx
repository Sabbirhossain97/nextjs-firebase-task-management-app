import { useEffect, useState, useRef } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { deleteTodo } from "../services/deleteTodo";
import { CgUndo } from "react-icons/cg";
import { editTodo } from "../services/editTodo";
import { Popconfirm, Tooltip } from 'antd';
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import { deleteCompletedTodos } from "../services/deleteAllCompleted";
import { IoMdInformationCircle } from "react-icons/io";
import { MdAddReaction } from "react-icons/md";
import Picker from 'emoji-picker-react';
import moment from "moment";

export default function AllTasks({ user, todoList, setLoading }) {

  const [currentItem, setCurrentItem] = useState(null);
  const [edit, setEdit] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);
  const [updates, setUpdates] = useState({
    title: "",
    status: "pending",
    isImportant: false
  })

  const confirm = (user, id) => {
    handleDeleteTodo(user, id)
  };

  const cancel = (e) => {
    console.log();
  };

  const handleEditTodo = (todoId) => {
    try {
      setLoading(true);
      editTodo(user, todoId, updates)
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setEdit(false);
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

  const handleToggleImportant = (currentIsImportant, item) => {
    setUpdates((prevUpdates) => ({
      ...prevUpdates,
      title: item.title,
      status: item.status,
      isImportant: !currentIsImportant
    }));
    setCurrentTodoId(item.id);
  };

  const onEmojiClick = (emojiObject) => {
    setUpdates((prevUpdates) => ({
      ...prevUpdates,
      title: prevUpdates.title + emojiObject.emoji,
    }));
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


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
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ delay: 0 }}
                    className="py-6 flex justify-center flex-col gap-4 items-center">
                    <span className="border-2 p-1 rounded-full border-cyan-500">
                      <BsCheckLg className="text-7xl text-cyan-400" />
                    </span>
                    <h1>
                      You have completed all tasks for today!
                    </h1>
                  </motion.div>
                  :
                  todoList.filter((todo) => todo.status === "pending").map((item) => (
                    <motion.li
                      className="transition duration-300 mt-4"
                      key={item.id}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ delay: 0.25 }}
                    >
                      <div className="flex gap-2">
                        <div className={`${item.status === "completed" && 'border-gray-600'} relative w-11/12 h-auto p-2 bg-transparent transition ${edit && item.id === currentItem?.[0]?.id ? "border-cyan-400 border-b-2" : "border-cyan-600 border-b"}  flex justify-start items-center px-1`}>
                          <div className="flex items-center gap-1">
                           {!edit && item.id === currentItem?.[0]?.id} <Popconfirm
                              title={item.isImportant ? "Mark as not important" : "Mark as important"}
                              onConfirm={() => handleToggleImportant(item.isImportant, item)}
                              onCancel={cancel}
                              okText="Yes"
                              cancelText="No"
                              overlayInnerStyle={{ padding: "15px 20px 15px 20px" }}
                              style={{ padding: '5px' }}
                            >
                              <button
                                className="cursor-pointer flex items-center gap-1"
                                id={item.id}
                                disabled={edit ? true : false}
                              >
                                {item.isImportant ?
                                  <FaStar className="text-yellow-400" /> :
                                  <CiStar className="text-xl text-cyan-500" />
                                }
                              </button>
                            </Popconfirm>
                          </div>
                          {edit && item.id === currentItem[0].id ? (
                            <>
                              <input
                                defaultValue={item.title}
                                value={updates.title}
                                onChange={(e) => {
                                  setUpdates((prevUpdates) => {
                                    const newUpdates = { ...prevUpdates, title: e.target.value, status: item.status, isImportant: item.isImportant }
                                    return newUpdates
                                  })
                                }}
                                className={` caret-cyan-400 w-full text-sm h-auto text-white outline-none px-2 font-semibold bg-inherit  border-cyan-700 placeholder-gray-400`}
                                placeholder="Edit todo..."
                                autoFocus={true}
                              />
                              <div ref={buttonRef}>
                                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                  <MdAddReaction className="text-xl text-gray-500 hover:text-cyan-400 transition duration-300" />
                                </button>
                              </div>
                              {showEmojiPicker &&
                                <motion.div
                                  initial={{ opacity: 0, }}
                                  animate={{ opacity: 1, }}
                                  exit={{ opacity: 0 }}
                                  transition={{ delay: 0.50 }}
                                  className="absolute right-6 top-10 z-10" ref={pickerRef}>
                                  <Picker
                                    onEmojiClick={onEmojiClick} />
                                </motion.div>
                              }
                            </>
                          ) : (
                            <motion.p
                              className={`${item.status === "completed" ? 'line-through text-gray-400' : ""} decoration-white decoration-3 text-sm mt-0.5 ml-2 text-gray-300 font-semibold`}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: 5 }}
                              transition={{ delay: 0.25 }}
                            >
                              {item.title}
                            </motion.p>
                          )}
                        </div>
                        <Popconfirm
                          title="Mark as complete"
                          onConfirm={() => {
                            setUpdates((prevUpdates) => {
                              return { ...prevUpdates, title: item.title, status: 'completed', isImportant: item.isImportant };
                            })
                            setCurrentTodoId(item.id);
                          }}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                          overlayInnerStyle={{ padding: "15px 20px 15px 20px" }}
                          style={{ padding: '5px' }}
                        >
                          <motion.button
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 5 }}
                            transition={{ delay: 0.5 }}
                            className="cursor-pointer scale-100 h-10 flex items-end"
                            id={item.id}
                          >
                            <HiOutlineDocumentCheck className="text-xl transition duration-300 text-gray-500 hover:text-cyan-500 " />
                          </motion.button>
                        </Popconfirm>

                        {/* delete todo */}

                        <Popconfirm
                          title="Delete the task"
                          description="Are you sure to delete this task?"
                          onConfirm={() => confirm(user, item.id)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <motion.button
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 5 }}
                            transition={{ delay: 0.5 }}
                            className="cursor-pointer scale-100 h-10 flex items-end"
                            title="delete this item"
                          >
                            <AiFillDelete className="text-xl text-red-600 hover:text-red-400 transition duration-300" />
                          </motion.button>
                        </Popconfirm>
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
                                    key={item.id}
                                    title="save changes"
                                    className="cursor-pointer scale-100 h-10 flex items-end"
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
                                    className="cursor-pointer scale-100 h-10 flex items-end"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: 5 }}
                                    transition={{ delay: 0.5 }}
                                    title="undo changes"
                                  >
                                    <CgUndo className="text-2xl text-cyan-500 hover:text-cyan-700 transition duration-300" />
                                  </motion.button>
                                ) : (
                                  <motion.button
                                    onClick={() => {
                                      setEdit(true);
                                      handleEdit(item.id);
                                    }}
                                    className="cursor-pointer scale-100 h-10 flex items-end"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: 5 }}
                                    transition={{ delay: 0.5 }}
                                    title="edit this item"
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
                  ))}
              </AnimatePresence>
              {/* completed todo lists */}
              <AnimatePresence>
                {todoList.filter((todo) => todo.status === "completed").length > 0 &&
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 0 }}
                    transition={{ delay: 0 }}
                    className="mt-8 flex items-center gap-4">
                    <h1
                      className=" text-white">Completed
                    </h1>
                    <button onClick={() => deleteCompletedTodos(user)} className="bg-cyan-500 hover:bg-cyan-600 transition duration-300 text-white text-xs px-2 rounded-md py-1">Clear {todoList.filter((todo) => todo.status === "completed").length > 1 ? "All" : ""}</button>
                  </motion.div>
                }
                {todoList.filter((todo) => todo.status === "completed").map((item) => (
                  <motion.li
                    className="transition duration-300 mt-4 flex gap-2 "
                    key={item.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ delay: 0 }}
                  >
                    <Tooltip placement="top" title={`Completed On: ${moment(item.updatedAt).format("MMMM Do YYYY h:mm A")}`}>
                      <IoMdInformationCircle className="cursor-pointer text-xl text-cyan-400 h-10 flex items-end" />
                    </Tooltip>
                    <div className={`${item.status === "completed" && 'border-gray-600 '} relative w-11/12 h-auto p-2 bg-transparent transition border border-cyan-600 rounded-md flex justify-start items-center px-3`}>
                      <HiOutlineDocumentCheck className="text-xl transition text-cyan-400 " />
                      <p className={`${item.status === "completed" ? 'line-through text-gray-400' : ""} ml-2 decoration-white decoration-3 text-sm mt-0.5 text-gray-300 font-semibold`}>
                        {item.title}
                      </p>
                    </div>
                    <Popconfirm
                      title="Delete the task"
                      description="Are you sure to delete this task?"
                      onConfirm={() => confirm(user, item.id)}
                      onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                      overlayClassName="custom-popconfirm"
                    >
                      <motion.button
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 5 }}
                        transition={{ delay: 0.5 }}
                        className="cursor-pointer scale-100 h-10"
                      >
                        <AiFillDelete className="text-xl text-red-600 hover:text-red-400 transition duration-300" />
                      </motion.button>
                    </Popconfirm>
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
