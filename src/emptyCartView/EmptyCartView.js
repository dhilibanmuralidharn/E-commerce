import { Link } from "react-router-dom";

import "./EmptyCartView.css";
import NavBar from "../navbar/NavBar";

const EmptyCartView = () => (
  <div>
    <NavBar />
    <div className="cart-empty-view-container pt-12">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
        className="cart-empty-img"
        alt="cart empty"
      />
      <h1 className="cart-empty-heading pt-5">Your Cart Is Empty</h1>

      <Link to="/products" className="pt-5">
        <button type="button" className="shop-now-btn">
          Shop Now
        </button>
      </Link>
    </div>
  </div>
);

export default EmptyCartView;
