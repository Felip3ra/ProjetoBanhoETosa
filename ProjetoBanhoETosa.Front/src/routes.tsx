import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/home";
import Clients from "./pages/clients";
import Subscriptions from "./pages/subscriptions";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Login/>
    },
    {
        path: "/Login",
        element: <Login/>
    },
    {
        path: "/Home",
        element: <Home/>
    },
    {
        path: "/Clientes",
        element: <Clients/>
    },
    {
        path: "/Assinaturas",
        element: <Subscriptions/>
    },
    
]);

export {router}
