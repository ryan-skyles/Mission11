import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "../types/CartItem";
import type { Book } from "../types/Book";

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (book: Book) => {
    const id =
      book.bookId ??
      (book as Book & { bookID?: number }).bookID;
    if (id == null || Number.isNaN(Number(id))) {
      return;
    }
    const bookId = Number(id);

    setCart((prev) => {
      const existing = prev.find((c) => c.bookId === bookId);
      if (existing) {
        return prev.map((c) =>
          c.bookId === bookId
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [
        ...prev,
        {
          bookId,
          title: book.title,
          author: book.author,
          price: book.price,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (bookId: number) => {
    setCart((prev) => prev.filter((c) => c.bookId !== bookId));
  };

  const updateQuantity = (bookId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(bookId);
      return;
    }
    setCart((prev) =>
      prev.map((c) =>
        c.bookId === bookId ? { ...c, quantity } : c
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
