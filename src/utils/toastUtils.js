import { toast } from "react-toastify";

export const showErrorToast = (
  errorMessage,
  autoClose = 2000,
  theme = "colored"
) => {
  toast.error(errorMessage, {
    autoClose,
    theme,
  });
};

export const showSuccessToast = (
  message,
  autoClose = 2000,
  theme = "colored"
) => {
  toast.success(message, {
    autoClose,
    theme,
  });
};
