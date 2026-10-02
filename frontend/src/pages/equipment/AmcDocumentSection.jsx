import {
    useEffect,
    useRef,
    useState
} from "react";


import {
    Download,
    Eye,
    FileCheck2,
    FileText,
    Trash2,
    Upload,
    X
} from "lucide-react";


import {
    deleteAmcDocument,
    downloadAmcDocument,
    getAmcDocuments,
    uploadAmcDocument,
    viewAmcDocument
} from "../../services/amcDocumentService";


/*
 * ============================================================
 * CONSTANTS
 * ============================================================
 */

const DOCUMENT_TYPES = [

    {
        value: "AMC_CERTIFICATE",
        label: "AMC Certificate"
    },

    {
        value: "AMC_AGREEMENT",
        label: "AMC Agreement"
    },

    {
        value: "AMC_RENEWAL",
        label: "AMC Renewal"
    },

    {
        value: "AMC_INVOICE",
        label: "AMC Invoice"
    },

    {
        value: "OTHER",
        label: "Other"
    }

];


const MAX_FILE_SIZE =
    10 * 1024 * 1024;


const ALLOWED_FILE_TYPES = [

    "application/pdf",

    "application/msword",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "application/vnd.ms-excel",

    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    "image/jpeg",

    "image/png"

];


/*
 * ============================================================
 * COMPONENT
 * ============================================================
 */

function AmcDocumentSection({
    equipment
}) {

    const equipmentId =
        equipment?.id;


    /*
     * ========================================================
     * STATE
     * ========================================================
     */

    const [documents, setDocuments] =
        useState([]);


    const [loading, setLoading] =
        useState(true);


    const [uploading, setUploading] =
        useState(false);


    const [deletingId, setDeletingId] =
        useState(null);


    const [viewingId, setViewingId] =
        useState(null);


    const [downloadingId, setDownloadingId] =
        useState(null);


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState("");


    const [selectedFile, setSelectedFile] =
        useState(null);


    const [documentType, setDocumentType] =
        useState(
            "AMC_CERTIFICATE"
        );


    const [showUploadForm, setShowUploadForm] =
        useState(false);


    const fileInputRef =
        useRef(null);


    /*
     * ========================================================
     * LOAD DOCUMENTS
     * ========================================================
     */

    const loadDocuments = async () => {

        if (!equipmentId) {

            setDocuments([]);

            setLoading(false);

            return;

        }


        try {

            setLoading(true);

            setError("");


            const result =
                await getAmcDocuments(
                    equipmentId
                );


            const data =
                result?.data ??
                result;


            setDocuments(
    Array.isArray(data)
        ? data.filter(
            (document) =>
                String(
                    document?.documentType || ""
                ).toUpperCase() !== "SOP"
          )
        : []
);


        } catch (err) {

            console.error(
                "LOAD AMC DOCUMENTS ERROR:",
                err
            );


            setError(

                err?.response?.data?.message ||

                err?.response?.data?.error ||

                "Unable to load AMC documents."

            );


        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadDocuments();

    }, [equipmentId]);


    /*
     * ========================================================
     * CLEAR MESSAGES
     * ========================================================
     */

    const clearMessages = () => {

        setError("");

        setSuccess("");

    };


    /*
     * ========================================================
     * FILE SELECT
     * ========================================================
     */

    const handleFileChange = (
        event
    ) => {

        clearMessages();


        const file =
            event.target.files?.[0];


        if (!file) {

            setSelectedFile(
                null
            );

            return;

        }


        /*
         * FILE TYPE
         */

        if (
            !ALLOWED_FILE_TYPES.includes(
                file.type
            )
        ) {

            setError(
                "Unsupported file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, JPG and PNG."
            );


            event.target.value =
                "";


            setSelectedFile(
                null
            );


            return;

        }


        /*
         * FILE SIZE
         */

        if (
            file.size >
            MAX_FILE_SIZE
        ) {

            setError(
                "File size must not exceed 10 MB."
            );


            event.target.value =
                "";


            setSelectedFile(
                null
            );


            return;

        }


        setSelectedFile(
            file
        );

    };


    /*
     * ========================================================
     * REMOVE SELECTED FILE
     * ========================================================
     */

    const removeSelectedFile = () => {

        setSelectedFile(
            null
        );


        if (
            fileInputRef.current
        ) {

            fileInputRef.current.value =
                "";

        }

    };


    /*
     * ========================================================
     * UPLOAD
     * ========================================================
     */

    const handleUpload = async (
        event
    ) => {

        event.preventDefault();


        if (!equipmentId) {

            setError(
                "Equipment ID is missing."
            );

            return;

        }


        if (!selectedFile) {

            setError(
                "Please select an AMC document."
            );

            return;

        }


        if (!documentType) {

            setError(
                "Please select a document type."
            );

            return;

        }


        try {

            setUploading(true);

            clearMessages();


            await uploadAmcDocument(

                equipmentId,

                selectedFile,

                documentType

            );


            setSuccess(
                "AMC document uploaded successfully."
            );


            setSelectedFile(
                null
            );


            setDocumentType(
                "AMC_CERTIFICATE"
            );


            if (
                fileInputRef.current
            ) {

                fileInputRef.current.value =
                    "";

            }


            setShowUploadForm(
                false
            );


            await loadDocuments();


        } catch (err) {

            console.error(
                "UPLOAD AMC DOCUMENT ERROR:",
                err
            );


            setError(

                err?.response?.data?.message ||

                err?.response?.data?.error ||

                err?.message ||

                "Unable to upload AMC document."

            );


        } finally {

            setUploading(false);

        }

    };


    /*
     * ========================================================
     * DELETE
     * ========================================================
     */

    const handleDelete = async (
        documentRecord
    ) => {

        const documentId =
            documentRecord?.id ??
            documentRecord?.documentId;


        if (!documentId) {

            setError(
                "Document ID is missing."
            );

            return;

        }


        const confirmed =
            window.confirm(
                `Delete "${getDocumentName(
                    documentRecord
                )}"?`
            );


        if (!confirmed) {

            return;

        }


        try {

            setDeletingId(
                documentId
            );

            clearMessages();


            await deleteAmcDocument(

                equipmentId,

                documentId

            );


            setSuccess(
                "AMC document deleted successfully."
            );


            await loadDocuments();


        } catch (err) {

            console.error(
                "DELETE AMC DOCUMENT ERROR:",
                err
            );


            setError(

                err?.response?.data?.message ||

                err?.response?.data?.error ||

                "Unable to delete AMC document."

            );


        } finally {

            setDeletingId(
                null
            );

        }

    };


    /*
     * ========================================================
     * VIEW
     * ========================================================
     *
     * IMPORTANT:
     *
     * DO NOT use:
     *
     * window.open(getAmcDocumentUrl(...))
     *
     * because the endpoint requires JWT authentication.
     *
     * viewAmcDocument() uses Axios + JWT + Blob.
     * ========================================================
     */

    const handleView = async (
        documentRecord
    ) => {

        const documentId =
            documentRecord?.id ??
            documentRecord?.documentId;


        if (!documentId) {

            setError(
                "Document ID is missing."
            );

            return;

        }


        try {

            clearMessages();


            setViewingId(
                documentId
            );


            await viewAmcDocument(

                equipmentId,

                documentRecord

            );


        } catch (err) {

            console.error(
                "VIEW AMC DOCUMENT ERROR:",
                err
            );


            setError(

                err?.response?.data?.message ||

                err?.response?.data?.error ||

                err?.message ||

                "Unable to view AMC document."

            );


        } finally {

            setViewingId(
                null
            );

        }

    };


    /*
     * ========================================================
     * DOWNLOAD
     * ========================================================
     */

    const handleDownload = async (
        documentRecord
    ) => {

        const documentId =
            documentRecord?.id ??
            documentRecord?.documentId;


        if (!documentId) {

            setError(
                "Document ID is missing."
            );

            return;

        }


        try {

            clearMessages();


            setDownloadingId(
                documentId
            );


            await downloadAmcDocument(

                equipmentId,

                documentRecord

            );


        } catch (err) {

            console.error(
                "DOWNLOAD AMC DOCUMENT ERROR:",
                err
            );


            setError(

                err?.response?.data?.message ||

                err?.response?.data?.error ||

                err?.message ||

                "Unable to download AMC document."

            );


        } finally {

            setDownloadingId(
                null
            );

        }

    };


    /*
     * ========================================================
     * HELPERS
     * ========================================================
     */

    const getDocumentName = (
        documentRecord
    ) => {

        return (

            documentRecord?.documentName ||

            documentRecord?.originalFileName ||

            documentRecord?.fileName ||

            "AMC Document"

        );

    };


    const getDocumentTypeLabel = (
        type
    ) => {

        const found =
            DOCUMENT_TYPES.find(
                (item) =>
                    item.value ===
                    type
            );


        return (

            found?.label ||

            type ||

            "Other"

        );

    };


    const formatFileSize = (
        bytes
    ) => {

        if (

            bytes === null ||

            bytes === undefined ||

            bytes === ""

        ) {

            return "—";

        }


        const size =
            Number(bytes);


        if (
            Number.isNaN(size)
        ) {

            return "—";

        }


        if (
            size < 1024
        ) {

            return `${size} B`;

        }


        if (
            size <
            1024 * 1024
        ) {

            return `${(
                size / 1024
            ).toFixed(1)} KB`;

        }


        return `${(
            size /
            1024 /
            1024
        ).toFixed(1)} MB`;

    };


    const formatDate = (
        value
    ) => {

        if (!value) {

            return "—";

        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return value;

        }


        return date.toLocaleDateString(

            "en-IN",

            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }

        );

    };


    /*
     * ========================================================
     * UI
     * ========================================================
     */

    return (

        <section
            className="
                mt-6
                rounded-2xl
                border
                border-slate-800
                bg-[#101729]
                p-4
                sm:p-5
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-4
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-500/10
                            text-blue-400
                        "
                    >

                        <FileCheck2
                            size={20}
                        />

                    </div>


                    <div>

                        <h3
                            className="
                                text-base
                                font-bold
                                text-white
                            "
                        >
                            AMC Softcopy
                        </h3>


                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-slate-500
                            "
                        >
                            Supplier-provided AMC
                            certificates and documents
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    onClick={() => {

                        clearMessages();

                        setShowUploadForm(
                            true
                        );

                    }}
                    disabled={
                        uploading
                    }
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        bg-blue-600
                        px-4
                        py-2.5
                        text-xs
                        font-semibold
                        text-white
                        transition
                        hover:bg-blue-500
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    <Upload
                        size={16}
                    />

                    Upload AMC Document

                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div
                    className="
                        mt-4
                        rounded-lg
                        border
                        border-red-500/30
                        bg-red-500/10
                        px-3
                        py-2.5
                        text-xs
                        text-red-300
                    "
                >

                    {error}

                </div>

            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <div
                    className="
                        mt-4
                        rounded-lg
                        border
                        border-emerald-500/30
                        bg-emerald-500/10
                        px-3
                        py-2.5
                        text-xs
                        text-emerald-300
                    "
                >

                    {success}

                </div>

            )}


            {/* =================================================
                UPLOAD FORM
            ================================================= */}

            {showUploadForm && (

                <form
                    onSubmit={
                        handleUpload
                    }
                    className="
                        mt-4
                        rounded-xl
                        border
                        border-slate-800
                        bg-[#080d1b]
                        p-4
                    "
                >

                    <div
                        className="
                            mb-4
                            flex
                            items-start
                            justify-between
                            gap-4
                        "
                    >

                        <div>

                            <h4
                                className="
                                    font-semibold
                                    text-white
                                "
                            >
                                Upload AMC Softcopy
                            </h4>


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Upload the document supplied
                                by the equipment vendor.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() => {

                                if (!uploading) {

                                    setShowUploadForm(
                                        false
                                    );

                                    removeSelectedFile();

                                }

                            }}
                            disabled={
                                uploading
                            }
                            className="
                                rounded-lg
                                p-1
                                text-slate-500
                                transition
                                hover:bg-slate-800
                                hover:text-white
                                disabled:opacity-40
                            "
                        >

                            <X
                                size={17}
                            />

                        </button>

                    </div>


                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            md:grid-cols-2
                        "
                    >

                        {/* DOCUMENT TYPE */}

                        <label>

                            <span
                                className="
                                    mb-2
                                    block
                                    text-xs
                                    font-semibold
                                    text-slate-400
                                "
                            >
                                Document Type
                            </span>


                            <select
                                value={
                                    documentType
                                }
                                onChange={(
                                    event
                                ) => {

                                    setDocumentType(
                                        event.target.value
                                    );

                                    clearMessages();

                                }}
                                disabled={
                                    uploading
                                }
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-700
                                    bg-[#101729]
                                    px-3.5
                                    py-2.5
                                    text-sm
                                    text-white
                                    outline-none
                                    focus:border-blue-500
                                    disabled:opacity-50
                                "
                            >

                                {DOCUMENT_TYPES.map(
                                    (type) => (

                                        <option
                                            key={
                                                type.value
                                            }
                                            value={
                                                type.value
                                            }
                                        >
                                            {
                                                type.label
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </label>


                        {/* FILE */}

                        <div>

                            <span
                                className="
                                    mb-2
                                    block
                                    text-xs
                                    font-semibold
                                    text-slate-400
                                "
                            >
                                File
                            </span>


                            <input
                                ref={
                                    fileInputRef
                                }
                                type="file"
                                accept="
                                    .pdf,
                                    .doc,
                                    .docx,
                                    .xls,
                                    .xlsx,
                                    .jpg,
                                    .jpeg,
                                    .png
                                "
                                onChange={
                                    handleFileChange
                                }
                                disabled={
                                    uploading
                                }
                                className="
                                    block
                                    w-full
                                    cursor-pointer
                                    rounded-lg
                                    border
                                    border-slate-700
                                    bg-[#101729]
                                    text-xs
                                    text-slate-400
                                    file:mr-3
                                    file:cursor-pointer
                                    file:border-0
                                    file:bg-blue-600
                                    file:px-4
                                    file:py-2.5
                                    file:text-xs
                                    file:font-semibold
                                    file:text-white
                                    hover:file:bg-blue-500
                                "
                            />


                            <p
                                className="
                                    mt-2
                                    text-[10px]
                                    text-slate-600
                                "
                            >
                                PDF, DOC, DOCX, XLS, XLSX,
                                JPG or PNG · Maximum 10 MB
                            </p>

                        </div>

                    </div>


                    {/* SELECTED FILE */}

                    {selectedFile && (

                        <div
                            className="
                                mt-4
                                flex
                                items-center
                                justify-between
                                gap-3
                                rounded-lg
                                border
                                border-slate-700
                                bg-[#101729]
                                p-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-blue-500/10
                                        text-blue-400
                                    "
                                >

                                    <FileText
                                        size={17}
                                    />

                                </div>


                                <div
                                    className="
                                        min-w-0
                                    "
                                >

                                    <p
                                        className="
                                            truncate
                                            text-xs
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        {
                                            selectedFile.name
                                        }
                                    </p>


                                    <p
                                        className="
                                            mt-0.5
                                            text-[10px]
                                            text-slate-500
                                        "
                                    >
                                        {
                                            formatFileSize(
                                                selectedFile.size
                                            )
                                        }
                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    removeSelectedFile
                                }
                                disabled={
                                    uploading
                                }
                                className="
                                    shrink-0
                                    text-red-400
                                    transition
                                    hover:text-red-300
                                    disabled:opacity-40
                                "
                                title="Remove file"
                            >

                                <X
                                    size={16}
                                />

                            </button>

                        </div>

                    )}


                    {/* FORM ACTIONS */}

                    <div
                        className="
                            mt-5
                            flex
                            justify-end
                            gap-3
                        "
                    >

                        <button
                            type="button"
                            onClick={() => {

                                if (!uploading) {

                                    setShowUploadForm(
                                        false
                                    );

                                    removeSelectedFile();

                                }

                            }}
                            disabled={
                                uploading
                            }
                            className="
                                rounded-lg
                                border
                                border-slate-700
                                px-4
                                py-2.5
                                text-xs
                                text-slate-300
                                transition
                                hover:bg-slate-800
                                disabled:opacity-40
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                uploading ||
                                !selectedFile
                            }
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-lg
                                bg-blue-600
                                px-5
                                py-2.5
                                text-xs
                                font-semibold
                                text-white
                                transition
                                hover:bg-blue-500
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            <Upload
                                size={16}
                            />


                            {uploading
                                ? "Uploading..."
                                : "Upload Document"}

                        </button>

                    </div>

                </form>

            )}


            {/* =================================================
                DOCUMENT LIST
            ================================================= */}

            <div
                className="
                    mt-5
                "
            >

                {loading ? (

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-800
                            bg-[#080d1b]
                            p-8
                            text-center
                            text-sm
                            text-slate-500
                        "
                    >

                        Loading AMC documents...

                    </div>

                ) : documents.length === 0 ? (

                    <div
                        className="
                            rounded-xl
                            border
                            border-dashed
                            border-slate-700
                            bg-[#080d1b]
                            p-8
                            text-center
                        "
                    >

                        <FileText
                            size={28}
                            className="
                                mx-auto
                                text-slate-600
                            "
                        />


                        <p
                            className="
                                mt-3
                                text-sm
                                font-medium
                                text-slate-400
                            "
                        >
                            No AMC documents uploaded
                        </p>


                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-600
                            "
                        >
                            Upload the supplier-provided
                            AMC softcopy here.
                        </p>

                    </div>

                ) : (

                    <div
                        className="
                            overflow-hidden
                            rounded-xl
                            border
                            border-slate-800
                        "
                    >

                        {/* TABLE HEADER */}

                        <div
                            className="
                                hidden
                                grid-cols-[minmax(0,1fr)_180px_120px_150px]
                                gap-4
                                border-b
                                border-slate-800
                                bg-[#0b1120]
                                px-4
                                py-3
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                                md:grid
                            "
                        >

                            <div>
                                Document
                            </div>


                            <div>
                                Type
                            </div>


                            <div>
                                Size
                            </div>


                            <div>
                                Actions
                            </div>

                        </div>


                        {/* DOCUMENT ROWS */}

                        <div>

                            {documents.map(
                                (
                                    documentRecord
                                ) => {

                                    const documentId =
                                        documentRecord?.id ??
                                        documentRecord?.documentId;


                                    return (

                                        <div
                                            key={
                                                documentId
                                            }
                                            className="
                                                grid
                                                grid-cols-1
                                                gap-3
                                                border-b
                                                border-slate-800
                                                p-4
                                                last:border-b-0
                                                md:grid-cols-[minmax(0,1fr)_180px_120px_150px]
                                                md:items-center
                                                md:gap-4
                                            "
                                        >

                                            {/* DOCUMENT */}

                                            <div
                                                className="
                                                    flex
                                                    min-w-0
                                                    items-center
                                                    gap-3
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-blue-500/10
                                                        text-blue-400
                                                    "
                                                >

                                                    <FileText
                                                        size={17}
                                                    />

                                                </div>


                                                <div
                                                    className="
                                                        min-w-0
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            truncate
                                                            text-sm
                                                            font-semibold
                                                            text-slate-200
                                                        "
                                                        title={
                                                            getDocumentName(
                                                                documentRecord
                                                            )
                                                        }
                                                    >
                                                        {
                                                            getDocumentName(
                                                                documentRecord
                                                            )
                                                        }
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-0.5
                                                            text-[10px]
                                                            text-slate-500
                                                        "
                                                    >
                                                        Uploaded{" "}
                                                        {
                                                            formatDate(
                                                                documentRecord?.createdAt ??
                                                                documentRecord?.uploadedAt
                                                            )
                                                        }
                                                    </p>

                                                </div>

                                            </div>


                                            {/* TYPE */}

                                            <div>

                                                <span
                                                    className="
                                                        inline-flex
                                                        rounded-full
                                                        bg-blue-500/10
                                                        px-2.5
                                                        py-1
                                                        text-[10px]
                                                        font-semibold
                                                        text-blue-300
                                                    "
                                                >
                                                    {
                                                        getDocumentTypeLabel(
                                                            documentRecord?.documentType
                                                        )
                                                    }
                                                </span>

                                            </div>


                                            {/* SIZE */}

                                            <div
                                                className="
                                                    text-xs
                                                    text-slate-400
                                                "
                                            >

                                                {
                                                    formatFileSize(
                                                        documentRecord?.fileSize
                                                    )
                                                }

                                            </div>


                                            {/* ACTIONS */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                "
                                            >

                                                {/* VIEW */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleView(
                                                            documentRecord
                                                        )
                                                    }
                                                    disabled={
                                                        viewingId ===
                                                            documentId ||
                                                        deletingId ===
                                                            documentId ||
                                                        downloadingId ===
                                                            documentId
                                                    }
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        rounded-lg
                                                        border
                                                        border-slate-700
                                                        px-3
                                                        py-2
                                                        text-xs
                                                        text-slate-300
                                                        transition
                                                        hover:bg-slate-800
                                                        hover:text-white
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-40
                                                    "
                                                    title="View document"
                                                >

                                                    <Eye
                                                        size={14}
                                                    />

                                                    {viewingId ===
                                                    documentId
                                                        ? "Opening..."
                                                        : "View"}

                                                </button>


                                                {/* DOWNLOAD */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDownload(
                                                            documentRecord
                                                        )
                                                    }
                                                    disabled={
                                                        viewingId ===
                                                            documentId ||
                                                        deletingId ===
                                                            documentId ||
                                                        downloadingId ===
                                                            documentId
                                                    }
                                                    className="
                                                        inline-flex
                                                        h-9
                                                        w-9
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        border
                                                        border-emerald-500/30
                                                        bg-emerald-500/10
                                                        text-emerald-400
                                                        transition
                                                        hover:bg-emerald-500/20
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-40
                                                    "
                                                    title="Download"
                                                >

                                                    <Download
                                                        size={15}
                                                    />

                                                </button>


                                                {/* DELETE */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            documentRecord
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        documentId
                                                    }
                                                    className="
                                                        inline-flex
                                                        h-9
                                                        w-9
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        border
                                                        border-red-500/30
                                                        bg-red-500/10
                                                        text-red-300
                                                        transition
                                                        hover:bg-red-500/20
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-40
                                                    "
                                                    title="Delete"
                                                >

                                                    <Trash2
                                                        size={15}
                                                    />

                                                </button>

                                            </div>

                                        </div>

                                    );

                                }

                            )}

                        </div>

                    </div>

                )}

            </div>

        </section>

    );

}


export default AmcDocumentSection;