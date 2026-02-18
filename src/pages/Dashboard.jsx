import Layout from "../components/layout/Layout";
import { useEffect, useState } from "react";
import { getCustomers } from "../utils/storage";

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    setCustomers(getCustomers());
  }, []);

  const allOrders = customers.flatMap(c => c.orders || []);

  const totalCustomers = customers.length;
  const totalOrders = allOrders.length;

  const fabricCutting = allOrders.filter(
    o => o.status === "fabric_cutting"
  ).length;

  const stitching = allOrders.filter(
    o => o.status === "stitching"
  ).length;

  const ready = allOrders.filter(
    o => o.status === "ready"
  ).length;

  const completed = allOrders.filter(
    o => o.status === "completed"
  ).length;

  const activeOrders = allOrders.filter(
    o => o.status !== "completed"
  ).length;



  const today = new Date().toISOString().split("T")[0];

  const overdue = allOrders.filter(
    o => o.deliveryDate < today && o.status !== "completed"
  ).length;

  const progress = totalOrders
    ? Math.round((completed / totalOrders) * 100)
    : 0;

  return (
    <Layout>

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-32 left-1/3 w-[600px] h-[600px] bg-blue-500/20 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-indigo-500/20 blur-[150px] rounded-full"></div>
      </div>

      <h2 className="text-4xl font-bold mb-12">
        Welcome back, Sarfaraz 👋
      </h2>

      <div className="grid lg:grid-cols-3 gap-10">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-10">

          <div className="relative group bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-[0_30px_80px_rgba(0,0,0,0.5)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_40px_100px_rgba(0,0,0,0.7)] overflow-hidden animate-[float_6s_ease-in-out_infinite]">


            {/* Soft Glow Layer */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-blue-400/10 to-transparent rounded-3xl pointer-events-none"></div>

            <h3 className="text-3xl font-bold mb-2">
              New Super Tailor
            </h3>
            <p className="text-gray-300">
              Smart Tailoring Management Dashboard
            </p>
          </div>

          {/* ROW 1 – WORK FOCUS */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <GlassCard title="Active Orders" value={activeOrders} highlight />
            <GlassCard title="Overdue Orders" value={overdue} red highlight />
            <GlassCard title="Ready for Delivery" value={ready} green highlight />
          </div>

          {/* ROW 2 – PRODUCTION FLOW */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <GlassCard title="Fabric Cutting" value={fabricCutting} />
            <GlassCard title="Stitching" value={stitching} />
            <GlassCard title="Completed" value={completed} />
          </div>

          {/* ROW 3 – BUSINESS STATS */}
          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard title="Total Orders" value={totalOrders} />
            <GlassCard title="Total Customers" value={totalCustomers} />
          </div>


        </div>

        {/* RIGHT SECTION */}
        <div className="relative group bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-[0_30px_80px_rgba(0,0,0,0.5)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_40px_100px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center overflow-hidden animate-[float_6s_ease-in-out_infinite]">


          {/* Inner Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-3xl pointer-events-none"></div>


          <h3 className="text-xl mb-8 font-semibold">
            Delivery Progress
          </h3>

          <CircularProgress percentage={progress} />

          <div className="mt-8 text-center">
            <p className="text-green-400 text-lg">
              completed: {completed}
            </p>
            <p className="text-yellow-400 text-lg">
              Pending: {fabricCutting + stitching + ready}
            </p>
          </div>

        </div>

      </div>

    </Layout>
  );
}

/* GLASS CARD */
function GlassCard({ title, value, red, green, highlight }) {
  return (
    <div className={`relative group backdrop-blur-xl border rounded-2xl p-6 transition duration-500 overflow-hidden
      ${highlight 
        ? "bg-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.6)] scale-105" 
        : "bg-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.4)]"}
      ${red ? "border-red-400/40" : green ? "border-green-400/40" : "border-white/20"}
      hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(0,0,0,0.7)]`}
    >

      <p className="text-gray-300 mb-3">
        {title}
      </p>

      <p
        className={`text-4xl font-bold ${
          red
            ? "text-red-400"
            : green
            ? "text-green-400"
            : "text-blue-400"
        }`}
      >
        {value}
      </p>

    </div>
  );
}



/* CIRCULAR PROGRESS */
function CircularProgress({ percentage }) {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-[200px] h-[200px] flex items-center justify-center">


      <svg height="200" width="200">
        <circle
          stroke="rgba(255,255,255,0.1)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="100"
          cy="100"
        />
        <circle
          stroke="url(#gradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.6s ease"
          }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx="100"
          cy="100"
        />
        <defs>
          <linearGradient id="gradient">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>

      {/* Outer Glow */}
      <div className="absolute w-[220px] h-[220px] bg-emerald-400/10 blur-3xl rounded-full"></div>

      <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
        {percentage}%
      </div>

    </div>
  );
}
