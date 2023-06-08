import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiUndo } from "react-icons/bi";
import axios from "axios";
import { BsCheckLg } from "react-icons/bs";

export default function CompletedTasks({ setLoading }) {
  const [completedTasks, setCompletedTasks] = useState(null);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const completedTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/allTasks");
        const result = response.data.filter((item) => {
          if (item.completed === true) {
            return item;
          }
        });
        setCompletedTasks(result);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    completedTasks();
  }, [empty]);

  const redoTasks = async (id) => {
    try {
      setEmpty(true);
      await axios.put(`/api/redoTasks/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.log(err);
    } finally {
      setEmpty(false);
    }
  };

  const clearAllCompletedTasks = async () => {
    try {
      setEmpty(true);
      await axios.get("/api/clearCompletedTasks");
    } catch (err) {
      console.log(err);
    } finally {
      setEmpty(false);
    }
  };

  return (
    <>
      <ul className=" max-h-[800px] transition delay-300 ease-out">
        <AnimatePresence>
          {completedTasks ? (
            completedTasks.length > 0 ? (
              completedTasks.map((item, key) => (
                <motion.li
                  className=" mt-4"
                  key={key}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ delay: 0.0 }}
                >
                  <div className="flex gap-2">
                    <div className="w-full h-10 bg-transparent transition border border-cyan-600 rounded-[7px] flex justify-between items-center px-3">
                      <div className="font-semibold decoration-white flex items-center text-sm mr-1 ">
                        <BsCheckLg className="text-lg text-green-400" />
                        <span className="ml-2 text-gray-500">{item.task}</span>
                      </div>
                      <p
                        onClick={() => redoTasks(item._id)}
                        className={`cursor-pointer decoration-white text-[13px] mt-0.5 ml-2 text-gray-300 font-semibold`}
                        title="redo task"
                      >
                        <BiUndo className="text-xl hover:text-cyan-500 transition" />
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))
            ) : (
              <motion.div
                className="mx-auto text-center text-sm mt-20 h-48   p-2 rounded-md"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ delay: 0.25 }}
              >
                You have no completed tasks!
              </motion.div>
            )
          ) : (
            ""
          )}
        </AnimatePresence>
      </ul>
      {completedTasks ? (
        completedTasks.length > 0 ? (
          <motion.div
            className="text-sm mt-4 flex justify-end border-t-1 border-cyan-700 py-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ delay: 0.5 }}
            onClick={clearAllCompletedTasks}
          >
            <p className="cursor-pointer font-semibold px-2 py-2 rounded-md border border-cyan-500 transition hover:bg-cyan-600">
              Clear all
            </p>
          </motion.div>
        ) : (
          ""
        )
      ) : (
        ""
      )}
    </>
  );
}
