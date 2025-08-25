import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { About } from "./screens/About";
import { Fo } from "./screens/Fo";
import { Login } from "./screens/Login";
import { Rv } from "./screens/Rv";
import { SignUp } from "./screens/SignUp";
import { ZareNu } from "./screens/ZareNu";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <ZareNu />,
  },
  {
    path: "/zare-nu",
    element: <ZareNu />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  
  {
    path: "/rv",
    element: <Rv />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/fo",
    element: <Fo />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
