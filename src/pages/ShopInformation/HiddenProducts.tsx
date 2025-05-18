import React, { useState, useEffect } from "react";
import Header from "../../layouts/header";
import Sidemenu from "../../layouts/sidemenu";
import Breadcrumb from "../../components/breadcrumbs";
import { HiPencilSquare } from "react-icons/hi2";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image?: string;
  sizes?: string[];
  colors?: string[];
  types?: string[];
  hidden?: boolean;
}

const HiddenProducts: React.FC = () => {
  const [hiddenProducts, setHiddenProducts] = useState<Product[]>([]);
  const [selections, setSelections] = useState<Record<number, any>>({});

  const displayPrice = (price: number | string): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `₱${numericPrice.toFixed(2)}`;
  };

  const getStockStatus = (stock: number): { label: string; color: string } => {
    if (stock <= 5) {
      return { label: "Low Stock", color: "text-red-600 font-semibold" };
    }
    return { label: "In Stock", color: "text-green-600 font-semibold" };
  };

  const fetchHiddenProducts = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const headers: HeadersInit = {
        Accept: "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("http://localhost:8000/api/products", {
        headers,
      });

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      const productsData = Array.isArray(data) ? data : data.data || [];
      
      // Filter hidden products
      const hiddenProducts = productsData.filter((product: Product) => product.hidden);
      setHiddenProducts(hiddenProducts);

    } catch (error) {
      console.error("Error fetching hidden products:", error);
    }
  };

  useEffect(() => {
    fetchHiddenProducts();
  }, []);

  const toggleProductVisibility = async (productId: number, hide: boolean): Promise<void> => {
    try {
      const token = localStorage.getItem("auth_token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:8000/api/products/${productId}/visibility`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ hidden: hide }),
      });

      if (!response.ok) throw new Error("Failed to update product visibility");

      // Refresh the list after unhiding
      fetchHiddenProducts();
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  const handleSelectionChange = (
    productId: number,
    field: "selectedSize" | "selectedColor" | "selectedType",
    value: string
  ): void => {
    setSelections((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <Breadcrumb
            title="Hidden Products"
            links={[
              { text: "Dashboard", link: "/" },
              { text: "POS", link: "/shop" },
            ]}
            active="Hidden Products"
          />

          <div className="box p-4">
            <h2 className="text-xl font-semibold mb-4">Hidden Products</h2>
            {hiddenProducts.length === 0 ? (
              <p>No hidden products found.</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {hiddenProducts.map((product) => {
                  const selection = selections[product.id] || {};
                  return (
                    <div
                      key={product.id}
                      className={`border rounded-xl p-4 hover:shadow-lg transition relative ${
                        product.stock <= 20 ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <div className="mt-2">
                        <span className={getStockStatus(product.stock).color}>
                          {getStockStatus(product.stock).label}
                        </span>
                      </div>
                      <img
                        src={
                          product.image
                            ? product.image.startsWith('http') || product.image.startsWith('/storage')
                              ? product.image
                              : `http://localhost:8000/storage/${product.image}`
                            : '/placeholder.jpg'
                        }
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-md mb-4"
                      />
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">{product.name}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleProductVisibility(product.id, false)}
                            className="text-green-600 hover:text-green-800 text-xl p-1 transition-colors duration-200"
                            title="Unhide Product"
                            aria-label="Unhide product"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                              <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {}}
                            className="text-blue-600 hover:text-blue-800 text-xl p-1 transition-colors duration-200"
                            title="Edit Product"
                            aria-label="Edit product"
                          >
                            <HiPencilSquare />
                          </button>
                        </div>
                      </div>
                      <p style={{ color: "#FF8000" }} className="text-lg">
                        {displayPrice(product.price)}
                      </p>
                      <p className={`text-xs mb-2 ${product.stock > 0 ? 'text-blue-500' : 'text-red-500'}`}>
                        Stock: {product.stock}
                      </p>

                      {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-2">
                          <label className="block text-sm">Size</label>
                          <select
                            className="w-full p-2 mt-1 border rounded"
                            onChange={(e) =>
                              handleSelectionChange(product.id, "selectedSize", e.target.value)
                            }
                            value={selection.selectedSize || ""}
                          >
                            <option value="" disabled>
                              Select size
                            </option>
                            {product.sizes.map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {product.colors && product.colors.length > 0 && (
                        <div className="mb-2">
                          <label className="block text-sm">Color</label>
                          <select
                            className="w-full p-2 mt-1 border rounded"
                            onChange={(e) =>
                              handleSelectionChange(product.id, "selectedColor", e.target.value)
                            }
                            value={selection.selectedColor || ""}
                          >
                            <option value="" disabled>
                              Select color
                            </option>
                            {product.colors.map((color) => (
                              <option key={color} value={color}>
                                {color}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {product.types && product.types.length > 0 && (
                        <div className="mb-2">
                          <label className="block text-sm">Type</label>
                          <select
                            className="w-full p-2 mt-1 border rounded"
                            onChange={(e) =>
                              handleSelectionChange(product.id, "selectedType", e.target.value)
                            }
                            value={selection.selectedType || ""}
                          >
                            <option value="" disabled>
                              Select type
                            </option>
                            {product.types.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <button
                        style={{ backgroundColor: "#FF8000", color: "white" }}
                        className="w-full mt-4 py-1 rounded hover:bg-[#FFA725]/80 transition-colors duration-200 opacity-50 cursor-not-allowed"
                        disabled
                      >
                        Product Hidden
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HiddenProducts;