// One line in the cart: unit price × quantity (line total computed in the UI).
export interface CartItem {
  bookId: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
}
