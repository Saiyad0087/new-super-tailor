import Layout from "../components/layout/Layout";
import { getCustomers } from "../utils/storage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const customers = getCustomers();

    const allOrders = customers.flatMap(customer =>
      customer.orders.map(order => ({
        ...order,
        customerName: customer.name,
        mobile: customer.mobile
      }))
    );

    // Sort by latest fabric received
    allOrders.sort(
      (a, b) =>
        new Date(b.fabricReceivedDate) -
        new Date(a.fabricReceivedDate)
    );

    setOrders(allOrders);
  }, []);

  const filtered = orders.filter(order =>
    order.customerName.toLowerCase().includes(search.toLowerCase()) ||
    order.mobile.includes(search)
  );

  function getStatusDisplay(status) {
    if (status === "cutting_pending")
      return { color: "text-yellow-400", label: "Cutting Pending" };
    if (status === "cutting_done")
      return { color: "text-blue-400", label: "Cutting Done" };
    if (status === "delivered")
      return { color: "text-green-400", label: "Delivered" };
  }

  return (
    <Layout>

      <h2 className="text-3xl font-bold mb-6">Orders</h2>

      <input
        placeholder="Search by name or mobile..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="p-3 rounded-xl bg-white/20 mb-6 w-full"
      />

      <div className="divide-y divide-white/20">

        {filtered.map(order => {
          const statusInfo = getStatusDisplay(order.status);

          return (
            <div
              key={order.orderId}
              onClick={() =>
                navigate(`/order-detail/${order.mobile}/${order.orderId}`)
              }
              className="py-4 cursor-pointer hover:bg-white/5 px-2 transition"
            >
              <div className="flex justify-between items-center">

                <div>
                  <div className="font-semibold text-lg">
                    {order.customerName}
                  </div>
                  <div className="text-gray-400 text-sm">
                    Fabric: {order.fabricReceivedDate}
                  </div>
                </div>

                <div className={`flex items-center gap-2 ${statusInfo.color}`}>
                  <span>●</span>
                  <span>{statusInfo.label}</span>
                </div>

              </div>
            </div>
          );
        })}

      </div>

    </Layout>
  );
}
