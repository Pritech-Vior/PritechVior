import React from "react";

const Card = ({ children, className = "" }) => (
  <div className={`bg-n-8 rounded-xl shadow border border-n-6 ${className}`}>
    {children}
  </div>
);

export default Card;
