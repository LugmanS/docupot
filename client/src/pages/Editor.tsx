import Navbar from "../components/Navbar";
import TextEditor from "../components/TextEditor";

const Editor = () => {
    return (
        <div className="w-screen h-screen overflow-hidden">
            <Navbar />
            <TextEditor />
        </div>
    );
};
export default Editor;