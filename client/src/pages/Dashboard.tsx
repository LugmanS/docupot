import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import DocumentList from "../components/dashboard/DocumentList";
import Navbar from "../components/dashboard/Navbar";
import { baseURL } from "../utils/config";


const Dashboard = () => {


    return (
        <div className="">
            <Navbar />
            <div className="max-w-7xl mx-auto py-20">
                <DocumentList />
            </div>
        </div>
    );
};
export default Dashboard;