export interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}
export interface InlineErrorBannerProps  {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
};
