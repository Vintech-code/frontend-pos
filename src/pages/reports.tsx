import React, { useState } from "react";
import Header from "../layouts/header";
import Sidemenu from "../layouts/sidemenu";
import Breadcrumb from "../components/breadcrumbs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Sample data for charts
const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
];


// Sample transaction data
const transactions = [
  { id: 1, date: '2023-05-01', items: 3, total: 45.00, status: 'Completed' },
  { id: 2, date: '2023-05-02', items: 5, total: 78.50, status: 'Completed' },
  { id: 3, date: '2023-05-03', items: 2, total: 30.00, status: 'Completed' },
  { id: 4, date: '2023-05-04', items: 1, total: 15.00, status: 'Completed' },
  { id: 5, date: '2023-05-05', items: 4, total: 62.00, status: 'Completed' },
];

const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [reportType, setReportType] = useState<string>('sales');
  const [filter, setFilter] = useState<string>('weekly');

  // Handle date changes with proper typing
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <Breadcrumb
            title="Reports - Social Action Center"
            links={[
              { text: "Dashboard", link: "/" },
              { text: "POS", link: "/shop" }
            ]}
            active="Reports"
          />

          <div className="box p-4 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setReportType('sales')}
                  className={`px-4 py-2 rounded ${reportType === 'sales' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  Sales Report
                </button>
                <button
                  onClick={() => setReportType('inventory')}
                  className={`px-4 py-2 rounded ${reportType === 'inventory' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  Inventory Report
                </button>
                <button
                  onClick={() => setReportType('transactions')}
                  className={`px-4 py-2 rounded ${reportType === 'transactions' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  Transactions
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label>From:</label>
                  <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="p-2 border rounded"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label>To:</label>
                  <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate || undefined}
                    className="p-2 border rounded"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="custom">Custom Range</option>
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  Generate
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
                  <i className="ri-download-line"></i> Export
                </button>
              </div>
            </div>
          </div>

          {reportType === 'sales' && (
            <div className="grid grid-cols-1 gap-6">
              <div className="box p-4">
                <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-gray-500">Total Sales</h3>
                    <p className="text-2xl font-bold">₱12,345.00</p>
                    <p className="text-green-600 text-sm">↑ 12% from last period</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-gray-500">Items Sold</h3>
                    <p className="text-2xl font-bold">245</p>
                    <p className="text-green-600 text-sm">↑ 8% from last period</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="text-gray-500">Average Order</h3>
                    <p className="text-2xl font-bold">₱50.39</p>
                    <p className="text-green-600 text-sm">↑ 5% from last period</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="#8884d8" name="Sales (₱)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="box p-4">
                <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Sold</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">T-Shirt</td>
                        <td className="px-6 py-4 whitespace-nowrap">85</td>
                        <td className="px-6 py-4 whitespace-nowrap">₱1,530.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">12.4%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Bible</td>
                        <td className="px-6 py-4 whitespace-nowrap">72</td>
                        <td className="px-6 py-4 whitespace-nowrap">₱1,080.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">8.7%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Rosary</td>
                        <td className="px-6 py-4 whitespace-nowrap">65</td>
                        <td className="px-6 py-4 whitespace-nowrap">₱780.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">6.3%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Candle</td>
                        <td className="px-6 py-4 whitespace-nowrap">58</td>
                        <td className="px-6 py-4 whitespace-nowrap">₱580.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">4.7%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Prayer Book</td>
                        <td className="px-6 py-4 whitespace-nowrap">45</td>
                        <td className="px-6 py-4 whitespace-nowrap">₱900.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">7.3%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {reportType === 'inventory' && (
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                <div className="box p-6">
                  <h3 className="text-gray-500 text-lg mb-2">Total Products</h3>
                  <p className="text-3xl font-bold">5</p>
                </div>
                <div className="box p-6">
                  <h3 className="text-gray-500 text-lg mb-2">Items in Stock</h3>
                  <p className="text-3xl font-bold">130</p>
                </div>
                <div className="box p-6">
                  <h3 className="text-gray-500 text-lg mb-2">Low Stock Items</h3>
                  <p className="text-3xl font-bold">2</p>
                </div>
              </div>

              <div className="box p-4">
                <h2 className="text-xl font-semibold mb-4">Inventory Details</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">T-Shirt</td>
                        <td className="px-6 py-4 whitespace-nowrap">40</td>
                        <td className="px-6 py-4 whitespace-nowrap">₱18.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            In Stock
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Bible</td>
                        <td className="px-6 py-4 whitespace-nowrap">25</td>
                        <td className="px-6 py-4 whitespace-nowrap">₱15.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            In Stock
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Rosary</td>
                        <td className="px-6 py-4 whitespace-nowrap">30</td>
                        <td className="px-6 py-4 whitespace-nowrap">₱12.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            In Stock
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Candle</td>
                        <td className="px-6 py-4 whitespace-nowrap">20</td>
                        <td className="px-6 py-4 whitespace-nowrap">₱10.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            In Stock
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Prayer Book</td>
                        <td className="px-6 py-4 whitespace-nowrap">5</td>
                        <td className="px-6 py-4 whitespace-nowrap">₱20.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Low Stock
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {reportType === 'transactions' && (
            <div className="box p-4">
              <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">#{transaction.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{transaction.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{transaction.items}</td>
                        <td className="px-6 py-4 whitespace-nowrap">₱{transaction.total.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {transaction.status}
                          </span>
                        </td>                     
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  Showing 1 to 5 of 5 entries
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border rounded">Previous</button>
                  <button className="px-3 py-1 border rounded bg-blue-600 text-white">1</button>
                  <button className="px-3 py-1 border rounded">Next</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Reports;