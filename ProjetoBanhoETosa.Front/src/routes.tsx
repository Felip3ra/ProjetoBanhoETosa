import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/home";

const router = createBrowserRouter([
    {
        path: "/Login",
        element: <Login/>
    },
    {
        path: "/Home",
        element: <Home/>
    }
]);

export {router}