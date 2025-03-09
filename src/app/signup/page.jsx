import { SignupFormDemo } from "@/components/auth/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupPage() {
  return <>
    <ToastContainer />
    <SignupFormDemo />
  </>;
}
