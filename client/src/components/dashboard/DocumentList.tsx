import { useNavigate } from "react-router-dom";
import { FiPlus, FiUsers } from "react-icons/fi";
import { useAuth } from "@clerk/clerk-react";
import { baseURL } from "../../utils/config";
import { useEffect, useState } from "react";
import { Document } from "../../utils/types";
import axios from "axios";

const DocumentList = () => {

    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [documents, setDocuments] = useState<Document[]>([]);

    const createNewDocument = async () => {
        try {
            await axios.post(`${baseURL}/documents`, { title: 'Untitled document' },
                {
                    headers: {
                        'Authorization': await getToken()
                    }
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    const getAllUserDocuments = async () => {
        try {
            const response = await axios.get(`${baseURL}/documents`, {
                headers: {
                    'Authorization': await getToken()
                }
            });
            const data: Document[] = response.data;
            setDocuments(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllUserDocuments();
    }, []);

    const onSelectDocument = (id: string) => {
        navigate(`/document/${id}`);
    };

    return (
        <div className="flex items-center flex-wrap gap-6">
            <div className="w-48 h-72 border flex items-center justify-center" onClick={() => createNewDocument}>
                <FiPlus className="w-7 h-7" />
            </div>
            {documents.map((doc) =>
                <div key={doc._id} className="border rounded w-48 h-72 flex flex-col justify-end cursor-pointer" onClick={() => onSelectDocument(doc._id)}>
                    <div className="bg-white p-4 rounded-b border-t">
                        <h1 className="text-primary-text-light font-medium">{doc.title}</h1>
                        <div className="mt-1 flex items-center gap-2 text-sm">
                            <FiUsers className="text-secondary-text-light w-5 h-5" />
                            <p className="text-secondary-text-light">Opened Jul 4</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default DocumentList;