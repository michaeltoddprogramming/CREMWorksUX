import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image?: string;
  brand?: string;
  category?: string;
  stock?: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
    }
  }, [isAuthenticated]);

  const addItem = (productId: string, product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to cart');
      return;
    }

    setItems(prev => {
      const existing = prev.find(item => item._id === productId);
      if (existing) {
        return prev.map(item =>
          item._id === productId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, _id: productId, quantity }];
    });
    toast.success('Item added to cart');
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item._id !== productId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prev => 
      prev.map(item =>
        item._id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      count
    }}>
      {children}
    </CartContext.Provider>
  );
};
