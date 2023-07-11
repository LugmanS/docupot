import { useParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useEffect, useState } from "react";
import { Document } from "../../utils/types";
import { socket } from "../../utils/config";
import { useAuth } from "@clerk/clerk-react";

const TextEditor = ({ document, accessType }: { document: Document; accessType: string; }) => {

    const { documentId } = useParams();
    const [content, setContent] = useState(document.content);
    const { getToken } = useAuth();

    useEffect(() => {
        const setToken = async () => {
            const token = await getToken();
            if (token) {
                socket.auth = { token };
            }
        };
        socket.connect();
        setToken();
        socket.emit("document:join", documentId);
        socket.on("document:broadcastedChanges", (content) => {
            console.log('Content', content);
            setContent(content);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => socket.emit("document:saveChanges", { documentId, content }), 300);
        return () => clearTimeout(timeout);
    }, [content]);

    return (
        <div className="w-full h-full pt-14 flex items-center">
            {accessType !== 'VIEW' && <div className="w-1/2 h-full">
                <Editor
                    theme="vs-light"
                    options={{
                        fontSize: "16px",
                        minimap: {
                            enabled: false,
                        },
                        wordWrap: true,
                    }}
                    value={content}
                    onChange={(value) => value && setContent(value)}
                    language="markdown"
                />
            </div>}
            <div className="w-1/2 h-full mx-auto bg-white px-6 preview overflow-y-auto border-l-4">
                <ReactMarkdown children={content} />
            </div>
        </div>
    );
};
export default TextEditor;