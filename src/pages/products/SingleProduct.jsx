import React, { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useGetProductByIdQuery } from "../../redux/features/products/productsApi";
import "../../Styles/StylesSingleProduct.css";
import { useTranslation } from "react-i18next";

const SingleProduct = () => {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const translatedTitle = product?.translations?.[lang]?.title || product?.title;
  const translatedDescription = product?.translations?.[lang]?.description || product?.description;

  // Category translation
  const categoryKey = product?.category?.toLowerCase();
  const translatedCategory = t(`categories.${categoryKey}`, product?.category);

  useEffect(() => {
    if (product) {
      setSelectedColor(
        product.colors?.[0] || {
          colorName: "Default",
          image: product?.coverImage || "/assets/default-image.png",
          stock: product?.stockQuantity || 0,
        }
      );
    }
  }, [product]);

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    const maxStock = selectedColor?.stock ?? 0;
    setQuantity(value > maxStock ? maxStock : value);
  };

  const handleSelectColor = (color) => {
    setSelectedColor(color);
    setQuantity(1); // Reset quantity when changing color
  };

  const handleAddToCart = () => {
    if ((selectedColor?.stock ?? 0) > 0 && quantity > 0) {
      dispatch(
        addToCart({
          ...product,
          quantity,
          color: selectedColor,
        })
      );
    }
  };

  if (isLoading)
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (isError || !product)
    return <div className="text-center py-10 text-red-600">Error loading product info</div>;


  return (
    <div className="single-product-container">
      <h1 className="product-title">{translatedTitle}</h1>
  
      <div className="product-content">
        {/* Image Section */}
        <div className="product-image-box">
          <img
            src={getImgUrl(selectedColor?.image ?? "/assets/default-image.png")}
            alt={translatedTitle}
            className="product-main-image"
          />
          <div className={`stock-badge ${selectedColor?.stock > 0 ? "in-stock" : "out-of-stock"}`}>
            {selectedColor?.stock > 0
              ? `${t("stock")}: ${selectedColor?.stock}`
              : t("out_of_stock")}
          </div>
        </div>
  
        {/* Details Section */}
        <div className="product-details">
          <p className="product-description">{translatedDescription}</p>
  
          <div className="product-meta">
            <p><strong>{t("category")}:</strong> {translatedCategory}</p>
            <p><strong>{t("published")}:</strong> {product?.createdAt
              ? new Date(product.createdAt).toLocaleDateString()
              : t("unknown")}</p>
          </div>
  
          <div className="product-price">
            <span className="new">${product?.newPrice ?? "0.00"}</span>
            {product?.oldPrice && (
              <span className="old">${Math.round(product?.oldPrice)}</span>
            )}
          </div>
  
          <div className="product-stock-info">
            <strong>{t("stock")}:</strong>{" "}
            {selectedColor?.stock > 0 ? selectedColor.stock : t("out_of_stock")}
          </div>
  
          <div className="product-quantity">
            <label>{t("quantity")}:</label>
            <input
              type="number"
              min="1"
              max={selectedColor?.stock ?? 0}
              value={quantity}
              onChange={handleQuantityChange}
              disabled={(selectedColor?.stock ?? 0) === 0}
            />
          </div>
  
          <button
            onClick={handleAddToCart}
            disabled={(selectedColor?.stock ?? 0) === 0}
            className={`add-to-cart-btn ${selectedColor?.stock > 0 ? "enabled" : "disabled"}`}
          >
            <FiShoppingCart className="icon" />
            {selectedColor?.stock > 0 ? t("add_to_cart") : t("out_of_stock")}
          </button>
  
          {/* Color Options */}
          <div className="product-colors">
            <label>{t("select_color")}:</label>
            <div className="color-options">
              {product?.colors?.map((color, index) => {
                const stock = color?.stock ?? 0;
                const translatedName =
                  color?.colorName?.[lang] || color?.colorName?.en || "Default";
                const isSelected =
                  selectedColor?.colorName?.en === color?.colorName?.en;
  
                return (
                  <div key={index} className="color-option">
                    <img
                      src={getImgUrl(color?.image)}
                      alt={translatedName}
                      className={`color-image ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSelectColor(color)}
                    />
                    <div className={`color-stock ${stock > 0 ? "in-stock" : "out-of-stock"}`}>
                      {stock > 0 ? stock : t("out_of_stock")}
                    </div>
                  </div>
                );
              })}
            </div>
  
            <p className="selected-color">
              {t("selected")}:{" "}
              <strong>
                {selectedColor?.colorName?.[lang] ||
                  selectedColor?.colorName?.en ||
                  t("default")}
              </strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};  

export default SingleProduct;