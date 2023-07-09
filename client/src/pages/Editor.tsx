import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/editor/Navbar";
import TextEditor from "../components/editor/TextEditor";
import { socket } from "../utils/config";

const Editor = () => {
    const { documentId } = useParams();
    useEffect(() => {
        socket.connect();
        socket.emit("document:addAllowedUser", {
            documentId: "64a93e6defa8efd051df1404",
            userEmail: "lugmanpc@gmail.com",
            accessType: "READ_ONLY"
        });
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