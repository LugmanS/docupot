import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();

    return (
        <main className="max-w-4xl mx-auto">
            <nav className="w-full h-14 flex items-center justify-between px-4">
                <h1>Docupot</h1>
                <button onClick={() => navigate("/dashboard")} >Get Started</button>
            </nav>
        </main>
    );
};
export default Home;