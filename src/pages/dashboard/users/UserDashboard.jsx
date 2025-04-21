import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useGetOrderByEmailQuery } from "../../../redux/features/orders/ordersApi";
import { getImgUrl } from "../../../utils/getImgUrl";
import { Helmet } from "react-helmet";
import LoadingSpinner from "../../../components/Loading";
import { useTranslation } from "react-i18next";
import "../../../Styles/StylesUserDashboard.css";

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading } = useGetOrderByEmailQuery(currentUser?.email);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  if (isLoading) return <LoadingSpinner />;

  const customerName =
    orders.length > 0
      ? orders[0].name
      : currentUser?.username || t("userDashboard.defaultUser");

  return (
    <div className="user-dashboard">
      <Helmet>
        <title>{t("userDashboard.title")}</title>
      </Helmet>

      <div className="dashboard-content">
        <h1 className="dashboard-title">
          {t("userDashboard.welcome", { name: customerName })}
        </h1>
        <p className="dashboard-subtitle">{t("userDashboard.overview")}</p>

        <div className="orders-section">
          <h2 className="orders-title">{t("userDashboard.yourOrders")}</h2>

          {orders.length > 0 ? (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <p className="order-id">
                      <strong>{t("userDashboard.orderId")}:</strong>{" "}
                      <span dir="ltr">{order._id.slice(0, 8)}...</span>
                    </p>
                    <p className="order-date">
                      {new Date(order?.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="order-total">
                    {t("userDashboard.total")}:{" "}
                    <span className="highlight">${order.totalPrice}</span>
                  </p>

                  <h3 className="order-products-title">
                    {t("userDashboard.orderedProducts")}
                  </h3>

                  <ul className="product-list">
                    {order.products.map((product, index) => {
                      if (!product.productId) return null;

                      const translatedColorName =
                        product.color?.colorName?.[lang] ||
                        product.color?.colorName?.en ||
                        t("userDashboard.original");

                      return (
                        <li key={`${product.productId._id}-${index}`} className="product-item">
                          <img
                            src={
                              product.color?.image
                                ? getImgUrl(product.color.image)
                                : getImgUrl(product.productId.coverImage)
                            }
                            alt={product.productId.title || t("userDashboard.noTitle")}
                            className="product-img"
                          />
                          <div className="product-info">
                            <p className="product-title">
                              {product.productId.title || t("userDashboard.noTitle")}
                            </p>
                            <p>{t("userDashboard.quantity")}: {product.quantity}</p>
                            <p>{t("userDashboard.color")}: {translatedColorName}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-orders">{t("userDashboard.noOrders")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
