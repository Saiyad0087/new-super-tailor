import Layout from "../components/layout/Layout";
import { useEffect, useState } from "react";
import { getCustomers, saveCustomers } from "../utils/storage";

export default function AddOrder() {
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [customers, setCustomers] = useState([]);
  const [existing, setExisting] = useState(false);

  const [showMeasurement, setShowMeasurement] = useState(true);

  const [measurement, setMeasurement] = useState({
    shirt: {},
    pant: {},
    kurta: {}
  });

  const [fabricDate, setFabricDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const [garments, setGarments] = useState({
    shirt: false,
    pant: false,
    kurta: false
  });

  useEffect(() => {
    setCustomers(getCustomers());
  }, []);

  // AUTO DETECT CUSTOMER
  useEffect(() => {
    if (mobile.length >= 10) {
      const found = customers.find(c => c.mobile === mobile);

      if (found) {
        setExisting(true);
        setName(found.name);
        setMeasurement(found.measurements);
        setShowMeasurement(false);
      } else {
        setExisting(false);
        setName("");
        setMeasurement({
          shirt: {},
          pant: {},
          kurta: {}
        });
        setShowMeasurement(true);
      }
    }
  }, [mobile, customers]);

  function updateMeasurement(section, field, value) {
    setMeasurement(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  }

  function createOrder() {
    if (!mobile || !fabricDate || !deliveryDate) {
      alert("Fill required fields");
      return;
    }

    let updatedCustomers = [...customers];

    const newOrder = {
      orderId: Date.now(),
      fabricReceivedDate: fabricDate,
      deliveryDate: deliveryDate,
      deliveredDate: null,
      garments,
      status: "cutting_pending"
    };

    if (existing) {
      updatedCustomers = updatedCustomers.map(c =>
        c.mobile === mobile
          ? {
              ...c,
              measurements: measurement,
              orders: [...c.orders, newOrder]
            }
          : c
      );
    } else {
      updatedCustomers.push({
        mobile,
        name,
        measurements: measurement,
        orders: [newOrder]
      });
    }

    saveCustomers(updatedCustomers);
    alert("Order Created ✅");

    // Reset form
    setMobile("");
    setName("");
    setFabricDate("");
    setDeliveryDate("");
    setGarments({ shirt: false, pant: false, kurta: false });
    setMeasurement({ shirt: {}, pant: {}, kurta: {} });
  }

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
    <Layout>

      <h2 className="text-3xl font-bold mb-6">Add Order</h2>

      <div className="space-y-4">

        <input
          placeholder="Mobile"
          value={mobile}
          onChange={(e)=>setMobile(e.target.value)}
          className="p-3 rounded-xl bg-white/20 w-full"
        />

        {mobile.length >= 10 && (
          <div className={`text-sm ${existing ? "text-green-400" : "text-yellow-400"}`}>
            {existing ? "Existing Customer Detected" : "New Customer"}
          </div>
        )}

        {!existing && (
          <input
            placeholder="Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="p-3 rounded-xl bg-white/20 w-full"
          />
        )}

        <button
          onClick={()=>setShowMeasurement(!showMeasurement)}
          className="bg-white/20 px-4 py-2 rounded-xl"
        >
          {showMeasurement ? "Hide Measurement" : "Show Measurement"}
        </button>

        {showMeasurement && (
          <>
            <MeasurementSection
              title="Shirt"
              fields={shirtFields}
              data={measurement.shirt}
              update={(f,v)=>updateMeasurement("shirt",f,v)}
            />
            <MeasurementSection
              title="Pant"
              fields={pantFields}
              data={measurement.pant}
              update={(f,v)=>updateMeasurement("pant",f,v)}
            />
            <MeasurementSection
              title="Kurta"
              fields={kurtaFields}
              data={measurement.kurta}
              update={(f,v)=>updateMeasurement("kurta",f,v)}
            />
          </>
        )}

        <input
          type="date"
          value={fabricDate}
          onChange={(e)=>setFabricDate(e.target.value)}
          className="p-3 rounded-xl bg-white/20 w-full"
        />

        <input
          type="date"
          value={deliveryDate}
          onChange={(e)=>setDeliveryDate(e.target.value)}
          className="p-3 rounded-xl bg-white/20 w-full"
        />

        <div className="flex gap-4">
          {["shirt","pant","kurta"].map(g => (
            <label key={g} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={garments[g]}
                onChange={()=>setGarments(prev=>({
                  ...prev,
                  [g]: !prev[g]
                }))}
              />
              {g}
            </label>
          ))}
        </div>

        <button
          onClick={createOrder}
          className="bg-blue-600 px-6 py-3 rounded-xl w-full"
        >
          Create Order
        </button>

      </div>

    </Layout>
  );
}

function MeasurementSection({ title, fields, data, update }) {
  return (
    <div className="bg-white/10 p-6 rounded-xl mt-6">
      <h3 className="font-bold mb-4">{title}</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {fields.map(field => (
          <input
            key={field}
            placeholder={field}
            value={data[field] || ""}
            onChange={(e)=>update(field,e.target.value)}
            className="p-2 rounded bg-white/20"
          />
        ))}
      </div>
    </div>
  );
}
