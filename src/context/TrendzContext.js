import React from "react";

const TrendzContext = React.createContext({
  cartList: [],
  addCartItem: () => {},
  increseCartItem: () => {},
  decreseCartItem: () => {},
  removeCartItem: () => {},
});

export default TrendzContext;
