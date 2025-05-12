  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import API from "../api";

  function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

   const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Make an API call to the backend for login
    const response = await API.post("http://localhost:8000/api/login", {
      username,
      password,
    });

    // Check if the response is okay and handle accordingly
    if (response.status === 200 && response.data.token) {
      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect to the dashboard
      navigate("/dashboard");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  } catch (error: any) {
    if (error.response) {
      alert(error.response.data.message); // Handle errors from the server
    } else {
      alert("An error occurred during login. Please try again.");
    }
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
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            <a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-300 ease-in-out">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    );
  }

  export default Login;
