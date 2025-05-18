import React, { useState, useEffect } from "react";
import Header from "../layouts/header";
import Sidemenu from "../layouts/sidemenu";
import Breadcrumb from "../components/breadcrumbs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface ProductHistory {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  checked_out_at: string;
}

interface TopProduct {
  product_name: string;
  total_quantity: number;
  total_sales: number;
}

interface SalesByDate {
  date: string;
  total_sales: number;
}

interface SalesReport {
  totalSales: number;
  totalItemsSold: number;
  averageSaleValue: number;
  topProducts: TopProduct[];
  salesByDate: SalesByDate[];
}

const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [products, setProducts] = useState<Product[]>([]);
  const [history, setHistory] = useState<ProductHistory[]>([]);
  const [report, setReport] = useState<SalesReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchReport();
    // eslint-disable-next-line
  }, [startDate, endDate]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Accept': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch("http://localhost:8000/api/products", {
        headers,
      });
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      const productsData = Array.isArray(data) ? data : data.data || [];
      setProducts(productsData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Accept': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const params = new URLSearchParams({
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      });

      // Fetch sales history
      const historyResponse = await fetch(`http://localhost:8000/api/products/history?${params}`, {
        headers,
      });
      if (!historyResponse.ok) throw new Error("Failed to fetch history");
      const historyData = await historyResponse.json();
      setHistory(historyData);

      // Fetch report data
      const reportResponse = await fetch(`http://localhost:8000/api/products/report?${params}`, {
        headers,
      });
      if (!reportResponse.ok) throw new Error("Failed to fetch report");
      const reportData = await reportResponse.json();
      setReport(reportData);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setIsLoading(false);
    }
  };

 const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);



  // Prepare data for charts
  const salesChartData = {
    labels: report?.salesByDate?.map(item => new Date(item.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Daily Sales',
        data: report?.salesByDate?.map(item => item.total_sales) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const topProductsChartData = {
    labels: report?.topProducts?.map(item => item.product_name) || [],
    datasets: [
      {
        label: 'Sales by Product',
        data: report?.topProducts?.map(item => item.total_sales) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <Breadcrumb
            title="Sales Report"
            links={[
              { text: "Dashboard", link: "/" },
              { text: "Shop", link: "/shop" }
            ]}
            active="Sales Report"
          />

          <div className="box p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold">Sales Report</h2>
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
  <div className="flex flex-col">
    <label htmlFor="startDate" className="text-sm text-gray-600 mb-1">Start Date</label>
    <DatePicker
      id="startDate"
      selected={startDate}
      onChange={(date) => date && setStartDate(date)}
      maxDate={new Date()}
      dateFormat="yyyy-MM-dd"
      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
  <div className="flex flex-col">
    <label htmlFor="endDate" className="text-sm text-gray-600 mb-1">End Date</label>
    <DatePicker
      id="endDate"
      selected={endDate}
      onChange={(date) => date && setEndDate(date)}
      maxDate={new Date()}
      dateFormat="yyyy-MM-dd"
      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
  <button
    onClick={fetchReport}
    disabled={isLoading}
    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition disabled:bg-gray-400"
  >
    {isLoading ? 'Loading...' : 'Refresh'}
  </button>
</div>

            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading report data...</div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {report ? formatCurrency(report.totalSales) : '₱0.00'}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">Items Sold</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {report ? report.totalItemsSold : 0}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">Average Sale</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {report ? formatCurrency(report.averageSaleValue) : '₱0.00'}
                    </p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
                    <div className="h-64">
                      <Bar
                        data={salesChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: function(value) {
                                  return '₱' + value;
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold mb-4">Top Products</h3>
                    <div className="h-64">
                      <Pie
                        data={topProductsChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Detailed Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Products Table */}
                  <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty Sold</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total Sales</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {report?.topProducts?.map((product, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap">{product.product_name}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-right">{product.total_quantity}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-right">{formatCurrency(product.total_sales)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Current Inventory Table */}
                  <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold mb-4">Current Inventory</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Stock</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {products.map((product) => (
                            <tr key={product.id}>
                              <td className="px-4 py-2 whitespace-nowrap">{product.name}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-right">{formatCurrency(product.price)}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-right">{product.stock}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-right">
                                {formatCurrency(product.price * product.stock)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Transaction History */}
                <div className="mt-6 bg-white p-4 rounded-lg shadow border">
                  <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {history.length > 0 ? (
                          history.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-2 whitespace-nowrap">
                                {new Date(item.checked_out_at).toLocaleString()}
                              </td>
                              <td className="px-4 py-2">{item.product_name}</td>
                              <td className="px-4 py-2 text-right">{item.quantity}</td>
                              <td className="px-4 py-2 text-right">{formatCurrency(item.price)}</td>
                              <td className="px-4 py-2 text-right">
                                {formatCurrency(item.price * item.quantity)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                              No transactions found in the selected date range
                            </td>
                          </tr>
                        )}
                      </tbody>
                      {history.length > 0 && (
                        <tfoot className="bg-gray-50 font-semibold">
                          <tr>
                            <td colSpan={4} className="px-4 py-2 text-right">Total:</td>
                            <td className="px-4 py-2 text-right">
                              {formatCurrency(
                                history.reduce((sum, item) => sum + item.price * item.quantity, 0)
                              )}
                            </td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
