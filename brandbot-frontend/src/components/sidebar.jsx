import React from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/content-history", label: "Content History" },
  { to: "/pricing", label: "Pricing" },
  { to: "/profile", label: "Profile" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 flex flex-col justify-between pt-8 bg-white rounded-tl-2xl rounded-bl-2xl">
      <div>
        <div className="font-bold text-3xl mb-1">BrandBot</div>
        <div className="text-base text-gray-700 mb-8">by Dimensions</div>
        <nav className="flex flex-col gap-2 mb-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-left px-6 py-3 rounded-xl font-medium text-lg ${location.pathname === link.to
                  ? "bg-violet-100 text-violet-950"
                  : "hover:bg-violet-100 text-violet-950"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="bg-violet-100 rounded-xl p-6 mb-8 mr-4 text-violet-950 text-base font-normal">
        Upgrade to <br />
        <span className="font-bold text-xl">Pro</span>
        <br />
        Save up to <br />
        <span className="font-bold text-2xl">17%</span>
      </div>
    </aside>
  );
};

export default Sidebar;
