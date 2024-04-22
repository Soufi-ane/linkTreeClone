import { useEffect, useState } from "react";
import { getLoginState } from "./api/usersApi";

import { Outlet } from "react-router-dom";

import { LoginContext } from "./Context/LoginContext";
import toast from "react-hot-toast";
import Loader from "./components/Loader";

//localStorage.setItem('keyName', 'value');

function App() {
    const webToken = localStorage.getItem("webToken");
    const [logedIn, setLogedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const getLogin = async () => {
        try {
            const state = await getLoginState(webToken);
            if (state?.logedIn) {
                setLogedIn(true);
            } else {
                setLogedIn(false);
            }
        } catch (err) {
            console.log(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    // if (isLoading) {
    //     toast.dismiss();
    //     toast.loading("Loading...");
    // }
    useEffect(() => {
        getLogin();
    }, []);
    return <LoginContext.Provider value={{ logedIn, setLogedIn }}>{isLoading ? <Loader /> : <Outlet />}</LoginContext.Provider>;
}

export default App;
