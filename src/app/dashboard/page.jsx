

import { Dashboard } from "@/components/dashboard/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function dashboardPage() {
    return <>
        <ToastContainer />
        <Dashboard />
    </>;
}