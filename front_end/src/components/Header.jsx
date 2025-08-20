import { useLocation, Link, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { User, ShoppingCart } from "lucide-react";

import { pritechviorLogo } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import AccountDropdown from "./AccountDropdown";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const Header = () => {
  const pathname = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartCount } = useCart();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Calculate scroll progress
  useEffect(() => {
    const calculateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", calculateScrollProgress);
    return () => window.removeEventListener("scroll", calculateScrollProgress);
  }, []);

  // Fetch cart count
  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-[100] border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      {/* Scroll Progress Bar */}
      <div
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-color-1 to-color-2 transition-all duration-300 ease-out z-10"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <Link className="block xl:mr-8" to="/">
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-color-1/10 to-color-2/10 border-2 border-color-1/30 hover:border-color-1/60 transition-all duration-300 hover:shadow-lg hover:shadow-color-1/20 flex items-center justify-center group">
            <img
              src={pritechviorLogo}
              width={32}
              height={32}
              alt="PritechVior"
              className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </Link>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) =>
              item.url.startsWith("#") ? (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={handleClick}
                  className={`block relative font-code text-lg uppercase text-n-1 transition-colors hover:text-color-1 ${
                    item.onlyMobile ? "lg:hidden" : ""
                  } px-4 py-4 md:py-6 lg:px-3 lg:text-xs lg:font-semibold ${
                    item.url === pathname.hash
                      ? "z-2 lg:text-n-1"
                      : "lg:text-n-1/50"
                  } lg:leading-5 lg:hover:text-n-1 xl:px-4`}
                >
                  {item.title}
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={item.url}
                  onClick={handleClick}
                  className={`block relative font-code text-lg uppercase text-n-1 transition-colors hover:text-color-1 ${
                    item.onlyMobile ? "lg:hidden" : ""
                  } px-4 py-4 md:py-6 lg:px-3 lg:text-xs lg:font-semibold ${
                    pathname.pathname === item.url
                      ? "z-2 lg:text-n-1"
                      : "lg:text-n-1/50"
                  } lg:leading-5 lg:hover:text-n-1 xl:px-4`}
                >
                  {item.title}
                </Link>
              )
            )}

            {/* Mobile Account Links */}
            <div className="lg:hidden border-t border-n-6 mt-4 pt-4">
              <Link
                to="/login"
                onClick={handleClick}
                className="flex items-center gap-2 font-code text-lg uppercase text-n-1 transition-colors hover:text-color-1 px-4 py-3"
              >
                <User size={18} />
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={handleClick}
                className="flex items-center gap-2 font-code text-lg uppercase text-n-1 transition-colors hover:text-color-1 px-4 py-3"
              >
                <User size={18} />
                Sign Up
              </Link>
            </div>

            {/* Mobile Account Link - moved to AccountDropdown */}
          </div>

          <HamburgerMenu />
        </nav>

        {/* Cart Icon - Available for all users */}
        <button
          onClick={() => navigate("/cart")}
          className="relative p-2 text-n-1 hover:text-color-1 transition-colors mr-4"
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-color-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium z-10">
              {cartCount}
            </span>
          )}
        </button>

        <AccountDropdown />

        <Button
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
