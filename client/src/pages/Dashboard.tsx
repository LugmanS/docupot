import DocumentList from "../components/dashboard/DocumentList";
import Navbar from "../components/dashboard/Navbar";


const Dashboard = () => {
    return (
        <div className="">
            <Navbar />
            <div className="max-w-5xl mx-auto py-20">
                <DocumentList />
            </div>
        </div>
    );
};
export default Dashboard;