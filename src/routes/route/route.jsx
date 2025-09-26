import { createBrowserRouter } from "react-router";
import RootLayout from "../../layouts/RootLayout/RootLayout";
import Home from "../../pages/Home/Home";

export const route = createBrowserRouter([
    {
        path: "/", 
        element: <RootLayout></RootLayout>,
        children: [
            {
                index: true,
                element: <Home></Home>
            }
        ]
    }
])