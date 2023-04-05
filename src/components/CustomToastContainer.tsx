import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CustomToastContainer = () => {
  return (
    <ToastContainer
      className="font-semibold text-sm"
      toastStyle={{
        backgroundColor: "#3A4342",
        color: "#fff",
        width: "300px",
        borderRadius: "8px",
      }}
      position="top-right"
      autoClose={2000}
      closeButton={false}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};
