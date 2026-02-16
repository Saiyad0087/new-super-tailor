import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-900 text-white flex">

      <Sidebar />

      <div className="flex-1 p-10">
        {children}
      </div>

    </div>
  );
}
  

