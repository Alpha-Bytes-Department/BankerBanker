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
      <div className="w-full h-[80vh] bg-[linear-gradient(255.49deg,rgba(0,0,0,0)_-2%,rgba(0,0,0,0.54)_58.53%),url('/images/banner.png')] bg-no-repeat bg-[center_65%] bg-cover relative flex flex-col items-center justify-center text-white">
        <div className="flex flex-col w-full items-start gap-3 px-4 lg:px-6 md:absolute bottom-8 lg:bottom-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-3xl lg:text-5xl font-semibold leading-tight w-full lg:w-10/12 xl:w-8/12"
          >
            Your Banker for Commercial Real Estate <br />
            Powered by AI
          </motion.h1>
          <div className="w-full flex gap-4 flex-col md:flex-row justify-between items-start md:items-end">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full lg:w-7/12 text-lg md:text-xl lg:text-2xl leading-normal"
            >
              Loan Origination, Brokerage and Capital Markets. Faster, Cheaper, Smarter
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="button-primary px-3 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
              onClick={() => {
                document.getElementById('transactions')?.scrollIntoView({ behavior: 'smooth' });
              }}
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
