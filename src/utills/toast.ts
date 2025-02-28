import { toast } from "react-toastify";

export const toastMessage = (type: any, message: any) => {
  if (type === "success") {
    toast.success(message, {
      position: "top-right",
      // autoClose: false,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      toastId: "3",
      className: "toast-success",
    });
  }
  if (type === "error") {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      toastId: "4",
      className: "toast-success",
    });
  }
};
