import { createBrowserRouter } from "react-router";
import RootLayout from "../../layouts/RootLayout/RootLayout";
import Home from "../../pages/Home/Home";
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";
import SignUp from "../../components/SignUp/SignUp";
import SignIn from "../../components/SignIn/SignIn";
import WhereListen from "../../pages/WhereListen/WhereListen";
import Profile from "../../pages/Profile/Profile";
import Tags from "../../pages/Tags/Tags";
import WhatToDo from "../../pages/WhatToDo/WhatToDo";
import MyNetwork from "../../pages/myNetwork/MyNetwork";

export const route = createBrowserRouter([
    {
        path: "/", 
        element: <RootLayout></RootLayout>,
        children: [
            {
                index: true,
                element: <Home></Home>
            },
            {
                path: "/profile",
                element: <Profile></Profile>
            },
            {
                path: '/network',
                element: <MyNetwork />
            }
        ]
    },
    {
        path: "/auth",
        element: <AuthLayout></AuthLayout>,
        children: [
            {
                path: "signup",
                element: <SignUp></SignUp>
            },
            {
                path: "signin",
                element: <SignIn></SignIn>
            },
            {
                path: "where-listen",
                element: <WhereListen></WhereListen>
            },
            {
                path: "tags",
                element: <Tags></Tags>
            },
            {
                path: "what-to-do",
                element: <WhatToDo></WhatToDo>
            }
        ]
    }
])