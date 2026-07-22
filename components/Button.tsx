"use client";
import { FaAngleRight } from "react-icons/fa6";

export type ButtonProps = {
  text?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | (() => void | Promise<void>);
  size?: "small" | "medium" | "large";
  className?: string;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  arrow?: boolean;
  isDisabled?: boolean;
};

const sizes = {
  small: "text-xs px-3 py-1.5",
  medium: "text-xs md:text-sm px-4 py-2",
  large: "text-sm md:text-base px-5 py-2.5",
}

const Button = ({
  text,
  onClick,
  className = "button-primary",
  size="large",
  type = "button",
  icon,
  arrow = false,
  isDisabled = false,
}: ButtonProps) => {

  
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={isDisabled}
      className={`flex justify-center items-center gap-2 rounded-full transition-colors duration-300 
        active:scale-95 cursor-pointer ${sizes[size]} ${className} ${isDisabled ? 'opacity-80 cursor-not-allowed' : ''}`}
    >
      {icon}
      {text}
      {arrow && <FaAngleRight className="text-white" />}
    </button>
  );
};

export default Button;