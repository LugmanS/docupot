import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useState } from "react";
import { FiArrowLeft, FiCheckCircle, FiDownload, FiEdit, FiLink2, FiShare2, FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";
import { baseURL } from "../../utils/config";
import { Document } from "../../utils/types";
import Spinner from "../Spinner";
import ConfirmDelete from "./ConfirmDelete";
import RenameModal from "./RenameModal";
import ShareModal from "./ShareModal";

const Navbar = ({ document, accessType, setConfigChanged }: { document: Document; accessType: string; setConfigChanged: () => void; }) => {

    const [isShareModalOpen, setShareModalOpen] = useState(false);

    const [isCopied, setCopied] = useState(false);

    const { getToken } = useAuth();
    const { user } = useUser();

    const onShareModalClose = () => setShareModalOpen(false);
    const openShareModal = () => setShareModalOpen(true);

    const onLinkCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const deleteModalOpen = () => setDeleteModalOpen(true);
    const deleteModalClose = () => setDeleteModalOpen(false);

    //Requesting access
    const [isRequestAccessLoading, setRequestAccessLoading] = useState(false);
    const requestAccess = async () => {
        setRequestAccessLoading(true);
        try {
            await axios.post(`${baseURL}/documents/${document._id}/request-access`, { userEmail: user?.primaryEmailAddress?.emailAddress }, {
                headers: {
                    Authorization: await getToken()
                }
            });
            setRequestAccessLoading(false);
        } catch (error) {
            setRequestAccessLoading(false);
            console.log(error);
        }
    };

    const downloadFile = () => {
        const a = window.document.createElement('a');
        const blob = new Blob([document.content]);
        a.href = URL.createObjectURL(blob);
        a.download = `${document.title}.md`;
        a.click();
    };

    const [isRenameOpen, setRenameOpen] = useState(false);

    const onRenameClose = () => {
        setRenameOpen(false);
    };

    return (
        <nav className="w-screen h-14 flex items-center justify-between px-4 border-b bg-white fixed z-50 top-0">
            <div className="flex items-center gap-2">
                <Link to="/dashboard">
                    <button className="p-2 text-sm border rounded-full hover:bg-neutral-900 hover:text-white duration-200 transition-colors" >
                        <FiArrowLeft className="w-5 h-5" />
                    </button>
                </Link>
                <div className="flex items-center group">
                    <h1 className="font-medium text-lg px-4 py-2" >{document.title}</h1>
                    <button className="hidden group-hover:block p-2 text-sm border rounded-full hover:bg-neutral-900 hover:text-white duration-200 transition-colors" onClick={() => setRenameOpen(true)}><FiEdit /></button>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {
                    accessType === 'OWNER' && <button className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-950 px-4 py-2 text-white text-sm rounded-full duration-150 transition-colors" onClick={openShareModal} >
                        <FiShare2 />
                        <p>Share</p>
                    </button>
                }
                <button className="p-2 text-sm border rounded-full hover:bg-neutral-900 hover:text-white duration-200 transition-colors" onClick={downloadFile}>
                    <FiDownload className="w-4 h-4" />
                </button>
                {
                    accessType === 'OWNER' && <button className="p-2 text-sm border rounded-full hover:bg-red-100 hover:text-red-500 hover:border-red-500 duration-200 transition-colors" onClick={deleteModalOpen}>
                        <FiTrash className="w-4 h-4" />
                    </button>
                }
                {
                    accessType !== 'OWNER' && <>
                        <button className="p-2 text-sm border rounded-full hover:bg-neutral-900 hover:text-white duration-200 transition-colors" disabled={isCopied} onClick={onLinkCopy}>
                            {!isCopied ? <FiLink2 className="w-4 h-4" /> : <FiCheckCircle className="w-4 h-4 text-green-700" />}
                        </button>
                    </>
                }
                {accessType === 'VIEW' && <button className="px-4 py-2 text-sm border rounded-full hover:bg-neutral-900 hover:text-white duration-200 transition-colors flex items-center gap-1" onClick={requestAccess} disabled={isRequestAccessLoading}>
                    {isRequestAccessLoading && <Spinner className="w-4 h-4" />}
                    {!isRequestAccessLoading ? "Request edit access" : "Requesting access"}
                </button>}
            </div>
            <ShareModal isOpen={isShareModalOpen} onClose={onShareModalClose} _document={document} setConfigChanged={setConfigChanged} />
            <ConfirmDelete isOpen={isDeleteModalOpen} onClose={deleteModalClose} document={document} />
            <RenameModal isOpen={isRenameOpen} onClose={onRenameClose} document={document} setConfigChanged={setConfigChanged} />
        </nav>
    );
};
export default Navbar;