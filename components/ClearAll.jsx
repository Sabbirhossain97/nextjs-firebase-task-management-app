import React from 'react'
import { motion } from "framer-motion";

export default function ClearAll({ clearall }) {
  return (
    <>
      <motion.div
        className="text-sm mt-4 flex justify-end border-t-1 border-cyan-700 py-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ delay: 0.5 }}
      >
        <p
          onClick={clearall}
          className="cursor-pointer font-semibold px-2 py-2 rounded-md border border-cyan-500 transition hover:bg-cyan-600"
        >
          Clear tasks
        </p>
      </motion.div>
    </>
  );
}
