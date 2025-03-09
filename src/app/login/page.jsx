import { LoginFormDemo } from "@/components/auth/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  return <>
    <ToastContainer/>
    <LoginFormDemo />
  </>;
}
