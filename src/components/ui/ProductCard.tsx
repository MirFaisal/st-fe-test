import { NAME_MAX_CHARS } from "../../const";
import { truncateSafe } from "../../lib";
import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
}


function ProductCard({ product }: ProductCardProps) {
  const safeName = truncateSafe(product.name, NAME_MAX_CHARS);

  return (
    <article
      className="glass-card"
      style={{
        overflow: "hidden",
        minWidth: "209.6px",
        display: "flex",
        flexDirection: "column",
      }}>
      <img
        src={product.imageUrl}
        alt={product.name}
        loading="lazy"
        style={{
          width: "100%",
          height: "210px",
          objectFit: "cover",
          borderBottomRightRadius: "12px",
          borderBottomLeftRadius: "12px",
        }}
      />
      <div style={{ padding: "8px" }}>
        <p
          style={{
            fontSize: "14px",
            marginBottom: "2px",
            fontWeight: 400,
            lineHeight: "20px",
            color: "var(--text-muted)",
          }}>
          {product.category}
        </p>
        <h3
          title={product.name}
          style={{ fontSize: "22px", marginBottom: "8px", lineHeight: "22px", fontWeight: 500 }}>
          {safeName}
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}>
          <p
            style={{
              fontWeight: 500,
              color: "var(--primary)",
              fontSize: "20px",
              lineHeight: "22px",
            }}>
            ৳ {product.price}
          </p>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
