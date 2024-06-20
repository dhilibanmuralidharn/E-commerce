import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./home/Home";
import Login from "./login/Login";
import Product from "./product/Product";
import ProductDetailedView from "./productDetailedView/ProductDetailedView";
import Cart from "./cart/Cart";
import TrendzContext from "./context/TrendzContext";
import { useEffect, useState } from "react";
import CheckoutView from "./checkout/CheckoutView";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";

const getLocalStorageData = () => {
  const localStorageData = localStorage.getItem("cartData");
  return localStorageData ? JSON.parse(localStorageData) : [];
};

function App() {
  const [cartList, setCartList] = useState(getLocalStorageData());

  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cartList));
  }, [cartList]);

  const addCartItem = (product) => {
    setCartList((prevCartList) => {
      const exisitingItem = prevCartList.find((item) => item.id === product.id);

      if (exisitingItem) {
        return prevCartList.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCartList, { ...product, quantity: 1 }];
      }
    });
  };

  console.log(cartList, "cartList");

  const increseCartItem = (id) => {
    setCartList((prevCartList) =>
      prevCartList.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreseCartItem = (id) => {
    setCartList((prevCartList) =>
      prevCartList.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeCartItem = (id) => {
    setCartList((prevCartList) => {
      const updatedCartList = prevCartList.filter((item) => item.id !== id);
      return updatedCartList;
    });
  };
  return (
    <TrendzContext.Provider
      value={{
        cartList,
        addCartItem,
        decreseCartItem,
        increseCartItem,
        removeCartItem,
      }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductDetailedView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </TrendzContext.Provider>
  );
}

export default App;
