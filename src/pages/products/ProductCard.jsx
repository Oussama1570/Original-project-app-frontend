import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getImgUrl } from "../../utils/getImgUrl";
import { addToCart } from "../../redux/features/cart/cartSlice";
import "../../Styles/StylesProductCard.css"

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const title = product.title || "Product Title";
  const description = product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const colorName = product?.colors?.[0]?.colorName?.en || "Default";
  const stock = product?.colors?.[0]?.stock ?? product.stockQuantity ?? 0;

  const handleAddToCart = () => {
    const color = product.colors?.[0];
    if ((color?.stock ?? 0) > 0 && quantity > 0) {
      dispatch(addToCart({ ...product, quantity, color }));
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-image-wrapper">
        <img
          src={getImgUrl(product.coverImage)}
          alt={title}
          className="product-image"
        />
        <div className={`stock-badge ${stock > 0 ? "in-stock" : "out-of-stock"}`}>
          {stock > 0 ? `Stock: ${stock}` : "Out of Stock"}
        </div>
      </Link>
  
      <div className="product-info">
        <Link to={`/products/${product._id}`}>
          <h3 className="product-title">{title}</h3>
        </Link>
        <p className="product-description">
          {description.length > 60 ? description.slice(0, 60) + "..." : description}
        </p>
        <p className="product-color">Color: {colorName}</p>
        <p className="product-price">
          ${product.newPrice}
          {product.oldPrice && (
            <span className="old-price">${Math.round(product.oldPrice)}</span>
          )}
        </p>
  
        <div className="product-controls">
          <input
            type="number"
            min="1"
            max={stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(+e.target.value, stock))}
            disabled={stock === 0}
            className="quantity-input"
          />
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`add-to-cart-btn ${stock === 0 ? "disabled" : ""}`}
          >
            <FiShoppingCart /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
  
};  

export default ProductCard;
