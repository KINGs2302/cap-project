import Reportstatus from "@/components/Report/Reportstatus";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function dashboardPage() {
    return <>
        <ToastContainer />
        <Reportstatus />
    </>;
}