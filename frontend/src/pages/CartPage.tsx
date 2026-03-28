import { useLocation, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import type { BookstoreResumeState } from "../types/BookstoreResume";

type CartLocationState = {
  resume?: BookstoreResumeState;
};

function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const resume = (location.state as CartLocationState | null)?.resume;

  const grandTotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const continueShopping = () => {
    if (resume) {
      navigate("/", { state: { resume } });
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <Header />
      <div className="container py-4">
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/">Shop</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Cart
            </li>
          </ol>
        </nav>

        <h1 className="h3 mb-4">Your cart</h1>

        {cart.length === 0 ? (
          <div className="row">
            <div className="col-lg-8">
              <p className="text-muted mb-2">Your cart is empty.</p>
              <Link to="/" className="btn btn-primary">
                Browse books
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="table-responsive shadow-sm rounded-3 border">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th className="text-end">Price</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Subtotal</th>
                      <th aria-label="Remove" />
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => {
                      const subtotal = item.quantity * item.price;
                      return (
                        <tr key={item.bookId}>
                          <td>{item.title}</td>
                          <td className="small text-muted">{item.author}</td>
                          <td className="text-end">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="text-center">
                            <div
                              className="btn-group btn-group-sm"
                              role="group"
                              aria-label={`Quantity for ${item.title}`}
                            >
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                  updateQuantity(
                                    item.bookId,
                                    item.quantity - 1
                                  )
                                }
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="btn btn-outline-secondary disabled">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                  updateQuantity(
                                    item.bookId,
                                    item.quantity + 1
                                  )
                                }
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="text-end fw-medium">
                            ${subtotal.toFixed(2)}
                          </td>
                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeFromCart(item.bookId)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-lg-4 align-self-start">
              <div
                className="card border-0 shadow-sm sticky-lg-top z-3"
                style={{ top: "1rem" }}
              >
                <div className="card-header bg-dark text-white">
                  Order summary
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Items</span>
                    <span>
                      {cart.reduce((n, c) => n + c.quantity, 0)}
                    </span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Total</span>
                    <span className="fs-4 fw-bold">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                  <button type="button" className="btn btn-primary w-100 mt-3">
                    Checkout
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100 mt-2"
                    onClick={continueShopping}
                  >
                    Continue shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CartPage;
