import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";

const router = createBrowserRouter([
    {
        path: "/Login",
        element: <Login/>
    }
]);

export {router}