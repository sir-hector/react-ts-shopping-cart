import { createContext, useContext, ReactNode, useState } from "react";

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

type CardItem = {
  id: number;
  quantity: number;
};

type ShoppingCartContext = {
  openCart: () => void
  closeCart: () => void
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCardQuantity: (id: number) => void;
  removeFromCard: (id: number) => void;
  cartQuantity: number
  cartItems: CardItem[]
};

type ShoppingCartPoviderProps = {
  children: ReactNode;
};
export function ShoppingCartProvider({ children }: ShoppingCartPoviderProps) {
  const [cartItems, setCartItems] = useState<CardItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const cartQuantity = cartItems.reduce((quantity, item) => 
  item.quantity + quantity, 0)

  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }

  function increaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (cartItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }
  function decreaseCardQuantity(id: number) {
    setCartItems((currItems) => {
      if (cartItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }
  function removeFromCard(id: number) {
    setCartItems(currItems => {
        return currItems.filter(item => item.id !== id);
    })
  }
  const openCard =() => setIsOpen(true);
  const closeCard= () => setIsOpen(false);
  

  return (
    <ShoppingCartContext.Provider
      value={{openCard, closeCard, getItemQuantity, increaseCartQuantity, decreaseCardQuantity, removeFromCard, cartQuantity, cartItems}}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}
