"use client";
import { FaAngleRight } from "react-icons/fa6";

export type ButtonProps = {
  text?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | (() => void | Promise<void>);
  className?: string;
  width?: string;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  arrow?: boolean;
};

const Button = ({
  text,
  onClick,
  width,
  className = "button-primary",
  type = "button",
  icon,
  arrow,
}: ButtonProps) => {

  const buttonStyle = width ? { width } : {};
  
  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      type={type}
      className={`flex justify-center items-center gap-3 text-xs sm:text-sm lg:text-base px-3 lg:px-6 py-3 rounded-full transition-colors duration-300 
        active:scale-95 cursor-pointer ${className}`}
    >
      {icon}
      {text}
      {arrow && <FaAngleRight className="text-white" />}
    </button>
  );
};

export default Button;