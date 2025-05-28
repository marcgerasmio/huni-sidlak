import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HiHome, HiMusicNote, HiClock, HiCog } from "react-icons/hi";
import { MdVideoCameraBack } from "react-icons/md";

const navItems = [
  { to: "/home", icon: <HiHome className="w-7 h-7" /> },
  { to: "/tuner", icon: <HiMusicNote className="w-7 h-7" /> },
  { to: "/trial", icon: <MdVideoCameraBack className="w-7 h-7" /> },
  { to: "/about", icon: <HiCog className="w-7 h-7" /> },
];

const BottomNav = () => {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#08342c] border-t border-gray-800 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.to}
            className={`flex flex-col items-center text-white transition-colors ${
              location.pathname === item.to ? "text-cyan-400" : "text-white"
            }`}
          >
            {item.icon}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;