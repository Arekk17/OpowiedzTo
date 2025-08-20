export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface FormState extends LoadingState {
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export interface ModalState<T = unknown> {
  isOpen: boolean;
  data?: T;
  type?: "info" | "warning" | "error" | "success";
}

export interface ToastState {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: string;
}

export interface TableColumn<T, K extends keyof T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: T[K], row: T) => React.ReactNode;
}

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: number;
}

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  fontSize: "small" | "medium" | "large";
}
