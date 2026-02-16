import { useParams, useNavigate } from "react-router-dom";
import { getCustomers, saveCustomers } from "../utils/storage";
import { useEffect, useState } from "react";

export default function OrderDetail() {
  const { mobile, orderId } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [order, setOrder] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const customers = getCustomers();
    const found = customers.find(c => c.mobile === mobile);

    if (!found) {
      navigate("/orders");
      return;
    }

    const selected = found.orders.find(
      o => String(o.orderId) === orderId
    );

    setCustomer(found);
    setOrder(selected);
  }, [mobile, orderId, navigate]);

  function updateMeasurement(section, field, value) {
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

  function saveMeasurement() {
    const customers = getCustomers();

    const updated = customers.map(c =>
      c.mobile === mobile ? customer : c
    );

    saveCustomers(updated);
    setEditMode(false);
  }

  function updateStatus(newStatus) {
    const customers = getCustomers();

    const updated = customers.map(c => {
      if (c.mobile === mobile) {
        return {
          ...c,
          orders: c.orders.map(o =>
            String(o.orderId) === orderId
              ? {
                  ...o,
                  status: newStatus,
                  deliveredDate:
                    newStatus === "delivered"
                      ? new Date().toISOString().split("T")[0]
                      : null
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

  if (!customer || !order) return null;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">{customer.name}</h1>
          <p className="text-gray-400">
            Mobile: {customer.mobile}
          </p>
          <p className="text-gray-400">
            Fabric: {order.fabricReceivedDate} | Delivery: {order.deliveryDate}
          </p>
        </div>

        <button
          onClick={() => navigate("/orders")}
          className="bg-white/20 px-4 py-2 rounded-xl"
        >
          Back
        </button>
      </div>

      {/* EDIT TOGGLE */}
      <div className="mb-6">
        <button
          onClick={() => setEditMode(!editMode)}
          className="bg-blue-600 px-4 py-2 rounded-xl"
        >
          {editMode ? "Cancel Edit" : "Edit Measurement"}
        </button>
      </div>

      {/* MEASUREMENT GRID */}
      <div className="grid md:grid-cols-3 gap-8">

        {order.garments.shirt && (
          <Section
            title="SHIRT"
            fields={shirtFields}
            data={customer.measurements.shirt}
            editMode={editMode}
            update={(f,v)=>updateMeasurement("shirt",f,v)}
          />
        )}

        {order.garments.pant && (
          <Section
            title="PANT"
            fields={pantFields}
            data={customer.measurements.pant}
            editMode={editMode}
            update={(f,v)=>updateMeasurement("pant",f,v)}
          />
        )}

        {order.garments.kurta && (
          <Section
            title="KURTA"
            fields={kurtaFields}
            data={customer.measurements.kurta}
            editMode={editMode}
            update={(f,v)=>updateMeasurement("kurta",f,v)}
          />
        )}

      </div>

      {editMode && (
        <button
          onClick={saveMeasurement}
          className="mt-8 bg-green-600 px-6 py-3 rounded-xl"
        >
          Save Measurement
        </button>
      )}

      {/* STATUS BUTTONS */}
      <div className="mt-12 flex gap-6">

        {order.status === "cutting_pending" && (
          <button
            onClick={() => updateStatus("cutting_done")}
            className="bg-blue-600 px-6 py-3 rounded-xl"
          >
            Mark Cutting Done
          </button>
        )}

        {order.status === "cutting_done" && (
          <button
            onClick={() => updateStatus("delivered")}
            className="bg-green-600 px-6 py-3 rounded-xl"
          >
            Mark Delivered
          </button>
        )}

      </div>

    </div>
  );
}

function Section({ title, fields, data, editMode, update }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6 text-blue-400">
        {title}
      </h2>

      <div className="space-y-3">
        {fields.map(field => (
          <div
            key={field}
            className="flex justify-between border-b border-white/10 pb-2"
          >
            <span className="text-gray-400 capitalize">
              {field}
            </span>

            {editMode ? (
              <input
                value={data[field] || ""}
                onChange={(e)=>update(field,e.target.value)}
                className="bg-white/20 px-2 py-1 rounded"
              />
            ) : (
              <span className="text-xl font-semibold">
                {data[field] || "-"}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
