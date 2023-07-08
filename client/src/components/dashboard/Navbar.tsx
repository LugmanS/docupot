import Logo from "../../assets/logo.svg";

const Navbar = () => {
    return (
        <nav className="w-screen h-14 flex items-center px-4 border-b bg-white z-50 fixed top-0 left-0">
            <div className="flex items-center gap-1">
                <img src={Logo} className="w-6 h-6" />
                <h1 className="text-lg font-medium">Docupot</h1>
            </div>
        </nav>
    );
};
export default Navbar;