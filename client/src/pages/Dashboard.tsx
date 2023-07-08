import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import DocumentList from "../components/dashboard/DocumentList";
import Navbar from "../components/dashboard/Navbar";


const Dashboard = () => {
    const { getToken } = useAuth();

    const token = async () => {
        const value = await getToken();
        console.log(value);
    };

    useEffect(() => {
        token();
    }, []);

    return (
        <div className="">
            <Navbar />
            <div className="max-w-5xl mx-auto py-20 bg-red-200">
                <DocumentList />
            </div>
        </div>
    );
};
export default Dashboard;