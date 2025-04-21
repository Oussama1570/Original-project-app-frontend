// ✅ Corrected CartPage.jsx for Wahret Zmen
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "../../redux/features/cart/cartSlice";
import { useTranslation } from "react-i18next";


const CartPage = () => {
  const { t, i18n } = useTranslation();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice * item.quantity, 0)
    .toFixed(2);

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleQuantityChange = (product, quantity) => {
    if (quantity > 0) {
      dispatch(
        updateQuantity({
          _id: product._id,
          color: product.color,
          quantity,
        })
      );
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-box">
        {/* Header */}
        <div className="cart-header">
          <h2 className="cart-title">{t("cart.title")}</h2>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="cart-btn btn-danger"
            >
              {t("cart.clear_cart")}
            </button>
          )}
        </div>
  
        {/* Cart Items */}
        <div className="mt-6">
          {cartItems.length > 0 ? (
            <ul className="space-y-4">
              {cartItems.map((product) => (
                <li
                  key={`${product._id}-${product.color?.colorName?.en}`}
                  className="flex flex-col sm:flex-row items-center sm:items-start bg-gray-50 p-4 rounded-lg shadow-sm border border-[#A67C52] gap-4"
                >
                  {/* Image */}
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 border-[#A67C52] shadow-md">
                    <img
                      src={getImgUrl(product.color?.image || product.coverImage)}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
  
                  {/* Details */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        <Link to={`/products/${product._id}`} className="hover:text-[#A67C52]">
                          {product.title}
                        </Link>
                      </h3>
                      <p className="text-lg font-semibold text-[#A67C52]">
                        ${(product.newPrice * product.quantity).toFixed(2)}
                      </p>
                    </div>
  
                    <p className="text-sm text-gray-600 mt-1">
                      {t("cart.category")}: {product.category}
                    </p>
  
                    <p className="text-sm text-gray-600 capitalize mt-1">
                      {t("cart.color")}:{" "}
                      {product.color?.colorName?.[i18n.language] || t("cart.original")}
                    </p>
  
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center">
                        <label className="mr-2 text-gray-700">{t("cart.qty")}:</label>
                        <input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) =>
                            handleQuantityChange(product, Number(e.target.value))
                          }
                          className="cart-qty-input"
                        />
                      </div>
  
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFromCart(product)}
                        className="cart-btn btn-danger"
                      >
                        {t("cart.remove")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 text-lg mt-4">
              {t("cart.empty")}
            </p>
          )}
        </div>
  
        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#A67C52] pt-6 mt-6">
            <div className="flex flex-col sm:flex-row justify-between text-lg font-semibold gap-2">
              <p>{t("cart.subtotal")}</p>
              <p className="text-[#A67C52]">${totalPrice}</p>
            </div>
            <Link
              to="/checkout"
              className="mt-6 block text-center btn-checkout cart-btn"
            >
              {t("cart.proceed_to_checkout")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};  

export default CartPage;
