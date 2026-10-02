import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    createBreakage,
    getBreakageById,
    getBreakages,
    getBreakageSummary,
    updateBreakage,
    updateRecoveryStatus,
    deleteBreakage,
    uploadBreakageEvidence,
    getBreakageItems,
    getBreakageEvidence,
    getBreakageEvidenceImage
} from "../../services/breakageService";


const PERSON_TYPES = [
    "STUDENT",
    "FACULTY",
    "STAFF"
];

const RECOVERY_STATUS = [
    "PENDING",
    "PAID",
    "WAIVED"
];

const MAX_FILE_SIZE =
    5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
];


const emptyForm = {
    breakageDate: "",
    breakageTime: "",
    inventoryItemId: "",
    quantity: 1,
    responsibleName: "",
    responsibleId: "",
    personType: "STUDENT",
    departmentClassSection: "",
    cause: "",
    estimatedCost: 0,
    recoveryStatus: "PENDING",
    remarks: ""
};


function BreakageRegister() {

    const [data, setData] =
        useState([]);

    const [summary, setSummary] =
        useState({
            totalBreakages: 0,
            totalCost: 0,
            pendingRecovery: 0
        });

    const [page, setPage] =
        useState(0);

    const [size] =
        useState(10);

    const [totalPages, setTotalPages] =
        useState(0);

    const [search, setSearch] =
        useState("");

    const [personType, setPersonType] =
        useState("");

    const [recoveryStatus, setRecoveryStatus] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [selectedBreakage, setSelectedBreakage] =
        useState(null);

    const [editingBreakage, setEditingBreakage] =
        useState(null);

    const [form, setForm] =
        useState(emptyForm);


    const [availableItems, setAvailableItems] =
        useState([]);

    const [itemsLoading, setItemsLoading] =
        useState(false);


    const [breakagePhoto, setBreakagePhoto] =
        useState(null);

    const [photoPreview, setPhotoPreview] =
        useState("");

    const [photoError, setPhotoError] =
        useState("");

    const fileInputRef =
        useRef(null);


    const [selectedEvidence, setSelectedEvidence] =
        useState([]);

    const [evidenceImageUrls, setEvidenceImageUrls] =
        useState([]);

    const [evidenceLoading, setEvidenceLoading] =
        useState(false);

    const [evidenceError, setEvidenceError] =
        useState("");


    /* =========================================================
       LOAD BREAKAGES
    ========================================================= */

    const load = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                result,
                summaryResult
            ] = await Promise.all([

                getBreakages({
                    page,
                    size,
                    search,
                    personType,
                    recoveryStatus,
                    sortBy:
                        "breakageDateTime",
                    sortDirection:
                        "desc"
                }),

                getBreakageSummary()

            ]);


            const content =
                result?.content ??
                result?.data?.content ??
                result?.data ??
                (
                    Array.isArray(result)
                        ? result
                        : []
                );


            setData(
                Array.isArray(content)
                    ? content
                    : []
            );


            setTotalPages(
                result?.totalPages ??
                result?.data?.totalPages ??
                0
            );


            const summaryData =
                summaryResult?.data ??
                summaryResult;


            setSummary(
                summaryData || {
                    totalBreakages: 0,
                    totalCost: 0,
                    pendingRecovery: 0
                }
            );

        } catch (err) {

            console.error(
                "LOAD BREAKAGES ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to load breakage records."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        const timer =
            setTimeout(() => {
                load();
            }, 300);

        return () =>
            clearTimeout(timer);

    }, [
        page,
        search,
        personType,
        recoveryStatus
    ]);


    /* =========================================================
       LOAD ACTIVE ITEMS
    ========================================================= */

    const loadBreakageItems =
        async () => {

            try {

                setItemsLoading(true);

                const result =
                    await getBreakageItems();

                const pageData =
                    result?.data ??
                    result;

                const content =
                    pageData?.content ??
                    pageData?.data?.content ??
                    (
                        Array.isArray(pageData)
                            ? pageData
                            : []
                    );

                setAvailableItems(
                    Array.isArray(content)
                        ? content
                        : []
                );

            } catch (err) {

                console.error(
                    "LOAD BREAKAGE ITEMS ERROR:",
                    err
                );

                setAvailableItems([]);

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Unable to load active inventory items."
                );

            } finally {

                setItemsLoading(false);

            }

        };


    /* =========================================================
       OPEN CREATE FORM
    ========================================================= */

    const openCreate = () => {

        const now =
            new Date();

        setForm({
            ...emptyForm,

            breakageDate:
                now
                    .toISOString()
                    .slice(0, 10),

            breakageTime:
                now
                    .toTimeString()
                    .slice(0, 5)
        });

        setEditingBreakage(null);

        setBreakagePhoto(null);
        setPhotoPreview("");
        setPhotoError("");

        setSelectedBreakage(null);
        setSelectedEvidence([]);
        setEvidenceImageUrls([]);
        setEvidenceError("");

        setShowForm(true);
        setError("");

        loadBreakageItems();

    };


    /* =========================================================
       OPEN EDIT FORM
    ========================================================= */

    const openEdit = async (record) => {

        try {

            setError("");
            setSaving(false);

            const recordId =
                record?.id ??
                record?.breakageId;

            if (!recordId) {
                setError(
                    "Breakage ID is missing."
                );
                return;
            }

            const [
                detailResult
            ] = await Promise.all([
                getBreakageById(recordId),
                loadBreakageItems()
            ]);

            const detail =
                detailResult?.data ??
                detailResult ??
                record;

            const dateTime =
                detail?.breakageDateTime ??
                record?.breakageDateTime;

            let breakageDate =
                detail?.breakageDate ??
                record?.breakageDate ??
                "";

            let breakageTime =
                detail?.breakageTime ??
                record?.breakageTime ??
                "";

            if (
                dateTime &&
                (!breakageDate ||
                    !breakageTime)
            ) {

                const date =
                    new Date(dateTime);

                if (
                    !Number.isNaN(
                        date.getTime()
                    )
                ) {

                    breakageDate =
                        date
                            .toISOString()
                            .slice(0, 10);

                    breakageTime =
                        date
                            .toTimeString()
                            .slice(0, 5);

                }

            }

            const inventoryItemId =
                detail?.inventoryItemId ??
                detail?.itemId ??
                detail?.inventoryItem?.id ??
                record?.inventoryItemId ??
                record?.itemId ??
                record?.inventoryItem?.id ??
                "";

            const editForm = {
                ...emptyForm,

                breakageDate,
                breakageTime,

                inventoryItemId:
                    inventoryItemId === null ||
                    inventoryItemId === undefined
                        ? ""
                        : String(
                            inventoryItemId
                        ),

                quantity:
                    detail?.quantity ??
                    detail?.qty ??
                    record?.quantity ??
                    record?.qty ??
                    1,

                responsibleName:
                    detail?.responsibleName ??
                    detail?.personName ??
                    detail?.brokenBy ??
                    record?.responsibleName ??
                    record?.personName ??
                    record?.brokenBy ??
                    "",

                responsibleId:
                    detail?.responsibleId ??
                    detail?.personId ??
                    detail?.brokenById ??
                    record?.responsibleId ??
                    record?.personId ??
                    record?.brokenById ??
                    "",

                personType:
                    detail?.personType ??
                    detail?.type ??
                    record?.personType ??
                    record?.type ??
                    "STUDENT",

                departmentClassSection:
                    detail?.departmentClassSection ??
                    detail?.departmentOrClass ??
                    detail?.department ??
                    record?.departmentClassSection ??
                    record?.departmentOrClass ??
                    record?.department ??
                    "",

                cause:
                    detail?.cause ??
                    record?.cause ??
                    "",

                estimatedCost:
                    detail?.estimatedCost ??
                    detail?.cost ??
                    record?.estimatedCost ??
                    record?.cost ??
                    0,

                recoveryStatus:
                    detail?.recoveryStatus ??
                    detail?.status ??
                    record?.recoveryStatus ??
                    "PENDING",

                remarks:
                    detail?.remarks ??
                    detail?.remark ??
                    record?.remarks ??
                    record?.remark ??
                    ""
            };

            setForm(editForm);
            setEditingBreakage(detail);
            setSelectedBreakage(null);
            setSelectedEvidence([]);
            setEvidenceImageUrls([]);
            setEvidenceError("");

            setBreakagePhoto(null);
            setPhotoPreview("");
            setPhotoError("");

            if (
                fileInputRef.current
            ) {
                fileInputRef.current.value = "";
            }

            setShowForm(true);

        } catch (err) {

            console.error(
                "OPEN EDIT BREAKAGE ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Unable to load breakage record for editing."
            );

        }

    };


    /* =========================================================
       CLOSE FORM
    ========================================================= */

    const closeCreate = () => {

        if (saving) {
            return;
        }

        if (photoPreview) {
            URL.revokeObjectURL(
                photoPreview
            );
        }

        setShowForm(false);
        setEditingBreakage(null);
        setForm({
            ...emptyForm
        });

        setBreakagePhoto(null);
        setPhotoPreview("");
        setPhotoError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

    };


    /* =========================================================
       PHOTO
    ========================================================= */

    const handlePhotoChange =
        (event) => {

            const file =
                event.target.files?.[0];

            setPhotoError("");

            if (!file) {
                setBreakagePhoto(null);
                setPhotoPreview("");
                return;
            }

            if (
                !ALLOWED_FILE_TYPES.includes(
                    file.type
                )
            ) {

                setPhotoError(
                    "Only JPG, PNG or WEBP images are allowed."
                );

                event.target.value = "";

                setBreakagePhoto(null);
                setPhotoPreview("");

                return;
            }

            if (
                file.size >
                MAX_FILE_SIZE
            ) {

                setPhotoError(
                    "Photo size must not exceed 5 MB."
                );

                event.target.value = "";

                setBreakagePhoto(null);
                setPhotoPreview("");

                return;
            }

            if (photoPreview) {
                URL.revokeObjectURL(
                    photoPreview
                );
            }

            setBreakagePhoto(file);

            setPhotoPreview(
                URL.createObjectURL(file)
            );

        };


    const removePhoto = () => {

        if (photoPreview) {
            URL.revokeObjectURL(
                photoPreview
            );
        }

        setBreakagePhoto(null);
        setPhotoPreview("");
        setPhotoError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

    };


    /* =========================================================
       CREATE / UPDATE
    ========================================================= */

    const handleCreate =
        async (event) => {

        event.preventDefault();

        try {

            setSaving(true);
            setError("");

            const inventoryItemId =
                String(
                    form.inventoryItemId ??
                    ""
                ).trim();

            if (!inventoryItemId) {
                setError(
                    "Please select an inventory item."
                );
                return;
            }

            const numericItemId =
                Number(
                    inventoryItemId
                );

            if (
                !Number.isInteger(
                    numericItemId
                ) ||
                numericItemId <= 0
            ) {
                setError(
                    "Selected inventory item is invalid."
                );
                return;
            }

            const selectedItem =
                availableItems.find(
                    (item) =>
                        Number(item?.id) ===
                        numericItemId
                );

            /*
             * During editing, the item may no longer be present
             * in the active-items response. The existing record
             * is still a valid source for the selected item.
             */
            if (
                !selectedItem &&
                !editingBreakage
            ) {
                setError(
                    "Please select a valid active item."
                );
                return;
            }

            const quantity =
                Number(
                    form.quantity
                );

            if (
                !Number.isInteger(quantity) ||
                quantity <= 0
            ) {
                setError(
                    "Quantity must be greater than zero."
                );
                return;
            }

            if (
                !form.responsibleName?.trim()
            ) {
                setError(
                    "Responsible person's name is required."
                );
                return;
            }

            if (
                !form.cause?.trim()
            ) {
                setError(
                    "Cause / Description is required."
                );
                return;
            }

            let breakageDateTime =
                null;

            if (
                form.breakageDate &&
                form.breakageTime
            ) {

                breakageDateTime =
                    `${form.breakageDate}T${form.breakageTime}:00`;

            } else if (
                form.breakageDate
            ) {

                breakageDateTime =
                    `${form.breakageDate}T00:00:00`;

            }

            const payload = {

                inventoryItemId:
                    numericItemId,

                quantity,

                breakageDateTime,

                responsibleName:
                    form
                        .responsibleName
                        .trim(),

                responsibleId:
                    form
                        .responsibleId
                        ?.trim() ||
                    null,

                personType:
                    form.personType,

                departmentClassSection:
                    form
                        .departmentClassSection
                        ?.trim() ||
                    null,

                cause:
                    form
                        .cause
                        .trim(),

                estimatedCost:
                    Number(
                        form.estimatedCost ||
                        0
                    ),

                recoveryStatus:
                    form.recoveryStatus,

                remarks:
                    form
                        .remarks
                        ?.trim() ||
                    null

            };

            if (editingBreakage) {

                const breakageId =
                    editingBreakage?.id ??
                    editingBreakage?.breakageId;

                if (!breakageId) {
                    throw new Error(
                        "Breakage ID is missing."
                    );
                }

                await updateBreakage(
                    breakageId,
                    payload
                );

                /*
                 * If the user selected a new photo while editing,
                 * upload it after the record update. Existing
                 * evidence remains untouched when no new photo is
                 * selected.
                 */
                if (breakagePhoto) {

                    await uploadBreakageEvidence(
                        breakageId,
                        breakagePhoto
                    );

                }

            } else {

                const created =
                    await createBreakage(
                        payload
                    );

                const createdData =
                    created?.data ??
                    created;

                const createdBreakageId =
                    createdData?.id ??
                    createdData?.breakageId ??
                    createdData?.data?.id ??
                    createdData?.data?.breakageId;

                if (breakagePhoto) {

                    if (!createdBreakageId) {
                        throw new Error(
                            "Breakage ID was not returned."
                        );
                    }

                    await uploadBreakageEvidence(
                        createdBreakageId,
                        breakagePhoto
                    );

                }

            }

            /*
             * closeCreate() intentionally blocks while saving.
             * Reset saving first so the successful create/update
             * can close the form normally.
             */
            setSaving(false);

            closeCreate();

            await load();

        } catch (err) {

            console.error(
                editingBreakage
                    ? "UPDATE BREAKAGE ERROR:"
                    : "CREATE BREAKAGE ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                (
                    editingBreakage
                        ? "Unable to update breakage record."
                        : "Something went wrong while creating breakage."
                )
            );

        } finally {

            setSaving(false);

        }

    };


    /* =========================================================
       DELETE
    ========================================================= */

    const handleDelete =
        async (record) => {

        const breakageId =
            record?.id ??
            record?.breakageId;

        if (!breakageId) {
            setError(
                "Breakage ID is missing."
            );
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this breakage record? This action cannot be undone."
            );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            await deleteBreakage(
                breakageId
            );

            /*
             * If the last record on the current page was deleted,
             * move back one page so the table does not remain empty
             * unnecessarily.
             */
            if (
                data.length === 1 &&
                page > 0
            ) {
                setPage(
                    (current) =>
                        Math.max(
                            0,
                            current - 1
                        )
                );
            } else {
                await load();
            }

        } catch (err) {

            console.error(
                "DELETE BREAKAGE ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Unable to delete breakage record."
            );

        }

    };


    /* =========================================================
       MARK PAID
    ========================================================= */

    const markPaid =
        async (id) => {

            try {

                setError("");

                await updateRecoveryStatus(
                    id,
                    "PAID"
                );

                await load();

            } catch (err) {

                console.error(
                    "UPDATE RECOVERY ERROR:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Unable to update recovery status."
                );

            }

        };


    /* =========================================================
       VIEW BREAKAGE + EVIDENCE
    ========================================================= */

    const viewBreakage =
        async (id) => {

            try {

                setError("");
                setEvidenceError("");
                setEvidenceLoading(true);

                setSelectedEvidence([]);
                setEvidenceImageUrls([]);

                const result =
                    await getBreakageById(id);

                const breakageData =
                    result?.data ??
                    result;

                setSelectedBreakage(
                    breakageData
                );


                const evidenceResult =
                    await getBreakageEvidence(id);

                const rawEvidence =
                    evidenceResult?.data ??
                    evidenceResult;

                let evidenceList = [];

                if (
                    Array.isArray(rawEvidence)
                ) {

                    evidenceList =
                        rawEvidence;

                } else if (
                    Array.isArray(
                        rawEvidence?.content
                    )
                ) {

                    evidenceList =
                        rawEvidence.content;

                } else if (
                    Array.isArray(
                        rawEvidence?.data
                    )
                ) {

                    evidenceList =
                        rawEvidence.data;

                } else if (
                    rawEvidence
                ) {

                    evidenceList = [
                        rawEvidence
                    ];

                }

                setSelectedEvidence(
                    evidenceList
                );


                const loadedImages = [];

                for (
                    const evidence
                    of evidenceList
                ) {

                    const evidenceId =
                        evidence?.id ??
                        evidence?.evidenceId;

                    if (!evidenceId) {
                        continue;
                    }

                    try {

                        const blob =
                            await getBreakageEvidenceImage(
                                id,
                                evidenceId
                            );

                        loadedImages.push({
                            id: evidenceId,
                            url:
                                URL.createObjectURL(
                                    blob
                                ),
                            fileName:
                                evidence?.fileName ??
                                evidence?.originalFileName ??
                                evidence?.name ??
                                "Breakage Photo"
                        });

                    } catch (imageError) {

                        console.error(
                            "IMAGE LOAD ERROR:",
                            imageError
                        );

                    }

                }

                setEvidenceImageUrls(
                    loadedImages
                );

                if (
                    evidenceList.length > 0 &&
                    loadedImages.length === 0
                ) {

                    setEvidenceError(
                        "Evidence was found, but the photo could not be loaded."
                    );

                }

            } catch (err) {

                console.error(
                    "VIEW BREAKAGE ERROR:",
                    err
                );

                setEvidenceError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Unable to load breakage details."
                );

            } finally {

                setEvidenceLoading(false);

            }

        };


    const closeDetails =
        () => {

            evidenceImageUrls.forEach(
                (image) => {

                    if (image?.url) {
                        URL.revokeObjectURL(
                            image.url
                        );
                    }

                }
            );

            setSelectedBreakage(null);
            setSelectedEvidence([]);
            setEvidenceImageUrls([]);
            setEvidenceError("");
            setEvidenceLoading(false);

        };


    /* =========================================================
       FORMATTERS
    ========================================================= */

    const formatDate =
        (value) => {

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
                    month: "2-digit",
                    year: "numeric"
                }
            );

        };


    const formatTime =
        (record) => {

            if (
                record?.breakageDateTime
            ) {

                const date =
                    new Date(
                        record.breakageDateTime
                    );

                if (
                    !Number.isNaN(
                        date.getTime()
                    )
                ) {

                    return date.toLocaleTimeString(
                        "en-IN",
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false
                        }
                    );

                }

            }

            return (
                record?.breakageTime ||
                record?.time ||
                "—"
            );

        };


    const getRecordDate =
        (record) =>
            record?.breakageDateTime ||
            record?.breakageDate ||
            record?.date;


    const formatCurrency =
        (value) =>
            `₹${Number(
                value || 0
            ).toLocaleString(
                "en-IN"
            )}`;


    return (

        <div
            className="
                min-h-full
                bg-[#070b18]
                px-6
                py-6
                text-white
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    mb-6
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-4
                "
            >

                <div>

                    <h1
                        className="
                            text-2xl
                            font-bold
                            tracking-tight
                            text-white
                        "
                    >
                        Breakage Register
                    </h1>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-cyan-300
                        "
                    >
                        Track damaged items and recovery
                    </p>

                </div>


                <button
                    type="button"
                    onClick={openCreate}
                    className="
                        rounded-lg
                        border
                        border-pink-500/40
                        bg-pink-500/10
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-pink-400
                        shadow-sm
                        transition
                        hover:border-pink-400/60
                        hover:bg-pink-500/20
                        hover:text-pink-300
                    "
                >
                    💔 Log Breakage
                </button>

            </div>


            {/* ERROR */}

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


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div
                className="
                    mb-6
                    grid
                    grid-cols-1
                    gap-4
                    md:grid-cols-3
                "
            >

                <SummaryCard
                    label="Total Breakages"
                    value={
                        summary.totalBreakages ??
                        0
                    }
                    icon="💔"
                    theme="pink"
                />

                <SummaryCard
                    label="Total Cost"
                    value={
                        formatCurrency(
                            summary.totalCost
                        )
                    }
                    icon="💰"
                    theme="red"
                />

                <SummaryCard
                    label="Pending Recovery"
                    value={
                        summary.pendingRecovery ??
                        0
                    }
                    icon="⏳"
                    theme="orange"
                />

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div
                className="
                    mb-5
                    rounded-xl
                    border
                    border-cyan-500/20
                    bg-[#101729]
                    p-4
                    shadow-sm
                "
            >

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-3
                        md:grid-cols-3
                    "
                >

                    <input
                        type="text"
                        placeholder="Search by item, person..."
                        value={search}
                        onChange={(event) => {

                            setSearch(
                                event.target.value
                            );

                            setPage(0);

                        }}
                        className="
                            rounded-lg
                            border
                            border-slate-700
                            bg-[#080d1b]
                            px-4
                            py-3
                            text-sm
                            text-white
                            outline-none
                            placeholder:text-slate-600
                            focus:border-cyan-400
                            focus:ring-1
                            focus:ring-cyan-400/20
                        "
                    />


                    <select
                        value={personType}
                        onChange={(event) => {

                            setPersonType(
                                event.target.value
                            );

                            setPage(0);

                        }}
                        className="
                            rounded-lg
                            border
                            border-slate-700
                            bg-[#080d1b]
                            px-4
                            py-3
                            text-sm
                            text-white
                            outline-none
                            focus:border-blue-400
                            focus:ring-1
                            focus:ring-blue-400/20
                        "
                    >

                        <option value="">
                            All Persons
                        </option>

                        {PERSON_TYPES.map(
                            (type) => (

                                <option
                                    key={type}
                                    value={type}
                                >
                                    {type}
                                </option>

                            )
                        )}

                    </select>


                    <select
                        value={recoveryStatus}
                        onChange={(event) => {

                            setRecoveryStatus(
                                event.target.value
                            );

                            setPage(0);

                        }}
                        className="
                            rounded-lg
                            border
                            border-slate-700
                            bg-[#080d1b]
                            px-4
                            py-3
                            text-sm
                            text-white
                            outline-none
                            focus:border-emerald-400
                            focus:ring-1
                            focus:ring-emerald-400/20
                        "
                    >

                        <option value="">
                            All Status
                        </option>

                        {RECOVERY_STATUS.map(
                            (status) => (

                                <option
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </option>

                            )
                        )}

                    </select>

                </div>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div
                className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-800
                    bg-[#101729]
                    shadow-lg
                "
            >

                {loading ? (

                    <div
                        className="
                            p-12
                            text-center
                            text-cyan-300
                        "
                    >
                        Loading breakage records...
                    </div>

                ) : data.length === 0 ? (

                    <div
                        className="
                            p-12
                            text-center
                            text-slate-400
                        "
                    >
                        No breakage records found.
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table
                            className="
                                w-full
                                min-w-[1250px]
                            "
                        >

                            <thead>

                                <tr
                                    className="
                                        border-b
                                        border-slate-800
                                        bg-[#080d1b]
                                        text-left
                                    "
                                >

                                    <TableHeader color="cyan">
                                        Date
                                    </TableHeader>

                                    <TableHeader color="blue">
                                        Item Broken
                                    </TableHeader>

                                    <TableHeader color="violet">
                                        Qty
                                    </TableHeader>

                                    <TableHeader color="pink">
                                        Broken By
                                    </TableHeader>

                                    <TableHeader color="purple">
                                        Type
                                    </TableHeader>

                                    <TableHeader color="amber">
                                        Dept / Class
                                    </TableHeader>

                                    <TableHeader color="orange">
                                        Cause
                                    </TableHeader>

                                    <TableHeader color="red">
                                        Cost
                                    </TableHeader>

                                    <TableHeader color="emerald">
                                        Recovery
                                    </TableHeader>

                                    <TableHeader color="cyan">
                                        Remarks
                                    </TableHeader>

                                    <TableHeader color="blue">
                                        Actions
                                    </TableHeader>

                                </tr>

                            </thead>


                            <tbody>

                                {data.map(
                                    (record) => (

                                        <tr
                                            key={
                                                record.id
                                            }
                                            className="
                                                border-b
                                                border-slate-800
                                                transition
                                                duration-150
                                                hover:bg-slate-800/30
                                            "
                                        >

                                            {/* DATE */}

                                            <td
                                                className="
                                                    px-4
                                                    py-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        text-sm
                                                        font-medium
                                                        text-cyan-300
                                                    "
                                                >
                                                    {
                                                        formatDate(
                                                            getRecordDate(
                                                                record
                                                            )
                                                        )
                                                    }
                                                </div>

                                                <div
                                                    className="
                                                        mt-1
                                                        text-xs
                                                        text-slate-500
                                                    "
                                                >
                                                    {
                                                        formatTime(
                                                            record
                                                        )
                                                    }
                                                </div>

                                            </td>


                                            {/* ITEM */}

                                            <td
                                                className="
                                                    px-4
                                                    py-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        font-semibold
                                                        text-blue-300
                                                    "
                                                >
                                                    {
                                                        record.itemName ??
                                                        record.inventoryItemName ??
                                                        record.inventoryItem ??
                                                        "—"
                                                    }
                                                </div>

                                                <div
                                                    className="
                                                        mt-1
                                                        text-xs
                                                        text-violet-400
                                                    "
                                                >
                                                    ID:{" "}
                                                    {
                                                        record.inventoryItemId ??
                                                        record.itemId ??
                                                        "—"
                                                    }
                                                </div>

                                            </td>


                                            {/* QTY */}

                                            <td
                                                className="
                                                    px-4
                                                    py-4
                                                "
                                            >

                                                <span
                                                    className="
                                                        inline-flex
                                                        min-w-8
                                                        items-center
                                                        justify-center
                                                        rounded-md
                                                        bg-violet-500/10
                                                        px-2
                                                        py-1
                                                        text-sm
                                                        font-semibold
                                                        text-violet-300
                                                    "
                                                >
                                                    {
                                                        record.quantity ??
                                                        record.qty ??
                                                        "—"
                                                    }
                                                </span>

                                            </td>


                                            {/* BROKEN BY */}

                                            <td
                                                className="
                                                    px-4
                                                    py-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        font-semibold
                                                        text-white
                                                    "
                                                >
                                                    {
                                                        record.responsibleName ??
                                                        record.personName ??
                                                        record.brokenBy ??
                                                        "—"
                                                    }
                                                </div>

                                                <div
                                                    className="
                                                        mt-1
                                                        text-xs
                                                        text-slate-500
                                                    "
                                                >
                                                    {
                                                        record.responsibleId ??
                                                        record.personId ??
                                                        record.brokenById ??
                                                        ""
                                                    }
                                                </div>

                                            </td>


                                            {/* TYPE */}

                                            <td
                                                className="
                                                    px-4
                                                    py-4
                                                "
                                            >

                                                <PersonBadge
                                                    type={
                                                        record.personType ??
                                                        record.type
                                                    }
                                                />

                                            </td>


                                            {/* DEPT */}

                                            <td
                                                className="
                                                    max-w-[180px]
                                                    px-4
                                                    py-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        truncate
                                                        text-sm
                                                        font-medium
                                                        text-amber-300
                                                    "
                                                >
                                                    {
                                                        record.departmentClassSection ??
                                                        record.departmentOrClass ??
                                                        record.department ??
                                                        "—"
                                                    }
                                                </div>

                                            </td>


                                            {/* CAUSE */}

                                            <td
                                                className="
                                                    max-w-[180px]
                                                    px-4
                                                    py-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        truncate
                                                        text-sm
                                                        text-orange-300
                                                    "
                                                    title={
                                                        record.cause ??
                                                        ""
                                                    }
                                                >
                                                    {
                                                        record.cause ??
                                                        "—"
                                                    }
                                                </div>

                                            </td>


                                            {/* COST */}

                                            <td
                                                className="
                                                    px-4
                                                    py-4
                                                "
                                            >

                                                <span
                                                    className="
                                                        font-semibold
                                                        text-red-400
                                                    "
                                                >
                                                    {
                                                        formatCurrency(
                                                            record.estimatedCost ??
                                                            record.cost ??
                                                            0
                                                        )
                                                    }
                                                </span>

                                            </td>


                                            {/* RECOVERY */}

                                            <td
                                                className="
                                                    px-4
                                                    py-4
                                                "
                                            >

                                                <RecoveryBadge
                                                    status={
                                                        record.recoveryStatus
                                                    }
                                                />

                                            </td>


                                            {/* REMARKS */}

                                            <td
                                                className="
                                                    max-w-[180px]
                                                    px-4
                                                    py-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        truncate
                                                        text-sm
                                                        text-cyan-300
                                                    "
                                                    title={
                                                        record.remarks ??
                                                        ""
                                                    }
                                                >
                                                    {
                                                        record.remarks ??
                                                        "—"
                                                    }
                                                </div>

                                            </td>


                                            {/* ACTIONS */}

                                            <td
                                                className="
                                                    px-4
                                                    py-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    "
                                                >

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            viewBreakage(
                                                                record.id
                                                            )
                                                        }
                                                        className="
                                                            rounded-lg
                                                            border
                                                            border-blue-500/30
                                                            bg-blue-500/10
                                                            px-3
                                                            py-2
                                                            text-xs
                                                            font-semibold
                                                            text-blue-300
                                                            transition
                                                            hover:border-blue-400/50
                                                            hover:bg-blue-500/20
                                                        "
                                                    >
                                                        View
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEdit(
                                                                record
                                                            )
                                                        }
                                                        className="
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
                                                            hover:border-cyan-400/50
                                                            hover:bg-cyan-500/20
                                                        "
                                                    >
                                                        Edit
                                                    </button>


                                                    {record.recoveryStatus ===
                                                        "PENDING" && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                markPaid(
                                                                    record.id
                                                                )
                                                            }
                                                            className="
                                                                rounded-lg
                                                                border
                                                                border-emerald-500/30
                                                                bg-emerald-500/10
                                                                px-3
                                                                py-2
                                                                text-xs
                                                                font-semibold
                                                                text-emerald-400
                                                                transition
                                                                hover:border-emerald-400/50
                                                                hover:bg-emerald-500/20
                                                            "
                                                        >
                                                            Paid
                                                        </button>

                                                    )}


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                record
                                                            )
                                                        }
                                                        className="
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
                                                            hover:border-red-400/50
                                                            hover:bg-red-500/20
                                                        "
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}


                {/* PAGINATION */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-t
                        border-slate-800
                        bg-[#0b1120]
                        px-5
                        py-4
                    "
                >

                    <span
                        className="
                            text-xs
                            font-medium
                            text-slate-400
                        "
                    >
                        Page{" "}

                        <span className="text-white">
                            {totalPages === 0
                                ? 0
                                : page + 1}
                        </span>

                        {" "}of{" "}

                        <span className="text-cyan-300">
                            {totalPages}
                        </span>

                    </span>


                    <div className="flex gap-2">

                        <button
                            type="button"
                            disabled={
                                page === 0
                            }
                            onClick={() =>
                                setPage(
                                    (current) =>
                                        Math.max(
                                            0,
                                            current - 1
                                        )
                                )
                            }
                            className="
                                rounded-lg
                                border
                                border-slate-700
                                bg-slate-900
                                px-4
                                py-2
                                text-xs
                                font-medium
                                text-blue-300
                                transition
                                hover:border-blue-500/40
                                hover:bg-blue-500/10
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            Previous
                        </button>


                        <button
                            type="button"
                            disabled={
                                totalPages === 0 ||
                                page >=
                                    totalPages - 1
                            }
                            onClick={() =>
                                setPage(
                                    (current) =>
                                        current + 1
                                )
                            }
                            className="
                                rounded-lg
                                border
                                border-slate-700
                                bg-slate-900
                                px-4
                                py-2
                                text-xs
                                font-medium
                                text-blue-300
                                transition
                                hover:border-blue-500/40
                                hover:bg-blue-500/10
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            Next
                        </button>

                    </div>

                </div>

            </div>


            {/* CREATE FORM */}

            {showForm && (

                <BreakageForm
                    form={form}
                    setForm={setForm}
                    saving={saving}
                    onClose={closeCreate}
                    onSubmit={handleCreate}
                    breakagePhoto={breakagePhoto}
                    photoPreview={photoPreview}
                    photoError={photoError}
                    fileInputRef={fileInputRef}
                    onPhotoChange={handlePhotoChange}
                    onRemovePhoto={removePhoto}
                    availableItems={availableItems}
                    itemsLoading={itemsLoading}
                    isEditing={Boolean(editingBreakage)}
                />

            )}


            {/* DETAILS */}

            {selectedBreakage && (

                <BreakageDetails
                    record={
                        selectedBreakage
                    }
                    evidence={
                        selectedEvidence
                    }
                    evidenceLoading={
                        evidenceLoading
                    }
                    evidenceError={
                        evidenceError
                    }
                    evidenceImageUrls={
                        evidenceImageUrls
                    }
                    onClose={
                        closeDetails
                    }
                />

            )}

        </div>

    );

}


/* =============================================================
 * TABLE HEADER
 * ============================================================= */

function TableHeader({
    children,
    color
}) {

    const colors = {

        cyan:
            "text-cyan-400",

        blue:
            "text-blue-400",

        violet:
            "text-violet-400",

        pink:
            "text-pink-400",

        purple:
            "text-purple-400",

        amber:
            "text-amber-400",

        orange:
            "text-orange-400",

        red:
            "text-red-400",

        emerald:
            "text-emerald-400"

    };

    return (

        <th
            className={`
                px-4
                py-4
                text-xs
                font-semibold
                uppercase
                tracking-wide
                ${colors[color] || "text-slate-400"}
            `}
        >
            {children}
        </th>

    );

}


/* =============================================================
 * SUMMARY CARD
 * ============================================================= */

function SummaryCard({
    label,
    value,
    icon,
    theme
}) {

    const styles = {

        pink: {
            border:
                "border-pink-500/25",
            label:
                "text-pink-300",
            value:
                "text-pink-400",
            icon:
                "bg-pink-500/10 text-pink-400"
        },

        red: {
            border:
                "border-red-500/25",
            label:
                "text-red-300",
            value:
                "text-red-400",
            icon:
                "bg-red-500/10 text-red-400"
        },

        orange: {
            border:
                "border-orange-500/25",
            label:
                "text-orange-300",
            value:
                "text-orange-400",
            icon:
                "bg-orange-500/10 text-orange-400"
        }

    };

    const style =
        styles[theme] ||
        styles.pink;


    return (

        <div
            className={`
                rounded-xl
                border
                bg-[#101729]
                p-5
                transition
                hover:bg-[#121b30]
                ${style.border}
            `}
        >

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <div>

                    <p
                        className={`
                            text-sm
                            font-medium
                            ${style.label}
                        `}
                    >
                        {label}
                    </p>

                    <p
                        className={`
                            mt-2
                            text-3xl
                            font-bold
                            ${style.value}
                        `}
                    >
                        {value}
                    </p>

                </div>


                <div
                    className={`
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        text-xl
                        ${style.icon}
                    `}
                >
                    {icon}
                </div>

            </div>

        </div>

    );

}


/* =============================================================
 * PERSON BADGE
 * ============================================================= */

function PersonBadge({
    type
}) {

    const styles = {

        STUDENT:
            "border border-blue-500/25 bg-blue-500/10 text-blue-300",

        FACULTY:
            "border border-purple-500/25 bg-purple-500/10 text-purple-300",

        STAFF:
            "border border-orange-500/25 bg-orange-500/10 text-orange-300"

    };


    return (

        <span
            className={`
                inline-flex
                rounded-md
                px-2.5
                py-1
                text-xs
                font-semibold
                ${
                    styles[type] ||
                    "border border-slate-700 bg-slate-700/20 text-slate-300"
                }
            `}
        >
            {type || "—"}
        </span>

    );

}


/* =============================================================
 * RECOVERY BADGE
 * ============================================================= */

function RecoveryBadge({
    status
}) {

    const styles = {

        PENDING:
            "border border-orange-500/30 bg-orange-500/10 text-orange-300",

        PAID:
            "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300",

        WAIVED:
            "border border-slate-600 bg-slate-700/30 text-slate-300"

    };


    return (

        <span
            className={`
                inline-flex
                rounded-md
                px-2.5
                py-1
                text-xs
                font-semibold
                ${
                    styles[status] ||
                    "border border-slate-700 bg-slate-700/20 text-slate-300"
                }
            `}
        >
            {status || "—"}
        </span>

    );

}


/* =============================================================
 * BREAKAGE FORM
 * ============================================================= */

function BreakageForm({
    form,
    setForm,
    saving,
    onClose,
    onSubmit,
    breakagePhoto,
    photoPreview,
    photoError,
    fileInputRef,
    onPhotoChange,
    onRemovePhoto,
    availableItems,
    itemsLoading,
    isEditing = false
}) {

    const update =
        (
            field,
            value
        ) => {

            setForm(
                (previous) => ({
                    ...previous,
                    [field]: value
                })
            );

        };


    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/75
                p-4
                backdrop-blur-sm
            "
        >

            <div
                className="
                    max-h-[92vh]
                    w-full
                    max-w-3xl
                    overflow-y-auto
                    rounded-2xl
                    border
                    border-pink-500/20
                    bg-[#101729]
                    shadow-2xl
                "
            >

                <div
                    className="
                        sticky
                        top-0
                        z-10
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-800
                        bg-[#101729]
                        px-6
                        py-5
                    "
                >

                    <div>

                        <h2
                            className="
                                text-xl
                                font-bold
                                text-white
                            "
                        >
                            {isEditing
                                ? "Edit Breakage"
                                : "Log Breakage"}
                        </h2>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-cyan-300
                            "
                        >
                            {isEditing
                                ? "Update damaged laboratory item details"
                                : "Record damaged laboratory items"}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="
                            text-2xl
                            text-slate-500
                            transition
                            hover:text-pink-400
                            disabled:opacity-40
                        "
                    >
                        ×
                    </button>

                </div>


                <form
                    onSubmit={onSubmit}
                    className="p-6"
                >

                    {photoError && (

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
                            {photoError}
                        </div>

                    )}


                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            md:grid-cols-2
                        "
                    >

                        <Field
                            label="Breakage Date"
                            type="date"
                            value={
                                form.breakageDate
                            }
                            onChange={(value) =>
                                update(
                                    "breakageDate",
                                    value
                                )
                            }
                            required
                        />


                        <Field
                            label="Breakage Time"
                            type="time"
                            value={
                                form.breakageTime
                            }
                            onChange={(value) =>
                                update(
                                    "breakageTime",
                                    value
                                )
                            }
                        />


                        <div
                            className="
                                md:col-span-2
                                rounded-xl
                                border
                                border-pink-500/20
                                bg-pink-500/5
                                p-4
                            "
                        >

                            <label>

                                <span
                                    className="
                                        mb-2
                                        block
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-pink-400
                                    "
                                >
                                    Inventory Item *
                                </span>


                                <select
                                    required
                                    value={
                                        form.inventoryItemId ??
                                        ""
                                    }
                                    disabled={
                                        itemsLoading ||
                                        saving
                                    }
                                    onChange={(event) =>
                                        update(
                                            "inventoryItemId",
                                            event.target.value
                                        )
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
                                        focus:border-pink-400
                                        focus:ring-1
                                        focus:ring-pink-400/20
                                    "
                                >

                                    <option value="">
                                        {itemsLoading
                                            ? "Loading active items..."
                                            : availableItems.length === 0
                                                ? "No active items available"
                                                : "Select an inventory item"}
                                    </option>


                                    {availableItems.map(
                                        (item) => (

                                            <option
                                                key={
                                                    item.id
                                                }
                                                value={
                                                    item.id
                                                }
                                            >
                                                {
                                                    item.itemName ||
                                                    "Unnamed Item"
                                                }
                                                {" — "}
                                                {
                                                    item.itemCode ||
                                                    `ID ${item.id}`
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </label>

                        </div>


                        <Field
                            label="Quantity"
                            type="number"
                            min="1"
                            step="1"
                            value={
                                form.quantity
                            }
                            onChange={(value) =>
                                update(
                                    "quantity",
                                    value
                                )
                            }
                            required
                        />


                        <div
                            className="
                                md:col-span-2
                            "
                        >

                            <h3
                                className="
                                    mb-3
                                    border-b
                                    border-slate-800
                                    pb-2
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-pink-400
                                "
                            >
                                Person Responsible
                            </h3>

                        </div>


                        <Field
                            label="Full Name"
                            value={
                                form.responsibleName
                            }
                            onChange={(value) =>
                                update(
                                    "responsibleName",
                                    value
                                )
                            }
                            required
                        />


                        <SelectField
                            label="Type"
                            value={
                                form.personType
                            }
                            onChange={(value) =>
                                update(
                                    "personType",
                                    value
                                )
                            }
                            options={
                                PERSON_TYPES
                            }
                        />


                        <Field
                            label="ID / Roll No."
                            value={
                                form.responsibleId
                            }
                            onChange={(value) =>
                                update(
                                    "responsibleId",
                                    value
                                )
                            }
                        />


                        <Field
                            label="Department / Class / Section"
                            value={
                                form.departmentClassSection
                            }
                            onChange={(value) =>
                                update(
                                    "departmentClassSection",
                                    value
                                )
                            }
                        />


                        <div
                            className="
                                md:col-span-2
                            "
                        >

                            <h3
                                className="
                                    mb-3
                                    border-b
                                    border-slate-800
                                    pb-2
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-cyan-400
                                "
                            >
                                Financial Details
                            </h3>

                        </div>


                        <Field
                            label="Estimated Cost (₹)"
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                                form.estimatedCost
                            }
                            onChange={(value) =>
                                update(
                                    "estimatedCost",
                                    value
                                )
                            }
                        />


                        <SelectField
                            label="Recovery Status"
                            value={
                                form.recoveryStatus
                            }
                            onChange={(value) =>
                                update(
                                    "recoveryStatus",
                                    value
                                )
                            }
                            options={
                                RECOVERY_STATUS
                            }
                        />


                        <div
                            className="
                                md:col-span-2
                            "
                        >

                            <TextArea
                                label="Cause / Description"
                                value={
                                    form.cause
                                }
                                onChange={(value) =>
                                    update(
                                        "cause",
                                        value
                                    )
                                }
                                required
                            />

                        </div>


                        <div
                            className="
                                md:col-span-2
                            "
                        >

                            <TextArea
                                label="Remarks"
                                value={
                                    form.remarks
                                }
                                onChange={(value) =>
                                    update(
                                        "remarks",
                                        value
                                    )
                                }
                            />

                        </div>


                        <div
                            className="
                                md:col-span-2
                            "
                        >

                            <h3
                                className="
                                    mb-3
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-pink-400
                                "
                            >
                                Breakage Evidence
                            </h3>


                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-dashed
                                    border-pink-500/30
                                    bg-pink-500/5
                                    p-4
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-white
                                    "
                                >
                                    Upload Breakage Photo
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    JPG, PNG or WEBP · Maximum 5 MB
                                </p>


                                <input
                                    ref={
                                        fileInputRef
                                    }
                                    type="file"
                                    id="breakage-photo-input"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={
                                        onPhotoChange
                                    }
                                    className="hidden"
                                />


                                <label
                                    htmlFor="breakage-photo-input"
                                    className="
                                        mt-4
                                        flex
                                        w-full
                                        cursor-pointer
                                        items-center
                                        justify-center
                                        rounded-lg
                                        border
                                        border-slate-700
                                        bg-[#111a2e]
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-cyan-300
                                        transition
                                        hover:border-pink-500/50
                                        hover:bg-pink-500/10
                                    "
                                >
                                    📷 Choose Breakage Photo
                                </label>


                                {breakagePhoto &&
                                    photoPreview && (

                                    <div
                                        className="
                                            mt-4
                                            flex
                                            items-center
                                            gap-4
                                            rounded-xl
                                            border
                                            border-slate-700
                                            bg-[#0b1120]
                                            p-3
                                        "
                                    >

                                        <img
                                            src={
                                                photoPreview
                                            }
                                            alt="Breakage evidence"
                                            className="
                                                h-20
                                                w-20
                                                rounded-lg
                                                object-cover
                                            "
                                        />

                                        <div>

                                            <p
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                "
                                            >
                                                {
                                                    breakagePhoto.name
                                                }
                                            </p>

                                            <button
                                                type="button"
                                                onClick={
                                                    onRemovePhoto
                                                }
                                                className="
                                                    mt-2
                                                    text-xs
                                                    font-semibold
                                                    text-red-400
                                                    hover:text-red-300
                                                "
                                            >
                                                Remove Photo
                                            </button>

                                        </div>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>


                    <div
                        className="
                            mt-6
                            flex
                            justify-end
                            gap-3
                            border-t
                            border-slate-800
                            pt-5
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="
                                rounded-lg
                                border
                                border-slate-700
                                px-5
                                py-2.5
                                text-sm
                                text-slate-300
                                transition
                                hover:bg-slate-800
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={saving}
                            className="
                                rounded-lg
                                border
                                border-pink-500/40
                                bg-pink-600
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                shadow-lg
                                shadow-pink-600/10
                                transition
                                hover:bg-pink-500
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {saving
                                ? "Saving..."
                                : isEditing
                                    ? "Update Breakage"
                                    : "Log Breakage"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


/* =============================================================
 * BREAKAGE DETAILS
 * ============================================================= */

function BreakageDetails({
    record,
    evidence = [],
    evidenceLoading = false,
    evidenceError = "",
    evidenceImageUrls = [],
    onClose
}) {

    const value = (
        first,
        second,
        third
    ) =>
        record?.[first] ??
        record?.[second] ??
        record?.[third] ??
        "—";


    return (

        <div
            className="
                fixed
                inset-0
                z-[60]
                flex
                items-center
                justify-center
                bg-black/75
                p-4
                backdrop-blur-sm
            "
        >

            <div
                className="
                    max-h-[90vh]
                    w-full
                    max-w-3xl
                    overflow-y-auto
                    rounded-2xl
                    border
                    border-cyan-500/20
                    bg-[#101729]
                    shadow-2xl
                "
            >

                <div
                    className="
                        sticky
                        top-0
                        z-10
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-800
                        bg-[#101729]
                        px-6
                        py-5
                    "
                >

                    <div>

                        <h2
                            className="
                                text-xl
                                font-bold
                                text-white
                            "
                        >
                            Breakage Details
                        </h2>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-cyan-300
                            "
                        >
                            Complete breakage record
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            text-2xl
                            text-slate-500
                            hover:text-pink-400
                        "
                    >
                        ×
                    </button>

                </div>


                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4
                        p-6
                        md:grid-cols-2
                    "
                >

                    <Info
                        label="Item"
                        value={
                            value(
                                "itemName",
                                "inventoryItemName",
                                "inventoryItem"
                            )
                        }
                        color="blue"
                    />

                    <Info
                        label="Item ID"
                        value={
                            value(
                                "inventoryItemId",
                                "itemId",
                                "id"
                            )
                        }
                        color="violet"
                    />

                    <Info
                        label="Quantity"
                        value={
                            value(
                                "quantity",
                                "qty"
                            )
                        }
                        color="purple"
                    />

                    <Info
                        label="Person"
                        value={
                            value(
                                "responsibleName",
                                "personName",
                                "brokenBy"
                            )
                        }
                        color="pink"
                    />

                    <Info
                        label="Person Type"
                        value={
                            value(
                                "personType",
                                "type"
                            )
                        }
                        color="cyan"
                    />

                    <Info
                        label="ID / Roll No."
                        value={
                            value(
                                "responsibleId",
                                "personId",
                                "brokenById"
                            )
                        }
                        color="amber"
                    />

                    <Info
                        label="Department / Class"
                        value={
                            value(
                                "departmentClassSection",
                                "departmentOrClass",
                                "department"
                            )
                        }
                        color="orange"
                    />

                    <Info
                        label="Date & Time"
                        value={
                            record?.breakageDateTime
                                ? new Date(
                                    record.breakageDateTime
                                ).toLocaleString(
                                    "en-IN"
                                )
                                : "—"
                        }
                        color="cyan"
                    />

                    <Info
                        label="Cost"
                        value={
                            `₹${Number(
                                record?.estimatedCost ??
                                record?.cost ??
                                0
                            ).toLocaleString(
                                "en-IN"
                            )}`
                        }
                        color="red"
                    />

                    <Info
                        label="Recovery"
                        value={
                            value(
                                "recoveryStatus",
                                "status"
                            )
                        }
                        color="emerald"
                    />


                    <div
                        className="
                            md:col-span-2
                        "
                    >

                        <Info
                            label="Cause"
                            value={
                                record?.cause ||
                                "—"
                            }
                            color="orange"
                        />

                    </div>


                    <div
                        className="
                            md:col-span-2
                        "
                    >

                        <Info
                            label="Remarks"
                            value={
                                record?.remarks ||
                                record?.remark ||
                                "—"
                            }
                            color="cyan"
                        />

                    </div>


                    <div
                        className="
                            md:col-span-2
                        "
                    >

                        <div
                            className="
                                mb-3
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <h3
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-pink-400
                                "
                            >
                                Breakage Evidence
                            </h3>

                            <div
                                className="
                                    h-px
                                    flex-1
                                    bg-slate-800
                                "
                            />

                        </div>


                        <div
                            className="
                                rounded-xl
                                border
                                border-slate-800
                                bg-[#080d1b]
                                p-4
                            "
                        >

                            {evidenceLoading ? (

                                <div
                                    className="
                                        py-10
                                        text-center
                                        text-sm
                                        text-cyan-300
                                    "
                                >
                                    Loading breakage photo...
                                </div>

                            ) : evidenceImageUrls.length > 0 ? (

                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-4
                                        md:grid-cols-2
                                    "
                                >

                                    {evidenceImageUrls.map(
                                        (image) => (

                                            <div
                                                key={
                                                    image.id
                                                }
                                                className="
                                                    overflow-hidden
                                                    rounded-xl
                                                    border
                                                    border-slate-700
                                                    bg-[#101729]
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        min-h-[260px]
                                                        items-center
                                                        justify-center
                                                        p-3
                                                    "
                                                >

                                                    <img
                                                        src={
                                                            image.url
                                                        }
                                                        alt={
                                                            image.fileName ||
                                                            "Breakage evidence"
                                                        }
                                                        className="
                                                            max-h-[420px]
                                                            w-full
                                                            rounded-lg
                                                            object-contain
                                                        "
                                                    />

                                                </div>

                                                <div
                                                    className="
                                                        border-t
                                                        border-slate-800
                                                        px-4
                                                        py-3
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            truncate
                                                            text-sm
                                                            font-semibold
                                                            text-cyan-300
                                                        "
                                                    >
                                                        {
                                                            image.fileName
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <div
                                    className="
                                        py-10
                                        text-center
                                    "
                                >

                                    <div
                                        className="
                                            mb-3
                                            text-4xl
                                        "
                                    >
                                        📷
                                    </div>

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-slate-400
                                        "
                                    >
                                        No breakage photo available
                                    </p>

                                    {evidenceError && (

                                        <p
                                            className="
                                                mt-2
                                                text-xs
                                                text-red-300
                                            "
                                        >
                                            {evidenceError}
                                        </p>

                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


/* =============================================================
 * FIELD
 * ============================================================= */

function Field({
    label,
    value,
    onChange,
    type = "text",
    required = false,
    min,
    step
}) {

    return (

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

                {label}

                {required && (

                    <span className="ml-1 text-red-400">
                        *
                    </span>

                )}

            </span>


            <input
                type={type}
                min={min}
                step={step}
                required={required}
                value={
                    value ?? ""
                }
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                className="
                    w-full
                    rounded-lg
                    border
                    border-slate-700
                    bg-[#080d1b]
                    px-3.5
                    py-2.5
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-slate-600
                    focus:border-cyan-400
                    focus:ring-1
                    focus:ring-cyan-400/20
                "
            />

        </label>

    );

}


/* =============================================================
 * SELECT FIELD
 * ============================================================= */

function SelectField({
    label,
    value,
    onChange,
    options
}) {

    return (

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
                {label}
            </span>


            <select
                value={
                    value ?? ""
                }
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                className="
                    w-full
                    rounded-lg
                    border
                    border-slate-700
                    bg-[#080d1b]
                    px-3.5
                    py-2.5
                    text-sm
                    text-white
                    outline-none
                    focus:border-cyan-400
                    focus:ring-1
                    focus:ring-cyan-400/20
                "
            >

                {options.map(
                    (option) => (

                        <option
                            key={option}
                            value={option}
                        >
                            {option.replaceAll(
                                "_",
                                " "
                            )}
                        </option>

                    )
                )}

            </select>

        </label>

    );

}


/* =============================================================
 * TEXT AREA
 * ============================================================= */

function TextArea({
    label,
    value,
    onChange,
    required = false
}) {

    return (

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

                {label}

                {required && (

                    <span className="ml-1 text-red-400">
                        *
                    </span>

                )}

            </span>


            <textarea
                rows={4}
                required={required}
                value={
                    value ?? ""
                }
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                className="
                    w-full
                    resize-none
                    rounded-lg
                    border
                    border-slate-700
                    bg-[#080d1b]
                    px-3.5
                    py-2.5
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-slate-600
                    focus:border-cyan-400
                    focus:ring-1
                    focus:ring-cyan-400/20
                "
            />

        </label>

    );

}


/* =============================================================
 * INFO
 * ============================================================= */

function Info({
    label,
    value,
    color = "cyan"
}) {

    const colors = {

        cyan:
            "text-cyan-400",

        blue:
            "text-blue-400",

        violet:
            "text-violet-400",

        purple:
            "text-purple-400",

        pink:
            "text-pink-400",

        amber:
            "text-amber-400",

        orange:
            "text-orange-400",

        red:
            "text-red-400",

        emerald:
            "text-emerald-400"

    };


    return (

        <div
            className="
                rounded-lg
                border
                border-slate-800
                bg-[#080d1b]
                p-4
            "
        >

            <p
                className={`
                    text-xs
                    uppercase
                    tracking-wide
                    ${colors[color] || colors.cyan}
                `}
            >
                {label}
            </p>


            <p
                className="
                    mt-1
                    break-words
                    text-sm
                    font-medium
                    text-slate-200
                "
            >
                {value}
            </p>

        </div>

    );

}


export default BreakageRegister;