"use client";
import { motion } from 'framer-motion';
type DescriptionProps = {
    className?: string;
    position?: "left" | "right" | "center" | "justify";
    text?: string;
}

const Description = ({
    className="text-xl text-center",
    position="center",
    text="Add your description here",
}:DescriptionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div style={{ textAlign:position }} className={`text-[#4B5563] my-2 ${className}`}>
                {text}
            </div>
        </motion.div>
    );
};

export default Description;