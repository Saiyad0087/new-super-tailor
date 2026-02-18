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

    const today = new Date().toISOString().split("T")[0];

    allOrders.sort((a, b) => {

      const aOverdue =
        a.deliveryDate < today &&
        a.status !== "completed";

      const bOverdue =
        b.deliveryDate < today &&
        b.status !== "completed";

      // 1️⃣ Overdue first
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;

      // 2️⃣ Completed always last
      if (a.status === "completed" && b.status !== "completed") return 1;
      if (a.status !== "completed" && b.status === "completed") return -1;

      // 3️⃣ Otherwise latest fabric date first
      return new Date(b.fabricReceivedDate) -
        new Date(a.fabricReceivedDate);
    });


    setOrders(allOrders);
  }, []);

  const filtered = orders.filter(order =>
    order.customerName.toLowerCase().includes(search.toLowerCase()) ||
    order.mobile.includes(search)
  );

  const today = new Date().toISOString().split("T")[0];
  const isOverdue = (order) => {
    return order.deliveryDate < today &&
      order.status !== "completed";
  };

  function getStatusDisplay(status) {

    if (status === "fabric_cutting")
      return { color: "text-yellow-400", label: "Fabric Cutting" };

    if (status === "stitching")
      return { color: "text-blue-400", label: "Stitching" };

    if (status === "ready")
      return { color: "text-purple-400", label: "Ready" };

    if (status === "completed")
      return { color: "text-green-400", label: "Completed" };
  }


  return (
    <Layout>

      <h2 className="text-3xl font-bold mb-6">Orders</h2>

      <input
        placeholder="Search by name or mobile..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
              className={`py-4 cursor-pointer px-2 transition ${isOverdue(order)
                ? "bg-red-500/10 border-l-4 border-red-500"
                : "hover:bg-white/5"
                }`}

            >
              <div className="flex justify-between items-center">

                <div>
                  <div className="font-semibold text-lg">
                    {order.customerName}
                  </div>

                  <div className="text-gray-400 text-sm">
                    Fabric: {order.fabricReceivedDate}
                  </div>

                  <div className="text-gray-300 text-sm mt-1">
                    {order.garments.shirt > 0 && `Shirt: ${order.garments.shirt} `}
                    {order.garments.pant > 0 && `Pant: ${order.garments.pant} `}
                    {order.garments.kurta > 0 && `Kurta: ${order.garments.kurta}`}
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
