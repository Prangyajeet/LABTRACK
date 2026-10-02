import { useEffect, useMemo, useState } from "react";

import {
    Search,
    Plus,
    RefreshCw,
    Eye,
    Pencil,
    Trash2,
    X,
    Package,
    Activity,
    Building2,
    CalendarDays,
    Clock3,
    UserRound,
    FileText,
    AlertCircle,
    CheckCircle2,
    ClipboardList,
    Hash,
    Layers3,
    Image as ImageIcon
} from "lucide-react";

import {
    getConsumableItems,
    getUsageRecords,
    getUsageSummary,
    logConsumableUsage,
    getUsageById,
    updateUsage,
    deleteUsage,
    uploadUsagePhoto,
    getUsagePhoto,
    deleteUsagePhoto
} from "../../services/dailyConsumableService";

import * as departmentService
    from "../../services/departmentService";


function DailyConsumables() {

    // =========================================================
    // STATE
    // =========================================================

    const [usageRecords, setUsageRecords] = useState([]);
    const [consumableItems, setConsumableItems] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [summary, setSummary] = useState({
        totalTransactions: 0,
        totalQuantityUsed: 0,
        totalUsageValue: 0,
        departmentSummaries: []
    });

    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(false);

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");

    const [showUsageModal, setShowUsageModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const [editingUsageId, setEditingUsageId] = useState(null);
    const [selectedUsage, setSelectedUsage] = useState(null);

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);


    // =========================================================
    // FORM
    // =========================================================

    const getCurrentDate = () => {

        const now = new Date();

        return `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}-${String(
            now.getDate()
        ).padStart(2, "0")}`;
    };


    const getCurrentTime = () => {

        const now = new Date();

        return `${String(
            now.getHours()
        ).padStart(2, "0")}:${String(
            now.getMinutes()
        ).padStart(2, "0")}`;
    };


    const getInitialForm = () => ({
        itemId: "",
        quantityUsed: "",
        facultyStaffName: "",
        designation: "",
        departmentId: "",
        purposeTest: "",
        usageDate: getCurrentDate(),
        usageTime: getCurrentTime(),
        remarks: ""
    });


    const [form, setForm] = useState(
        getInitialForm()
    );

    const [formErrors, setFormErrors] = useState({});

    const [usagePhotoFile, setUsagePhotoFile] =
        useState(null);

    const [usagePhotoPreviewUrl, setUsagePhotoPreviewUrl] =
        useState(null);

    const [detailsPhotoUrl, setDetailsPhotoUrl] =
        useState(null);

    const [photoLoading, setPhotoLoading] =
        useState(false);


    // =========================================================
    // DEPARTMENT NORMALIZATION
    // =========================================================

    const normalizeDepartments = (response) => {

        if (Array.isArray(response)) {
            return response;
        }

        if (Array.isArray(response?.data)) {
            return response.data;
        }

        if (Array.isArray(response?.content)) {
            return response.content;
        }

        if (Array.isArray(response?.data?.content)) {
            return response.data.content;
        }

        return [];
    };


    // =========================================================
    // LOAD MASTER DATA
    // =========================================================

    const loadMasterData = async () => {

        try {

            const [
                itemsResponse,
                departmentsResponse
            ] = await Promise.all([
                getConsumableItems(),

                departmentService.getAllDepartments(
                    0,
                    1000,
                    "departmentName",
                    "asc",
                    ""
                )
            ]);


            setConsumableItems(
                Array.isArray(itemsResponse)
                    ? itemsResponse
                    : []
            );


            setDepartments(
                normalizeDepartments(
                    departmentsResponse
                )
            );

        }
        catch (err) {

            console.error(
                "Failed to load master data:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load consumable items or departments."
            );
        }
    };


    // =========================================================
    // LOAD USAGE
    // =========================================================

    const loadUsageRecords = async () => {

        try {

            setLoading(true);
            setError(null);

            const response =
                await getUsageRecords({
                    date: selectedDate,
                    departmentId: selectedDepartment,
                    search: search.trim()
                });


            setUsageRecords(
                Array.isArray(response)
                    ? response
                    : []
            );

        }
        catch (err) {

            console.error(
                "Failed to load usage:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load consumable usage."
            );

            setUsageRecords([]);

        }
        finally {

            setLoading(false);

        }
    };


    // =========================================================
    // LOAD SUMMARY
    // =========================================================

    const loadSummary = async () => {

        try {

            setSummaryLoading(true);

            const response =
                await getUsageSummary({
                    date: selectedDate,
                    departmentId: selectedDepartment,
                    search: search.trim()
                });


            setSummary(
                response || {
                    totalTransactions: 0,
                    totalQuantityUsed: 0,
                    totalUsageValue: 0,
                    departmentSummaries: []
                }
            );

        }
        catch (err) {

            console.error(
                "Failed to load summary:",
                err
            );

        }
        finally {

            setSummaryLoading(false);

        }
    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadMasterData();

    }, []);


    useEffect(() => {

        loadUsageRecords();
        loadSummary();

    }, [
        selectedDate,
        selectedDepartment
    ]);


    useEffect(() => {

        const timer = setTimeout(() => {

            loadUsageRecords();
            loadSummary();

        }, 400);

        return () => clearTimeout(timer);

    }, [search]);


    // =========================================================
    // HELPERS
    // =========================================================

    const getDepartmentName = (departmentId) => {

        const department =
            departments.find(
                (item) =>
                    Number(
                        item.id ??
                        item.departmentId
                    ) === Number(departmentId)
            );

        return (
            department?.departmentName ??
            department?.name ??
            "-"
        );
    };


    const getItemName = (itemId) => {

        const item =
            consumableItems.find(
                (item) =>
                    Number(
                        item.id ??
                        item.inventoryItemId
                    ) === Number(itemId)
            );

        return item?.itemName ?? "-";
    };


    const getItemCode = (itemId) => {

        const item =
            consumableItems.find(
                (item) =>
                    Number(
                        item.id ??
                        item.inventoryItemId
                    ) === Number(itemId)
            );

        return item?.itemCode ?? "-";
    };


    const getItemStock = (itemId) => {

        const item =
            consumableItems.find(
                (item) =>
                    Number(
                        item.id ??
                        item.inventoryItemId
                    ) === Number(itemId)
            );

        return Number(
            item?.quantity ??
            item?.currentStock ??
            0
        );
    };


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        try {

            return new Date(
                `${date}T00:00:00`
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

        }
        catch {

            return date;

        }
    };


    const formatDateTimeValue = (value) => {

        if (!value) {
            return "-";
        }

        try {

            return new Date(
                value
            ).toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        }
        catch {

            return value;

        }
    };


    // =========================================================
    // FORM
    // =========================================================

    const resetForm = () => {

        setForm(
            getInitialForm()
        );

        setFormErrors({});
        setEditingUsageId(null);

        if (usagePhotoPreviewUrl) {
            URL.revokeObjectURL(
                usagePhotoPreviewUrl
            );
        }

        setUsagePhotoFile(null);
        setUsagePhotoPreviewUrl(null);

    };


    const handleFormChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setForm(
            previous => ({
                ...previous,
                [name]: value
            })
        );


        setFormErrors(
            previous => ({
                ...previous,
                [name]: ""
            })
        );
    };


    // =========================================================
    // USAGE PHOTO
    // =========================================================

    const handleUsagePhotoChange = (event) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {

            setError(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            );

            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {

            setError(
                "Usage photo must not exceed 5 MB."
            );

            event.target.value = "";
            return;
        }

        setError(null);

        if (usagePhotoPreviewUrl) {
            URL.revokeObjectURL(
                usagePhotoPreviewUrl
            );
        }

        setUsagePhotoFile(file);

        setUsagePhotoPreviewUrl(
            URL.createObjectURL(file)
        );
    };


    // =========================================================
    // VALIDATION
    // =========================================================

    const validateForm = () => {

        const errors = {};


        if (!form.itemId) {
            errors.itemId =
                "Item Used is required.";
        }


        if (
            !form.quantityUsed ||
            Number(form.quantityUsed) <= 0
        ) {
            errors.quantityUsed =
                "Quantity Used must be greater than 0.";
        }


        if (
            form.itemId &&
            Number(form.quantityUsed) >
            getItemStock(form.itemId) &&
            !editingUsageId
        ) {

            errors.quantityUsed =
                `Only ${getItemStock(
                    form.itemId
                )} units are available.`;
        }


        if (!form.facultyStaffName.trim()) {
            errors.facultyStaffName =
                "Faculty/Staff is required.";
        }


        if (!form.departmentId) {
            errors.departmentId =
                "Department is required.";
        }


        if (!form.usageDate) {
            errors.usageDate =
                "Date is required.";
        }


        if (!form.usageTime) {
            errors.usageTime =
                "Time is required.";
        }


        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };


    // =========================================================
    // CREATE
    // =========================================================

    const openCreateModal = () => {

        resetForm();

        setError(null);
        setSuccessMessage(null);

        setShowUsageModal(true);
    };


    // =========================================================
    // EDIT
    // =========================================================

    const openEditModal = async (usageId) => {

        try {

            setError(null);
            setSuccessMessage(null);

            const response =
                await getUsageById(
                    usageId
                );


            const usage =
                response || {};


            setForm({
                itemId:
                    usage.itemId ??
                    usage.inventoryItemId ??
                    "",

                quantityUsed:
                    usage.quantityUsed ??
                    usage.quantity ??
                    "",

                facultyStaffName:
                    usage.facultyStaffName ??
                    "",

                designation:
                    usage.designation ??
                    "",

                departmentId:
                    usage.departmentId ??
                    "",

                purposeTest:
                    usage.purposeTest ??
                    "",

                usageDate:
                    usage.usageDate ??
                    "",

                usageTime:
                    usage.usageTime ??
                    "",

                remarks:
                    usage.remarks ??
                    ""
            });


            setEditingUsageId(
                usageId
            );

            if (usagePhotoPreviewUrl) {
                URL.revokeObjectURL(
                    usagePhotoPreviewUrl
                );
            }

            setUsagePhotoFile(null);
            setUsagePhotoPreviewUrl(null);

            if (usage.photoAvailable) {

                try {

                    const photoBlob =
                        await getUsagePhoto(
                            usageId
                        );

                    setUsagePhotoPreviewUrl(
                        URL.createObjectURL(
                            photoBlob
                        )
                    );

                }
                catch (photoError) {

                    console.error(
                        "Failed to load existing usage photo:",
                        photoError
                    );

                }

            }

            setFormErrors({});
            setShowUsageModal(true);

        }
        catch (err) {

            console.error(
                "Failed to load usage:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load usage details."
            );
        }
    };


    // =========================================================
    // SAVE
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError(null);
        setSuccessMessage(null);


        if (!validateForm()) {
            return;
        }


        try {

            setSaving(true);


            const payload = {

                itemId:
                    Number(form.itemId),

                quantityUsed:
                    Number(form.quantityUsed),

                facultyStaffName:
                    form.facultyStaffName.trim(),

                designation:
                    form.designation.trim() ||
                    null,

                departmentId:
                    Number(form.departmentId),

                purposeTest:
                    form.purposeTest.trim() ||
                    null,

                usageDate:
                    form.usageDate,

                usageTime:
                    form.usageTime,

                remarks:
                    form.remarks.trim() ||
                    null
            };


            let savedUsage;

            if (editingUsageId) {

                savedUsage =
                    await updateUsage(
                        editingUsageId,
                        payload
                    );

                setSuccessMessage(
                    "Consumable usage updated successfully."
                );

            }
            else {

                savedUsage =
                    await logConsumableUsage(
                        payload
                    );

                setSuccessMessage(
                    "Consumable usage logged successfully."
                );

            }

            if (
                usagePhotoFile &&
                savedUsage?.id
            ) {

                await uploadUsagePhoto(
                    savedUsage.id,
                    usagePhotoFile
                );

                setSuccessMessage(
                    editingUsageId
                        ? "Consumable usage and photo updated successfully."
                        : "Consumable usage and photo logged successfully."
                );
            }


            setShowUsageModal(false);

            resetForm();


            await Promise.all([
                loadUsageRecords(),
                loadSummary(),
                loadMasterData()
            ]);

        }
        catch (err) {

            console.error(
                "Failed to save usage:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to save consumable usage."
            );

        }
        finally {

            setSaving(false);

        }
    };


    // =========================================================
    // VIEW
    // =========================================================

    const openDetailsModal = async (usageId) => {

        try {

            setError(null);

            const response =
                await getUsageById(
                    usageId
                );


            setSelectedUsage(
                response || null
            );

            if (detailsPhotoUrl) {
                URL.revokeObjectURL(
                    detailsPhotoUrl
                );
            }

            setDetailsPhotoUrl(null);

            if (response?.photoAvailable) {

                setPhotoLoading(true);

                try {

                    const photoBlob =
                        await getUsagePhoto(
                            usageId
                        );

                    setDetailsPhotoUrl(
                        URL.createObjectURL(
                            photoBlob
                        )
                    );

                }
                catch (photoError) {

                    console.error(
                        "Failed to load usage photo:",
                        photoError
                    );

                }
                finally {

                    setPhotoLoading(false);

                }

            }

            setShowDetailsModal(true);

        }
        catch (err) {

            console.error(
                "Failed to load details:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load usage details."
            );
        }
    };


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (usage) => {

        const confirmed =
            window.confirm(
                "This will reverse the consumable usage and restore the stock. Continue?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(
                usage.id
            );

            setError(null);
            setSuccessMessage(null);


            await deleteUsage(
                usage.id
            );


            setSuccessMessage(
                "Consumable usage corrected and stock restored successfully."
            );


            await Promise.all([
                loadUsageRecords(),
                loadSummary(),
                loadMasterData()
            ]);

        }
        catch (err) {

            console.error(
                "Failed to correct usage:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to correct consumable usage."
            );

        }
        finally {

            setDeletingId(null);

        }
    };


    // =========================================================
    // FILTERS
    // =========================================================

    const clearFilters = () => {

        setSearch("");
        setSelectedDate("");
        setSelectedDepartment("");

    };


    const hasFilters =
        Boolean(
            search ||
            selectedDate ||
            selectedDepartment
        );


    const calculatedTotalQuantity =
        useMemo(
            () =>
                usageRecords.reduce(
                    (
                        total,
                        record
                    ) =>
                        total +
                        Number(
                            record.quantityUsed ??
                            record.quantity ??
                            0
                        ),
                    0
                ),
            [usageRecords]
        );


    const totalTransactions =
        summary?.totalTransactions ??
        usageRecords.length;


    const totalQuantityUsed =
        summary?.totalQuantityUsed ??
        calculatedTotalQuantity;


    // =========================================================
    // RETURN
    // =========================================================

    return (

        <div
            className="
                daily-consumables-page
                p-6
            "
        >

            {/* =====================================================
                CUSTOM GLOSSY STYLES
            ====================================================== */}

            <style>{`

                .daily-consumables-page {
                    --gloss-white: #f8fafc;
                }

                .daily-consumables-page h1,
                .daily-consumables-page h2 {
                    color: #f8fafc;
                    text-shadow:
                        0 0 8px rgba(255,255,255,0.12),
                        0 0 20px rgba(56,189,248,0.08);
                }

                .daily-consumables-page
                .summary-card {
                    position: relative;
                    overflow: hidden;
                }

                .daily-consumables-page
                .summary-card::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 12%;
                    right: 12%;
                    height: 1px;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255,255,255,0.28),
                        transparent
                    );
                }

                .daily-consumables-page
                .summary-card::after {
                    content: "";
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    top: -55px;
                    right: -35px;
                    border-radius: 9999px;
                    background: rgba(255,255,255,0.025);
                    filter: blur(3px);
                }

                .daily-consumables-page
                .section-heading {
                    letter-spacing: -0.015em;
                }

                .daily-consumables-page
                .table-heading {
                    color: #cbd5e1 !important;
                    text-shadow:
                        0 0 12px rgba(56,189,248,0.12);
                    letter-spacing: 0.065em;
                }

                .daily-consumables-page
                .summary-label {
                    letter-spacing: 0.04em;
                }

                .daily-consumables-page
                .summary-value {
                    letter-spacing: -0.04em;
                }

                .daily-consumables-page
                table tbody tr {
                    transition:
                        background-color 180ms ease,
                        box-shadow 180ms ease,
                        transform 180ms ease;
                }

                .daily-consumables-page
                table tbody tr:hover {
                    box-shadow:
                        inset 3px 0 0 rgba(34,211,238,0.55);
                }

                .daily-consumables-page
                button {
                    transition:
                        color 180ms ease,
                        background-color 180ms ease,
                        border-color 180ms ease,
                        box-shadow 180ms ease,
                        transform 180ms ease;
                }

                .daily-consumables-page
                button:hover:not(:disabled) {
                    transform: translateY(-1px);
                }

                .daily-consumables-page
                input,
                .daily-consumables-page
                select,
                .daily-consumables-page
                textarea {
                    transition:
                        border-color 180ms ease,
                        box-shadow 180ms ease;
                }

                .daily-consumables-page
                input::placeholder,
                .daily-consumables-page
                textarea::placeholder {
                    color: #64748b;
                }

                .daily-consumables-page
                select option {
                    background: #020617;
                    color: #f8fafc;
                }

            `}</style>


            {/* =====================================================
                PAGE HEADER
            ====================================================== */}

            <div
                className="
                    mb-7
                    flex
                    flex-col
                    gap-4
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >

                <div>

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
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-cyan-400/25
                                bg-gradient-to-br
                                from-cyan-400/15
                                via-blue-500/10
                                to-violet-500/10
                                shadow-[0_0_30px_rgba(34,211,238,0.12)]
                            "
                        >

                            <Activity
                                className="
                                    h-6
                                    w-6
                                    text-cyan-300
                                "
                            />

                        </div>


                        <div>

                            <h1
                                className="
                                    text-2xl
                                    font-extrabold
                                    text-white
                                "
                            >
                                Daily Consumables
                            </h1>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    font-medium
                                    text-slate-400
                                "
                            >
                                Manage and track consumable usage from laboratory stock.
                            </p>

                        </div>

                    </div>

                </div>


                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <button
                        type="button"
                        onClick={() => {

                            loadUsageRecords();
                            loadSummary();
                            loadMasterData();

                        }}
                        disabled={
                            loading ||
                            summaryLoading
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-blue-500/25
                            bg-gradient-to-r
                            from-blue-500/[0.08]
                            to-cyan-500/[0.04]
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-blue-200
                            hover:border-blue-400/40
                            hover:bg-blue-500/15
                            hover:shadow-[0_0_22px_rgba(59,130,246,0.14)]
                            disabled:opacity-50
                        "
                    >

                        <RefreshCw
                            className={`
                                h-4
                                w-4
                                text-blue-400
                                ${
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            `}
                        />

                        Refresh

                    </button>


                    <button
                        type="button"
                        onClick={
                            openCreateModal
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-cyan-300/25
                            bg-gradient-to-r
                            from-cyan-600
                            via-blue-600
                            to-violet-600
                            px-4
                            py-2.5
                            text-sm
                            font-bold
                            text-white
                            shadow-[0_0_25px_rgba(8,145,178,0.22)]
                            hover:from-cyan-500
                            hover:via-blue-500
                            hover:to-violet-500
                            hover:shadow-[0_0_32px_rgba(8,145,178,0.32)]
                        "
                    >

                        <Plus
                            className="h-4 w-4"
                        />

                        Log Usage

                    </button>

                </div>

            </div>


            {/* =====================================================
                MESSAGES
            ====================================================== */}

            {
                error && (

                    <div
                        className="
                            mb-5
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-red-500/25
                            bg-gradient-to-r
                            from-red-500/10
                            via-rose-500/5
                            to-transparent
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-red-200
                        "
                    >

                        <AlertCircle
                            className="
                                mt-0.5
                                h-4
                                w-4
                                shrink-0
                                text-red-400
                            "
                        />

                        <span className="flex-1">
                            {error}
                        </span>


                        <button
                            type="button"
                            onClick={() =>
                                setError(null)
                            }
                            className="
                                text-red-300
                                hover:text-white
                            "
                        >

                            <X
                                className="h-4 w-4"
                            />

                        </button>

                    </div>

                )
            }


            {
                successMessage && (

                    <div
                        className="
                            mb-5
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-emerald-500/25
                            bg-gradient-to-r
                            from-emerald-500/10
                            via-cyan-500/5
                            to-transparent
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-emerald-200
                        "
                    >

                        <CheckCircle2
                            className="
                                mt-0.5
                                h-4
                                w-4
                                text-emerald-400
                            "
                        />

                        <span className="flex-1">
                            {successMessage}
                        </span>


                        <button
                            type="button"
                            onClick={() =>
                                setSuccessMessage(null)
                            }
                            className="
                                text-emerald-300
                                hover:text-white
                            "
                        >

                            <X
                                className="h-4 w-4"
                            />

                        </button>

                    </div>

                )
            }


            {/* =====================================================
                SUMMARY CARDS
            ====================================================== */}

            <div
                className="
                    mb-7
                    grid
                    grid-cols-1
                    gap-5
                    sm:grid-cols-2
                    lg:grid-cols-3
                "
            >

                {/* TOTAL TRANSACTIONS */}

                <div
                    className="
                        summary-card
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-blue-400/20
                        bg-gradient-to-br
                        from-blue-500/[0.13]
                        via-blue-500/[0.035]
                        to-slate-900/80
                        p-5
                        shadow-[0_0_30px_rgba(59,130,246,0.08)]
                    "
                >

                    <div
                        className="
                            absolute
                            right-0
                            top-0
                            h-32
                            w-32
                            rounded-full
                            bg-blue-500/[0.08]
                            blur-3xl
                        "
                    />


                    <div
                        className="
                            relative
                            flex
                            items-start
                            justify-between
                        "
                    >

                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <div
                                    className="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-blue-400
                                        shadow-[0_0_10px_rgba(96,165,250,0.8)]
                                    "
                                />

                                <p
                                    className="
                                        summary-label
                                        text-xs
                                        font-bold
                                        uppercase
                                        text-blue-200/80
                                    "
                                >
                                    Total Transactions
                                </p>

                            </div>


                            <p
                                className="
                                    summary-value
                                    mt-3
                                    text-4xl
                                    font-black
                                    text-blue-200
                                    drop-shadow-[0_0_12px_rgba(96,165,250,0.25)]
                                "
                            >
                                {
                                    summaryLoading
                                        ? "..."
                                        : totalTransactions
                                }
                            </p>


                            <p
                                className="
                                    mt-2
                                    text-xs
                                    font-medium
                                    text-slate-400
                                "
                            >
                                Usage transactions recorded
                            </p>

                        </div>


                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-blue-400/25
                                bg-blue-500/10
                                shadow-[0_0_22px_rgba(59,130,246,0.14)]
                            "
                        >

                            <ClipboardList
                                className="
                                    h-6
                                    w-6
                                    text-blue-400
                                "
                            />

                        </div>

                    </div>

                </div>


                {/* TOTAL QUANTITY */}

                <div
                    className="
                        summary-card
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-emerald-400/20
                        bg-gradient-to-br
                        from-emerald-500/[0.13]
                        via-emerald-500/[0.035]
                        to-slate-900/80
                        p-5
                        shadow-[0_0_30px_rgba(16,185,129,0.08)]
                    "
                >

                    <div
                        className="
                            absolute
                            right-0
                            top-0
                            h-32
                            w-32
                            rounded-full
                            bg-emerald-500/[0.08]
                            blur-3xl
                        "
                    />


                    <div
                        className="
                            relative
                            flex
                            items-start
                            justify-between
                        "
                    >

                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <div
                                    className="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-emerald-400
                                        shadow-[0_0_10px_rgba(52,211,153,0.8)]
                                    "
                                />

                                <p
                                    className="
                                        summary-label
                                        text-xs
                                        font-bold
                                        uppercase
                                        text-emerald-200/80
                                    "
                                >
                                    Total Quantity Used
                                </p>

                            </div>


                            <p
                                className="
                                    summary-value
                                    mt-3
                                    text-4xl
                                    font-black
                                    text-emerald-200
                                    drop-shadow-[0_0_12px_rgba(52,211,153,0.25)]
                                "
                            >
                                {
                                    summaryLoading
                                        ? "..."
                                        : totalQuantityUsed
                                }
                            </p>


                            <p
                                className="
                                    mt-2
                                    text-xs
                                    font-medium
                                    text-slate-400
                                "
                            >
                                Total consumable quantity
                            </p>

                        </div>


                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-emerald-400/25
                                bg-emerald-500/10
                                shadow-[0_0_22px_rgba(16,185,129,0.14)]
                            "
                        >

                            <Package
                                className="
                                    h-6
                                    w-6
                                    text-emerald-400
                                "
                            />

                        </div>

                    </div>

                </div>


                {/* DEPARTMENTS */}

                <div
                    className="
                        summary-card
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-violet-400/20
                        bg-gradient-to-br
                        from-violet-500/[0.13]
                        via-violet-500/[0.035]
                        to-slate-900/80
                        p-5
                        shadow-[0_0_30px_rgba(139,92,246,0.08)]
                    "
                >

                    <div
                        className="
                            absolute
                            right-0
                            top-0
                            h-32
                            w-32
                            rounded-full
                            bg-violet-500/[0.08]
                            blur-3xl
                        "
                    />


                    <div
                        className="
                            relative
                            flex
                            items-start
                            justify-between
                        "
                    >

                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <div
                                    className="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-violet-400
                                        shadow-[0_0_10px_rgba(167,139,250,0.8)]
                                    "
                                />

                                <p
                                    className="
                                        summary-label
                                        text-xs
                                        font-bold
                                        uppercase
                                        text-violet-200/80
                                    "
                                >
                                    Departments Using Consumables
                                </p>

                            </div>


                            <p
                                className="
                                    summary-value
                                    mt-3
                                    text-4xl
                                    font-black
                                    text-violet-200
                                    drop-shadow-[0_0_12px_rgba(167,139,250,0.25)]
                                "
                            >
                                {
                                    summaryLoading
                                        ? "..."
                                        : (
                                            summary
                                                ?.departmentSummaries
                                                ?.length || 0
                                        )
                                }
                            </p>


                            <p
                                className="
                                    mt-2
                                    text-xs
                                    font-medium
                                    text-slate-400
                                "
                            >
                                Active laboratory departments
                            </p>

                        </div>


                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-violet-400/25
                                bg-violet-500/10
                                shadow-[0_0_22px_rgba(139,92,246,0.14)]
                            "
                        >

                            <Building2
                                className="
                                    h-6
                                    w-6
                                    text-violet-400
                                "
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
                DEPARTMENT-WISE USAGE
            ====================================================== */}

            {
                summary?.departmentSummaries?.length > 0 && (

                    <div
                        className="
                            mb-7
                            overflow-hidden
                            rounded-2xl
                            border
                            border-violet-500/20
                            bg-gradient-to-br
                            from-violet-500/[0.055]
                            via-slate-900/80
                            to-blue-500/[0.035]
                            shadow-[0_0_35px_rgba(139,92,246,0.06)]
                        "
                    >

                        <div
                            className="
                                border-b
                                border-violet-500/10
                                bg-gradient-to-r
                                from-violet-500/[0.08]
                                via-transparent
                                to-blue-500/[0.05]
                                px-5
                                py-5
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
                                        border
                                        border-violet-400/20
                                        bg-violet-500/10
                                        shadow-[0_0_18px_rgba(139,92,246,0.12)]
                                    "
                                >

                                    <Layers3
                                        className="
                                            h-5
                                            w-5
                                            text-violet-400
                                        "
                                    />

                                </div>


                                <div>

                                    <h2
                                        className="
                                            section-heading
                                            text-lg
                                            font-bold
                                            text-white
                                        "
                                    >
                                        Department-wise Usage
                                    </h2>


                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-400
                                        "
                                    >
                                        Consumable usage grouped by department.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead>

                                    <tr
                                        className="
                                            border-b
                                            border-slate-800
                                            bg-slate-950/60
                                        "
                                    >

                                        <th
                                            className="
                                                table-heading
                                                px-5
                                                py-4
                                                text-left
                                                text-[11px]
                                                font-extrabold
                                                uppercase
                                            "
                                        >
                                            Department
                                        </th>

                                        <th
                                            className="
                                                table-heading
                                                px-5
                                                py-4
                                                text-left
                                                text-[11px]
                                                font-extrabold
                                                uppercase
                                            "
                                        >
                                            Transactions
                                        </th>

                                        <th
                                            className="
                                                table-heading
                                                px-5
                                                py-4
                                                text-left
                                                text-[11px]
                                                font-extrabold
                                                uppercase
                                            "
                                        >
                                            Quantity Used
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {
                                        summary.departmentSummaries.map(
                                            department => (

                                                <tr
                                                    key={
                                                        department.departmentId
                                                    }
                                                    className="
                                                        border-b
                                                        border-slate-800
                                                        last:border-b-0
                                                        hover:bg-violet-500/[0.045]
                                                    "
                                                >

                                                    <td
                                                        className="
                                                            px-5
                                                            py-4
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
                                                                    h-8
                                                                    w-8
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    border
                                                                    border-violet-400/20
                                                                    bg-violet-500/10
                                                                "
                                                            >

                                                                <Building2
                                                                    className="
                                                                        h-4
                                                                        w-4
                                                                        text-violet-400
                                                                    "
                                                                />

                                                            </div>


                                                            <span
                                                                className="
                                                                    font-bold
                                                                    text-violet-200
                                                                "
                                                            >
                                                                {
                                                                    department.departmentName ??
                                                                    getDepartmentName(
                                                                        department.departmentId
                                                                    )
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    <td
                                                        className="
                                                            px-5
                                                            py-4
                                                        "
                                                    >

                                                        <span
                                                            className="
                                                                inline-flex
                                                                min-w-[38px]
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                border
                                                                border-blue-400/20
                                                                bg-blue-500/10
                                                                px-3
                                                                py-1.5
                                                                text-sm
                                                                font-extrabold
                                                                text-blue-300
                                                                shadow-[0_0_12px_rgba(59,130,246,0.06)]
                                                            "
                                                        >
                                                            {
                                                                department.transactionCount ??
                                                                0
                                                            }
                                                        </span>

                                                    </td>


                                                    <td
                                                        className="
                                                            px-5
                                                            py-4
                                                        "
                                                    >

                                                        <span
                                                            className="
                                                                inline-flex
                                                                min-w-[38px]
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                border
                                                                border-emerald-400/20
                                                                bg-emerald-500/10
                                                                px-3
                                                                py-1.5
                                                                text-sm
                                                                font-extrabold
                                                                text-emerald-300
                                                                shadow-[0_0_12px_rgba(16,185,129,0.06)]
                                                            "
                                                        >
                                                            {
                                                                department.totalQuantityUsed ??
                                                                0
                                                            }
                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )
                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>

                )
            }


            {/* =====================================================
                FILTER BAR
            ====================================================== */}

            <div
                className="
                    mb-7
                    rounded-2xl
                    border
                    border-cyan-500/15
                    bg-gradient-to-r
                    from-cyan-500/[0.035]
                    via-slate-900/80
                    to-violet-500/[0.035]
                    p-4
                "
            >

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-3
                        md:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    <div className="relative">

                        <Search
                            className="
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-cyan-400
                            "
                        />


                        <input
                            type="text"
                            value={search}
                            onChange={event =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search item or faculty/staff..."
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-950/80
                                py-2.5
                                pl-9
                                pr-3
                                text-sm
                                text-slate-200
                                focus:border-cyan-500
                                focus:outline-none
                                focus:ring-1
                                focus:ring-cyan-500
                            "
                        />

                    </div>


                    <div className="relative">

                        <CalendarDays
                            className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-blue-400
                            "
                        />


                        <input
                            type="date"
                            value={selectedDate}
                            onChange={event =>
                                setSelectedDate(
                                    event.target.value
                                )
                            }
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-950/80
                                py-2.5
                                pl-9
                                pr-3
                                text-sm
                                text-slate-200
                                focus:border-blue-500
                                focus:outline-none
                                focus:ring-1
                                focus:ring-blue-500
                            "
                        />

                    </div>


                    <div className="relative">

                        <Building2
                            className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-violet-400
                            "
                        />


                        <select
                            value={selectedDepartment}
                            onChange={event =>
                                setSelectedDepartment(
                                    event.target.value
                                )
                            }
                            className="
                                w-full
                                appearance-none
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-950/80
                                py-2.5
                                pl-9
                                pr-3
                                text-sm
                                text-slate-200
                                focus:border-violet-500
                                focus:outline-none
                                focus:ring-1
                                focus:ring-violet-500
                            "
                        >

                            <option value="">
                                All Departments
                            </option>


                            {
                                departments.map(
                                    department => {

                                        const id =
                                            department.id ??
                                            department.departmentId;


                                        return (

                                            <option
                                                key={id}
                                                value={id}
                                            >
                                                {
                                                    department.departmentName ??
                                                    department.name ??
                                                    "-"
                                                }
                                            </option>

                                        );

                                    }
                                )
                            }

                        </select>

                    </div>


                    <button
                        type="button"
                        onClick={
                            clearFilters
                        }
                        disabled={
                            !hasFilters
                        }
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-rose-500/20
                            bg-rose-500/[0.035]
                            px-4
                            py-2.5
                            text-sm
                            font-bold
                            text-rose-300
                            hover:border-rose-400/30
                            hover:bg-rose-500/10
                            hover:text-rose-200
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >

                        <X
                            className="h-4 w-4"
                        />

                        Clear Filters

                    </button>

                </div>

            </div>


            {/* =====================================================
                RECORDS
            ====================================================== */}

            <div
                className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-blue-500/15
                    bg-gradient-to-br
                    from-blue-500/[0.025]
                    via-slate-900/80
                    to-violet-500/[0.025]
                    shadow-[0_0_35px_rgba(59,130,246,0.045)]
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        border-b
                        border-slate-800
                        bg-gradient-to-r
                        from-blue-500/[0.045]
                        to-violet-500/[0.035]
                        px-5
                        py-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div>

                        <h2
                            className="
                                section-heading
                                text-lg
                                font-bold
                                text-white
                            "
                        >
                            Consumable Usage Records
                        </h2>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-400
                            "
                        >
                            Usage records linked with laboratory stock transactions.
                        </p>

                    </div>


                    <div
                        className="
                            inline-flex
                            w-fit
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-cyan-500/20
                            bg-cyan-500/[0.05]
                            px-3
                            py-1.5
                            text-xs
                            font-bold
                            text-cyan-300
                        "
                    >

                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-cyan-400
                                shadow-[0_0_8px_rgba(34,211,238,0.8)]
                            "
                        />

                        {usageRecords.length}
                        {" "}
                        record
                        {
                            usageRecords.length !== 1
                                ? "s"
                                : ""
                        }

                    </div>

                </div>


                {
                    loading ? (

                        <div
                            className="
                                p-14
                                text-center
                            "
                        >

                            <RefreshCw
                                className="
                                    mx-auto
                                    h-7
                                    w-7
                                    animate-spin
                                    text-cyan-400
                                "
                            />

                            <p
                                className="
                                    mt-4
                                    text-sm
                                    font-semibold
                                    text-slate-300
                                "
                            >
                                Loading consumable usage...
                            </p>

                        </div>

                    ) : usageRecords.length === 0 ? (

                        <div
                            className="
                                p-14
                                text-center
                            "
                        >

                            <Package
                                className="
                                    mx-auto
                                    h-10
                                    w-10
                                    text-slate-700
                                "
                            />


                            <p
                                className="
                                    mt-4
                                    font-semibold
                                    text-slate-200
                                "
                            >
                                No consumable usage records found.
                            </p>


                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Try changing your filters or log a new usage record.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table
                                className="
                                    w-full
                                    min-w-[1250px]
                                "
                            >

                                {/* =============================
                                    TABLE HEADER
                                ============================== */}

                                <thead>

                                    <tr
                                        className="
                                            border-b
                                            border-slate-700/80
                                            bg-slate-950/70
                                        "
                                    >

                                        <th
                                            className="
                                                table-heading
                                                px-5
                                                py-4
                                                text-left
                                                text-[10px]
                                                font-extrabold
                                                uppercase
                                            "
                                        >
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="h-3.5 w-3.5 text-blue-400" />
                                                Date & Time
                                            </div>
                                        </th>


                                        <th
                                            className="
                                                table-heading
                                                px-5
                                                py-4
                                                text-left
                                                text-[10px]
                                                font-extrabold
                                                uppercase
                                            "
                                        >
                                            <div className="flex items-center gap-2">
                                                <Package className="h-3.5 w-3.5 text-cyan-400" />
                                                Item Used
                                            </div>
                                        </th>


                                        <th
                                            className="
                                                table-heading
                                                px-5
                                                py-4
                                                text-left
                                                text-[10px]
                                                font-extrabold
                                                uppercase
                                            "
                                        >
                                            <div className="flex items-center gap-2">
                                                <Hash className="h-3.5 w-3.5 text-rose-400" />
                                                Qty Used
                                            </div>
                                        </th>


                                        <th
                                            className="
                                                table-heading
                                                px-5
                                                py-4
                                                text-left
                                                text-[10px]
                                                font-extrabold
                                                uppercase
                                            "
                                        >
                                            <div className="flex items-center gap-2">
                                                <UserRound className="h-3.5 w-3.5 text-cyan-400" />
                                                Faculty / Staff
                                            </div>
                                        </th>


                                        <th
                                            className="
                                                table-heading
                                                px-5
                                                py-4
                                                text-left
                                                text-[10px]
                                                font-extrabold
                                                uppercase
                                            "
                                        >
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-3.5 w-3.5 text-violet-400" />
                                                Department
                                            </div>
                                        </th>


                                        <th
                                            className="
                                                table-heading
                                                px-5
                                                py-4
                                                text-left
                                                text-[10px]
                                                font-extrabold
                                                uppercase
                                            "
                                        >
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-3.5 w-3.5 text-amber-400" />
                                                Purpose / Test
                                            </div>
                                        </th>


                                        <th
                                            className="
                                                table-heading
                                                px-5
                                                py-4
                                                text-left
                                                text-[10px]
                                                font-extrabold
                                                uppercase
                                            "
                                        >
                                            Remarks
                                        </th>


                                        <th
                                            className="
                                                table-heading
                                                px-5
                                                py-4
                                                text-left
                                                text-[10px]
                                                font-extrabold
                                                uppercase
                                            "
                                        >
                                            Logged By
                                        </th>


                                        <th
                                            className="
                                                table-heading
                                                px-5
                                                py-4
                                                text-right
                                                text-[10px]
                                                font-extrabold
                                                uppercase
                                            "
                                        >
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                {/* =============================
                                    TABLE BODY
                                ============================== */}

                                <tbody>

                                    {
                                        usageRecords.map(
                                            record => {

                                                const itemName =
                                                    record.itemName ??
                                                    getItemName(
                                                        record.itemId
                                                    );


                                                const itemCode =
                                                    record.itemCode ??
                                                    getItemCode(
                                                        record.itemId
                                                    );


                                                const quantity =
                                                    record.quantityUsed ??
                                                    record.quantity ??
                                                    0;


                                                const departmentName =
                                                    record.departmentName ??
                                                    getDepartmentName(
                                                        record.departmentId
                                                    );


                                                return (

                                                    <tr
                                                        key={
                                                            record.id
                                                        }
                                                        className="
                                                            border-b
                                                            border-slate-800
                                                            last:border-b-0
                                                            hover:bg-cyan-500/[0.025]
                                                        "
                                                    >

                                                        {/* DATE */}

                                                        <td
                                                            className="
                                                                px-5
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

                                                                <CalendarDays
                                                                    className="
                                                                        h-4
                                                                        w-4
                                                                        shrink-0
                                                                        text-blue-400
                                                                    "
                                                                />


                                                                <div>

                                                                    <div
                                                                        className="
                                                                            whitespace-nowrap
                                                                            text-sm
                                                                            font-bold
                                                                            text-slate-100
                                                                        "
                                                                    >
                                                                        {
                                                                            formatDate(
                                                                                record.usageDate
                                                                            )
                                                                        }
                                                                    </div>


                                                                    <div
                                                                        className="
                                                                            mt-1
                                                                            flex
                                                                            items-center
                                                                            gap-1
                                                                            text-xs
                                                                            font-semibold
                                                                            text-cyan-400
                                                                        "
                                                                    >

                                                                        <Clock3
                                                                            className="
                                                                                h-3
                                                                                w-3
                                                                            "
                                                                        />

                                                                        {
                                                                            record.usageTime ??
                                                                            "-"
                                                                        }

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* ITEM */}

                                                        <td
                                                            className="
                                                                px-5
                                                                py-4
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    font-extrabold
                                                                    text-white
                                                                "
                                                            >
                                                                {
                                                                    itemName
                                                                }
                                                            </div>


                                                            <div
                                                                className="
                                                                    mt-1
                                                                    text-xs
                                                                    font-bold
                                                                    text-cyan-400
                                                                "
                                                            >
                                                                {
                                                                    itemCode
                                                                }
                                                            </div>

                                                        </td>


                                                        {/* QTY */}

                                                        <td
                                                            className="
                                                                px-5
                                                                py-4
                                                            "
                                                        >

                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    rounded-lg
                                                                    border
                                                                    border-rose-400/25
                                                                    bg-gradient-to-r
                                                                    from-rose-500/10
                                                                    to-red-500/5
                                                                    px-3
                                                                    py-1.5
                                                                    text-sm
                                                                    font-black
                                                                    text-rose-300
                                                                    shadow-[0_0_14px_rgba(244,63,94,0.08)]
                                                                "
                                                            >
                                                                -{quantity}
                                                            </span>

                                                        </td>


                                                        {/* FACULTY */}

                                                        <td
                                                            className="
                                                                px-5
                                                                py-4
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    text-sm
                                                                    font-bold
                                                                    text-cyan-200
                                                                "
                                                            >
                                                                {
                                                                    record.facultyStaffName ??
                                                                    "-"
                                                                }
                                                            </div>


                                                            {
                                                                record.designation && (

                                                                    <div
                                                                        className="
                                                                            mt-1
                                                                            text-xs
                                                                            font-medium
                                                                            text-slate-500
                                                                        "
                                                                    >
                                                                        {
                                                                            record.designation
                                                                        }
                                                                    </div>

                                                                )
                                                            }

                                                        </td>


                                                        {/* DEPARTMENT */}

                                                        <td
                                                            className="
                                                                px-5
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

                                                                <div
                                                                    className="
                                                                        flex
                                                                        h-7
                                                                        w-7
                                                                        shrink-0
                                                                        items-center
                                                                        justify-center
                                                                        rounded-lg
                                                                        border
                                                                        border-violet-400/20
                                                                        bg-violet-500/10
                                                                    "
                                                                >

                                                                    <Building2
                                                                        className="
                                                                            h-3.5
                                                                            w-3.5
                                                                            text-violet-400
                                                                        "
                                                                    />

                                                                </div>


                                                                <span
                                                                    className="
                                                                        text-sm
                                                                        font-bold
                                                                        text-violet-200
                                                                    "
                                                                >
                                                                    {
                                                                        departmentName
                                                                    }
                                                                </span>

                                                            </div>

                                                        </td>


                                                        {/* PURPOSE */}

                                                        <td
                                                            className="
                                                                max-w-[220px]
                                                                px-5
                                                                py-4
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    truncate
                                                                    text-sm
                                                                    font-semibold
                                                                    text-amber-200
                                                                "
                                                                title={
                                                                    record.purposeTest ??
                                                                    ""
                                                                }
                                                            >
                                                                {
                                                                    record.purposeTest ??
                                                                    "-"
                                                                }
                                                            </div>

                                                        </td>


                                                        {/* REMARKS */}

                                                        <td
                                                            className="
                                                                max-w-[220px]
                                                                px-5
                                                                py-4
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    truncate
                                                                    text-sm
                                                                    font-medium
                                                                    text-rose-200
                                                                "
                                                                title={
                                                                    record.remarks ??
                                                                    ""
                                                                }
                                                            >
                                                                {
                                                                    record.remarks ||
                                                                    "-"
                                                                }
                                                            </div>

                                                        </td>


                                                        {/* LOGGED BY */}

                                                        <td
                                                            className="
                                                                px-5
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

                                                                <div
                                                                    className="
                                                                        flex
                                                                        h-7
                                                                        w-7
                                                                        shrink-0
                                                                        items-center
                                                                        justify-center
                                                                        rounded-full
                                                                        border
                                                                        border-cyan-400/20
                                                                        bg-cyan-500/10
                                                                    "
                                                                >

                                                                    <UserRound
                                                                        className="
                                                                            h-3.5
                                                                            w-3.5
                                                                            text-cyan-400
                                                                        "
                                                                    />

                                                                </div>


                                                                <span
                                                                    className="
                                                                        text-sm
                                                                        font-bold
                                                                        text-cyan-200
                                                                    "
                                                                >
                                                                    {
                                                                        record.loggedByName ??
                                                                        "-"
                                                                    }
                                                                </span>

                                                            </div>

                                                        </td>


                                                        {/* ACTIONS */}

                                                        <td
                                                            className="
                                                                px-5
                                                                py-4
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    justify-end
                                                                    gap-1.5
                                                                "
                                                            >

                                                                <button
                                                                    type="button"
                                                                    title="View"
                                                                    onClick={() =>
                                                                        openDetailsModal(
                                                                            record.id
                                                                        )
                                                                    }
                                                                    className="
                                                                        rounded-lg
                                                                        border
                                                                        border-blue-500/15
                                                                        bg-blue-500/[0.035]
                                                                        p-2
                                                                        text-blue-400
                                                                        hover:border-blue-400/30
                                                                        hover:bg-blue-500/15
                                                                        hover:text-blue-300
                                                                        hover:shadow-[0_0_14px_rgba(59,130,246,0.15)]
                                                                    "
                                                                >

                                                                    <Eye
                                                                        className="h-4 w-4"
                                                                    />

                                                                </button>


                                                                <button
                                                                    type="button"
                                                                    title="Edit"
                                                                    onClick={() =>
                                                                        openEditModal(
                                                                            record.id
                                                                        )
                                                                    }
                                                                    className="
                                                                        rounded-lg
                                                                        border
                                                                        border-amber-500/15
                                                                        bg-amber-500/[0.035]
                                                                        p-2
                                                                        text-amber-400
                                                                        hover:border-amber-400/30
                                                                        hover:bg-amber-500/15
                                                                        hover:text-amber-300
                                                                        hover:shadow-[0_0_14px_rgba(245,158,11,0.15)]
                                                                    "
                                                                >

                                                                    <Pencil
                                                                        className="h-4 w-4"
                                                                    />

                                                                </button>


                                                                <button
                                                                    type="button"
                                                                    title="Correct / Reverse"
                                                                    disabled={
                                                                        deletingId ===
                                                                        record.id
                                                                    }
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            record
                                                                        )
                                                                    }
                                                                    className="
                                                                        rounded-lg
                                                                        border
                                                                        border-rose-500/15
                                                                        bg-rose-500/[0.035]
                                                                        p-2
                                                                        text-rose-400
                                                                        hover:border-rose-400/30
                                                                        hover:bg-rose-500/15
                                                                        hover:text-rose-300
                                                                        hover:shadow-[0_0_14px_rgba(244,63,94,0.15)]
                                                                        disabled:opacity-40
                                                                    "
                                                                >

                                                                    {
                                                                        deletingId ===
                                                                        record.id
                                                                            ? (
                                                                                <RefreshCw
                                                                                    className="
                                                                                        h-4
                                                                                        w-4
                                                                                        animate-spin
                                                                                    "
                                                                                />
                                                                            )
                                                                            : (
                                                                                <Trash2
                                                                                    className="
                                                                                        h-4
                                                                                        w-4
                                                                                    "
                                                                                />
                                                                            )
                                                                    }

                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>

                                                );

                                            }
                                        )
                                    }

                                </tbody>

                            </table>

                        </div>

                    )
                }

            </div>


            {/* =====================================================
                USAGE MODAL
            ====================================================== */}

            {
                showUsageModal && (

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
                                max-h-[90vh]
                                w-full
                                max-w-3xl
                                overflow-y-auto
                                rounded-2xl
                                border
                                border-cyan-500/20
                                bg-gradient-to-br
                                from-slate-900
                                via-slate-900
                                to-blue-950/40
                                shadow-[0_0_60px_rgba(8,145,178,0.14)]
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
                                    bg-slate-900/95
                                    px-6
                                    py-5
                                    backdrop-blur
                                "
                            >

                                <div>

                                    <h2
                                        className="
                                            text-lg
                                            font-bold
                                            text-white
                                        "
                                    >
                                        {
                                            editingUsageId
                                                ? "Edit Consumable Usage"
                                                : "Log Consumable Usage"
                                        }
                                    </h2>


                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-400
                                        "
                                    >
                                        Record consumable usage and update laboratory stock.
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={() => {

                                        setShowUsageModal(false);
                                        resetForm();

                                    }}
                                    className="
                                        rounded-lg
                                        border
                                        border-slate-700
                                        p-2
                                        text-slate-400
                                        hover:border-cyan-500/30
                                        hover:bg-cyan-500/10
                                        hover:text-cyan-300
                                    "
                                >

                                    <X
                                        className="h-5 w-5"
                                    />

                                </button>

                            </div>


                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="p-6"
                            >

                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-5
                                        md:grid-cols-2
                                    "
                                >

                                    <div
                                        className="
                                            md:col-span-2
                                        "
                                    >

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-sm
                                                font-semibold
                                                text-slate-200
                                            "
                                        >
                                            Item Used
                                            <span className="ml-1 text-red-400">
                                                *
                                            </span>
                                        </label>


                                        <select
                                            name="itemId"
                                            value={
                                                form.itemId
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            className={`
                                                w-full
                                                rounded-lg
                                                border
                                                bg-slate-950
                                                px-3
                                                py-2.5
                                                text-sm
                                                text-slate-200
                                                focus:outline-none
                                                focus:ring-1
                                                ${
                                                    formErrors.itemId
                                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                        : "border-cyan-500/30 focus:border-cyan-500 focus:ring-cyan-500"
                                                }
                                            `}
                                        >

                                            <option value="">
                                                Select consumable item
                                            </option>


                                            {
                                                consumableItems.map(
                                                    item => {

                                                        const itemId =
                                                            item.id ??
                                                            item.inventoryItemId;


                                                        const stock =
                                                            item.quantity ??
                                                            item.currentStock ??
                                                            0;


                                                        return (

                                                            <option
                                                                key={itemId}
                                                                value={itemId}
                                                            >
                                                                {
                                                                    item.itemName ??
                                                                    "-"
                                                                }
                                                                {" "}
                                                                (
                                                                {
                                                                    item.itemCode ??
                                                                    "-"
                                                                }
                                                                )
                                                                {" "}
                                                                — Stock:
                                                                {" "}
                                                                {stock}
                                                            </option>

                                                        );

                                                    }
                                                )
                                            }

                                        </select>


                                        {
                                            formErrors.itemId && (

                                                <p
                                                    className="
                                                        mt-1
                                                        text-xs
                                                        text-red-400
                                                    "
                                                >
                                                    {
                                                        formErrors.itemId
                                                    }
                                                </p>

                                            )
                                        }

                                    </div>


                                    <FormInput
                                        label="Quantity Used"
                                        name="quantityUsed"
                                        type="number"
                                        value={
                                            form.quantityUsed
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="Enter quantity"
                                        error={
                                            formErrors.quantityUsed
                                        }
                                        required
                                    />


                                    <FormInput
                                        label="Faculty / Staff"
                                        name="facultyStaffName"
                                        value={
                                            form.facultyStaffName
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="Enter faculty/staff name"
                                        error={
                                            formErrors.facultyStaffName
                                        }
                                        required
                                    />


                                    <FormInput
                                        label="Designation"
                                        name="designation"
                                        value={
                                            form.designation
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="e.g. Lab Technician"
                                    />


                                    <div>

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-sm
                                                font-semibold
                                                text-slate-200
                                            "
                                        >
                                            Department
                                            <span className="ml-1 text-red-400">
                                                *
                                            </span>
                                        </label>


                                        <select
                                            name="departmentId"
                                            value={
                                                form.departmentId
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            className="
                                                w-full
                                                rounded-lg
                                                border
                                                border-violet-500/25
                                                bg-slate-950
                                                px-3
                                                py-2.5
                                                text-sm
                                                text-slate-200
                                                focus:border-violet-500
                                                focus:outline-none
                                                focus:ring-1
                                                focus:ring-violet-500
                                            "
                                        >

                                            <option value="">
                                                Select department
                                            </option>


                                            {
                                                departments.map(
                                                    department => {

                                                        const id =
                                                            department.id ??
                                                            department.departmentId;


                                                        return (

                                                            <option
                                                                key={id}
                                                                value={id}
                                                            >
                                                                {
                                                                    department.departmentName ??
                                                                    department.name ??
                                                                    "-"
                                                                }
                                                            </option>

                                                        );

                                                    }
                                                )
                                            }

                                        </select>


                                        {
                                            formErrors.departmentId && (

                                                <p
                                                    className="
                                                        mt-1
                                                        text-xs
                                                        text-red-400
                                                    "
                                                >
                                                    {
                                                        formErrors.departmentId
                                                    }
                                                </p>

                                            )
                                        }

                                    </div>


                                    <FormInput
                                        label="Date"
                                        name="usageDate"
                                        type="date"
                                        value={
                                            form.usageDate
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        error={
                                            formErrors.usageDate
                                        }
                                        required
                                    />


                                    <FormInput
                                        label="Time"
                                        name="usageTime"
                                        type="time"
                                        value={
                                            form.usageTime
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        error={
                                            formErrors.usageTime
                                        }
                                        required
                                    />


                                    <div
                                        className="
                                            md:col-span-2
                                        "
                                    >

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-sm
                                                font-semibold
                                                text-slate-200
                                            "
                                        >
                                            Purpose / Test
                                        </label>


                                        <input
                                            type="text"
                                            name="purposeTest"
                                            value={
                                                form.purposeTest
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            placeholder="Enter purpose or test name"
                                            className="
                                                w-full
                                                rounded-lg
                                                border
                                                border-amber-500/20
                                                bg-slate-950
                                                px-3
                                                py-2.5
                                                text-sm
                                                text-slate-200
                                                focus:border-amber-500
                                                focus:outline-none
                                                focus:ring-1
                                                focus:ring-amber-500
                                            "
                                        />

                                    </div>


                                    <div
                                        className="
                                            md:col-span-2
                                        "
                                    >

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-sm
                                                font-semibold
                                                text-slate-200
                                            "
                                        >
                                            Photo of Consumed Item
                                            <span className="ml-1 text-slate-500">
                                                (Optional)
                                            </span>
                                        </label>

                                        <div
                                            className="
                                                rounded-xl
                                                border
                                                border-cyan-500/20
                                                bg-slate-950
                                                p-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    flex-col
                                                    gap-4
                                                    sm:flex-row
                                                    sm:items-start
                                                "
                                            >

                                                {
                                                    usagePhotoPreviewUrl && (

                                                        <div
                                                            className="
                                                                overflow-hidden
                                                                rounded-lg
                                                                border
                                                                border-slate-700
                                                                bg-slate-900
                                                            "
                                                        >
                                                            <img
                                                                src={usagePhotoPreviewUrl}
                                                                alt="Consumed item preview"
                                                                className="
                                                                    h-32
                                                                    w-32
                                                                    object-cover
                                                                "
                                                            />
                                                        </div>

                                                    )
                                                }

                                                <div className="flex-1">

                                                    <div
                                                        className="
                                                            mb-3
                                                            flex
                                                            items-center
                                                            gap-2
                                                            text-sm
                                                            text-slate-300
                                                        "
                                                    >
                                                        <ImageIcon
                                                            className="
                                                                h-4
                                                                w-4
                                                                text-cyan-400
                                                            "
                                                        />

                                                        {
                                                            editingUsageId &&
                                                            usagePhotoPreviewUrl
                                                                ? "Choose a new photo to replace the existing photo."
                                                                : "Upload a photo showing what was consumed."
                                                        }

                                                    </div>

                                                    <input
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/webp"
                                                        onChange={
                                                            handleUsagePhotoChange
                                                        }
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
                                                            text-slate-300
                                                            file:mr-4
                                                            file:rounded-md
                                                            file:border-0
                                                            file:bg-cyan-600
                                                            file:px-3
                                                            file:py-2
                                                            file:text-sm
                                                            file:font-semibold
                                                            file:text-white
                                                            hover:file:bg-cyan-500
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

                                                </div>

                                            </div>

                                        </div>

                                    </div>


                                    <div
                                        className="
                                            md:col-span-2
                                        "
                                    >

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-sm
                                                font-semibold
                                                text-slate-200
                                            "
                                        >
                                            Remarks
                                        </label>


                                        <textarea
                                            name="remarks"
                                            rows="3"
                                            value={
                                                form.remarks
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            placeholder="Enter any additional remarks..."
                                            className="
                                                w-full
                                                resize-none
                                                rounded-lg
                                                border
                                                border-rose-500/20
                                                bg-slate-950
                                                px-3
                                                py-2.5
                                                text-sm
                                                text-slate-200
                                                focus:border-rose-500
                                                focus:outline-none
                                                focus:ring-1
                                                focus:ring-rose-500
                                            "
                                        />

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
                                        onClick={() => {

                                            setShowUsageModal(false);
                                            resetForm();

                                        }}
                                        disabled={saving}
                                        className="
                                            rounded-lg
                                            border
                                            border-slate-700
                                            bg-slate-950
                                            px-4
                                            py-2.5
                                            text-sm
                                            font-semibold
                                            text-slate-300
                                            hover:bg-slate-800
                                            hover:text-white
                                        "
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-lg
                                            border
                                            border-cyan-300/20
                                            bg-gradient-to-r
                                            from-cyan-600
                                            to-blue-600
                                            px-5
                                            py-2.5
                                            text-sm
                                            font-bold
                                            text-white
                                            shadow-[0_0_22px_rgba(8,145,178,0.18)]
                                            hover:from-cyan-500
                                            hover:to-blue-500
                                            disabled:opacity-50
                                        "
                                    >

                                        {
                                            saving && (

                                                <RefreshCw
                                                    className="
                                                        h-4
                                                        w-4
                                                        animate-spin
                                                    "
                                                />

                                            )
                                        }


                                        {
                                            editingUsageId
                                                ? "Update Usage"
                                                : "Log Usage"
                                        }

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )
            }


            {/* =====================================================
                DETAILS MODAL
            ====================================================== */}

            {
                showDetailsModal &&
                selectedUsage && (

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
                                max-h-[90vh]
                                w-full
                                max-w-2xl
                                overflow-y-auto
                                rounded-2xl
                                border
                                border-violet-500/20
                                bg-gradient-to-br
                                from-slate-900
                                via-slate-900
                                to-violet-950/30
                                shadow-[0_0_60px_rgba(139,92,246,0.12)]
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    border-b
                                    border-slate-800
                                    px-6
                                    py-5
                                "
                            >

                                <div>

                                    <h2
                                        className="
                                            text-lg
                                            font-bold
                                            text-white
                                        "
                                    >
                                        Usage Details
                                    </h2>


                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-400
                                        "
                                    >
                                        Complete consumable usage information.
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={() => {

                                        setShowDetailsModal(false);
                                        setSelectedUsage(null);

                                        if (detailsPhotoUrl) {
                                            URL.revokeObjectURL(
                                                detailsPhotoUrl
                                            );
                                        }

                                        setDetailsPhotoUrl(null);

                                    }}
                                    className="
                                        rounded-lg
                                        border
                                        border-slate-700
                                        p-2
                                        text-slate-400
                                        hover:border-violet-500/30
                                        hover:bg-violet-500/10
                                        hover:text-violet-300
                                    "
                                >

                                    <X
                                        className="h-5 w-5"
                                    />

                                </button>

                            </div>


                            <div className="p-6">

                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-4
                                        sm:grid-cols-2
                                    "
                                >

                                    <DetailField
                                        label="Item"
                                        value={
                                            selectedUsage.itemName ??
                                            getItemName(
                                                selectedUsage.itemId
                                            )
                                        }
                                        accent="cyan"
                                    />


                                    <DetailField
                                        label="Item Code"
                                        value={
                                            selectedUsage.itemCode ??
                                            getItemCode(
                                                selectedUsage.itemId
                                            )
                                        }
                                        accent="blue"
                                    />


                                    <DetailField
                                        label="Quantity Used"
                                        value={
                                            selectedUsage.quantityUsed ??
                                            selectedUsage.quantity ??
                                            "-"
                                        }
                                        accent="emerald"
                                    />


                                    <DetailField
                                        label="Faculty / Staff"
                                        value={
                                            selectedUsage.facultyStaffName ??
                                            "-"
                                        }
                                        accent="cyan"
                                    />


                                    <DetailField
                                        label="Designation"
                                        value={
                                            selectedUsage.designation ??
                                            "-"
                                        }
                                        accent="amber"
                                    />


                                    <DetailField
                                        label="Department"
                                        value={
                                            selectedUsage.departmentName ??
                                            getDepartmentName(
                                                selectedUsage.departmentId
                                            )
                                        }
                                        accent="violet"
                                    />


                                    <DetailField
                                        label="Usage Date"
                                        value={
                                            formatDate(
                                                selectedUsage.usageDate
                                            )
                                        }
                                        accent="blue"
                                    />


                                    <DetailField
                                        label="Usage Time"
                                        value={
                                            selectedUsage.usageTime ??
                                            "-"
                                        }
                                        accent="cyan"
                                    />


                                    <DetailField
                                        label="Purpose / Test"
                                        value={
                                            selectedUsage.purposeTest ??
                                            "-"
                                        }
                                        accent="amber"
                                    />


                                    <DetailField
                                        label="Logged By"
                                        value={
                                            selectedUsage.loggedByName ??
                                            "-"
                                        }
                                        accent="cyan"
                                    />


                                    <DetailField
                                        label="Created At"
                                        value={
                                            formatDateTimeValue(
                                                selectedUsage.createdAt
                                            )
                                        }
                                        accent="blue"
                                    />


                                    <DetailField
                                        label="Updated At"
                                        value={
                                            formatDateTimeValue(
                                                selectedUsage.updatedAt
                                            )
                                        }
                                        accent="violet"
                                    />


                                    <div
                                        className="
                                            sm:col-span-2
                                        "
                                    >

                                        <div
                                            className="
                                                rounded-xl
                                                border
                                                border-cyan-500/15
                                                bg-cyan-500/[0.025]
                                                p-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-[11px]
                                                    font-bold
                                                    uppercase
                                                    tracking-wider
                                                    text-slate-500
                                                "
                                            >
                                                <ImageIcon
                                                    className="
                                                        h-3.5
                                                        w-3.5
                                                        text-cyan-400
                                                    "
                                                />
                                                Photo of Consumed Item
                                            </div>

                                            {
                                                photoLoading && (

                                                    <div
                                                        className="
                                                            mt-4
                                                            flex
                                                            items-center
                                                            gap-2
                                                            text-sm
                                                            text-slate-400
                                                        "
                                                    >
                                                        <RefreshCw
                                                            className="
                                                                h-4
                                                                w-4
                                                                animate-spin
                                                            "
                                                        />
                                                        Loading photo...
                                                    </div>

                                                )
                                            }

                                            {
                                                !photoLoading &&
                                                detailsPhotoUrl && (

                                                    <img
                                                        src={detailsPhotoUrl}
                                                        alt="Consumed item"
                                                        className="
                                                            mt-4
                                                            max-h-80
                                                            w-full
                                                            rounded-lg
                                                            border
                                                            border-slate-700
                                                            object-contain
                                                            bg-slate-950
                                                        "
                                                    />

                                                )
                                            }

                                            {
                                                !photoLoading &&
                                                !detailsPhotoUrl && (

                                                    <p
                                                        className="
                                                            mt-3
                                                            text-sm
                                                            text-slate-500
                                                        "
                                                    >
                                                        No photo uploaded for this usage.
                                                    </p>

                                                )
                                            }

                                        </div>

                                    </div>


                                    <div
                                        className="
                                            sm:col-span-2
                                        "
                                    >

                                        <DetailField
                                            label="Remarks"
                                            value={
                                                selectedUsage.remarks ||
                                                "-"
                                            }
                                            accent="rose"
                                        />

                                    </div>

                                </div>


                                <div
                                    className="
                                        mt-6
                                        flex
                                        justify-end
                                    "
                                >

                                    <button
                                        type="button"
                                        onClick={() => {

                                            setShowDetailsModal(false);
                                            setSelectedUsage(null);

                                            if (detailsPhotoUrl) {
                                                URL.revokeObjectURL(
                                                    detailsPhotoUrl
                                                );
                                            }

                                            setDetailsPhotoUrl(null);

                                        }}
                                        className="
                                            rounded-lg
                                            border
                                            border-slate-700
                                            bg-slate-950
                                            px-4
                                            py-2.5
                                            text-sm
                                            font-semibold
                                            text-slate-300
                                            hover:bg-slate-800
                                            hover:text-white
                                        "
                                    >
                                        Close
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>

    );
}


// =============================================================
// FORM INPUT
// =============================================================

function FormInput({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    error,
    required = false
}) {

    return (

        <div>

            <label
                className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-200
                "
            >

                {label}

                {
                    required && (

                        <span className="ml-1 text-red-400">
                            *
                        </span>

                    )
                }

            </label>


            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                min={
                    type === "number"
                        ? "1"
                        : undefined
                }
                step={
                    type === "number"
                        ? "1"
                        : undefined
                }
                className={`
                    w-full
                    rounded-lg
                    border
                    bg-slate-950
                    px-3
                    py-2.5
                    text-sm
                    text-slate-200
                    placeholder:text-slate-500
                    focus:outline-none
                    focus:ring-1
                    ${
                        error
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-slate-700 focus:border-cyan-500 focus:ring-cyan-500"
                    }
                `}
            />


            {
                error && (

                    <p
                        className="
                            mt-1
                            text-xs
                            text-red-400
                        "
                    >
                        {error}
                    </p>

                )
            }

        </div>

    );
}


// =============================================================
// DETAIL FIELD
// =============================================================

function DetailField({
    label,
    value,
    accent = "cyan"
}) {

    const accentStyles = {

        cyan: `
            border-cyan-500/15
            bg-cyan-500/[0.025]
            text-cyan-200
        `,

        blue: `
            border-blue-500/15
            bg-blue-500/[0.025]
            text-blue-200
        `,

        emerald: `
            border-emerald-500/15
            bg-emerald-500/[0.025]
            text-emerald-200
        `,

        violet: `
            border-violet-500/15
            bg-violet-500/[0.025]
            text-violet-200
        `,

        amber: `
            border-amber-500/15
            bg-amber-500/[0.025]
            text-amber-200
        `,

        rose: `
            border-rose-500/15
            bg-rose-500/[0.025]
            text-rose-200
        `
    };


    return (

        <div
            className={`
                rounded-xl
                border
                p-4
                ${accentStyles[accent] ?? accentStyles.cyan}
            `}
        >

            <p
                className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-500
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-2
                    break-words
                    text-sm
                    font-bold
                "
            >
                {value}
            </p>

        </div>

    );
}


export default DailyConsumables;