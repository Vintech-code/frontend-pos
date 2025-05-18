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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [updatedPrice, setUpdatedPrice] = useState<string>("");
  const [quantityToAdd, setQuantityToAdd] = useState<string>("");
  const [selections, setSelections] = useState<SelectionState>({});
  const [activeTab, setActiveTab] = useState<"price" | "stock">("price");

  const displayPrice = (price: number | string): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `₱${numericPrice.toFixed(2)}`;
  };

  useEffect(() => {
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
        
        const formattedProducts = productsData.map((product: any) => ({
          ...product,
          price: Number(product.price),
          stock: Number(product.stock)
        }));
        
        setProducts(formattedProducts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  const handleCheckout = async (): Promise<void> => {
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

      setProducts(prevProducts => 
        prevProducts.map(product => {
          const cartItem = cart.find(item => item.id === product.id);
          if (cartItem) {
            return {
              ...product,
              stock: product.stock - cartItem.quantity
            };
          }
          return product;
        })
      );
      
      setCart([]);
      alert("Checkout successful!");
    } catch (err: any) {
      alert(err.message || "Checkout failed");
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

  const addToCart = (
    product: Product,
    selectedSize?: string,
    selectedColor?: string,
    selectedType?: string
  ): void => {
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

  const removeFromCart = (id: number): void => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number): void => {
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

  const openProductModal = (product: Product): void => {
    setSelectedProduct(product);
    setUpdatedPrice(product.price.toString());
    setQuantityToAdd("");
    setActiveTab("price");
  };

 const handleUpdateProduct = async (): Promise<void> => {
  if (!selectedProduct) return;

  try {
    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let endpoint = `http://localhost:8000/api/products/${selectedProduct.id}`;
    let body: any = {};

    if (activeTab === "price") {
      const price = parseFloat(updatedPrice);
      if (isNaN(price)) {
        alert("Please enter a valid price");
        return;
      }
      body = { price, stock: selectedProduct.stock };
    } else {
      const quantity = parseInt(quantityToAdd);
      if (isNaN(quantity)) {
        alert("Please enter a valid quantity");
        return;
      }
      body = { price: selectedProduct.price, stock: selectedProduct.stock + quantity };
    }

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to ${activeTab === "price" ? "update price" : "add stock"}`);
    }

    const updatedProduct = await response.json();
    setProducts(products.map(p => p.id === selectedProduct.id ? updatedProduct : p));
    setSelectedProduct(null);
  } catch (error: unknown) {
    console.error('Error updating product:', error);
    if (error instanceof Error) {
      alert(error.message || `Failed to ${activeTab === "price" ? "update price" : "add stock"}. Please try again.`);
    } else {
      alert(`Failed to ${activeTab === "price" ? "update price" : "add stock"}. Please try again.`);
    }
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
                            onClick={() => openProductModal(product)}
                            className="text-blue-600 hover:text-blue-800 text-xl p-1 transition-colors duration-200"
                            title="Edit Product"
                            aria-label="Edit product"
                          >
                            <HiPencilSquare />
                          </button>
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
                            (product.types && !selection.selectedType) ||
                            product.stock <= 0
                          }
                        >
                          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
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
                      <div key={`${item.id}-${idx}`} className="flex justify-between items-center mb-3">
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
                            {displayPrice(item.price)} × {item.quantity}
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
                  <p className="font-semibold text-lg">Total: {displayPrice(total)}</p>
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

          {selectedProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Manage Product</h3>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex border-b mb-4">
                    <button
                      className={`py-2 px-4 font-medium ${activeTab === "price" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                      onClick={() => setActiveTab("price")}
                    >
                      Edit Price
                    </button>
                    <button
                      className={`py-2 px-4 font-medium ${activeTab === "stock" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                      onClick={() => setActiveTab("stock")}
                    >
                      Add Stock
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-700 mb-2">Product: <span className="font-medium">{selectedProduct.name}</span></p>
                    {activeTab === "price" ? (
                      <>
                        <p className="text-gray-700 mb-2">Current Price: <span className="font-medium">
                          {displayPrice(selectedProduct.price)}
                        </span></p>
                        <div className="mb-4">
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                            New Price (₱)
                          </label>
                          <input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={updatedPrice}
                            onChange={(e) => setUpdatedPrice(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-700 mb-2">Current Stock: <span className="font-medium">{selectedProduct.stock}</span></p>
                        <div className="mb-4">
                          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity to Add
                          </label>
                          <input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantityToAdd}
                            onChange={(e) => setQuantityToAdd(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter quantity"
                            required
                          />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateProduct}
                      className={`px-4 py-2 text-white rounded-md hover:bg-${activeTab === "price" ? "blue" : "green"}-700 focus:outline-none focus:ring-2 focus:ring-${activeTab === "price" ? "blue" : "green"}-500 bg-${activeTab === "price" ? "blue" : "green"}-600`}
                    >
                      {activeTab === "price" ? "Update Price" : "Add Stock"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;
