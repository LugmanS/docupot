import { useNavigate } from "react-router-dom";
import { FiDelete, FiPlus, FiUpload, FiUsers } from "react-icons/fi";
import { useAuth } from "@clerk/clerk-react";
import { baseURL } from "../../utils/config";
import { useEffect, useState } from "react";
import { Document } from "../../utils/types";
import axios from "axios";
import moment from "moment";

import EmptyImage from "../../assets/notFound.svg";
import Forbidden from "../../assets/forbidden.svg";
import Spinner from "../Spinner";
import Markdown from "../../assets/md.png";

const EmptyState = ({ createNewDocument }: { createNewDocument: () => void; }) => {
    return <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-16rem)]">
        <img src={Forbidden} alt="Not found" />
        <h1>Create your first document</h1>
        <button onClick={() => createNewDocument()} className="flex items-center justify-center gap-2 border rounded-md px-6 py-3 text-sm text-white bg-neutral-800 hover:bg-neutral-950 transition duration-200">
            <FiPlus className="w-5 h-5" />
            <p>Create document</p>
        </button>
    </div>;
};

const SearchEmptyState = ({ clearSearch }: { clearSearch: () => void; }) => {
    return <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-16rem)]">
        <div className="flex flex-col items-center">
            <img src={EmptyImage} alt="Not found" />
            <div className="flex flex-col items-center gap-3">
                <h1>No Documents matched your search</h1>
                <button onClick={() => clearSearch()} className="flex items-center justify-center gap-2 border rounded-md px-6 py-3 text-sm text-white bg-neutral-800 hover:bg-neutral-950 transition duration-200">
                    <FiDelete className="w-5 h-5" />
                    <p>Clear search</p>
                </button>
            </div>
        </div>
    </div>;
};

const DocumentLoader = () => {
    return (<>
        {Array.from({ length: 8 }).map(() => <div className="border w-72 h-48 flex flex-col justify-end cursor-pointer hover:shadow-xl rounded-md animate-pulse relative">
            <div className="w-44 h-40 bg-gray-200 rounded-md absolute top-6 left-1/2 transform -translate-x-1/2"></div>
            <div className="bg-white p-4 rounded-b border-t h-20 z-40">
                <div className="w-48 h-5 rounded-md bg-gray-200 "></div>
                <div className="mt-1 flex items-center gap-2 text-sm">
                    <div className="w-60 mt-1 h-4 rounded-md bg-gray-100"></div>
                </div>
            </div>
        </div>)}
    </>);
};

const DocumentList = () => {

    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [documents, setDocuments] = useState<Document[]>([]);
    const [searchText, setSearchText] = useState("");
    const [isDocumentsLoading, setDocumentsLoading] = useState(false);

    const [filterType, setFilterType] = useState<"authored" | "shared">("authored");

    const createNewDocument = async (title?: string, content?: string) => {
        console.log('CreateContent', content);
        try {
            const response = await axios.post<Document>(`${baseURL}/documents`, { title: title ?? 'Untitled Document', content },
                {
                    headers: {
                        'Authorization': await getToken()
                    }
                }
            );
            navigate(`/document/${response.data._id}`);
        } catch (error) {
            console.log(error);
        }
    };

    const getAllUserDocuments = async () => {
        setDocumentsLoading(true);
        try {
            const response = await axios.get(`${baseURL}/documents/${filterType}`, {
                headers: {
                    'Authorization': await getToken()
                }
            });
            const data: Document[] = response.data;
            setDocuments(data);
            setDocumentsLoading(false);
        } catch (error) {
            console.log(error);
            setDocumentsLoading(false);
        }
    };

    useEffect(() => {
        getAllUserDocuments();
    }, []);

    const onSelectDocument = (id: string) => {
        navigate(`/document/${id}`);
    };

    const [searchLoading, setSearchLoading] = useState(false);

    const onSearchInput = async () => {
        if (searchText.length === 0) {
            return getAllUserDocuments();
        }
        if (searchText.length > 4) {
            setSearchLoading(true);
            try {
                const response = await axios.get<Document[]>(`${baseURL}/documents/${filterType}?search=${searchText}`, {
                    headers: {
                        'Authorization': await getToken()
                    }
                });
                setDocuments(response.data);
                setSearchLoading(false);
            } catch (error) {
                setSearchLoading(false);
                console.log(error);
            }
        }
    };

    useEffect(() => {
        onSearchInput();
    }, [searchText, filterType]);

    const [fileInput, setFileInput] = useState<{ title?: string, content?: string | ArrayBuffer | null; } | null>();

    const onFileUpload = (file: Blob) => {
        setFileInput((prev) => ({ ...prev, title: file.name }));
        const fileReader = new FileReader();
        fileReader.onload = () => setFileInput((prev) => ({ ...prev, content: fileReader.result }));
        fileReader.readAsText(file);
    };

    useEffect(() => {
        if (!fileInput || !fileInput.title || !fileInput.content) return;
        createNewDocument(fileInput.title, fileInput.content.toString());
    }, [fileInput]);
    return (
        <div className="">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-start gap-4">
                    <button onClick={() => createNewDocument()} className="flex items-center justify-center gap-2 border rounded-md px-6 py-3 text-sm text-white bg-neutral-800 hover:bg-neutral-950 transition duration-200">
                        <FiPlus className="w-5 h-5" />
                        <p>Create document</p>
                    </button>
                    <form>
                        <label htmlFor="upload-btn" className="flex items-center justify-center gap-2 border rounded-md px-6 py-3 text-sm text-white bg-neutral-800 hover:bg-neutral-950 transition duration-200 cursor-pointer">
                            <FiUpload className="w-5 h-5" />
                            Upload file
                        </label>
                        <input type="file" id="upload-btn" accept=".md" onChange={(e) => e.target.files && onFileUpload(e.target.files[0])} hidden />
                    </form>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 relative">
                        <input type="text" className="border px-6 py-3 rounded-md w-96 text-sm focus:outline-neutral-400" placeholder="Find in documents" autoComplete="off" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                        {searchLoading && <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                            <Spinner className="" />
                        </div>}
                    </div>
                    <button className={`flex items-center justify-center gap-2 border rounded-md px-6 py-3 text-sm ${filterType === 'authored' ? "text-white bg-neutral-800 hover:bg-neutral-950" : "hover:bg-neutral-800 hover:text-white"} transition duration-200`} onClick={() => filterType !== 'authored' && setFilterType("authored")}>My files</button>
                    <button className={`flex items-center justify-center gap-2 border rounded-md px-6 py-3 text-sm ${filterType === 'shared' ? "text-white bg-neutral-800 hover:bg-neutral-950" : "hover:bg-neutral-800 hover:text-white"} transition duration-200`} onClick={() => filterType !== 'shared' && setFilterType("shared")}>Shared</button>
                </div>
            </div>
            {/* Empty state */}
            {!isDocumentsLoading && searchText.length === 0 && documents.length === 0 && <EmptyState createNewDocument={createNewDocument} />}
            {/* Search empty state */}
            {!isDocumentsLoading && documents.length === 0 && searchText.length > 0 && !searchLoading && <SearchEmptyState clearSearch={() => setSearchText("")} />}
            {/* List documents */}
            <div className="grid grid-cols-4 gap-10">
                {/* Loader */}
                {isDocumentsLoading && <DocumentLoader />}
                {(documents.length > 0 && !isDocumentsLoading) && documents.map((doc) =>
                    <div key={doc._id} className="border w-72 h-48 flex flex-col justify-end cursor-pointer hover:shadow-xl duration-200 transition-all rounded-md relative" onClick={() => onSelectDocument(doc._id)}>
                        {doc.isPublic && <div className="z-50 text-xs font-medium text-green-700 bg-green-700 bg-opacity-20 px-1 py-1 rounded absolute top-2 right-2">Public</div>}
                        <div className="w-44 h-20 bg-neutral-200 rounded-md absolute top-9 left-1/2 transform -translate-x-1/2 flex justify-center pt-6">
                            <img src={Markdown} className="w-10 h-10 opacity-30" />
                        </div>
                        <div className="bg-white p-4 rounded-b border-t z-40">
                            <h1 className="text-primary-text-light font-medium">{doc.title}</h1>
                            <div className="mt-1 flex items-center gap-2 text-sm">
                                {doc.allowedUsers.length > 0 && <FiUsers className="text-secondary-text-light w-5 h-5" />}
                                <p className="text-secondary-text-light text-xs">Updated {moment(doc.updatedAt).fromNow()}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default DocumentList;