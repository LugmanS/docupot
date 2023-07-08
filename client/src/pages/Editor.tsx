import { useEffect } from "react";
import Navbar from "../components/Navbar";
import TextEditor from "../components/TextEditor";
import { socket } from "../utils/config";

const Editor = () => {
    useEffect(() => {
        socket.connect();
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="w-screen h-screen overflow-hidden">
            <Navbar />
            <TextEditor />
        </div>
    );
};
export default Editor;