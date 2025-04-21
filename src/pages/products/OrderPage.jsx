import React from "react";
import {
  useGetOrderByEmailQuery,
  useDeleteOrderMutation,
  useRemoveProductFromOrderMutation,
} from "../../redux/features/orders/ordersApi";
import { useAuth } from "../../context/AuthContext";
import { getImgUrl } from "../../utils/getImgUrl";
import { Helmet } from "react-helmet";
import LoadingSpinner from "../../components/Loading";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { productEventsActions } from "../../redux/features/products/productEventsSlice";
import "../../Styles/StylesOrderPage.css";

const OrderPage = () => {
  const { currentUser } = useAuth();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const dispatch = useDispatch();

  const userEmail = currentUser?.email;
  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useGetOrderByEmailQuery(userEmail, {
    skip: !userEmail,
  });

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [removeProductFromOrder] = useRemoveProductFromOrderMutation();

  if (!userEmail) {
    return (
      <div className="centered-page">
        <p className="text-message">{t("ordersPage.pleaseLogin")}</p>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  const handleDelete = async (orderId) => {
    Swal.fire({
      title: t("ordersPage.confirmDeleteTitle"),
      text: t("ordersPage.confirmDeleteText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("ordersPage.confirmDeleteBtn"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOrder({ orderId }).unwrap();
          Swal.fire(t("ordersPage.deleted"), t("ordersPage.orderDeleted"), "success");
          refetch();
          dispatch(productEventsActions.triggerRefetch());
        } catch {
          Swal.fire(t("ordersPage.error"), t("ordersPage.orderDeleteFailed"), "error");
        }
      }
    });
  };

  const handleDeleteProduct = async (
    orderId,
    productId,
    colorNameObj,
    maxQuantity
  ) => {
    const colorName = colorNameObj?.[lang] || colorNameObj?.en || "Original";
    const productKey = `${productId}|${colorName}`;

    const { value: quantityToRemove } = await Swal.fire({
      title: t("ordersPage.removeQuantityTitle"),
      input: "number",
      inputLabel: t("ordersPage.removeQuantityLabel", { max: maxQuantity }),
      inputAttributes: { min: 1, max: maxQuantity, step: 1 },
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: t("ordersPage.removeBtn"),
      cancelButtonText: t("ordersPage.cancelBtn"),
    });

    if (!quantityToRemove || quantityToRemove <= 0) return;

    try {
      await removeProductFromOrder({ orderId, productKey, quantityToRemove }).unwrap();
      Swal.fire(
        t("ordersPage.removed"),
        t("ordersPage.productRemoved", { qty: quantityToRemove }),
        "success"
      );
      refetch();
      dispatch(productEventsActions.triggerRefetch());
    } catch {
      Swal.fire(t("ordersPage.error"), t("ordersPage.productRemoveFailed"), "error");
    }
  };

  return (
    <div className="order-page">
      <Helmet>
        <title>{t("ordersPage.title")}</title>
      </Helmet>

      <div className="order-container">
        <h2 className="order-title">{t("ordersPage.yourOrders")}</h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">{t("ordersPage.noOrders")}</p>
        ) : (
          <div className="order-list">
            {orders.map((order, index) => (
              <div key={order._id} className="order-card">
                <div className="order-info-top">
                  <p>
                    <strong>{t("ordersPage.orderNumber")}:</strong> {index + 1}
                  </p>
                  <p>{new Date(order?.createdAt).toLocaleDateString()}</p>
                </div>

                <p className="order-id">
                  {t("ordersPage.orderId")}: {order._id.slice(0, 8)}...
                </p>
                <p>{t("ordersPage.name")}: {order.name}</p>
                <p>{t("ordersPage.email")}: {order.email}</p>
                <p>{t("ordersPage.phone")}: {order.phone}</p>
                <p className="order-total">
                  {t("ordersPage.total")}: <span>${order.totalPrice}</span>
                </p>

                <h3 className="order-subtitle">{t("ordersPage.orderedProducts")}</h3>

                <ul className="order-products">
                  {order.products.map((product, idx) => {
                    if (!product.productId) return null;
                    const color = product.color?.colorName?.[lang] || product.color?.colorName?.en;

                    return (
                      <li key={`${product.productId._id}-${idx}`} className="order-product-item">
                        <img
                          src={getImgUrl(product.color?.image || product.productId.coverImage)}
                          alt={product.productId.title}
                          className="product-img"
                        />
                        <div className="product-info">
                          <p className="product-title">{product.productId.title}</p>
                          <p>{t("ordersPage.quantity")}: {product.quantity}</p>
                          <p>{t("ordersPage.color")}: {color}</p>
                          <button
                            onClick={() =>
                              handleDeleteProduct(
                                order._id,
                                product.productId._id,
                                product.color.colorName,
                                product.quantity
                              )
                            }
                            className="btn-red"
                          >
                            {t("ordersPage.removeProduct")}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <button
                  onClick={() => handleDelete(order._id)}
                  className={`btn-delete ${isDeleting ? "btn-disabled" : ""}`}
                  disabled={isDeleting}
                >
                  {isDeleting ? t("ordersPage.deleting") : t("ordersPage.deleteOrder")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
