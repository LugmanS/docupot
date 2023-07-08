import { useNavigate } from "react-router-dom";

const DocsList = () => {
    const navigate = useNavigate();

    const onDocClick = () => {
        navigate("/document/13o49123");
    };

    return (
        <div className="max-w-3xl mx-auto my-4">
            <div className="p-4 border border-gray-400 rounded" onClick={onDocClick}>Untitled document</div>
        </div>
    );
};
export default DocsList;