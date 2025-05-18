import React, { useEffect, useState } from "react";
import Header from "../layouts/header";
import Sidemenu from "../layouts/sidemenu";
import { FaBoxOpen, FaMoneyBillWave, FaBoxes, FaExclamationTriangle } from "react-icons/fa";

interface LowStockProduct {
  id: number;
  name: string;
  stock: number;
}

interface RecentTransaction {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  checked_out_at: string;
}

interface DashboardOverview {
  totalProducts: number;
  inventoryValue: number;
  todaysSales: number;
  lowStock: LowStockProduct[];
  recentTransactions: RecentTransaction[];
}

const Dashboard: React.FC = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const headers: HeadersInit = {
        Accept: "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch("http://localhost:8000/api/dashboard/overview", { headers });
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      const data = await response.json();
      setOverview(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value);

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
      <main className="flex flex-col md:flex-row bg-gradient-to-br from-indigo-50 to-white min-h-screen p-6 md:p-10 gap-8">
        {/* Left: KPIs */}
        <section className="flex-1 flex flex-col gap-6">
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 drop-shadow-md">
            Dashboard Overview
          </h1>

          {loading ? (
            <div className="text-center py-20 text-indigo-400 font-semibold tracking-wider text-xl animate-pulse">
              Loading dashboard...
            </div>
          ) : (
            overview && (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {[
                    {
                      icon: <FaBoxes className="text-indigo-600" />,
                      label: "Total Products",
                      value: overview.totalProducts,
                      bg: "bg-indigo-100",
                      iconBg: "bg-indigo-300",
                    },
                    {
                      icon: <FaBoxOpen className="text-green-600" />,
                      label: "Inventory Value",
                      value: formatCurrency(overview.inventoryValue),
                      bg: "bg-green-100",
                      iconBg: "bg-green-300",
                    },
                    {
                      icon: <FaMoneyBillWave className="text-purple-600" />,
                      label: "Today's Sales",
                      value: formatCurrency(overview.todaysSales),
                      bg: "bg-purple-100",
                      iconBg: "bg-purple-300",
                    },
                  ].map(({ icon, label, value, bg, iconBg }, idx) => (
                    <div
                      key={idx}
                      className={`${bg} rounded-2xl shadow-lg p-6 flex items-center gap-5 transition-transform hover:scale-[1.03] cursor-default`}
                    >
                      <div
                        className={`${iconBg} rounded-full p-4 shadow-md flex items-center justify-center text-4xl`}
                      >
                        {icon}
                      </div>
                      <div>
                        <div className="text-gray-600 font-semibold tracking-wide uppercase text-xs">
                          {label}
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Panels */}
                <div className="flex flex-col md:flex-row gap-8 mt-8">
                  {/* Low Stock Panel */}
                 <div className="flex-1 bg-gradient-to-br from-yellow-50 to-white rounded-3xl shadow-lg p-6 border border-yellow-300 max-h-[420px] overflow-auto">
                  <div className="flex items-center gap-3 mb-5">
                    <FaExclamationTriangle className="text-yellow-500 text-3xl animate-pulse" />
                    <h2 className="text-xl font-bold text-yellow-800">Low Stock Products</h2>
                  </div>

                  {overview.lowStock.length === 0 ? (
                    <p className="text-gray-500 font-medium select-none">
                      All products are sufficiently stocked.
                    </p>
                  ) : (
                    <ul className="space-y-4">
                      {overview.lowStock.map((item) => (
                        <li
                          key={item.id}
                          className="bg-yellow-100 border border-yellow-300 p-4 rounded-xl shadow-sm hover:bg-yellow-200 transition-colors cursor-pointer group"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <a
                              href={`/shop#product-${item.id}`}
                              className="text-yellow-800 font-semibold group-hover:underline"
                            >
                              {item.name}
                            </a>
                            <span className="text-sm font-mono text-yellow-700 bg-yellow-300 px-3 py-1 rounded-full shadow-inner">
                              {item.stock} left
                            </span>
                          </div>
                          <div className="w-full bg-yellow-200 rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(item.stock, 10) * 10}%` }}
                            ></div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                  {/* Recent Transactions Panel */}
                  <div className="flex-1 bg-white rounded-3xl shadow-lg p-6 border border-indigo-300 max-h-[420px] overflow-auto">
                    <h2 className="text-xl font-semibold text-indigo-700 mb-6">
                      Recent Transactions
                    </h2>
                    {overview.recentTransactions.length === 0 ? (
                      <p className="text-gray-500 font-medium select-none">
                        No recent transactions to show.
                      </p>
                    ) : (
                      <table className="min-w-full text-left text-gray-800">
                        <thead>
                          <tr className="border-b border-indigo-200">
                            <th className="py-3 px-4 font-semibold text-sm">Date</th>
                            <th className="py-3 px-4 font-semibold text-sm">Product</th>
                            <th className="py-3 px-4 font-semibold text-sm text-right">Qty</th>
                            <th className="py-3 px-4 font-semibold text-sm text-right">Price</th>
                            <th className="py-3 px-4 font-semibold text-sm text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {overview.recentTransactions.map((item) => (
                            <tr
                              key={item.id}
                              className="hover:bg-indigo-50 transition-colors cursor-default"
                            >
                              <td className="py-2 px-4 text-sm whitespace-nowrap">
                                {new Date(item.checked_out_at).toLocaleString()}
                              </td>
                              <td className="py-2 px-4 text-sm">{item.product_name}</td>
                              <td className="py-2 px-4 text-sm text-right">{item.quantity}</td>
                              <td className="py-2 px-4 text-sm text-right">
                                {formatCurrency(item.price)}
                              </td>
                              <td className="py-2 px-4 text-sm text-right">
                                {formatCurrency(item.price * item.quantity)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </>
            )
          )}
        </section>
      </main>
      </div>
    </>
  );
};

export default Dashboard;
