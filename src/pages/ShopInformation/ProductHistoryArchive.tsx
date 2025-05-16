import React, { useEffect, useState } from "react";
import Header from "../../layouts/header";
import Sidemenu from "../../layouts/sidemenu";
import Breadcrumb from "../../components/breadcrumbs";

interface ProductHistory {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  checked_out_at: string;
}

const ProductHistoryArchive: React.FC = () => {
  const [history, setHistory] = useState<ProductHistory[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Calculate the total of all history items
  const totalAmount = history.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Accept': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:8000/api/products/history', {
        headers,
      });
      
      if (!response.ok) throw new Error("Failed to fetch history");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshKey]);

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <Breadcrumb
            title="Checkout History"
            links={[
              { text: "Dashboard", link: "/" },
              { text: "Shop", link: "/shop" }
            ]}
            active="History"
          />

          <div className="box p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Checkout History</h2>
              <button 
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Refresh
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border">Date</th>
                    <th className="py-2 px-4 border">Product</th>
                    <th className="py-2 px-4 border">Qty</th>
                    <th className="py-2 px-4 border">Price</th>
                    <th className="py-2 px-4 border">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length > 0 ? (
                    <>
                      {history.map((h) => (
                        <tr key={h.id} className="hover:bg-gray-50">
                          <td className="py-2 px-4 border">
                            {new Date(h.checked_out_at).toLocaleString()}
                          </td>
                          <td className="py-2 px-4 border">{h.product_name}</td>
                          <td className="py-2 px-4 border">{h.quantity}</td>
                          <td className="py-2 px-4 border">₱{Number(h.price).toFixed(2)}</td>
                          <td className="py-2 px-4 border">₱{(h.price * h.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="font-semibold">
                        <td colSpan={4} className="py-2 px-4 border text-right">Total:</td>
                        <td className="py-2 px-4 border">₱{totalAmount.toFixed(2)}</td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-gray-500">
                        No checkout history found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductHistoryArchive;
