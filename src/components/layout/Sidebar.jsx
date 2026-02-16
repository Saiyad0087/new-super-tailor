import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { FaTshirt } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6">

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="flex items-center gap-3 mb-12"
      >
        <FaTshirt size={28} className="text-blue-400" />
        <h1 className="text-2xl font-bold">
          New Super Tailor
        </h1>
      </motion.div>

      <div className="space-y-4">

        <NavLink
          to="/"
            className={({ isActive }) =>
             `block p-3 rounded-xl transition ${
               isActive
                ? "bg-blue-600/40"
                : "bg-white/10 hover:bg-white/20"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/add-order"
            className={({ isActive }) =>
              `block p-3 rounded-xl transition ${
                isActive
                  ? "bg-blue-600/40"
                  : "bg-white/10 hover:bg-white/20"
            }`
          }
        >
          Add Order
        </NavLink>

        <NavLink
          to="/orders"
            className={({ isActive }) =>
              `block p-3 rounded-xl transition ${
                isActive
                ? "bg-blue-600/40"
                : "bg-white/10 hover:bg-white/20"
            }`
          }
        >
          Orders
        </NavLink>


      </div>

    </div>
  );
}
