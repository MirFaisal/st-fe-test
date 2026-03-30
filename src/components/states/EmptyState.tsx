import { Package } from "lucide-react";

function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem",
        border: "1px dashed var(--border)",
        borderRadius: "16px",
      }}>
      <Package size={40} color="var(--text-muted)" style={{ marginBottom: "1rem" }} />
      <h2 style={{ marginBottom: "0.5rem" }}>No products found</h2>
      <p style={{ color: "var(--text-muted)", textAlign: "center", maxWidth: "500px" }}>
        Try a different search term or category.
      </p>
    </div>
  );
}

export default EmptyState;
