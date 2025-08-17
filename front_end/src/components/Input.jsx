import { forwardRef } from "react";

const Input = forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`
        w-full px-4 py-3 
        bg-n-8 border border-n-6 rounded-lg
        text-n-1 placeholder-n-4
        focus:outline-none focus:ring-2 focus:ring-primary-1 focus:border-transparent
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
