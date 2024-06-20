import { useContext } from "react";
import { BsPlusSquare, BsDashSquare } from "react-icons/bs";
import {
  CheckIcon,
  ClockIcon,
  XMarkIcon as XMarkIconMini,
} from "@heroicons/react/20/solid";
import TrendzContext from "../context/TrendzContext";
import Footer from "../footer/Footer";
import NavBar from "../navbar/NavBar";
import "./CartListView.css";
import CartSummary from "../cartSummary/CartSummary";

const policies = [
  {
    name: "Free returns",
    imageUrl:
      "https://tailwindui.com/img/ecommerce/icons/icon-returns-light.svg",
    description:
      "Not what you expected? Place it back in the parcel and attach the pre-paid postage stamp.",
  },
  {
    name: "Same day delivery",
    imageUrl:
      "https://tailwindui.com/img/ecommerce/icons/icon-calendar-light.svg",
    description:
      "We offer a delivery service that has never been done before. Checkout today and receive your products within hours.",
  },
  {
    name: "All year discount",
    imageUrl:
      "https://tailwindui.com/img/ecommerce/icons/icon-gift-card-light.svg",
    description:
      'Looking for a deal? You can use the code "ALLYEAR" at checkout and get money off all year round.',
  },
  {
    name: "For the planet",
    imageUrl:
      "https://tailwindui.com/img/ecommerce/icons/icon-planet-light.svg",
    description:
      "We’ve pledged 1% of sales to the preservation and restoration of the natural environment.",
  },
];

export default function CartListView() {
  const { cartList, increseCartItem, decreseCartItem, removeCartItem } =
    useContext(TrendzContext);

  const onClickIncrement = (id) => {
    increseCartItem(id);
  };

  const onClickDecrement = (id) => {
    decreseCartItem(id);
  };

  const clickremoveCartItem = (id) => {
    removeCartItem(id);
  };

  return (
    <div className="bg-white">
      <NavBar />
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-b border-t border-gray-200"
            >
              {cartList.map((product, productIdx) => (
                <li key={product.id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <p className="font-medium text-gray-700 hover:text-gray-800">
                              {product.title}
                            </p>
                          </h3>
                        </div>
                        <div className="mt-1 flex text-sm">
                          <p className="text-gray-500">
                            Quantity : {product.quantity}
                          </p>
                        </div>
                        <p className="mt-1 text-sm font-medium price text-gray-900">
                          Rs.
                          {parseFloat(product.price).toFixed(2)} /-
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label
                          htmlFor={`quantity-${productIdx}`}
                          className="sr-only"
                        >
                          Quantity, {product.name}
                        </label>
                        <div className="cart-quantity-container">
                          <button
                            type="button"
                            className="quantity-controller-button"
                            onClick={() => onClickDecrement(product.id)}
                            data-testid="decrement-quantity"
                          >
                            <BsDashSquare color="#52606D" size={12} />
                          </button>
                          <div data-testid="item-quantity">
                            <p
                              className="cart-quantity"
                              data-testid="item-quantity"
                            >
                              {product.quantity}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="quantity-controller-button"
                            onClick={() => onClickIncrement(product.id)}
                            data-testid="increment-quantity"
                          >
                            <BsPlusSquare color="#52606D" size={12} />
                          </button>
                        </div>

                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => clickremoveCartItem(product.id)}
                          >
                            <span className="sr-only">Remove</span>
                            <XMarkIconMini
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                      {product.availability ? (
                        <CheckIcon
                          className="h-5 w-5 flex-shrink-0 text-green-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <ClockIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-300"
                          aria-hidden="true"
                        />
                      )}

                      <span>
                        {product.availability
                          ? "In stock"
                          : `Ships in ${product.leadTime}`}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <CartSummary />
        </form>

        {/* Related products */}
        <section
          aria-labelledby="policies-heading"
          className="border-t border-gray-200 bg-gray-50"
        >
          <h2 id="policies-heading" className="sr-only">
            Our policies
          </h2>

          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0">
              {policies.map((policy) => (
                <div
                  key={policy.name}
                  className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
                >
                  <div className="md:flex-shrink-0">
                    <div className="flow-root">
                      <img
                        className="-my-1 mx-auto h-24 w-auto"
                        src={policy.imageUrl}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                    <h3 className="text-base font-medium text-gray-900">
                      {policy.name}
                    </h3>
                    <p className="mt-3 text-sm text-gray-500">
                      {policy.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
