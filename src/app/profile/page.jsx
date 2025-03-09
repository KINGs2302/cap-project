
import Profile from "@/components/profile/profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function dashboardPage() {
    return <>
        <ToastContainer />
        <Profile/>
    </>;
}