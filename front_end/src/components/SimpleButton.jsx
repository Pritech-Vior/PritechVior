const SimpleButton = ({
  className,
  href,
  onClick,
  children,
  variant = "primary",
  disabled = false,
}) => {
  const baseClasses =
    "relative inline-flex items-center justify-center px-6 py-3 font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300",
    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
  };

  const classes = `${baseClasses} ${variants[variant]} ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  } ${className || ""}`;

  const renderButton = () => (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );

  const renderLink = () => (
    <a href={href} className={classes}>
      {children}
    </a>
  );

  return href ? renderLink() : renderButton();
};

export default SimpleButton;
