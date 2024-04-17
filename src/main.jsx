import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Main from "./pages/Main.jsx";
import LinkTree from "./pages/LinkTree.jsx";
import { QueryClient, QueryClientProvider } from "react-query";
import Create from "./pages/Create.jsx";
const router = createBrowserRouter([
    {
        path: "/linkTreeClone/",
        element: <App />,
        children: [
            {
                path: "/linkTreeClone/",
                element: <Main />,
                children: [
                    {
                        path: "/linkTreeClone/",
                        element: <Create />,
                    },
                    {
                        path: "/linkTreeClone/:username",
                        element: <LinkTree />,
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
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
);
