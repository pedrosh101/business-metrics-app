"use client";
import { useState, useRef, useEffect } from "react";


const Navbar = ({ setSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);

  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex sm:w-1/6 sm:min-h-screen bg-slate-50 text-black text-left border-r-2 border-slate-200">


      {/* menu mobile */}
      <div onClick={toggleNav} className="text-2xl cursor-pointer sm:hidden">
        <svg viewBox="0 0 24 24" fill="currentColor" height="1.3em">
          <path d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z" />
        </svg>
      </div>

      <div
        className={`fixed inset-0 bg-black bg-opacity-75 z-50 transition-opacity duration-700 ${
          isOpen ? "opacity-100 z-50" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          ref={navRef}
          className={`fixed flex flex-col space-y-2 right-0 top-0 h-full w-72 sm:w-80 p-10 shadow transition-transform transform duration-700 text-black bg-white ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <ul className="text-left">
          <li className="my-4">
            <button onClick={() => setSection("dashboard")}>Dashboard</button>
          </li>
          <li className="my-4">
            <button onClick={() => setSection("vendors")}>Vendors</button>
          </li>
          <li className="my-4">
            <button onClick={() => setSection("subscriptions")}>
              Subscriptions
            </button>
          </li>
          <li className="my-4">
            <button onClick={() => setSection("pages")}>Pages</button>
          </li>
          <li className="my-4">
            <button onClick={() => setSection("configurations")}>
              Configurations
            </button>
          </li>
          </ul>
        </div>
      </div>

      {/* menu desktop */}
      <nav className="sm:fixed top-1/2 sm:transform sm:-translate-y-1/2 hidden sm:flex pl-12">
        <ul className="text-left">
          <li className="my-4">
            <button onClick={() => setSection("dashboard")} className="hover:text-slate-700">Dashboard</button>
          </li>
          <li className="my-4">
            <button onClick={() => setSection("vendors")} className="hover:text-slate-700">Vendors</button>
          </li>
          <li className="my-4">
            <button onClick={() => setSection("subscriptions")} className="hover:text-slate-700">
              Subscriptions
            </button>
          </li>
          <li className="my-4">
            <button onClick={() => setSection("pages")} className="hover:text-slate-700">Pages</button>
          </li>
          <li className="my-4">
            <button onClick={() => setSection("configurations")} className="hover:text-slate-700">
              Configurations
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
