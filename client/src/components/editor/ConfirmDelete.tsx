import { useAuth } from "@clerk/clerk-react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../utils/config";
import { Document } from "../../utils/types";
import ModalWrapper from "../ModalWrapper";
import Spinner from "../Spinner";

const ConfirmDelete = ({ isOpen, onClose, document }: { isOpen: boolean, onClose: () => void; document: Document; }) => {

    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [isDeleteLoading, setDeleteLoading] = useState(false);

    const deleteDocument = async () => {
        setDeleteLoading(true);
        try {
            await axios.delete(`${baseURL}/documents/${document._id}`, {
                headers: {
                    'Authorization': await getToken()
                }
            });
            setDeleteLoading(false);
            navigate("/dashboard");
            onClose();
        } catch (error) {
            setDeleteLoading(false);
            onClose();
        }
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose}>
            <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-primary-text-light"
            >
                Confirm delete '{document.title}'
            </Dialog.Title>
            <div className="my-3">
                <p className="text-gray-500">Are you sure about deleting this file. This action can't be reverted</p>
            </div>
            <div className="flex items-center gap-2 w-full justify-end mt-4">
                <button className="py-2 px-4 text-sm rounded-full  font-medium border hover:text-white hover:bg-neutral-900 duration-200 transition-colors" onClick={onClose}>
                    Cancel
                </button>
                <button className="py-2 px-4 text-sm rounded-full bg-red-100 text-red-500 font-medium hover:bg-red-200 duration-200 transition-colors flex items-center gap-2" onClick={deleteDocument}>
                    {
                        isDeleteLoading ? <>
                            <Spinner className="w-4 h-4" />
                            <p>Deleting</p>
                        </> : "Confirm delete"
                    }
                </button>
            </div>
        </ModalWrapper>
    );
};
export default ConfirmDelete;