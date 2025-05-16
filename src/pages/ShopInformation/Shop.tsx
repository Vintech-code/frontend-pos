import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
}

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedType?: string;
}

interface SelectionState {
  [productId: number]: {
    selectedSize?: string;
    selectedColor?: string;
    selectedType?: string;
  };
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [updatedStock, setUpdatedStock] = useState("");
  const [selections, setSelections] = useState<SelectionState>({});

  // Fetch products from backend API on mount
 useEffect(() => {
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      // Build headers without undefined values
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
      setProducts(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error(error);
    }
  };
  fetchProducts();
}, []);

const handleCheckout = async () => {
  if (cart.length === 0) return;
  try {
    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('http://localhost:8000/api/products/checkout', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          // Include additional selection details if needed
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          selectedType: item.selectedType
        })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Checkout failed");
    }

    // Clear cart and show success message
    setCart([]);
    alert("Checkout successful!");
    
    // Return the response data which should include the new history records
    return await response.json();
  } catch (err: any) {
    alert(err.message || "Checkout failed");
    throw err; // Re-throw the error so it can be handled by the caller if needed
  }
};

  const handleSelectionChange = (
    productId: number,
    field: "selectedSize" | "selectedColor" | "selectedType",
    value: string
  ) => {
    setSelections((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const addToCart = (
    product: Product,
    selectedSize?: string,
    selectedColor?: string,
    selectedType?: string
  ) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          (!product.sizes || item.selectedSize === selectedSize) &&
          (!product.colors || item.selectedColor === selectedColor) &&
          (!product.types || item.selectedType === selectedType)
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id &&
          (!product.sizes || item.selectedSize === selectedSize) &&
          (!product.colors || item.selectedColor === selectedColor) &&
          (!product.types || item.selectedType === selectedType) &&
          item.quantity < product.stock
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          selectedSize,
          selectedColor,
          selectedType,
        },
      ];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(1, Math.min(item.quantity + delta, item.stock)),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setUpdatedPrice(product.price.toString());
    setUpdatedStock(product.stock.toString());
  };

  const handleUpdateProduct = async () => {
  if (!editingProduct) return;
  
  const price = parseFloat(updatedPrice);
  const stock = parseInt(updatedStock);
  if (isNaN(price) || isNaN(stock)) return;

  try {
    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`http://localhost:8000/api/products/${editingProduct.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ price, stock }),
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    // Only update local state after successful API update
    const updatedProducts = products.map((p) =>
      p.id === editingProduct.id ? { ...p, price, stock } : p
    );
    setProducts(updatedProducts);
    setEditingProduct(null);
  } catch (error) {
    console.error('Error updating product:', error);
    // You might want to show an error message to the user here
  }
};

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <Breadcrumb
            title="POS - Social Action Center"
            links={[{ text: "Dashboard", link: "/" }]}
            active="POS"
            buttons={
              <Link
                to="/addproduct"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <i className="ri-add-line"></i> Add New Product
              </Link>
            }
          />

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              <div className="box p-4">
                <h2 className="text-xl font-semibold mb-4">Available Products</h2>
                <div className="grid grid-cols-3 gap-4">
                  {products.map((product) => {
                    const selection = selections[product.id] || {};
                    return (
                      <div
                        key={product.id}
                        className="border rounded-xl p-4 hover:shadow-lg transition relative"
                      >
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
                          <button
                            onClick={() => openEditModal(product)}
                            className="text-blue-600 hover:text-blue-800 text-xl p-1 transition-colors duration-200"
                            title="Edit"
                            aria-label="Edit product"
                          >
                            <HiPencilSquare />
                          </button>
                        </div>
                        <p style={{ color: "#FF8000" }} className="text-lg">
  ₱{Number(product.price).toFixed(2)}
</p>
                        <p className="text-xs text-blue-500 mb-2">Stock: {product.stock}</p>

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
                          onClick={() =>
                            addToCart(
                              product,
                              selection.selectedSize,
                              selection.selectedColor,
                              selection.selectedType
                            )
                          }
                          style={{ backgroundColor: "#FF8000", color: "white" }}
                          className="w-full mt-4 py-1 rounded hover:bg-[#FFA725]/80 transition-colors duration-200"
                          disabled={
                            (product.sizes && !selection.selectedSize) ||
                            (product.colors && !selection.selectedColor) ||
                            (product.types && !selection.selectedType)
                          }
                        >
                          Add to Cart
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="col-span-4">
              <div className="box p-4 flex flex-col justify-between max-h-96 overflow-auto">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Cart</h2>
                  {cart.length === 0 ? (
                    <p className="text-gray-500">No items in cart.</p>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={item.id + "-" + idx} className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          {item.selectedSize && (
                            <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
                          )}
                          {item.selectedColor && (
                            <p className="text-sm text-gray-500">Color: {item.selectedColor}</p>
                          )}
                          {item.selectedType && (
                            <p className="text-sm text-gray-500">Type: {item.selectedType}</p>
                          )}
                          <p className="text-sm text-gray-500">
                            ₱{item.price} × {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors duration-200"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors duration-200"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4 border-t pt-4">
                  <p className="font-semibold text-lg">Total: ₱{total.toFixed(2)}</p>
                 <button
  className="w-full mt-2 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
  disabled={cart.length === 0}
  onClick={handleCheckout}
>
  Checkout
</button>

                </div>
              </div>
            </div>
          </div>

          {/* Minimal Edit Modal */}
          {editingProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-md shadow p-5 w-72 relative">
                <button
                  onClick={() => setEditingProduct(null)}
                  aria-label="Close modal"
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  ×
                </button>
                <h3 className="text-center font-medium mb-4">
                  Edit {editingProduct.name}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateProduct();
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label htmlFor="price" className="block text-sm mb-1">
                      Price (₱)
                    </label>
                    <input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={updatedPrice}
                      onChange={(e) => setUpdatedPrice(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="stock" className="block text-sm mb-1">
                      Stock Quantity
                    </label>
                    <input
                      id="stock"
                      type="number"
                      min="0"
                      step="1"
                      value={updatedStock}
                      onChange={(e) => setUpdatedStock(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-3 py-1 text-gray-700 rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Shop;
