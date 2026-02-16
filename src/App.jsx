import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Dashboard from "./pages/Dashboard";
import AddOrder from "./pages/AddOrder";
import Orders from "./pages/Orders";
import Measurements from "./pages/Measurements";
import OrderDetail from "./pages/OrderDetail";


export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-order" element={<AddOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/measurements/:mobile" element={<Measurements />} />
        <Route path="/order-detail/:mobile/:orderId" element={<OrderDetail />} />
      </Routes>
    </AnimatePresence>
  );
}
