import "./App.css";
import BookstorePage from "./pages/BookstorePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import AdminBooksPage from "./pages/AdminBooksPage";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<BookstorePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/adminbooks" element={<AdminBooksPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
