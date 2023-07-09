import { useState } from "react";
import { FiCheckCircle, FiDownload, FiLink2, FiShare2, FiTrash } from "react-icons/fi";
import Logo from "../../assets/logo.svg";
import { Document } from "../../utils/types";
import ConfirmDelete from "./ConfirmDelete";
import ShareModal from "./ShareModal";

const Navbar = ({ document, accessType }: { document: Document; accessType: string; }) => {

    const [isShareModalOpen, setShareModalOpen] = useState(false);

    const [isCopied, setCopied] = useState(false);

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
    return (
        <nav className="w-screen h-14 flex items-center justify-between px-4 border-b bg-white fixed z-50 top-0">
            <div className="flex items-center gap-1">
                <img src={Logo} className="w-6 h-6" />
                <h1 className="text-lg font-medium">Docupot</h1>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <h1 className="text-center">{document.title}</h1>
            </div>
            <div className="flex items-center gap-2">
                {
                    accessType === 'OWNER' && <button className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-950 px-4 py-2 text-white text-sm rounded-full duration-150 transition-colors" onClick={openShareModal} >
                        <FiShare2 />
                        <p>Share</p>
                    </button>
                }
                <button className="p-2 text-sm border rounded-full hover:bg-neutral-900 hover:text-white duration-200 transition-colors">
                    <FiDownload className="w-4 h-4" />
                </button>
                {
                    accessType === 'OWNER' && <button className="p-2 text-sm border rounded-full hover:bg-red-100 hover:text-red-500 hover:border-red-500 duration-200 transition-colors" onClick={deleteModalOpen}>
                        <FiTrash className="w-4 h-4" />
                    </button>
                }
                {
                    accessType !== 'OWNER' && <>
                        <button className="px-4 py-2 text-sm border rounded-full hover:bg-neutral-900 hover:text-white duration-200 transition-colors">
                            Request edit access
                        </button>
                        <button className="p-2 text-sm border rounded-full hover:bg-neutral-900 hover:text-white duration-200 transition-colors" disabled={isCopied} onClick={onLinkCopy}>
                            {!isCopied ? <FiLink2 className="w-4 h-4" /> : <FiCheckCircle className="w-4 h-4 text-green-700" />}
                        </button>
                    </>
                }
            </div>
            <ShareModal isOpen={isShareModalOpen} onClose={onShareModalClose} _document={document} />
            <ConfirmDelete isOpen={isDeleteModalOpen} onClose={deleteModalClose} document={document} />
        </nav>
    );
};
export default Navbar;