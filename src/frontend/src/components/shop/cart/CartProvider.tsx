import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface CartItemData {
  listingId: string;
  productName: string;
  retailerName: string;
  price: number;
  quantity: number;
  maxStock: number;
}

interface CartContextType {
  items: CartItemData[];
  addItem: (item: Omit<CartItemData, 'quantity'>, quantity?: number) => void;
  removeItem: (listingId: string) => void;
  updateQuantity: (listingId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemData[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItemData, 'quantity'>, quantity = 1) => {
    if (quantity > item.maxStock) {
      throw new Error('Not enough stock available');
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.listingId === item.listingId);
      if (existing) {
        const newQuantity = existing.quantity + quantity;
        if (newQuantity > item.maxStock) {
          throw new Error('Not enough stock available');
        }
        return prev.map((i) =>
          i.listingId === item.listingId ? { ...i, quantity: newQuantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeItem = (listingId: string) => {
    setItems((prev) => prev.filter((item) => item.listingId !== listingId));
  };

  const updateQuantity = (listingId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(listingId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.listingId === listingId) {
          if (quantity > item.maxStock) {
            throw new Error('Not enough stock available');
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
