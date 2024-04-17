import { useState } from "react";
import { getLoginState } from "./api/usersApi";
import { useQuery } from "react-query";
import { Outlet } from "react-router-dom";

import { LoginContext } from "./Context/LoginContext";

//localStorage.setItem('keyName', 'value');

function App() {
    const [logedIn, setLogedIn] = useState(false);
    const webToken = localStorage.getItem("webToken");

    // const { data } = useQuery({
    //     queryKey: ["logedInState"],
    //     queryFn: async () => {
    //         if (!webToken) return;
    //         const data = await fetch(`https://linktreecloneapi.onrender.com/is/logedIn`, {
    //             method: "GET",
    //             headers: {
    //                 authorization: String(webToken),
    //             },
    //         });
    //         const state = await data.json();
    //         setLogedIn(state.logedIn === true);
    //         return state.logedIn === true;
    //     },
    // });

    return (
        <LoginContext.Provider value={{ logedIn, setLogedIn }}>
            <Outlet />
        </LoginContext.Provider>
    );
}

export default App;
