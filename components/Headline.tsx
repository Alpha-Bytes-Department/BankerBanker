"use client";
import { motion } from 'framer-motion';
type HeadlineProps = {
    className?: string;
    text?: string;
}


const Headline = ({
    className = "text-4xl",
    text = "Add your headline here",
}: HeadlineProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h1 className={`font-bold my-2 text-[#4A5568] ${className}`}>
                {text}
            </h1>
        </motion.div>
    );
};

export default Headline;