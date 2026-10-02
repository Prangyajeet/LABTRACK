import {
    useEffect,
    useState
} from "react";

import {
    getBreakageEvidence,
    getBreakageEvidenceUrl,
    uploadBreakageEvidence
} from "../../services/breakageService";


function BreakageEvidenceUpload({
    breakageId
}) {

    const [file, setFile] =
        useState(null);

    const [preview, setPreview] =
        useState(null);

    const [evidence, setEvidence] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState(null);

    const [success, setSuccess] =
        useState(null);


    /* =========================================================
       LOAD EXISTING EVIDENCE
       ========================================================= */

    const loadEvidence = async () => {

        if (!breakageId) {
            return;
        }

        try {

            setError(null);

            const response =
                await getBreakageEvidence(
                    breakageId
                );

            setEvidence(
                Array.isArray(response)
                    ? response
                    : []
            );

        }
        catch (error) {

            console.error(
                "Failed to load breakage evidence:",
                error
            );

            setEvidence([]);

        }
    };


    useEffect(() => {

        loadEvidence();

    }, [breakageId]);


    /* =========================================================
       FILE SELECTION
       ========================================================= */

    const handleFileChange = (
        event
    ) => {

        const selectedFile =
            event.target.files?.[0];


        setError(null);
        setSuccess(null);


        if (!selectedFile) {

            setFile(null);
            setPreview(null);

            return;
        }


        /* -----------------------------------------------------
           ALLOWED FILE TYPES
           ----------------------------------------------------- */

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];


        if (
            !allowedTypes.includes(
                selectedFile.type
            )
        ) {

            setError(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            );

            setFile(null);
            setPreview(null);

            event.target.value = "";

            return;
        }


        /* -----------------------------------------------------
           MAX FILE SIZE = 5 MB
           ----------------------------------------------------- */

        const maxSize =
            5 * 1024 * 1024;


        if (
            selectedFile.size >
            maxSize
        ) {

            setError(
                "Image size must be 5 MB or less."
            );

            setFile(null);
            setPreview(null);

            event.target.value = "";

            return;
        }


        setFile(
            selectedFile
        );


        setPreview(
            URL.createObjectURL(
                selectedFile
            )
        );

    };


    /* =========================================================
       UPLOAD
       ========================================================= */

    const handleUpload = async () => {

        if (!breakageId) {

            setError(
                "Breakage ID is required."
            );

            return;
        }


        if (!file) {

            setError(
                "Please select a breakage photo."
            );

            return;
        }


        try {

            setLoading(true);

            setError(null);

            setSuccess(null);


            await uploadBreakageEvidence(
                breakageId,
                file
            );


            setFile(null);
            setPreview(null);


            setSuccess(
                "Breakage photo uploaded successfully."
            );


            await loadEvidence();


            const fileInput =
                document.getElementById(
                    `breakage-evidence-${breakageId}`
                );


            if (fileInput) {
                fileInput.value = "";
            }

        }
        catch (error) {

            console.error(
                "Breakage photo upload failed:",
                error
            );


            setError(
                error?.response?.data?.message ||
                "Failed to upload breakage photo."
            );

        }
        finally {

            setLoading(false);

        }
    };


    /* =========================================================
       CANCEL SELECTED PHOTO
       ========================================================= */

    const handleCancel = () => {

        setFile(null);

        setPreview(null);

        setError(null);

        setSuccess(null);


        const fileInput =
            document.getElementById(
                `breakage-evidence-${breakageId}`
            );


        if (fileInput) {
            fileInput.value = "";
        }
    };


    /* =========================================================
       RENDER
       ========================================================= */

    return (

        <div
            className="
                mt-6
                rounded-xl
                border
                border-slate-800
                bg-slate-900
                p-5
            "
        >

            {/* =================================================
                HEADER
                ================================================= */}

            <div className="mb-5">

                <h3
                    className="
                        text-base
                        font-semibold
                        text-white
                    "
                >
                    Breakage Evidence
                </h3>


                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-400
                    "
                >
                    Upload a photo showing the damaged item.
                </p>

            </div>


            {/* =================================================
                UPLOAD AREA
                ================================================= */}

            <div
                className="
                    rounded-lg
                    border
                    border-dashed
                    border-slate-700
                    bg-slate-950
                    p-5
                "
            >

                <label
                    htmlFor={
                        `breakage-evidence-${breakageId}`
                    }
                    className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-slate-300
                    "
                >
                    Breakage Photo
                </label>


                <input
                    id={
                        `breakage-evidence-${breakageId}`
                    }
                    type="file"
                    accept="
                        image/jpeg,
                        image/png,
                        image/webp
                    "
                    onChange={
                        handleFileChange
                    }
                    disabled={loading}
                    className="
                        block
                        w-full
                        cursor-pointer
                        rounded-lg
                        border
                        border-slate-700
                        bg-slate-900
                        p-2
                        text-sm
                        text-slate-400
                    "
                />


                <p
                    className="
                        mt-2
                        text-xs
                        text-slate-500
                    "
                >
                    JPG, PNG or WEBP • Maximum 5 MB
                </p>


                {/* =================================================
                    SELECTED FILE
                    ================================================= */}

                {file && (

                    <div
                        className="
                            mt-4
                            rounded-lg
                            border
                            border-slate-800
                            bg-slate-900
                            p-3
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-3
                            "
                        >

                            <div className="min-w-0">

                                <p
                                    className="
                                        truncate
                                        text-sm
                                        font-medium
                                        text-slate-200
                                    "
                                >
                                    {file.name}
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    {(
                                        file.size /
                                        (1024 * 1024)
                                    ).toFixed(2)}{" "}
                                    MB
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    handleCancel
                                }
                                disabled={loading}
                                className="
                                    rounded-md
                                    border
                                    border-slate-700
                                    px-3
                                    py-1.5
                                    text-xs
                                    text-slate-300
                                    hover:bg-slate-800
                                    disabled:opacity-50
                                "
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                )}


                {/* =================================================
                    PREVIEW
                    ================================================= */}

                {preview && (

                    <div className="mt-5">

                        <p
                            className="
                                mb-2
                                text-sm
                                font-medium
                                text-slate-300
                            "
                        >
                            Preview
                        </p>


                        <div
                            className="
                                overflow-hidden
                                rounded-lg
                                border
                                border-slate-800
                                bg-slate-900
                            "
                        >

                            <img
                                src={preview}
                                alt="Breakage preview"
                                className="
                                    max-h-72
                                    w-full
                                    object-contain
                                "
                            />

                        </div>

                    </div>

                )}


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
                            px-4
                            py-3
                            text-sm
                            text-red-400
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
                            px-4
                            py-3
                            text-sm
                            text-emerald-400
                        "
                    >
                        {success}
                    </div>

                )}


                {/* =================================================
                    UPLOAD BUTTON
                    ================================================= */}

                <div
                    className="
                        mt-5
                        flex
                        gap-3
                    "
                >

                    <button
                        type="button"
                        onClick={
                            handleUpload
                        }
                        disabled={
                            loading ||
                            !file
                        }
                        className="
                            rounded-lg
                            bg-blue-600
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-blue-500
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        {loading
                            ? "Uploading..."
                            : "Upload Photo"
                        }

                    </button>


                    {file && !loading && (

                        <button
                            type="button"
                            onClick={
                                handleCancel
                            }
                            className="
                                rounded-lg
                                border
                                border-slate-700
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-slate-300
                                hover:bg-slate-800
                            "
                        >
                            Cancel
                        </button>

                    )}

                </div>

            </div>


            {/* =================================================
                EXISTING EVIDENCE
                ================================================= */}

            {evidence.length > 0 && (

                <div className="mt-6">

                    <div
                        className="
                            mb-3
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <h4
                            className="
                                text-sm
                                font-semibold
                                text-slate-300
                            "
                        >
                            Uploaded Evidence
                        </h4>


                        <span
                            className="
                                rounded-full
                                bg-slate-800
                                px-2.5
                                py-1
                                text-xs
                                text-slate-400
                            "
                        >
                            {evidence.length}{" "}
                            {evidence.length === 1
                                ? "Photo"
                                : "Photos"
                            }
                        </span>

                    </div>


                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                            lg:grid-cols-3
                        "
                    >

                        {evidence.map(
                            (item) => {

                                const imageUrl =
                                    getBreakageEvidenceUrl(
                                        breakageId,
                                        item.id
                                    );


                                return (

                                    <a
                                        key={
                                            item.id
                                        }
                                        href={
                                            imageUrl
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="
                                            group
                                            overflow-hidden
                                            rounded-lg
                                            border
                                            border-slate-800
                                            bg-slate-950
                                            transition
                                            hover:border-slate-600
                                        "
                                    >

                                        <div
                                            className="
                                                overflow-hidden
                                                bg-slate-900
                                            "
                                        >

                                            <img
                                                src={
                                                    imageUrl
                                                }
                                                alt={
                                                    item.originalFileName ||
                                                    "Breakage evidence"
                                                }
                                                className="
                                                    h-40
                                                    w-full
                                                    object-cover
                                                    transition
                                                    duration-200
                                                    group-hover:scale-105
                                                "
                                            />

                                        </div>


                                        <div
                                            className="
                                                p-3
                                            "
                                        >

                                            <p
                                                className="
                                                    truncate
                                                    text-sm
                                                    font-medium
                                                    text-slate-300
                                                "
                                            >
                                                {
                                                    item.originalFileName ||
                                                    "Breakage Photo"
                                                }
                                            </p>


                                            {item.uploadedAt && (

                                                <p
                                                    className="
                                                        mt-1
                                                        text-xs
                                                        text-slate-500
                                                    "
                                                >
                                                    {
                                                        new Date(
                                                            item.uploadedAt
                                                        ).toLocaleString()
                                                    }
                                                </p>

                                            )}

                                        </div>

                                    </a>

                                );

                            }
                        )}

                    </div>

                </div>

            )}


            {/* =================================================
                NO EVIDENCE
                ================================================= */}

            {evidence.length === 0 && (

                <div
                    className="
                        mt-5
                        rounded-lg
                        border
                        border-slate-800
                        bg-slate-950
                        px-4
                        py-4
                        text-center
                        text-sm
                        text-slate-500
                    "
                >
                    No breakage photos uploaded yet.
                </div>

            )}

        </div>

    );
}


export default BreakageEvidenceUpload;