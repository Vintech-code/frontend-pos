import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../layouts/header";
import Sidemenu from "../../layouts/sidemenu";
import Breadcrumb from "../../components/breadcrumbs";

interface ProductForm {
  name: string;
  price: number;
  stock: number;
  image: File | null;
  sizes: string;
  colors: string;
  types: string;
}

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProductForm>({
    name: "",
    price: 0,
    stock: 0,
    image: null,
    sizes: "",
    colors: "",
    types: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", String(form.price));
      formData.append("stock", String(form.stock));
      if (form.image) formData.append("image", form.image);
      if (form.sizes) formData.append("sizes", JSON.stringify(form.sizes.split(",").map(s => s.trim()).filter(Boolean)));
      if (form.colors) formData.append("colors", JSON.stringify(form.colors.split(",").map(c => c.trim()).filter(Boolean)));
      if (form.types) formData.append("types", JSON.stringify(form.types.split(",").map(t => t.trim()).filter(Boolean)));

      const token = localStorage.getItem("auth_token");
      const headers: HeadersInit = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product");
      }

      navigate("/shop");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <Breadcrumb
            title="Add New Product"
            links={[
              { text: "Dashboard", link: "/" },
              { text: "Shop", link: "/shop" }
            ]}
            active="Add Product"
          />

          <div className="box p-6 max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-6">Add New Product</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₱)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-md"
                  accept="image/*"
                />
                {form.image && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(form.image)}
                      alt="Preview"
                      className="h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sizes (comma separated)
                </label>
                <input
                  type="text"
                  name="sizes"
                  value={form.sizes}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Small, Medium, Large"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Colors (comma separated)
                </label>
                <input
                  type="text"
                  name="colors"
                  value={form.colors}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Red, Blue, Green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Types (comma separated)
                </label>
                <input
                  type="text"
                  name="types"
                  value={form.types}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Wood, Plastic, Metal"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-6 py-2 px-4 rounded-md text-white font-medium ${
                  isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Adding Product..." : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
