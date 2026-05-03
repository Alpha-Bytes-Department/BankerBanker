"use client";
import { FaAngleRight } from "react-icons/fa6";
import { motion } from "framer-motion";
const Banner = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="w-full h-[80vh] bg-[linear-gradient(255.49deg,rgba(0,0,0,0)_-2%,rgba(0,0,0,0.54)_58.53%),url('/images/banner-img.png')] bg-no-repeat bg-[center_65%] bg-cover relative flex flex-col items-center justify-center text-white">
        <div className="flex flex-col w-full items-start gap-5 px-4 lg:px-6 md:absolute bottom-20 ">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl leading-20 lg:text-5xl font-semibold w-full lg:w-10/12 xl:w-8/12"
          >
            Your Banker for Commercial Real Estate Powered by AI
          </motion.h1>
          <div className="w-full flex gap-5 flex-col justify-between items-start">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full lg:w-8/12 xl:w-7/12 text-2xl"
            >
              Create perfect documents in minutes, every time. Let AI handle the
              paperwork while you build your dreams
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="button-primary px-3 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer"
              onClick={() => console.log("this btn is clicked")}
            >
              <span>VIEW TRANSACTIONS</span>
              <FaAngleRight />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Banner;
