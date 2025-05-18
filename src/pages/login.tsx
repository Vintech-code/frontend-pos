import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import logo from '../assets/images/background/logo.png';
import bgImage from '../assets/images/background/92791.jpg';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post("http://localhost:8000/api/login", {
        username,
        password,
      });

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred during login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }} // ✅ Use imported image here
    >
      <div className="backdrop-blur-md bg-white/80 max-w-md w-full rounded-2xl shadow-2xl p-8 space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
        </div>

        <h1 className="text-4xl font-extrabold text-indigo-900 text-center mb-2">
          Admin
        </h1>
        <p className="text-center text-indigo-700 mb-6">
          Please login to your account
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-indigo-700 font-semibold mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-indigo-400 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300"
              required
              autoComplete="username"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-indigo-700 font-semibold mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-indigo-400 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300"
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition transform ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 hover:scale-105"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
