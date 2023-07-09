import { useAuth, useUser } from "@clerk/clerk-react";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/editor/Navbar";
import TextEditor from "../components/editor/TextEditor";
import { baseURL, socket } from "../utils/config";
import { AccessType, Document } from "../utils/types";
import NotFound from "../assets/notFound.svg";
import Forbidden from "../assets/forbidden.svg";
import { FiArrowRight } from "react-icons/fi";

const Editor = () => {
    const { getToken } = useAuth();
    const { documentId } = useParams();
    const navigate = useNavigate();

    const { user } = useUser();

    console.log(user);

    const [document, setDocument] = useState<Document | null>(null);
    const [documentError, setDocumentError] = useState<number | null>(null);

    const [userAccessType, setUserAccessType] = useState<string | null>(null);

    const getDocumentData = async () => {
        if (!documentId) return;
        try {
            const response = await axios.get<Document>(`${baseURL}/documents/${documentId}`, {
                headers: {
                    'Authorization': await getToken()
                }
            });
            setDocument(response.data);
            if (user && user.emailAddresses) {
                if (response.data.authorId === user.primaryEmailAddress?.emailAddress) {
                    return setUserAccessType(AccessType.OWNER);
                }
                const userPermission = document?.allowedUsers.filter((allowedUser) => allowedUser.userEmail === user.primaryEmailAddress?.emailAddress);
                if (userPermission) {
                    return setUserAccessType(userPermission[0].accessType);
                }
                setUserAccessType(AccessType.VIEW);
            }

        } catch (error: AxiosError | any) {
            if (error.response) {
                if (error.response.status === 404) {
                    return setDocumentError(404);
                }
                if (error.response.status === 403) {
                    return setDocumentError(403);
                }
            }
        }
    };

    const back = () => {
        navigate("/dashboard");
    };

    useEffect(() => {
        documentId && getDocumentData();
    }, []);

    useEffect(() => {
        if (document && document.allowedUsers.length > 0) {
            socket.connect();
        }
        return () => {
            socket.disconnect();
        };
    }, [document]);
    return (
        <>
            {
                documentError ? <>
                    {
                        documentError === 404 && <div className="w-screen h-screen flex flex-col items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                                <img src={NotFound} alt="not found image" />
                                <h1 className="text-xl font-medium">Sorry, the file you have requested does not exist.</h1>
                                <p>Make sure that you have the correct URL and that the file exists.</p>
                                <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-950 rounded-full text-white text-sm flex items-center gap-1" onClick={back}>
                                    Back to dashboard
                                    <FiArrowRight />
                                </button>
                            </div>
                        </div>
                    }
                    {
                        documentError === 403 && <div className="w-screen h-screen flex flex-col items-center justify-center">
                            <div className="flex flex-col items-center justify-center">
                                <img src={Forbidden} alt="forbidden image" />
                                <h1 className="text-xl font-medium">You need access</h1>
                                <p>Request access, or switch to an account with access.</p>
                            </div>
                        </div>
                    }
                </> :
                    (!documentError && document && userAccessType) &&
                    <div className="w-screen h-screen overflow-hidden">
                        <Navbar document={document} accessType={userAccessType} />
                        <TextEditor />
                    </div>
            }
        </>
    );
};
export default Editor;