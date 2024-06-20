import {
  CurrencyDollarIcon,
  GlobeAmericasIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { IoIosAdd } from "react-icons/io";
import { FiMinus } from "react-icons/fi";
import { Link } from "react-router-dom";

import "./ProductDetailedView.css";
import TrendzContext from "../context/TrendzContext";

const policies = [
  {
    name: "International delivery",
    icon: GlobeAmericasIcon,
    description: "Get your order in 2 years",
  },
  {
    name: "Loyalty rewards",
    icon: CurrencyDollarIcon,
    description: "Don't look at other tees",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

export default function ProductDetailedView() {
  const { id } = useParams();
  const [productData, setProductData] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [quantity, setQunatity] = useState(1);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const { addCartItem, increseCartItem, decreseCartItem } =
    useContext(TrendzContext);

  const handleDecrementQunatity = (id) => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQunatity(newQuantity);
    }
    decreseCartItem(id);
  };

  const handleIncrementQunatity = (id) => {
    const newQuantity = quantity + 1;
    setQunatity(newQuantity);
    increseCartItem(id);
  };

  const clickToItemCart = (event) => {
    setQunatity(1);
    event.preventDefault();
    addCartItem({ ...productData, quantity: 1 });
  };

  const getFormattedData = (data) => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  });
  useEffect(() => {
    const getProductData = async () => {
      try {
        setApiStatus(apiStatusConstants.inProgress);
        const jwtToken = Cookies.get("jwt_token");
        const apiUrl = `https://apis.ccbp.in/products/${id}`;
        const options = {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          method: "GET",
        };
        const response = await fetch(apiUrl, options);
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          const updatedData = getFormattedData(data);
          const updatedSimilarProductsData = data.similar_products.map(
            (eachProduct) => getFormattedData(eachProduct)
          );
          setProductData(updatedData);
          setSimilarProducts(updatedSimilarProductsData);
          setApiStatus(apiStatusConstants.success);
          console.log(updatedData, "updated");
        }
      } catch (error) {
        console.log(error);
        setApiStatus(apiStatusConstants.failure);
      }
    };
    getProductData();
  }, [id]);

  const renderSuccessView = () => {
    return (
      <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="flex justify-between">
              <h1 className="text-xl font-medium text-gray-900">
                {productData.title}
              </h1>
              <p className="text-xl price font-medium text-gray-900">
                Rs. <LiaRupeeSignSolid />
                {parseFloat(productData.price).toFixed(2)}/-
              </p>
            </div>
            {/* Reviews */}
            <div className="mt-4">
              <h2 className="sr-only">Reviews</h2>
              <div className="flex items-center">
                <p className="text-sm text-gray-700">
                  {productData.rating}
                  <span className="sr-only"> out of 5 stars</span>
                </p>
                <div className="ml-1 flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        productData.rating > rating
                          ? "text-yellow-400"
                          : "text-gray-200",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="ml-4 flex">
                  <p className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    See all {productData.totalReviews} reviews
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image gallery */}
          <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
            <h2 className="sr-only">Images</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 lg:gap-8">
              <img
                key={productData.id}
                src={productData.imageUrl}
                alt={productData.title}
                className={classNames(
                  productData.imageUrl
                    ? "lg:col-span-2 lg:row-span-2"
                    : "hidden lg:block",
                  "rounded-lg"
                )}
              />
            </div>
          </div>

          <div className="mt-8 lg:col-span-5">
            <div
              aria-hidden="true"
              className="ml-2 text-sm price text-black-300"
            >
              Availability :<p>{productData.availability}</p>
            </div>
            <div
              aria-hidden="true"
              className="ml-2 text-sm text-black-300 pt-3"
            >
              <p className="price">
                Quantity :
                <button
                  className="pr-2 qunatity-button ml-2"
                  onClick={() => handleDecrementQunatity(productData.id)}
                >
                  {" "}
                  <FiMinus size={10} />{" "}
                </button>
                <p className="pr-3 pl-3">{quantity}</p>
                <button
                  className="qunatity-button"
                  onClick={() => handleIncrementQunatity(productData.id)}
                >
                  {" "}
                  <IoIosAdd size={10} />{" "}
                </button>
              </p>
            </div>
            <form>
              <button
                type="button"
                className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={clickToItemCart}
              >
                Add to cart
              </button>
            </form>

            {/* Product details */}
            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Description</h2>

              <div
                className="prose prose-sm mt-4 text-gray-500"
                dangerouslySetInnerHTML={{ __html: productData.description }}
              />
            </div>

            {/* Policies */}
            <section aria-labelledby="policies-heading" className="mt-10">
              <h2 id="policies-heading" className="sr-only">
                Our Policies
              </h2>

              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {policies.map((policy) => (
                  <div
                    key={policy.name}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center"
                  >
                    <dt>
                      <policy.icon
                        className="mx-auto h-6 w-6 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="mt-4 text-sm font-medium text-gray-900">
                        {policy.name}
                      </span>
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500">
                      {policy.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>

        {/* Related products */}
        <section aria-labelledby="related-heading" className="mt-16 sm:mt-24">
          <h2
            id="related-heading"
            className="text-lg font-medium text-gray-900"
          >
            Similar Products
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {similarProducts.map((product) => (
              <Link to={`/products/${product.id}`}>
                <div key={product.id} className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <p>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {product.title}
                        </p>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.brand}
                      </p>
                    </div>
                    <p className="text-sm font-medium price text-gray-900">
                      Rs. <LiaRupeeSignSolid />
                      {parseFloat(product.price).toFixed(2)}/-
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    );
  };

  const renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="error view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  );

  const renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <div class="loader"></div>
    </div>
  );

  const renderProductListdetils = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };
  return (
    <div className="bg-white">
      <NavBar />
      {renderProductListdetils()}
      <Footer />
    </div>
  );
}
