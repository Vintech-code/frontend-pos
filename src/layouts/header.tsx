import { useNavigate } from "react-router-dom";
import { RiLogoutBoxRLine } from "react-icons/ri";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    navigate("/");
  };

  return (
    <header className="app-header sticky" id="header">
      <div className="main-header-container container-fluid flex justify-between items-center px-4 py-2">
        <div className="header-content-left flex items-center space-x-4">
          <div className="horizontal-logo">
            <a href="/" className="header-logo">
              <img
                src="/assets/images/brand-logos/desktop-logo.png"
                alt="logo"
                className="desktop-logo"
              />
            </a>
          </div>
          <div>
            <a
              aria-label="Hide sidebar"
              className="side-menu-toggle header-link animated-arrow hor-toggle horizontal-navtoggle"
              data-bs-toggle="sidebar"
              href="javascript:void(0);"
            >
              <span> </span>
            </a>
          </div>
        </div>

        <div className="header-content-right">
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-red-600 transition text-xl"
            title="Logout"
          >
            <RiLogoutBoxRLine />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
