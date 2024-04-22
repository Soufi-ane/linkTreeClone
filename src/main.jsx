import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Main from "./pages/Main.jsx";
import LinkTree from "./pages/LinkTree.jsx";

import Create from "./pages/Create.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Settings from "./pages/Settings.jsx";
import Account from "./pages/Account.jsx";
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/:username",
                element: <LinkTree />,
            },
            {
                path: "/",
                element: <Main />,
                children: [
                    {
                        path: "/",
                        element: <Create />,
                    },

                    {
                        path: "/settings",
                        element: <Settings />,
                    },
                    {
                        path: "/account",
                        element: <Account />,
                    },
                ],
            },
        ],
    },
]);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
        },
    },
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            {" "}
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
);
