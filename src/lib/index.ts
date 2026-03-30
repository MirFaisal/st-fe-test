export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong while loading products.";
