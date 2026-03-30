import { Search, Loader2, RefreshCw, AlertCircle, Package } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "./services/api";
import type { Product } from "./types/product";
import { ITEMS_PER_PAGE, SEARCH_DEBOUNCE_MS, RETRY_DELAY_MS, MAX_RETRIES, CATEGORIES } from "./const";
import { formatPrice, getErrorMessage, wait } from "./lib";

function App() {
  // data state
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // query state
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");

  // network state
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  // stale request guard
  const latestRequestRef = useRef(0);

  // debounce search input
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearchQuery(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  // reset to page 1 when category changes
  useEffect(() => {
    setPage(1);
  }, [category]);

  // fetch products with retry + stale response protection
  useEffect(() => {
    let isActive = true;
    latestRequestRef.current += 1;
    const requestId = latestRequestRef.current;

    if (products.length === 0) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    const isStale = () => !isActive || requestId !== latestRequestRef.current;

    const loadProducts = async (retryCount = 0) => {
      try {
        const response = await api.fetchProducts({
          page,
          limit: ITEMS_PER_PAGE,
          category: category || undefined,
          search: searchQuery || undefined,
        });

        if (isStale()) {
          return;
        }

        setProducts(response.data);
        setTotal(response.total);
        setTotalPages(Math.max(response.totalPages, 1));
        setError(null);
      } catch (fetchError) {
        if (isStale()) {
          return;
        }

        if (retryCount < MAX_RETRIES) {
          await wait(RETRY_DELAY_MS);
          if (!isStale()) {
            await loadProducts(retryCount + 1);
          }
          return;
        }

        setError(getErrorMessage(fetchError));
      } finally {
        if (!isStale()) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, [page, category, searchQuery, refreshToken]);

  // pagination numbers around current page
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    return pages;
  }, [page, totalPages]);

  // manual retry from UI
  const handleRetry = () => {
    if (products.length === 0) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError(null);
    setRefreshToken((current) => current + 1);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "2rem" }}>
      <header className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "0.5rem" }}>Premium Products</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Browse our collection. Handling the flaky API gracefully is part of the challenge.
        </p>
      </header>

      <section style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <div
          className="glass-panel"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0.75rem 1rem",
            flex: 1,
            minWidth: "260px",
            maxWidth: "420px",
          }}>
          <Search size={20} color="var(--text-muted)" style={{ marginRight: "0.75rem" }} />
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-main)",
              outline: "none",
              width: "100%",
              fontSize: "1rem",
            }}
          />
        </div>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="glass-panel"
          aria-label="Filter by category"
          style={{
            padding: "0.75rem 1rem",
            color: "var(--text-main)",
            outline: "none",
            fontSize: "1rem",
            cursor: "pointer",
            appearance: "none",
            minWidth: "200px",
          }}>
          <option value="" style={{ background: "var(--surface)" }}>
            All Categories
          </option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item} style={{ background: "var(--surface)" }}>
              {item}
            </option>
          ))}
        </select>
      </section>

      <main>
        {!isLoading && error && products.length > 0 ? (
          <div
            role="alert"
            className="glass-panel"
            style={{
              marginBottom: "1rem",
              padding: "0.75rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              borderColor: "rgba(239,68,68,0.4)",
            }}>
            <AlertCircle size={18} color="var(--error)" />
            <p style={{ flex: 1, color: "var(--text-main)" }}>{error}. Showing last successful products.</p>
            <button type="button" onClick={handleRetry} style={{ color: "var(--primary)", fontWeight: 600 }}>
              Retry
            </button>
          </div>
        ) : null}

        {isLoading ? (
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
            <Loader2
              size={40}
              color="var(--primary)"
              style={{ marginBottom: "1rem", animation: "spin 1.5s linear infinite" }}
            />
            <h2 style={{ marginBottom: "0.5rem" }}>Loading products...</h2>
            <p style={{ color: "var(--text-muted)", textAlign: "center", maxWidth: "500px" }}>
              The API is intentionally slow and flaky, so this may take a moment.
            </p>
          </div>
        ) : null}

        {!isLoading && error && products.length === 0 ? (
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
            <AlertCircle size={40} color="var(--error)" style={{ marginBottom: "1rem" }} />
            <h2 style={{ marginBottom: "0.5rem" }}>Could not load products</h2>
            <p
              style={{
                color: "var(--text-muted)",
                textAlign: "center",
                maxWidth: "500px",
                marginBottom: "1rem",
              }}>
              {error}
            </p>
            <button type="button" className="btn-primary" onClick={handleRetry}>
              <RefreshCw size={16} style={{ marginRight: "0.4rem" }} />
              Try Again
            </button>
          </div>
        ) : null}

        {!isLoading && !error && products.length === 0 ? (
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
        ) : null}

        {!isLoading && products.length > 0 ? (
          <>
            <section
              aria-label="Product list"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "1rem",
              }}>
              {products.map((product) => (
                <article
                  key={product.id}
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
                      }}>
                      {product.category}
                    </p>
                    <h3
                      style={{ fontSize: "22px", marginBottom: "8px", lineHeight: "22px", fontWeight: 500 }}>
                      {product.name}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                      }}>
                      <p
                        style={{
                          fontWeight: 500,
                          color: "var(--primary)",
                          fontSize: "20px",
                          lineHeight: "22px",
                        }}>
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <footer
              aria-label="Pagination"
              style={{
                marginTop: "1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}>
              <p style={{ color: "var(--text-muted)" }}>
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, total)} of {total}
              </p>

              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="glass-panel"
                  style={{ padding: "0.4rem 0.7rem", opacity: page === 1 ? 0.5 : 1 }}>
                  Previous
                </button>

                {pageNumbers.map((pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    aria-current={pageNumber === page ? "page" : undefined}
                    className="glass-panel"
                    style={{
                      padding: "0.4rem 0.7rem",
                      background: pageNumber === page ? "var(--primary)" : undefined,
                      color: pageNumber === page ? "white" : undefined,
                    }}>
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page === totalPages}
                  className="glass-panel"
                  style={{ padding: "0.4rem 0.7rem", opacity: page === totalPages ? 0.5 : 1 }}>
                  Next
                </button>
              </div>
            </footer>
          </>
        ) : null}

        {isRefreshing ? (
          <div
            className="glass-panel"
            role="status"
            aria-live="polite"
            style={{
              position: "fixed",
              right: "1rem",
              bottom: "1rem",
              padding: "0.5rem 0.8rem",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
            }}>
            <Loader2 size={15} color="var(--primary)" style={{ animation: "spin 1.2s linear infinite" }} />
            <span style={{ fontSize: "0.85rem" }}>Updating results...</span>
          </div>
        ) : null}
      </main>

      <style>
        {`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default App;
