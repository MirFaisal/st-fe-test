import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "./services/api";
import type { Product } from "./types/product";
import { ITEMS_PER_PAGE, SEARCH_DEBOUNCE_MS, RETRY_DELAY_MS, MAX_RETRIES, CATEGORIES } from "./const";
import { getErrorMessage, wait } from "./lib";
import InlineErrorBanner from "./components/states/InlineErrorBanner";
import LoadingState from "./components/states/LoadingState";
import ErrorState from "./components/states/ErrorState";
import EmptyState from "./components/states/EmptyState";
import ProductsSection from "./components/states/ProductsSection";
import RefreshBadge from "./components/states/RefreshBadge";

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
  const [isSoftErrorDismissed, setIsSoftErrorDismissed] = useState(false);

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

  useEffect(() => {
    if (error) {
      setIsSoftErrorDismissed(false);
    }
  }, [error]);

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
          !isSoftErrorDismissed ? (
            <InlineErrorBanner
              message={error}
              onRetry={handleRetry}
              onDismiss={() => setIsSoftErrorDismissed(true)}
            />
          ) : null
        ) : null}

        {isLoading ? <LoadingState /> : null}

        {!isLoading && error && products.length === 0 ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : null}

        {!isLoading && !error && products.length === 0 ? <EmptyState /> : null}

        {!isLoading && products.length > 0 ? (
          <ProductsSection
            products={products}
            page={page}
            total={total}
            totalPages={totalPages}
            pageNumbers={pageNumbers}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setPage}
          />
        ) : null}

        {isRefreshing ? <RefreshBadge /> : null}
      </main>
    </div>
  );
}

export default App;
