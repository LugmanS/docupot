import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useCallback, useState } from "react";
import { editorToolbarOptions } from "../utils/config";

const TextEditor = () => {

    const [quill, setQuill] = useState();

    const editorWrapperRef = useCallback(wrapper => {
        if (wrapper == null)
            return;
        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        new Quill(editor, { theme: 'snow', modules: { toolbar: editorToolbarOptions } });
    }, []);

    return (
        <div className="editor w-full" ref={editorWrapperRef}></div>
    );
};
export default TextEditor;