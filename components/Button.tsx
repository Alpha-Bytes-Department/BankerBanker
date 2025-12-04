"use client";
import { FaAngleRight } from "react-icons/fa6";

export type ButtonProps = {
  text?: string;
  onClick?: () => void;
  className?: string;
  width?: string;
  type?: "button" | "submit" | "reset";
  icon?: boolean;
};

const Button = ({
  text,
  onClick,
  width = "auto",
  className = "button-primary",
  type = "button",
  icon,
}: ButtonProps) => {
  return (
    <button
      style={{ width: width }}
      onClick={onClick}
      type={type}
      className={`flex justify-center items-center gap-3 px-6 py-3 rounded-full transition-colors duration-300 
        active:scale-95 cursor-pointer ${className}`}
    >
      {text}
      {icon && <FaAngleRight className="text-white" />}
    </button>
  );
};

export default Button;
