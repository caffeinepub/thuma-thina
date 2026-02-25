import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItemData {
  listingId: bigint;
  productName: string;
  retailerName: string;
  price: bigint;
  quantity: number;
  imageUrl?: string;
}

interface CartContextType {
  items: CartItemData[];
  addItem: (item: CartItemData) => void;
  removeItem: (listingId: bigint) => void;
  updateQuantity: (listingId: bigint, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => bigint;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

function serializeCart(items: CartItemData[]): string {
  return JSON.stringify(
    items.map((item) => ({
      ...item,
      listingId: item.listingId.toString(),
      price: item.price.toString(),
    }))
  );
}

function deserializeCart(data: string): CartItemData[] {
  try {
    const parsed = JSON.parse(data);
    return parsed.map((item: Record<string, unknown>) => ({
      ...item,
      listingId: BigInt(item.listingId as string),
      price: BigInt(item.price as string),
    }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemData[]>(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? deserializeCart(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', serializeCart(items));
  }, [items]);

  const addItem = (newItem: CartItemData) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.listingId === newItem.listingId);
      if (existing) {
        return prev.map((i) =>
          i.listingId === newItem.listingId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (listingId: bigint) => {
    setItems((prev) => prev.filter((i) => i.listingId !== listingId));
  };

  const updateQuantity = (listingId: bigint, quantity: number) => {
    if (quantity <= 0) {
      removeItem(listingId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.listingId === listingId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const getTotalAmount = (): bigint => {
    return items.reduce((sum, item) => sum + item.price * BigInt(item.quantity), 0n);
  };

  const getTotalItems = (): number => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotalAmount, getTotalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
