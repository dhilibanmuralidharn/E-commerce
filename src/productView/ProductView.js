import { useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Cookies from "js-cookie";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/20/solid";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import "./ProductView.css";
import { LuIndianRupee } from "react-icons/lu";
import { Link } from "react-router-dom";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const categoryOption = [
  {
    name: "Clothing",
    categoryId: "1",
  },
  {
    name: "Electronics",
    categoryId: "2",
  },
  {
    name: "Appliances",
    categoryId: "3",
  },
  {
    name: "Grocery",
    categoryId: "4",
  },
  {
    name: "Toys",
    categoryId: "5",
  },
];
const sortbyOptions = [
  {
    optionId: "PRICE_HIGH",
    displayText: "Price (High-Low)",
  },
  {
    optionId: "PRICE_LOW",
    displayText: "Price (Low-High)",
  },
];
const ratingsList = [
  {
    ratingId: "4",
    imageUrl:
      "https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png",
  },
  {
    ratingId: "3",
    imageUrl:
      "https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png",
  },
  {
    ratingId: "2",
    imageUrl:
      "https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png",
  },
  {
    ratingId: "1",
    imageUrl:
      "https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductView() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [productList, SetproductList] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [activeOptionId, setActiveOptionId] = useState(
    sortbyOptions[0].optionId
  );
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [activeRatingId, setActiveRatingId] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const handleUserInput = (event) => {
    setSearchInput(event.target.value);
  };

  const handleCategory = (id) => {
    setActiveCategoryId(id);
  };

  const handleRating = (id) => {
    setActiveRatingId(id);
  };

  const changeSortBy = (id) => {
    setActiveOptionId(id);
  };

  useEffect(() => {
    const getproductList = async () => {
      try {
        setApiStatus(apiStatusConstants.inProgress);

        const jwtToken = Cookies.get("jwt_token");
        const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingId}`;
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
          const updatedData = data.products.map((product) => ({
            title: product.title,
            brand: product.brand,
            price: product.price,
            id: product.id,
            imageUrl: product.image_url,
            rating: product.rating,
          }));
          SetproductList(updatedData);
          setApiStatus(apiStatusConstants.success);
        }
      } catch (error) {
        console.log(error);
        setApiStatus(apiStatusConstants.failure);
      }
    };
    getproductList();
  }, [activeCategoryId, activeOptionId, activeRatingId, searchInput]);

  console.log(productList, "productList");
  const renderSuccessView = () => (
    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3">
      {productList.map((product) => (
        <Link to={`/products/${product.id}`}>
          <div
            key={product.id}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
          >
            <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-96">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-full w-full object-cover object-center sm:h-full sm:w-full"
              />
            </div>
            <div className="flex flex-1 flex-col space-y-2 p-4">
              <h3 className="text-sm font-medium text-gray-900">
                <p>
                  <span aria-hidden="true" className="absolute inset-0" />
                  {product.title}
                </p>
              </h3>
              <div className="flex flex-1 flex-col justify-end">
                <p className="text-sm italic text-gray-500">{product.brand}</p>
                <p className="text-base font-small price align-center text-gray-900 pt-1">
                  Rs. <LuIndianRupee size={15} /> {product.price.toFixed(2)}
                </p>
                <p className="text-base font-small text-gray-900">
                  Rating : {product.rating}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  const renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="all-products-error"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  );

  const renderLoadingView = () => (
    <div className="products-loader-container">
      <div class="three-body">
        <div class="three-body__dot"></div>
        <div class="three-body__dot"></div>
        <div class="three-body__dot"></div>
      </div>
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
    <div>
      <NavBar />
      <div className="bg-white">
        <div>
          {/* Mobile filter dialog */}

          <Transition show={mobileFiltersOpen}>
            <Dialog
              className="relative z-40 lg:hidden"
              onClose={setMobileFiltersOpen}
            >
              <TransitionChild
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </TransitionChild>

              <div className="fixed inset-0 z-40 flex">
                <TransitionChild
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                    <div className="flex items-center justify-between px-4">
                      <h2 className="text-lg font-medium text-gray-900">
                        Filters
                      </h2>
                      <button
                        type="button"
                        className="relative -mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                        onClick={() => setMobileFiltersOpen(false)}
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Filters */}
                    <form className="mt-4">
                      <Disclosure
                        as="div"
                        key="SotrtBy"
                        className="border-t border-gray-200 pb-4 pt-4"
                      >
                        {({ open }) => (
                          <fieldset>
                            <legend className="w-full px-2">
                              <DisclosureButton className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                                <span className="text-sm font-medium text-gray-900">
                                  Sort By
                                </span>
                                <span className="ml-6 flex h-7 items-center">
                                  <ChevronDownIcon
                                    className={classNames(
                                      open ? "-rotate-180" : "rotate-0",
                                      "h-5 w-5 transform"
                                    )}
                                    aria-hidden="true"
                                  />
                                </span>
                              </DisclosureButton>
                            </legend>
                            <DisclosurePanel className="px-4 pb-2 pt-4">
                              <div className="space-y-6">
                                {sortbyOptions.map((section, sectionInx) => (
                                  <div
                                    key={sectionInx}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`${section.optionId}-${sectionInx}-mobile`}
                                      name={section.displayText}
                                      defaultValue={section.displayText}
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      onChange={() =>
                                        changeSortBy(section.optionId)
                                      }
                                    />
                                    <label
                                      htmlFor={`${section.categoryId}-${sectionInx}-mobile`}
                                      className="ml-3 text-sm text-gray-500"
                                    >
                                      {section.displayText}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </DisclosurePanel>
                          </fieldset>
                        )}
                      </Disclosure>
                      <Disclosure
                        as="div"
                        key="Category"
                        className="border-t border-gray-200 pb-4 pt-4"
                      >
                        {({ open }) => (
                          <fieldset>
                            <legend className="w-full px-2">
                              <DisclosureButton className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                                <span className="text-sm font-medium text-gray-900">
                                  Category
                                </span>
                                <span className="ml-6 flex h-7 items-center">
                                  <ChevronDownIcon
                                    className={classNames(
                                      open ? "-rotate-180" : "rotate-0",
                                      "h-5 w-5 transform"
                                    )}
                                    aria-hidden="true"
                                  />
                                </span>
                              </DisclosureButton>
                            </legend>
                            <DisclosurePanel className="px-4 pb-2 pt-4">
                              <div className="space-y-6">
                                {categoryOption.map((section, sectionInx) => (
                                  <div
                                    key={sectionInx}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`${section.categoryId}-${sectionInx}-mobile`}
                                      name={section.name}
                                      defaultValue={section.name}
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      onChange={() =>
                                        handleCategory(section.categoryId)
                                      }
                                    />
                                    <label
                                      htmlFor={`${section.categoryId}-${sectionInx}-mobile`}
                                      className="ml-3 text-sm text-gray-500"
                                    >
                                      {section.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </DisclosurePanel>
                          </fieldset>
                        )}
                      </Disclosure>
                      <Disclosure
                        as="div"
                        key="Rating"
                        className="border-t border-gray-200 pb-4 pt-4"
                      >
                        {({ open }) => (
                          <fieldset>
                            <legend className="w-full px-2">
                              <DisclosureButton className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                                <span className="text-sm font-medium text-gray-900">
                                  Rating
                                </span>
                                <span className="ml-6 flex h-7 items-center">
                                  <ChevronDownIcon
                                    className={classNames(
                                      open ? "-rotate-180" : "rotate-0",
                                      "h-5 w-5 transform"
                                    )}
                                    aria-hidden="true"
                                  />
                                </span>
                              </DisclosureButton>
                            </legend>
                            <DisclosurePanel className="px-4 pb-2 pt-4">
                              <div className="space-y-6">
                                {ratingsList.map((section, sectionInx) => (
                                  <div
                                    key={sectionInx}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`${section.ratingId}-${sectionInx}-mobile`}
                                      name={section.ratingId}
                                      defaultValue={section.ratingId}
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      onChange={() =>
                                        handleRating(section.ratingId)
                                      }
                                    />
                                    <label
                                      htmlFor={`${section.ratingId}-${sectionInx}-mobile`}
                                      className="ml-3 text-sm text-gray-500"
                                    >
                                      <img
                                        src={section.imageUrl}
                                        alt={section.ratingId}
                                      />
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </DisclosurePanel>
                          </fieldset>
                        )}
                      </Disclosure>
                    </form>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </Dialog>
          </Transition>

          <main className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
            <div className="border-b border-gray-200 pb-10 pt-24">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                New Arrivals
              </h1>
              <p className="mt-4 text-base text-gray-500">
                Checkout out the latest release of Basic Tees, new and improved
                with four openings!
              </p>
            </div>

            <div className="pb-24 pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
              <aside>
                <h2 className="sr-only">Filters</h2>

                <button
                  type="button"
                  className="inline-flex items-center lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <span className="text-sm font-medium text-gray-700">
                    Filters
                  </span>
                  <PlusIcon
                    className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                </button>

                <div className="hidden lg:block">
                  <form className="space-y-10 divide-y divide-gray-200">
                    <div class="groups-desktop">
                      <svg
                        class="icons-desktop"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                      >
                        <g>
                          <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                        </g>
                      </svg>
                      <input
                        value={searchInput}
                        placeholder="Search"
                        type="search"
                        class="inputs-desktop"
                        onChange={handleUserInput}
                      />
                    </div>
                    <div key="sortBy">
                      <fieldset>
                        <legend className="block text-sm font-medium text-gray-900 pt-2">
                          Sort By
                        </legend>
                        <div className="space-y-3 pt-6">
                          {sortbyOptions.map((option, optionIdx) => (
                            <div
                              key={option.optionId}
                              className="flex items-center"
                            >
                              <input
                                id={`${option.optionId}-${optionIdx}`}
                                name={`${option.displayText}`}
                                value={option.displayText}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                onChange={() => changeSortBy(option.optionId)}
                                checked={activeOptionId === option.optionId}
                              />
                              <label
                                htmlFor={`${option.optionId}-${optionIdx}`}
                                className="ml-3 text-sm text-gray-600"
                              >
                                {option.displayText}
                              </label>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                    <div key="category">
                      <fieldset>
                        <legend className="block text-sm font-medium text-gray-900 pt-2">
                          Category
                        </legend>
                        <div className="space-y-3 pt-6">
                          {categoryOption.map((option, optionIdx) => (
                            <div
                              key={option.name}
                              className="flex items-center"
                            >
                              <input
                                id={`${option.categoryId}-${optionIdx}`}
                                name={`${option.name}`}
                                value={option.name}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                onChange={() =>
                                  handleCategory(option.categoryId)
                                }
                                checked={activeCategoryId === option.categoryId}
                              />
                              <label
                                htmlFor={`${option.categoryId}-${optionIdx}`}
                                className="ml-3 text-sm text-gray-600"
                              >
                                {option.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                    <div key="rating">
                      <fieldset>
                        <legend className="block text-sm font-medium text-gray-900 pt-2">
                          Rating
                        </legend>
                        <div className="space-y-3 pt-6">
                          {ratingsList.map((option, optionIdx) => (
                            <div key={optionIdx} className="flex items-center">
                              <input
                                id={`${option.ratingId}-${optionIdx}`}
                                name={`${option.ratingId}`}
                                value={option.ratingId}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                onChange={() => handleRating(option.ratingId)}
                                checked={activeRatingId === option.ratingId}
                              />
                              <label
                                htmlFor={`${option.ratingId}-${optionIdx}`}
                                className="ml-3 text-sm text-gray-600"
                              >
                                <img
                                  src={option.imageUrl}
                                  alt={option.ratingId}
                                />
                              </label>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  </form>
                </div>
              </aside>

              <section
                aria-labelledby="product-heading"
                className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3"
              >
                <h2 id="product-heading" className="sr-only">
                  Products
                </h2>
                {renderProductListdetils()}
              </section>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
