import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { editorToolbarOptions, socket } from "../utils/config";

const TextEditor = () => {
    const { documentId } = useParams();
    const [quill, setQuill] = useState<Quill | null>();

    //Get initial document data
    useEffect(() => {
        if (socket == null || quill == null) return;
        socket.once('load-document', (document) => {
            quill?.setContents(document);
            quill?.enable();
        });
        socket.emit('get-document', documentId);
    }, [socket, quill, documentId]);

    //Save changes
    useEffect(() => {
        if (socket == null || quill == null) return;
        const saveInterval = setInterval(() => {
            socket.emit("save-document", quill?.getContents());
        }, 2000);
        return () => {
            clearInterval(saveInterval);
        };
    }, [socket, quill]);

    //Receive changes
    useEffect(() => {
        if (socket == null || quill == null) return;
        const changeHandler = (delta) => {
            console.log(delta);
            quill?.updateContents(delta);
        };
        socket.on("receive-changes", changeHandler);
        return () => {
            socket.off("receive-changes", changeHandler);
        };
    }, [socket, quill]);

    useEffect(() => {
        if (socket == null || quill == null) return;

        const handler = (delta, oldDelta, source) => {
            if (source !== "user") return;
            socket.emit("send-changes", delta);
        };
        quill.on("text-change", handler);

        return () => {
            quill.off("text-change", handler);
        };
    }, [socket, quill]);

    const editorWrapperRef = useCallback(wrapper => {
        if (wrapper == null)
            return;
        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const _quill = new Quill(editor, { theme: 'snow', modules: { toolbar: editorToolbarOptions } });
        setQuill(_quill);
    }, []);

    return (
        <div className="editor w-full" ref={editorWrapperRef}></div>
    );
};
export default TextEditor;