import React, { useContext, useEffect, useState } from "react";
import CartListView from "../cartListView/CartListView";
import TrendzContext from "../context/TrendzContext";
import EmptyCartView from "../emptyCartView/EmptyCartView";

const Cart = () => {
  const { cartList } = useContext(TrendzContext);
  const [showEmptyCartView, setShowEmptyCartView] = useState(false);

  useEffect(() => {
    if (cartList.length === 0) {
      setShowEmptyCartView(true);
    }
  }, [cartList.length]);
  return <div>{showEmptyCartView ? <EmptyCartView /> : <CartListView />}</div>;
};

export default Cart;
