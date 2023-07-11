import { useParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useEffect, useState } from "react";
import { Document } from "../../utils/types";
import { baseURL } from "../../utils/config";
// import { baseURL, socket } from "../../utils/config";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const TextEditor = ({ document, accessType }: { document: Document; accessType: string; }) => {

    const { documentId } = useParams();
    const [content, setContent] = useState(document.content);
    const { getToken } = useAuth();

    // useEffect(() => {
    //     const setToken = async () => {
    //         const token = await getToken();
    //         if (token) {
    //             socket.auth = { token };
    //         }
    //     };
    //     socket.connect();
    //     setToken();
    //     socket.emit("document:join", documentId);
    //     socket.on("document:broadcastedChanges", (content) => {
    //         console.log('Content', content);
    //         setContent(content);
    //     });
    //     return () => {
    //         socket.disconnect();
    //     };
    // }, []);

    const updateContent = async () => {
        try {
            await axios.put(`${baseURL}/documents/${documentId}`, { ...document, content }, {
                headers: {
                    'Authorization': await getToken()
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    // useEffect(() => {
    //     const timeout = setTimeout(() => socket.emit("document:saveChanges", { documentId, content }), 300);
    //     return () => clearTimeout(timeout);
    // }, [content]);

    useEffect(() => {
        const timeout = setTimeout(() => updateContent(), 400);
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
            <div className={`${accessType === 'VIEW' ? "w-full max-w-4xl mx-auto mt-6 border" : "w-1/2 border-l-4"} h-full mx-auto bg-white p-6 preview overflow-y-auto `}>
                <ReactMarkdown children={content} />
            </div>
        </div>
    );
};
export default TextEditor;