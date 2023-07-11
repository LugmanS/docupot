import { useAuth } from "@clerk/clerk-react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useState } from "react";
import { baseURL } from "../../utils/config";
import { Document } from "../../utils/types";
import ModalWrapper from "../ModalWrapper";
import Spinner from "../Spinner";

const RenameModal = ({ isOpen, onClose, document, setConfigChanged }: { isOpen: boolean, onClose: () => void; document: Document; setConfigChanged: () => void; }) => {

    const { getToken } = useAuth();

    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState(document.title);

    const renameDocument = async () => {
        setLoading(true);
        try {
            await axios.put(`${baseURL}/documents/${document._id}`, { ...document, title: name }, {
                headers: {
                    'Authorization': await getToken()
                }
            });
            setLoading(false);
            setConfigChanged(true);
            onClose();
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose}>
            <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-primary-text-light"
            >
                Rename document
            </Dialog.Title>
            <div className="my-3">
                <p className="text-gray-500">Please enter a new name for the item:</p>
                <input type="text" minLength={5} maxLength={40} value={name} onChange={(e) => setName(e.target.value)} className="border w-full rounded py-2 px-4 text-sm mt-2 focus:outline-neutral-800 " />
            </div>
            <div className="flex items-center gap-2 w-full justify-end mt-4">
                <button className="py-2 px-4 text-sm rounded-full  font-medium border hover:text-white hover:bg-neutral-900 duration-200 transition-colors" onClick={onClose}>
                    Cancel
                </button>
                <button className="py-2 px-4 text-sm rounded-full bg-neutral-800 text-white font-medium disabled:bg-neutral-400 hover:bg-neutral-950 duration-200 transition-colors flex items-center gap-2" onClick={renameDocument} disabled={name === document.title}>
                    {
                        isLoading ? <>
                            <Spinner className="w-4 h-4" />
                            <p>Saving</p>
                        </> : "Save"
                    }
                </button>
            </div>
        </ModalWrapper>
    );
};
export default RenameModal;