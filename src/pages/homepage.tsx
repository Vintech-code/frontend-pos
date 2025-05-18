import { useNavigate } from "react-router-dom";
import backgroundImage from '../assets/images/background/92791.jpg';
import logo from '../assets/images/background/logo.png';


function HomePage() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div
      className="relative flex flex-col h-screen text-white font-sans"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-0"></div>

      {/* Transparent Header */}
      <header className="bg-white relative z-10 w-full p-6 flex justify-between items-center bg-transparent">
  <div className="flex items-center space-x-3">
    <img
      src={logo}
      alt="Logo"
      className="h-10 w-auto"
    />
    <span className="text-lg font-extrabold tracking-wide text-black">
      Social Action Center Shop
    </span>
  </div>
  <button
    onClick={goToLogin}
    className="bg-teal-500 hover:bg-teal-600 transition px-5 py-2 rounded-full font-semibold shadow-lg shadow-teal-700/50"
  >
    Admin Login
  </button>
</header>



      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        <div
          className="rounded-lg p-12 max-w-xl shadow-lg shadow-black/40"
          style={{
            animation: 'fadeInUp 1s ease forwards',
            backgroundColor: '#F7AD45',
            backdropFilter: 'blur(12px)',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto mb-6 h-20 w-20 text-white animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white drop-shadow-lg">
            Community Shop
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white leading-relaxed">
            Manage inventory, sales, and community support programs with ease.
          </p>
          <button
            onClick={goToLogin}
            className="w-full bg-teal-600 text-[#F7AD45] hover:bg-white/90 transition py-4 rounded-full font-bold text-lg shadow-lg shadow-black/30"
          >
            Enter POS System
          </button>
          <p className="mt-6 text-sm text-white italic">
            Empowering communities through social enterprise
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-teal-400 text-center py-6 text-sm select-none">
        &copy; {new Date().getFullYear()} Social Action Center &mdash; All rights reserved.
      </footer>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default HomePage;
