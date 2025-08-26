import React from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { About } from "./screens/About";
import { Fo } from "./screens/Fo";
import { Login } from "./screens/Login";
import { Rv } from "./screens/Rv";
import { SignUp } from "./screens/SignUp";
import { ZareNu } from "./screens/ZareNu";

const router = createHashRouter([
  {
    path: "/",
    element: <ZareNu />,
  },
  {
    path: "/fo",         
    element: <Fo />,
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
    path: "/sign-up",
    element: <SignUp />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};

