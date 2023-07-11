import { createContext, useState } from "react";

export interface EditorContextType {
    doc: Document | undefined;
    updateDoc: (doc: Document) => void;
}

export const EditorContext = createContext<EditorContextType | null>(null);

type Props = {
    children: string | JSX.Element | JSX.Element[];
};

const EditorContextProvider = ({ children }: Props) => {

    const [doc, setDoc] = useState<Document>();
    const updateDoc = (doc: Document) => {
        setDoc(doc);
    };

    const value = {
        doc,
        updateDoc
    };

    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};

export default EditorContextProvider;