import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Dummy authentication (replace with your API)
    if (email === "admin@example.com" && password === "password") {
      localStorage.setItem("authenticated", "true");
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-500 ease-in-out"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-6 w-full p-4 border-2 border-indigo-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 ease-in-out transform focus:scale-105"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full p-4 border-2 border-indigo-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 ease-in-out transform focus:scale-105"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Login
        </button>
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-300 ease-in-out">Forgot Password?</a>
        </div>
      </form>
    </div>
  );
}

export default Login;
