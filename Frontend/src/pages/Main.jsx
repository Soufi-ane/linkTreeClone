import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";

function Main() {
    return (
        <div
            style={{
                fontFamily: "Poppins",
            }}>
            <Header />
            <Outlet />
            <Toaster />
        </div>
    );
}

export default Main;
