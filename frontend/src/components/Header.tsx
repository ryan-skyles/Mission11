import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Header() {
  const { cart } = useCart();
  const count = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">
          Chapter &amp; Verse
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#storeNav"
          aria-controls="storeNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="storeNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link text-white-50 ${isActive ? "active text-white fw-semibold" : ""}`
                }
                end
                to="/"
              >
                Shop
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link text-white-50 ${isActive ? "active text-white fw-semibold" : ""}`
                }
                to="/adminbooks"
              >
                Admin
              </NavLink>
            </li>
            <li className="nav-item">
              <Link
                className="btn btn-outline-light btn-sm position-relative"
                to="/cart"
              >
                Cart
                {count > 0 ? (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {count}
                    <span className="visually-hidden">items in cart</span>
                  </span>
                ) : null}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
