const KEY = "nst_customers_v2";

export function getCustomers() {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCustomers(customers) {
  localStorage.setItem(KEY, JSON.stringify(customers));
}

export function clearAllData() {
  localStorage.removeItem(KEY);
}
