import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getCustomers, saveCustomers } from "../utils/storage";

export default function Measurements() {
  const { mobile } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = location.state?.orderId;

  const [customer, setCustomer] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [editMode, setEditMode] = useState(true);

  useEffect(() => {
    const customers = getCustomers();
    const found = customers.find(c => c.mobile === mobile);

    if (!found) {
      navigate("/orders");
      return;
    }

    setCustomer(found);

    if (orderId) {
      const order = found.orders.find(o => o.orderId === orderId);
      setCurrentOrder(order);
      setEditMode(false); // open directly in cutting mode
    } else {
      setEditMode(true);
    }
  }, [mobile, orderId, navigate]);

  function update(section, field, value) {
    setCustomer(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [section]: {
          ...prev.measurements[section],
          [field]: value
        }
      }
    }));
  }

  function saveMeasurements() {
    const customers = getCustomers();
    const updated = customers.map(c =>
      c.mobile === mobile ? customer : c
    );
    saveCustomers(updated);
    alert("Measurements Saved ✅");
  }

  function completeOrder() {
    const customers = getCustomers();

    const updated = customers.map(c => {
      if (c.mobile === mobile) {
        return {
          ...c,
          orders: c.orders.map(o =>
            o.orderId === orderId
              ? {
                  ...o,
                  status: "delivered",
                  deliveredDate: new Date().toISOString().split("T")[0]
                }
              : o
          )
        };
      }
      return c;
    });

    saveCustomers(updated);
    navigate("/orders");
  }

  if (!customer) return null;

  const shirtFields = [
    "collar","chest","waist","shoulder",
    "fullSleeve","halfSleeve","length","other"
  ];

  const pantFields = [
    "waist","inseam","outseam","seat",
    "rise","thigh","knee","opening","other"
  ];

  const kurtaFields = [
    "collar","shoulder","chest","waist",
    "hip","bottom","sleeve","cuff","length","other"
  ];

  // =============================
  // FULLSCREEN CUTTING VIEW
  // =============================
  if (!editMode && currentOrder) {
    return (
      <div className="min-h-screen bg-black text-white p-10">

        <div className="flex justify-between mb-10">
          <h1 className="text-3xl font-bold">
            {customer.name}
          </h1>

          <button
            onClick={() => navigate("/orders")}
            className="bg-white text-black px-6 py-2 rounded-xl"
          >
            Back
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-10">

          {currentOrder.garments.shirt && (
            <CuttingSection
              title="SHIRT"
              fields={shirtFields}
              data={customer.measurements.shirt}
            />
          )}

          {currentOrder.garments.pant && (
            <CuttingSection
              title="PANT"
              fields={pantFields}
              data={customer.measurements.pant}
            />
          )}

          {currentOrder.garments.kurta && (
            <CuttingSection
              title="KURTA"
              fields={kurtaFields}
              data={customer.measurements.kurta}
            />
          )}

        </div>

        {currentOrder.status !== "delivered" && (
          <button
            onClick={completeOrder}
            className="fixed bottom-8 right-8 bg-green-600 px-8 py-3 rounded-xl text-xl"
          >
            Complete Order
          </button>
        )}

      </div>
    );
  }

  // =============================
  // EDIT MODE
  // =============================
  return (
    <Layout>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">
          Edit Measurements — {customer.name}
        </h2>

        <button
          onClick={() => navigate("/orders")}
          className="bg-white/20 px-4 py-2 rounded-xl"
        >
          Back
        </button>
      </div>

      <EditSection
        title="Shirt"
        fields={shirtFields}
        data={customer.measurements.shirt}
        update={(f,v)=>update("shirt",f,v)}
      />

      <EditSection
        title="Pant"
        fields={pantFields}
        data={customer.measurements.pant}
        update={(f,v)=>update("pant",f,v)}
      />

      <EditSection
        title="Kurta"
        fields={kurtaFields}
        data={customer.measurements.kurta}
        update={(f,v)=>update("kurta",f,v)}
      />

      <button
        onClick={saveMeasurements}
        className="mt-6 bg-green-600 px-8 py-3 rounded-xl"
      >
        Save Measurements
      </button>

    </Layout>
  );
}

// =============================
function EditSection({ title, fields, data, update }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8">
      <h3 className="text-xl font-bold mb-6">{title}</h3>

      <div className="grid md:grid-cols-3 gap-6">
        {fields.map(field => (
          <div key={field}>
            <label className="block text-gray-300 mb-2 capitalize">
              {field}
            </label>
            <input
              value={data[field] || ""}
              onChange={(e)=>update(field,e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function CuttingSection({ title, fields, data }) {
  return (
    <div className="border border-gray-700 rounded-2xl p-6 bg-gray-900">
      <h2 className="text-2xl font-bold mb-6 text-blue-400">
        {title}
      </h2>

      <div className="space-y-4">
        {fields.map(field => (
          <div key={field} className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400 capitalize">
              {field}
            </span>
            <span className="text-2xl font-bold">
              {data[field] || "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
