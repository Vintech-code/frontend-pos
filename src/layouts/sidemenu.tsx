import logo from '../assets/images/background/logo.png';
import { Link } from 'react-router-dom';


function Sidemenu() {

return (
<>
    <aside className="app-sidebar" id="sidebar">
        <div className="main-sidebar-header">
            <a href="/" className="holder-logo"></a>
        </div>
        <div className="main-sidebar" id="sidebar-scroll">
            <nav className="main-menu-container nav nav-pills flex-col sub-open">
                <div className="slide-left" id="slide-left">
                </div>
                <ul className="main-menu">
                    <li>
                        <a href="">
                            <center>
                                <img src={logo} className="transparent-shadow" style={{maxHeight: '150px'}} />
                            </center>
                        </a>
                    </li>
                    <li>
                        <hr className="mt-3" />
                    </li>
                    <li className="slide__category"><span className="category-name">Main</span></li>
                    <li className="slide">
                        <Link to="/dashboard" className="side-menu__item">
                            <i className="w-6 h-4 side-menu_icon bi bi-speedometer"></i>
                            <span className="side-menu__label">
                                Dashboard &ensp;
                                <span className="translate-middle badge !rounded-full bg-danger"> 5+ </span>
                            </span>
                        </Link>
                    </li>
            
                    <li className="slide">
                        <Link to='/shop' className="side-menu__item">
                            <i className="w-6 h-4 side-menu__icon bi bi-cart-dash-fill"></i>
                            <span className="side-menu__label">
                                Shop
                            </span>
                        </Link>
                    </li>
                   <li className="slide">
                        <Link to='/reports' className="side-menu__item">
                            <i className="w-6 h-4 side-menu__icon bi bi-newspaper"></i>
                            <span className="side-menu__label">
                                Reports
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    </aside>
</>
)
}

export default Sidemenu;