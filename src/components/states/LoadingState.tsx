import { Loader2 } from "lucide-react";

function LoadingState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px",
        border: "1px dashed var(--border)",
        borderRadius: "16px",
      }}>
      <Loader2
        size={40}
        color="var(--primary)"
        style={{ marginBottom: "16px", animation: "spin 1.5s linear infinite" }}
      />
      <h2 style={{ marginBottom: "8px" }}>Loading products...</h2>
      <p style={{ color: "var(--text-muted)", textAlign: "center", maxWidth: "500px" }}>
        The API is intentionally slow and flaky, so this may take a moment.
      </p>
    </div>
  );
}

export default LoadingState;
