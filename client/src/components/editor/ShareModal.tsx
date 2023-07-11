import { useAuth } from "@clerk/clerk-react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiCopy, FiGlobe, FiLock, FiTrash, FiUserPlus } from "react-icons/fi";
import { baseURL } from "../../utils/config";
import { AccessType, Document } from "../../utils/types";
import ModalWrapper from "../ModalWrapper";
import Spinner from "../Spinner";

const ShareModal = ({ isOpen, onClose, _document, setConfigChanged }: { isOpen: boolean; onClose: () => void; _document: Document; setConfigChanged: () => void; }) => {
    const { getToken } = useAuth();
    const [document, setDocument] = useState<Document>(_document);

    //Add new email
    const [newEmail, setNewEmail] = useState("");

    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailRegex.test(email)) {
            return (_document.allowedUsers.filter(user => user.userEmail === email).length === 0 && _document.authorId !== email);
        }
    };

    const [isAddLoading, setAddLoading] = useState(false);

    const addNewEmail = async () => {
        setAddLoading(true);
        try {
            await axios.post(`${baseURL}/documents/${_document._id}/share`,
                { userEmail: newEmail, accessType: AccessType.VIEW }, {
                headers: {
                    "Authorization": await getToken()
                }
            });
            setAddLoading(false);
        } catch (error) {
            setAddLoading(false);
        }
        setDocument((prev) => {
            prev.allowedUsers.push({
                userEmail: newEmail,
                accessType: AccessType.VIEW
            });
            return { ...prev };
        });
        setNewEmail("");
    };

    const changeUserAccessType = (index: number, accessType: string) => {
        setDocument((prev) => {
            prev.allowedUsers[index].accessType = accessType;
            return { ...prev };
        });
    };

    const deleteUser = (index: number) => {
        setDocument((prev) => {
            prev.allowedUsers.splice(index, 1);
            return { ...prev };
        });
    };

    const updateGeneralAccess = (isPublic: string) => {
        setDocument((prev) => {
            prev.isPublic = isPublic === 'true';
            return { ...prev };
        });
    };

    useEffect(() => {
        setDocument(_document);
    }, [isOpen]);

    //Save
    const [isSaveEnabled, setSaveEnabled] = useState(false);
    const [isSaveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        setSaveEnabled(document !== _document);
    }, [document, _document]);

    const onSave = async () => {
        setSaveLoading(true);
        try {
            await axios.put(`${baseURL}/documents/${document._id}`, { ...document }, {
                headers: {
                    'Authorization': await getToken()
                }
            });
            setSaveLoading(false);
            setConfigChanged(true);
            onClose();
        } catch (error) {
            setSaveLoading(false);
            console.log(error);
        }
    };

    const [isCopied, setCopied] = useState(false);

    const copyDocumentLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose}>
            <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-primary-text-light"
            >
                Share '{document.title}'
            </Dialog.Title>
            <div className="flex flex-col items-start gap-2 my-2">
                <div className="w-full my-2 relative">
                    <input className="w-full px-4 py-3 border rounded text-sm focus:border-neutral-900 focus:outline-none" placeholder="Add people by entering their email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                    {validateEmail(newEmail) && <>
                        {
                            isAddLoading ? <div className="flex items-center gap-2 text-primary-text-dark px-4 py-1.5 text-sm rounded-full bg-primary-light absolute top-1/2 transform -translate-y-1/2 right-1.5" onClick={addNewEmail}>
                                <Spinner className="w-[14px] h-[14px]" />
                                <p>Adding</p>
                            </div> : <button className="flex items-center gap-1 text-primary-text-dark px-4 py-1.5 text-sm rounded-full bg-primary-light absolute top-1/2 transform -translate-y-1/2 right-1.5" onClick={addNewEmail}>
                                <p>Add</p>
                            </button>
                        }
                    </>}
                </div>
                <div className="w-full">
                    <h1 className="font-medium">People with access</h1>
                    <div className="my-2 flex flex-col items-start gap-3 w-full">
                        {
                            document.allowedUsers.length > 0 ? <>
                                {
                                    document.allowedUsers.map((allowedUser, index) => <div className="flex items-center justify-between w-full" key={index}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-[44px] h-[44px] rounded-full bg-neutral-400 flex items-center justify-center text-white capitalize">{allowedUser.userEmail[0]}</div>
                                            <p>{allowedUser.userEmail}</p>
                                        </div>
                                        <div>
                                            <>
                                                <select className="focus:border-none focus:outline-none" value={allowedUser.accessType} onChange={(e) => changeUserAccessType(index, e.target.value)}>
                                                    <option value={AccessType.OWNER}>Owner</option>
                                                    <option value={AccessType.VIEW}>View</option>
                                                    <option value={AccessType.EDIT}>Edit</option>
                                                </select>
                                                <button className="text-secondary-text-light p-2 rounded-full hover:bg-red-100 hover:text-red-500 ml-2" onClick={() => deleteUser(index)}>
                                                    <FiTrash />
                                                </button>
                                            </>
                                        </div>
                                    </div>)
                                }</> : <>
                                <div className="flex flex-col items-center justify-center gap-2 w-full my-5">
                                    <FiUserPlus className="w-8 h-8" />
                                    <p className="text-gray-500">Only you have access to this document</p>
                                </div>
                            </>
                        }
                    </div>
                </div>
                <div className="w-full">
                    <div className="flex items-center justify-between">
                        <h1 className="font-medium">General access</h1>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                        {!document.isPublic ? <div className="bg-gray-200 p-3 rounded-full">
                            <FiLock className="w-5 h-5" />
                        </div> : <div className="bg-green-700 bg-opacity-20 text-green-600 p-3 rounded-full">
                            <FiGlobe className="w-5 h-5" />
                        </div>}
                        <div>
                            <select className="px-1.5 focus:outline-none" value={document.isPublic.toString()} onChange={(e) => updateGeneralAccess(e.target.value)}>
                                <option value="false">Restricted</option>
                                <option value="true">Anyone with the link</option>
                            </select>
                            <p className="text-xs px-2 ml-[1px]">{document.isPublic ? "Only people with access can open with the link" : "Anyone on the Internet with the link can view"}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between w-full">
                    <button className="flex items-center gap-2 text-sm border px-4 py-2 rounded-full hover:bg-neutral-900 hover:text-white duration-150 transition-colors" onClick={copyDocumentLink} disabled={isCopied}>
                        {
                            isCopied ? <>
                                <FiCheckCircle className="w-4 h-4 text-green-500" />
                                <p>Copied document link</p>
                            </> : <>
                                <FiCopy className="w-4 h-4" />
                                <p>Copy document link</p>
                            </>
                        }
                    </button>
                    <button
                        className="px-4 py-2 text-white text-sm rounded-full disabled:bg-opacity-40 bg-neutral-800 hover:bg-neutral-900 focus:outline-none flex items-center gap-3"
                        onClick={isSaveEnabled ? onSave : onClose}
                    >
                        {isSaveLoading && <Spinner className="w-4 h-4" />}
                        {(isSaveEnabled && isSaveLoading) ? "Saving" : (isSaveEnabled && !isSaveLoading) ? "Save" : "Done"}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};
export default ShareModal;