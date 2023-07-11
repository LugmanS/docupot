import { FiArrowRight, FiGithub } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import GlowImage from "../assets/glow.svg";

const Home = () => {

    const navigate = useNavigate();

    return (
        <div className="bg-neutral-950 h-full">
            <div className="w-full max-w-4xl mx-auto h-screen flex flex-col items-center justify-center text-white relative">
                <img src={GlowImage} className="absolute top-0 w-full h-full" />
                <nav className="w-full max-w-4xl h-20 flex items-center justify-between fixed top-0 z-50">
                    <div className="flex items-center gap-1 text-gray-400">
                        <h1 className="text-lg font-medium">Docupot</h1>
                    </div>
                </nav>
                <div className="flex flex-col items-center gap-8 my-20 justify-center z-40">
                    <h1 className="text-center font-bold text-[6rem] leading-[88px] text-gray-300">
                        Cloud enabled <br /> for your Md.
                    </h1>
                    <h2 className="text-gray-400 text-lg text-center">Manage your markdown files from any device. <br /> Share the world what you made.</h2>
                    <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-white rounded-md w-max text-black flex items-center gap-2">Get Started <FiArrowRight /></button>
                </div>
                <footer className="flex items-center justify-between fixed bottom-0 h-14 w-full max-w-4xl mx-auto">
                    <p className="text-xs text-gray-500">© {new Date().getFullYear()} All rights reserved.</p>
                    <Link to={""} target="_blank" className="text-gray-400 hover:text-white duration-150 transition-colors">
                        <FiGithub className="" />
                    </Link>
                </footer>
            </div>
        </div>
    );
};
export default Home;