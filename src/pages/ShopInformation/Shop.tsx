import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../layouts/header";
import Sidemenu from "../../layouts/sidemenu";
import Breadcrumb from "../../components/breadcrumbs";

import candleImg from "../../assets/images/background/candle.jpg";
import bibleImg from "../../assets/images/background/bible.jpg";
import rosaryImg from "../../assets/images/background/rosary.jpg";
import prayerBookImg from "../../assets/images/background/book.jpg";
import tshirtImg from "../../assets/images/background/tshirt.jpg";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  size?: string[];
  color?: string[];
  type?: string[];
}

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedType?: string;
}

const initialProducts: Product[] = [
  { id: 1, name: "Candle", price: 10, stock: 20, image: candleImg, color: ["Red", "White", "Yellow"] },
  { id: 2, name: "Bible", price: 15, stock: 25, image: bibleImg, size: ["Small", "Medium", "Large"] },
  { id: 3, name: "Rosary", price: 12, stock: 30, image: rosaryImg, color: ["Red", "Blue", "Green"], type: ["Wood", "Plastic"] },
  { id: 4, name: "Prayer Book", price: 20, stock: 15, image: prayerBookImg, size: ["Small", "Medium"] },
  { id: 5, name: "T-Shirt", price: 18, stock: 40, image: tshirtImg, size: ["S", "M", "L", "XL"], color: ["Red", "Blue", "Black"] },
];

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [updatedStock, setUpdatedStock] = useState("");

  const addToCart = (
    product: Product,
    selectedSize?: string,
    selectedColor?: string,
    selectedType?: string
  ) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.quantity < product.stock
            ? {
                ...item,
                quantity: item.quantity + 1,
                selectedSize,
                selectedColor,
                selectedType,
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

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    const price = parseFloat(updatedPrice);
    const stock = parseInt(updatedStock);

    if (isNaN(price) || isNaN(stock)) return;

    const updatedProducts = products.map((p) =>
      p.id === editingProduct.id ? { ...p, price, stock } : p
    );

    setProducts(updatedProducts);
    setEditingProduct(null);
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
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-xl p-4 hover:shadow-lg transition relative">
                      <img
                        src={product.image}
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
                          <i className="ri-pencil-line"></i>
                        </button>
                      </div>
                      <p className="text-orange-600 text-lg">₱{product.price.toFixed(2)}</p>
                      <p className="text-xs text-blue-500 mb-2">Stock: {product.stock}</p>

                      {product.size && (
                        <div className="mb-2">
                          <label className="block text-sm">Size</label>
                          <select
                            className="w-full p-2 mt-1 border rounded"
                            onChange={(e) => addToCart(product, e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>Select size</option>
                            {product.size.map((size) => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {product.color && (
                        <div className="mb-2">
                          <label className="block text-sm">Color</label>
                          <select
                            className="w-full p-2 mt-1 border rounded"
                            onChange={(e) => addToCart(product, undefined, e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>Select color</option>
                            {product.color.map((color) => (
                              <option key={color} value={color}>{color}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {product.type && (
                        <div className="mb-2">
                          <label className="block text-sm">Type</label>
                          <select
                            className="w-full p-2 mt-1 border rounded"
                            onChange={(e) => addToCart(product, undefined, undefined, e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>Select type</option>
                            {product.type.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <button
                        onClick={() => addToCart(product)}
                        style={{ backgroundColor: "#FF8000", color: "white" }}
                        className="w-full mt-4 py-1 rounded hover:bg-[#FFA725]/80 transition-colors duration-200"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-4">
              <div className="box p-4 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Cart</h2>
                  {cart.length === 0 ? (
                    <p className="text-gray-500">No items in cart.</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          {item.selectedSize && <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>}
                          {item.selectedColor && <p className="text-sm text-gray-500">Color: {item.selectedColor}</p>}
                          {item.selectedType && <p className="text-sm text-gray-500">Type: {item.selectedType}</p>}
                          <p className="text-sm text-gray-500">₱{item.price} × {item.quantity}</p>
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
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          {editingProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Edit {editingProduct.name}</h3>
                  <button 
                    onClick={() => setEditingProduct(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      value={updatedPrice}
                      onChange={(e) => setUpdatedPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      value={updatedStock}
                      onChange={(e) => setUpdatedStock(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button 
                    onClick={() => setEditingProduct(null)} 
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProduct}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Save Changes
                  </button>
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