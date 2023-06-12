import React from "react";
import { motion } from "framer-motion";

export default function ClearAll({ clearall, toggle }) {
  return (
    <>
      {toggle ? (
        ""
      ) : (
        <motion.div
          className="text-sm flex justify-end border-t-1 border-cyan-700 py-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ delay: 0.5 }}
        >
          <p
            onClick={clearall}
            className="cursor-pointer font-semibold px-2 py-2 rounded-md border bg-cyan-700 hover:bg-cyan-600 border-cyan-500 transition "
          >
            Clear tasks
          </p>
        </motion.div>
      )}
    </>
  );
}
