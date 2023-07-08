import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" index element={<Dashboard />} />
                <Route path="/doc/:docId" element={<Editor />} />
            </Routes>
        </BrowserRouter>
    );
};
export default AppRouter;