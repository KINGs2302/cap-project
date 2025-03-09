import Approve from "@/components/Report/Approve";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function dashboardPage() {
    return <>
        <ToastContainer />
        <Approve/>
    </>;
}