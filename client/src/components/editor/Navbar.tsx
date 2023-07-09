import { FiShare2 } from "react-icons/fi";
import Logo from "../../assets/logo.svg";

const Navbar = () => {
    return (
        <nav className="w-screen h-14 flex items-center justify-between px-4 border-b bg-white fixed z-50 top-0">
            <div className="flex items-center gap-1">
                <img src={Logo} className="w-6 h-6" />
                <h1 className="text-lg font-medium">Docupot</h1>
            </div>
            <div>
                <button className="flex items-center gap-1 bg-primary-light border border-primary-light px-4 py-2 text-white text-sm rounded hover:bg-transparent hover:text-primary-light" >
                    <FiShare2 />
                    <span>Share</span>
                </button>
            </div>
        </nav>
    );
};
export default Navbar;