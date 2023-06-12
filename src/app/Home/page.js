"use client";
import { useEffect, useState } from "react";
import axios from "axios";
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

export default function Home() {
  const [todo, setTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [user, setUser] = useState(null);
  const [undo, setUndo]= useState(false)

  const handleTodo = async () => {
    if (todo === "") {
      return;
    } else {
      try {
        setLoading(true);
        await axios
          .post(
            "/api/newtask",
            {
              newTask: todo,
              userId: user?.data._id,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
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
        setLoading(true)
        const response = await axios.post(
          "/api/allTasks",
          {
            userId: user?.data._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = response.data.filter((item) => {
          if (item.completed === false) {
            return item;
          }
        });
        setData(result);
      } catch (err) {
        console.log("error fetching documents from db", err);
      } finally {
        setLoading(false)
      }
    };
    fetchTasks();
  }, [loading,undo]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = window.localStorage.getItem("token");

        const response = axios
          .post("/api/userData", token, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((data) => setUser(data))
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
      }
    };
    getUserData();
  }, []);

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
    <div>
      <motion.div
        className="relative transition-[height] flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gradient-to-br from-slate-800 to-slate-900 "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Header />
        <User user={user} />
        <div className="h-[700px] mt-10 transition-all w-11/12 md:w-3/4 lg:w-2/3 xl:w-2/3 2xl:w-1/3 bg-gray-200 bg-slate-900/20 rounded-lg p-10 drop-shadow-md shadow-cyan-800">
          <div className="mt-3 text-sm  text-white flex justify-between items-center">
            <p className=" font-semibold">{moment().format("MMMM Do YYYY")}</p>
            <p className=" font-semibold">{moment().format("h:mm a")}</p>
          </div>

          <div className="w-full mt-16 flex flex-row text-sm text-center justify-center ">
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
              onClick={handleTodo}
              className="flex justify-center items-center w-[60px] text-md  h-8 mt-2 bg-cyan-600 hover:bg-cyan-500 text-center transition text-white rounded-md ml-3"
            >
              <AiOutlineSend className="text-lg text-white" />
            </button>
          </div>
          {data ? (
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
                  className={`cursor-pointer text-sm font-semibold p-1 px-3 ${
                    toggle ? "" : " bg-cyan-700"
                  } hover:bg-cyan-500  transition`}
                >
                  Current tasks
                </p>
                <p
                  onClick={() => setToggle(true)}
                  className={`cursor-pointer text-sm font-semibold p-1 px-2 py-1 ${
                    toggle ? " bg-cyan-700 text-white" : ""
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
                  data={data}
                  loading={loading}
                  setLoading={setLoading}
                />
              )}
            </div>
          </SimpleBar>
         {data.length > 0 ?  <ClearAll clearall={clearAllTasks} toggle={toggle}/> : "" }
        </div>
      </motion.div>
    </div>
  );
}
