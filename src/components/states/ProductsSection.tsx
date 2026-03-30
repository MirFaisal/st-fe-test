import ProductCard from "../ui/ProductCard";
import type { ProductsSectionProps } from "../../types/product";

function ProductsSection({
  products,
  page,
  total,
  totalPages,
  pageNumbers,
  itemsPerPage,
  onPageChange,
}: ProductsSectionProps) {
  return (
    <>
      <section
        aria-label="Product list"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "16px",
        }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>

      <footer
        aria-label="Pagination"
        style={{
          width: "min(700px, 100%)",
          marginInline: "auto",
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="glass-panel"
            style={{ padding: "6px 11px", opacity: page === 1 ? 0.5 : 1 }}>
            Previous
          </button>

          {pageNumbers.map((pageNumber) => (
            <button
              type="button"
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              aria-current={pageNumber === page ? "page" : undefined}
              className="glass-panel"
              style={{
                padding: "6px 11px",
                background: pageNumber === page ? "var(--primary)" : undefined,
                color: pageNumber === page ? "white" : undefined,
              }}>
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="glass-panel"
            style={{ padding: "6px 11px", opacity: page === totalPages ? 0.5 : 1 }}>
            Next
          </button>
        </div>

        <p style={{ color: "var(--text-muted)" }}>
          Showing {(page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, total)} of {total}
        </p>
      </footer>
    </>
  );
}

export default ProductsSection;
