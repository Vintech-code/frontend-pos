import React, { useState } from "react";
import Header from "../../layouts/header";
import Sidemenu from "../../layouts/sidemenu";
import Breadcrumb from "../../components/breadcrumbs";

// Import images from the `src` folder
import candleImg from "../../assets/images/background/candle.jpg";
import bibleImg from "../../assets/images/background/bible.jpg";
import rosaryImg from "../../assets/images/background/rosary.jpg";
import prayerBookImg from "../../assets/images/background/book.jpg";
import tshirtImg from "../../assets/images/background/tshirt.jpg";

// Define product interface
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string | File; // Image can now be a URL or a File
  size?: string[]; 
  color?: string[]; 
  type?: string[];
}

const AddProduct: React.FC = () => {
  const [newProduct, setNewProduct] = useState<Product>({
    id: Date.now(),
    name: "",
    price: 0,
    stock: 0,
    image: "",
    size: [],
    color: [],
    type: [],
  });

  const [productList, setProductList] = useState<Product[]>([
    { id: 1, name: "Candle", price: 10, stock: 20, image: candleImg, color: ["Red", "White", "Yellow"] },
    { id: 2, name: "Bible", price: 15, stock: 25, image: bibleImg, size: ["Small", "Medium", "Large"] },
    { id: 3, name: "Rosary", price: 12, stock: 30, image: rosaryImg, color: ["Red", "Blue", "Green"], type: ["Wood", "Plastic"] },
    { id: 4, name: "Prayer Book", price: 20, stock: 15, image: prayerBookImg, size: ["Small", "Medium"] },
    { id: 5, name: "T-Shirt", price: 18, stock: 40, image: tshirtImg, size: ["S", "M", "L", "XL"], color: ["Red", "Blue", "Black"] },
  ]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Handle file input for image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the first file from the file input
    if (file) {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        image: file, // Store the file object in the product state
      }));
    }
  };

  const handleAddProduct = () => {
    setProductList((prevList) => [...prevList, { ...newProduct, id: Date.now() }]);
    setNewProduct({
      id: Date.now(),
      name: "",
      price: 0,
      stock: 0,
      image: "",
      size: [],
      color: [],
      type: [],
    });
  };

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <Breadcrumb
            title="Add New Product"
            links={[{ text: "Dashboard", link: "/" }, { text: "Shop", link: "/shop" }]}
            active="Add Product"
          />
          
          {/* Add Product Form */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              <div className="box p-4">
                <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-semibold">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="stock" className="block text-sm font-semibold">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={newProduct.stock}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-semibold">Upload Photo</label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageUpload}
                      className="w-full p-2 border rounded-md"
                    />
                    {/* Optional: Display a preview of the uploaded image */}
                    {newProduct.image && typeof newProduct.image !== 'string' && (
                      <img
                        src={URL.createObjectURL(newProduct.image)}
                        alt="Preview"
                        className="w-32 h-32 object-cover mt-2"
                      />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Add Product
                  </button>
                </form>
              </div>
            </div>

            {/* Product List */}
            <div className="col-span-4">
              <div className="box p-4">
                <h2 className="text-xl font-semibold mb-4">Current Products</h2>
                <div className="grid grid-cols-1 gap-4">
                  {productList.map((product) => (
                    <div key={product.id} className="border rounded-xl p-4 hover:shadow-lg transition">
                      <img
                        src={typeof product.image === 'string' ? product.image : URL.createObjectURL(product.image)}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-md mb-4"
                      />
                      <h3 className="text-lg font-bold">{product.name}</h3>
                      <p className="text-gray-500">₱{product.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-400 mb-2">Stock: {product.stock}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
