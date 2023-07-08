import DocsList from "../components/dashboard/DocsList";
import Navbar from "../components/dashboard/Navbar";

const Dashboard = () => {
    return (
        <div className="w-screen h-screen">
            <Navbar />
            <DocsList />
        </div>
    );
};
export default Dashboard;