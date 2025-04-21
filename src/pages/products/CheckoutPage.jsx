import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useCreateOrderMutation } from "../../redux/features/orders/ordersApi";

import { useTranslation } from "react-i18next";

const CheckoutPage = () => {
  const { t } = useTranslation();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice * item.quantity, 0)
    .toFixed(2);

  const { currentUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const onSubmit = async (data) => {
    const newOrder = {
      name: data.name,
      email: currentUser?.email,
      address: {
        street: data.address,
        city: data.city,
        country: data.country,
        state: data.state,
        zipcode: data.zipcode,
      },
      phone: data.phone,
      products: cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        color:
          typeof item.color?.colorName === "object"
            ? item.color
            : {
                colorName: {
                  en: item.color?.colorName || "Original",
                  fr: item.color?.colorName || "Original",
                  ar: "أصلي",
                },
                image: item.color?.image || item.coverImage || "/assets/default-image.png",
              },
      })),
      totalPrice: totalPrice,
    };

    try {
      const result = await createOrder(newOrder).unwrap();
      if (result) {
        Swal.fire({
          title: t("checkout.order_confirmed"),
          text: t("checkout.success_message"),
          icon: "success",
          confirmButtonColor: "#A67C52",
          confirmButtonText: t("checkout.go_to_orders"),
        }).then(() => {
          navigate("/orders");
        });
      }
    } catch (error) {
      Swal.fire({
        title: t("checkout.error_title"),
        text: error?.message || t("checkout.error_message"),
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (isLoading)
    return (
      <div className="text-center text-lg font-semibold py-10 text-[#A67C52]">
        {t("checkout.processing")}
      </div>
    );

    return (
      <section className="checkout-page">
        <div className="checkout-box">
          <h2 className="checkout-title">{t("checkout.title")}</h2>
  
          <div className="checkout-summary">
            <h3 className="checkout-subtitle">{t("checkout.payment_method")}</h3>
            <p>{t("checkout.total_price")}: <strong>${totalPrice}</strong></p>
            <p>{t("checkout.items")}: <strong>{totalItems}</strong></p>
          </div>
  
          <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">
            {/* Left - Personal Details */}
            <div className="form-column">
              <h3 className="checkout-subtitle">{t("checkout.personal_details")}</h3>
  
              <div className="form-group">
                <label>{t("checkout.full_name")}</label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  className="form-input"
                />
                {errors.name && <p className="error-text">{t("checkout.required")}</p>}
              </div>
  
              <div className="form-group">
                <label>{t("checkout.email")}</label>
                <input
                  type="email"
                  value={currentUser?.email}
                  disabled
                  className="form-input bg-gray-100 cursor-not-allowed"
                />
              </div>
  
              <div className="form-group">
                <label>{t("checkout.phone")}</label>
                <input
                  {...register("phone", { required: true })}
                  type="text"
                  className="form-input"
                />
                {errors.phone && <p className="error-text">{t("checkout.required")}</p>}
              </div>
            </div>
  
            {/* Right - Address Details */}
            <div className="form-column">
              <h3 className="checkout-subtitle">{t("checkout.shipping_address")}</h3>
  
              <div className="form-group">
                <label>{t("checkout.address")}</label>
                <input
                  {...register("address", { required: true })}
                  type="text"
                  className="form-input"
                />
                {errors.address && <p className="error-text">{t("checkout.required")}</p>}
              </div>
  
              <div className="form-row">
                <div className="form-group">
                  <label>{t("checkout.city")}</label>
                  <input
                    {...register("city", { required: true })}
                    type="text"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>{t("checkout.country")}</label>
                  <input
                    {...register("country", { required: true })}
                    type="text"
                    className="form-input"
                  />
                </div>
              </div>
  
              <div className="form-row">
                <div className="form-group">
                  <label>{t("checkout.state")}</label>
                  <input
                    {...register("state", { required: true })}
                    type="text"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>{t("checkout.zipcode")}</label>
                  <input
                    {...register("zipcode", { required: true })}
                    type="text"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
  
            {/* Footer - Terms and Submit */}
            <div className="form-footer">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="checkbox"
                />
                {t("checkout.agree")}{" "}
                <Link className="link">{t("checkout.terms")}</Link>{" "}
                {t("checkout.and")}{" "}
                <Link className="link">{t("checkout.policy")}</Link>.
              </label>
  
              <button
                type="submit"
                disabled={!isChecked}
                className={`checkout-button ${isChecked ? "enabled" : "disabled"}`}
              >
                {t("checkout.place_order")}
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  };
  
export default CheckoutPage;