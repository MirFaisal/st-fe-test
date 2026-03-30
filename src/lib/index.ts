export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong while loading products.";

export const truncateSafe = (value: string, maxChars: number) => {
  const chars = Array.from(value);
  if (chars.length <= maxChars) {
    return value;
  }
  return `${chars.slice(0, maxChars).join("")}...`;
};
