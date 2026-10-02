import {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import {
    Download,
    Eye,
    FileText,
    Trash2,
    Upload,
    X
} from "lucide-react";

import {
    getAllDepartments
} from "../../services/departmentService";

import {
    deleteSop,
    downloadSop,
    getAllSops,
    uploadSop,
    viewSop
} from "../../services/sopService";


const MAX_FILE_SIZE =
    10 * 1024 * 1024;


const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];


const ALLOWED_EXTENSIONS = [
    "pdf",
    "doc",
    "docx"
];


function SopLibrary() {

    const [
        departments,
        setDepartments
    ] = useState([]);


    const [
        sops,
        setSops
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        departmentsLoading,
        setDepartmentsLoading
    ] = useState(true);


    const [
        uploading,
        setUploading
    ] = useState(false);


    const [
        downloadingId,
        setDownloadingId
    ] = useState(null);


    const [
        deletingId,
        setDeletingId
    ] = useState(null);


    const [
        selectedDepartment,
        setSelectedDepartment
    ] = useState("");


    const [
        selectedFile,
        setSelectedFile
    ] = useState(null);


    const [
        error,
        setError
    ] = useState("");


    const [
        success,
        setSuccess
    ] = useState("");


    const fileInputRef =
        useRef(null);


    /*
     * ============================================================
     * LOAD DEPARTMENTS
     * ============================================================
     */

    const loadDepartments =
        async () => {

            try {

                setDepartmentsLoading(true);

                const result =
                    await getAllDepartments(
                        0,
                        100,
                        "departmentName",
                        "asc",
                        ""
                    );


                const data =
                    result?.content ??
                    result?.data ??
                    result;


                setDepartments(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (err) {

                console.error(
                    "LOAD DEPARTMENTS ERROR:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Unable to load departments."
                );

            } finally {

                setDepartmentsLoading(false);

            }

        };


    /*
     * ============================================================
     * LOAD SOPS
     * ============================================================
     */

    const loadSops =
        async () => {

            try {

                setLoading(true);

                setError("");

                const result =
                    await getAllSops();


                const data =
                    result?.data ??
                    result;


                setSops(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (err) {

                console.error(
                    "LOAD SOPS ERROR:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Unable to load SOP documents."
                );

            } finally {

                setLoading(false);

            }

        };


    /*
     * ============================================================
     * INITIAL LOAD
     * ============================================================
     */

    useEffect(() => {

        loadDepartments();

        loadSops();

    }, []);


    /*
     * ============================================================
     * DEPARTMENT NAME
     * ============================================================
     */

    const getDepartmentName =
        (departmentId) => {

            const department =
                departments.find(
                    (item) =>
                        String(item?.id) ===
                        String(departmentId)
                );


            return (
                department?.departmentName ||
                department?.name ||
                `Department ${departmentId}`
            );

        };


    /*
     * ============================================================
     * GROUP SOPS BY DEPARTMENT
     * ============================================================
     */

    const groupedSops =
        useMemo(() => {

            const groups = {};


            sops.forEach((sop) => {

                const departmentId =
                    sop?.departmentId;


                if (
                    departmentId === null ||
                    departmentId === undefined
                ) {

                    return;

                }


                const key =
                    String(departmentId);


                if (!groups[key]) {

                    groups[key] = [];

                }


                groups[key].push(sop);

            });


            return Object.entries(groups)

                .map(
                    ([
                        departmentId,
                        documents
                    ]) => ({

                        departmentId,

                        departmentName:
                            getDepartmentName(
                                departmentId
                            ),

                        documents

                    })
                )

                .sort(
                    (a, b) =>
                        a.departmentName.localeCompare(
                            b.departmentName
                        )
                );

        }, [
            sops,
            departments
        ]);


    /*
     * ============================================================
     * FILE VALIDATION
     * ============================================================
     */

    const validateFile =
        (file) => {

            if (!file) {

                return "Please select an SOP file.";

            }


            if (
                file.size >
                MAX_FILE_SIZE
            ) {

                return (
                    "File size must not exceed 10 MB."
                );

            }


            const extension =
                file.name
                    ?.split(".")
                    .pop()
                    ?.toLowerCase();


            const validExtension =
                ALLOWED_EXTENSIONS.includes(
                    extension
                );


            const validMimeType =
                ALLOWED_FILE_TYPES.includes(
                    file.type
                );


            if (
                !validExtension &&
                !validMimeType
            ) {

                return (
                    "Unsupported file type. Allowed: PDF, DOC and DOCX."
                );

            }


            return "";

        };


    /*
     * ============================================================
     * FILE SELECT
     * ============================================================
     */

    const handleFileChange =
        (event) => {

            setError("");

            setSuccess("");


            const file =
                event.target.files?.[0];


            const validation =
                validateFile(file);


            if (validation) {

                setError(
                    validation
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
     * ============================================================
     * REMOVE SELECTED FILE
     * ============================================================
     */

    const removeSelectedFile =
        () => {

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
     * ============================================================
     * UPLOAD SOP
     * ============================================================
     */

    const handleUpload =
        async (event) => {

            event.preventDefault();


            setError("");

            setSuccess("");


            if (
                !selectedDepartment
            ) {

                setError(
                    "Please select a department."
                );

                return;

            }


            if (!selectedFile) {

                setError(
                    "Please select an SOP file."
                );

                return;

            }


            try {

                setUploading(true);


                await uploadSop(
                    selectedDepartment,
                    selectedFile
                );


                setSuccess(
                    "SOP uploaded successfully."
                );


                setSelectedFile(
                    null
                );


                setSelectedDepartment(
                    ""
                );


                if (
                    fileInputRef.current
                ) {

                    fileInputRef.current.value =
                        "";

                }


                await loadSops();

            } catch (err) {

                console.error(
                    "UPLOAD SOP ERROR:",
                    err
                );


                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Unable to upload SOP."
                );

            } finally {

                setUploading(false);

            }

        };


    /*
     * ============================================================
     * VIEW SOP
     * ============================================================
     */

    const handleView =
        async (sop) => {

            const sopId =
                sop?.id ??
                sop?.documentId;


            if (!sopId) {

                setError(
                    "SOP document ID is missing."
                );

                return;

            }


            try {

                setError("");

                setSuccess("");


                /*
                 * viewSop() expects the complete
                 * SOP object, not only the ID.
                 */

                await viewSop(
                    sop
                );

            } catch (err) {

                console.error(
                    "VIEW SOP ERROR:",
                    err
                );


                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Unable to view SOP."
                );

            }

        };


    /*
     * ============================================================
     * DOWNLOAD SOP
     * ============================================================
     */

    const handleDownload =
        async (sop) => {

            const sopId =
                sop?.id ??
                sop?.documentId;


            if (!sopId) {

                setError(
                    "SOP document ID is missing."
                );

                return;

            }


            try {

                setError("");

                setSuccess("");


                setDownloadingId(
                    sopId
                );


                /*
                 * downloadSop() expects the complete
                 * SOP object, not the ID.
                 */

                await downloadSop(
                    sop
                );


                setSuccess(
                    "SOP download started."
                );

            } catch (err) {

                console.error(
                    "DOWNLOAD SOP ERROR:",
                    err
                );


                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Unable to download SOP."
                );

            } finally {

                setDownloadingId(
                    null
                );

            }

        };


    /*
     * ============================================================
     * DELETE SOP
     * ============================================================
     */

    const handleDelete =
        async (sop) => {

            const sopId =
                sop?.id ??
                sop?.documentId;


            if (!sopId) {

                setError(
                    "SOP document ID is missing."
                );

                return;

            }


            const fileName =
                sop?.originalFileName ||
                sop?.fileName ||
                "this SOP";


            const confirmed =
                window.confirm(
                    `Are you sure you want to delete "${fileName}"?`
                );


            if (!confirmed) {

                return;

            }


            try {

                setError("");

                setSuccess("");


                setDeletingId(
                    sopId
                );


                await deleteSop(
                    sopId
                );


                setSuccess(
                    "SOP deleted successfully."
                );


                await loadSops();

            } catch (err) {

                console.error(
                    "DELETE SOP ERROR:",
                    err
                );


                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Unable to delete SOP."
                );

            } finally {

                setDeletingId(
                    null
                );

            }

        };


    /*
     * ============================================================
     * FILE SIZE
     * ============================================================
     */

    const formatFileSize =
        (bytes) => {

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
            ).toFixed(2)} MB`;

        };


    /*
     * ============================================================
     * CONTENT TYPE
     * ============================================================
     */

    const formatContentType =
        (contentType) => {

            if (!contentType) {

                return "Document";

            }


            if (
                contentType ===
                "application/pdf"
            ) {

                return "PDF";

            }


            if (
                contentType ===
                "application/msword"
            ) {

                return "DOC";

            }


            if (
                contentType ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {

                return "DOCX";

            }


            return contentType;

        };


    /*
     * ============================================================
     * RENDER
     * ============================================================
     */

    return (

        <div
            className="
                min-h-full
                px-6
                py-6
                text-white
            "
        >

            {/* ================================================== */}
            {/* PAGE HEADER */}
            {/* ================================================== */}

            <div
                className="
                    mb-6
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
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-cyan-500/10
                            text-cyan-400
                        "
                    >

                        <FileText
                            size={22}
                        />

                    </div>


                    <div>

                        <h1
                            className="
                                text-2xl
                                font-bold
                                text-white
                            "
                        >
                            SOP Library
                        </h1>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-400
                            "
                        >
                            Standard Operating Procedures
                            grouped by department.
                        </p>

                    </div>

                </div>

            </div>


            {/* ================================================== */}
            {/* MESSAGES */}
            {/* ================================================== */}

            {error && (

                <div
                    className="
                        mb-5
                        rounded-lg
                        border
                        border-red-500/30
                        bg-red-500/10
                        px-4
                        py-3
                        text-sm
                        text-red-300
                    "
                >

                    {error}

                </div>

            )}


            {success && (

                <div
                    className="
                        mb-5
                        rounded-lg
                        border
                        border-emerald-500/30
                        bg-emerald-500/10
                        px-4
                        py-3
                        text-sm
                        text-emerald-300
                    "
                >

                    {success}

                </div>

            )}


            {/* ================================================== */}
            {/* UPLOAD SOP */}
            {/* ================================================== */}

            <form
                onSubmit={
                    handleUpload
                }
                className="
                    mb-8
                    rounded-xl
                    border
                    border-slate-800
                    bg-[#101729]
                    p-5
                "
            >

                <div
                    className="
                        mb-5
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
                            rounded-lg
                            bg-cyan-500/10
                            text-cyan-400
                        "
                    >

                        <Upload
                            size={20}
                        />

                    </div>


                    <div>

                        <h2
                            className="
                                text-base
                                font-semibold
                                text-white
                            "
                        >
                            Upload SOP
                        </h2>


                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                            "
                        >
                            Upload an SOP and assign it
                            to a department.
                        </p>

                    </div>

                </div>


                <div
                    className="
                        grid
                        grid-cols-1
                        gap-5
                        lg:grid-cols-2
                    "
                >

                    {/* DEPARTMENT */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-semibold
                                text-slate-400
                            "
                        >
                            Department
                        </label>


                        <select
                            value={
                                selectedDepartment
                            }
                            onChange={(event) => {

                                setSelectedDepartment(
                                    event.target.value
                                );

                                setError("");

                                setSuccess("");

                            }}
                            disabled={
                                departmentsLoading ||
                                uploading
                            }
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-700
                                bg-[#080d1b]
                                px-3.5
                                py-3
                                text-sm
                                text-white
                                outline-none
                                focus:border-cyan-500
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            <option
                                value=""
                            >
                                Select Department
                            </option>


                            {departments.map(
                                (department) => (

                                    <option
                                        key={
                                            department.id
                                        }
                                        value={
                                            department.id
                                        }
                                    >
                                        {
                                            department.departmentName ||
                                            department.name
                                        }
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* FILE */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-semibold
                                text-slate-400
                            "
                        >
                            SOP File
                        </label>


                        <input
                            ref={
                                fileInputRef
                            }
                            type="file"
                            accept="
                                application/pdf,
                                application/msword,
                                application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                                .pdf,
                                .doc,
                                .docx
                            "
                            onChange={
                                handleFileChange
                            }
                            disabled={
                                uploading
                            }
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-700
                                bg-[#080d1b]
                                px-3
                                py-2.5
                                text-sm
                                text-slate-300
                                file:mr-3
                                file:rounded-lg
                                file:border-0
                                file:bg-cyan-500
                                file:px-3
                                file:py-2
                                file:text-sm
                                file:font-semibold
                                file:text-slate-950
                                hover:file:bg-cyan-400
                                disabled:opacity-50
                            "
                        />


                        <p
                            className="
                                mt-2
                                text-xs
                                text-slate-500
                            "
                        >
                            PDF, DOC or DOCX.
                            Maximum 10 MB.
                        </p>

                    </div>

                </div>


                {/* SELECTED FILE */}

                {selectedFile && (

                    <div
                        className="
                            mt-5
                            flex
                            items-center
                            justify-between
                            gap-4
                            rounded-lg
                            border
                            border-cyan-500/20
                            bg-cyan-500/5
                            px-4
                            py-3
                        "
                    >

                        <div
                            className="
                                min-w-0
                            "
                        >

                            <p
                                className="
                                    truncate
                                    text-sm
                                    font-medium
                                    text-white
                                "
                            >
                                {
                                    selectedFile.name
                                }
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-xs
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
                                rounded-lg
                                p-2
                                text-slate-400
                                transition
                                hover:bg-slate-800
                                hover:text-white
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            <X
                                size={18}
                            />

                        </button>

                    </div>

                )}


                {/* UPLOAD BUTTON */}

                <div
                    className="
                        mt-5
                        flex
                        justify-end
                    "
                >

                    <button
                        type="submit"
                        disabled={
                            uploading ||
                            !selectedDepartment ||
                            !selectedFile
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            bg-cyan-600
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-cyan-500
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        <Upload
                            size={17}
                        />


                        {uploading
                            ? "Uploading..."
                            : "Upload SOP"}

                    </button>

                </div>

            </form>


            {/* ================================================== */}
            {/* SOP LIBRARY */}
            {/* ================================================== */}

            <div>

                <div
                    className="
                        mb-5
                    "
                >

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-white
                        "
                    >
                        SOP Library
                    </h2>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >
                        SOP documents grouped by
                        department.
                    </p>

                </div>


                {/* LOADING */}

                {loading ? (

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-800
                            bg-[#101729]
                            px-5
                            py-12
                            text-center
                            text-sm
                            text-slate-500
                        "
                    >

                        Loading SOP documents...

                    </div>

                ) : groupedSops.length === 0 ? (

                    /* EMPTY */

                    <div
                        className="
                            rounded-xl
                            border
                            border-dashed
                            border-slate-800
                            bg-[#101729]
                            px-5
                            py-14
                            text-center
                        "
                    >

                        <FileText
                            size={34}
                            className="
                                mx-auto
                                mb-3
                                text-slate-700
                            "
                        />


                        <p
                            className="
                                text-sm
                                font-medium
                                text-slate-400
                            "
                        >
                            No SOP documents uploaded.
                        </p>


                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-600
                            "
                        >
                            Upload an SOP to see it here.
                        </p>

                    </div>

                ) : (

                    /* DEPARTMENT GROUPS */

                    <div
                        className="
                            space-y-5
                        "
                    >

                        {groupedSops.map(
                            (group) => (

                                <div
                                    key={
                                        group.departmentId
                                    }
                                    className="
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-slate-800
                                        bg-[#101729]
                                    "
                                >

                                    {/* DEPARTMENT HEADER */}

                                    <div
                                        className="
                                            border-b
                                            border-slate-800
                                            px-5
                                            py-4
                                        "
                                    >

                                        <h3
                                            className="
                                                text-sm
                                                font-semibold
                                                text-cyan-400
                                            "
                                        >
                                            {
                                                group.departmentName
                                            }
                                        </h3>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-slate-500
                                            "
                                        >
                                            {
                                                group.documents.length
                                            }{" "}
                                            SOP
                                            {
                                                group.documents.length ===
                                                1
                                                    ? ""
                                                    : "s"
                                            }
                                        </p>

                                    </div>


                                    {/* DOCUMENTS */}

                                    <div>

                                        {group.documents.map(
                                            (sop) => {

                                                const sopId =
                                                    sop?.id ??
                                                    sop?.documentId;


                                                const fileName =
                                                    sop?.originalFileName ||
                                                    sop?.fileName ||
                                                    "SOP Document";


                                                const isDownloading =
                                                    downloadingId ===
                                                    sopId;


                                                const isDeleting =
                                                    deletingId ===
                                                    sopId;


                                                return (

                                                    <div
                                                        key={
                                                            sopId
                                                        }
                                                        className="
                                                            flex
                                                            flex-col
                                                            gap-4
                                                            border-b
                                                            border-slate-800
                                                            px-5
                                                            py-4
                                                            last:border-b-0
                                                            md:flex-row
                                                            md:items-center
                                                            md:justify-between
                                                        "
                                                    >

                                                        {/* FILE INFO */}

                                                        <div
                                                            className="
                                                                flex
                                                                min-w-0
                                                                items-center
                                                                gap-4
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    flex
                                                                    h-10
                                                                    w-10
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    bg-red-500/10
                                                                    text-red-400
                                                                "
                                                            >

                                                                <FileText
                                                                    size={20}
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
                                                                        text-white
                                                                    "
                                                                >
                                                                    {
                                                                        fileName
                                                                    }
                                                                </p>


                                                                <p
                                                                    className="
                                                                        mt-1
                                                                        text-xs
                                                                        text-slate-500
                                                                    "
                                                                >

                                                                    {
                                                                        formatFileSize(
                                                                            sop?.fileSize
                                                                        )
                                                                    }

                                                                    {" • "}

                                                                    {
                                                                        formatContentType(
                                                                            sop?.contentType
                                                                        )
                                                                    }

                                                                </p>

                                                            </div>

                                                        </div>


                                                        {/* ACTIONS */}

                                                        <div
                                                            className="
                                                                flex
                                                                shrink-0
                                                                items-center
                                                                gap-2
                                                            "
                                                        >

                                                            {/* VIEW */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleView(
                                                                        sop
                                                                    )
                                                                }
                                                                disabled={
                                                                    isDownloading ||
                                                                    isDeleting
                                                                }
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    gap-2
                                                                    rounded-lg
                                                                    border
                                                                    border-slate-700
                                                                    bg-slate-900/50
                                                                    px-3
                                                                    py-2
                                                                    text-xs
                                                                    font-semibold
                                                                    text-slate-300
                                                                    transition
                                                                    hover:border-slate-600
                                                                    hover:bg-slate-800
                                                                    hover:text-white
                                                                    disabled:cursor-not-allowed
                                                                    disabled:opacity-50
                                                                "
                                                            >

                                                                <Eye
                                                                    size={15}
                                                                />

                                                                View

                                                            </button>


                                                            {/* DOWNLOAD */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDownload(
                                                                        sop
                                                                    )
                                                                }
                                                                disabled={
                                                                    isDownloading ||
                                                                    isDeleting
                                                                }
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    gap-2
                                                                    rounded-lg
                                                                    border
                                                                    border-cyan-500/30
                                                                    bg-cyan-500/10
                                                                    px-3
                                                                    py-2
                                                                    text-xs
                                                                    font-semibold
                                                                    text-cyan-300
                                                                    transition
                                                                    hover:bg-cyan-500/20
                                                                    disabled:cursor-not-allowed
                                                                    disabled:opacity-50
                                                                "
                                                            >

                                                                <Download
                                                                    size={15}
                                                                />

                                                                {
                                                                    isDownloading
                                                                        ? "Downloading..."
                                                                        : "Download"
                                                                }

                                                            </button>


                                                            {/* DELETE */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        sop
                                                                    )
                                                                }
                                                                disabled={
                                                                    isDeleting ||
                                                                    isDownloading
                                                                }
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    gap-2
                                                                    rounded-lg
                                                                    border
                                                                    border-red-500/30
                                                                    bg-red-500/10
                                                                    px-3
                                                                    py-2
                                                                    text-xs
                                                                    font-semibold
                                                                    text-red-300
                                                                    transition
                                                                    hover:border-red-500/50
                                                                    hover:bg-red-500/20
                                                                    disabled:cursor-not-allowed
                                                                    disabled:opacity-50
                                                                "
                                                            >

                                                                <Trash2
                                                                    size={15}
                                                                />

                                                                {
                                                                    isDeleting
                                                                        ? "Deleting..."
                                                                        : "Delete"
                                                                }

                                                            </button>

                                                        </div>

                                                    </div>

                                                );

                                            }
                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    );

}


export default SopLibrary;