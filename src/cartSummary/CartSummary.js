import React, { useContext } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import TrendzContext from "../context/TrendzContext";
import { useNavigate } from "react-router-dom";

const CartSummary = () => {
  const { cartList } = useContext(TrendzContext);
  const navigate = useNavigate();

  const calculatedsubTotal = () => {
    return cartList.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const calculateShipping = (subTotal) => {
    return 5.0;
  };

  const calculateTax = (subTotal) => {
    const taxRate = 0.08;
    return subTotal * taxRate;
  };

  const subTotal = calculatedsubTotal();
  const shipping = calculateShipping(subTotal);
  const tax = calculateTax(subTotal);

  const orderTotal = subTotal + shipping + tax;

  const clickToCheckOut = () => {
    navigate("/checkout");
  };

  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
        Order summary
      </h2>

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Subtotal</dt>
          <dd className="text-sm font-medium text-gray-900">
            Rs. {subTotal.toFixed(2)} /-
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="flex items-center text-sm text-gray-600">
            <span>Shipping estimate</span>
            <a
              href="#"
              className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">
                Learn more about how shipping is calculated
              </span>
              <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
            </a>
          </dt>
          <dd className="text-sm font-medium text-gray-900">
            {shipping.toFixed(2)}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="flex text-sm text-gray-600">
            <span>Tax estimate</span>
            <a
              href="#"
              className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">
                Learn more about how tax is calculated
              </span>
              <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
            </a>
          </dt>
          <dd className="text-sm font-medium text-gray-900">
            {tax.toFixed(2)}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-medium text-gray-900">Order total</dt>
          <dd className="text-base font-medium text-gray-900">
            Rs. {orderTotal.toFixed(2)} /-
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
          onClick={clickToCheckOut}
        >
          Checkout
        </button>
      </div>
    </section>
  );
};

export default CartSummary;
