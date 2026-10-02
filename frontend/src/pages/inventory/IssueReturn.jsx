import { useEffect, useMemo, useState } from "react";

import {
    Search,
    Plus,
    RotateCcw,
    Eye,
    Trash2,
    X,
    CalendarDays,
    Building2,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    ClipboardList,
    ArrowDownToLine,
    ArrowUpFromLine,
    AlertTriangle,
    ChevronDown
} from "lucide-react";

import {
    getIssueReturnRecords,
    getIssueReturnById,
    getIssueReturnSummary,
    issueItem,
    recordReturn,
    deleteIssueReturn
} from "../../services/issueReturnService";

import * as departmentService
    from "../../services/departmentService";

import api from "../../services/api";


// =============================================================
// CONSTANTS
// =============================================================

const ISSUE_TYPES = [
    {
        value: "FACULTY",
        label: "Faculty"
    },
    {
        value: "DEPARTMENT",
        label: "Department"
    },
    {
        value: "STUDENT",
        label: "Student"
    }
];


const ISSUE_STATUSES = [
    {
        value: "",
        label: "All Status"
    },
    {
        value: "ISSUED",
        label: "Issued"
    },
    {
        value: "RETURNED",
        label: "Returned"
    },
    {
        value: "OVERDUE",
        label: "Overdue"
    }
];


const RETURN_CONDITIONS = [
    {
        value: "GOOD",
        label: "Good"
    },
    {
        value: "DAMAGED",
        label: "Damaged"
    },
    {
        value: "PARTIALLY_DAMAGED",
        label: "Partially Damaged"
    },
    {
        value: "LOST",
        label: "Lost"
    }
];


// =============================================================
// DATE HELPER
// =============================================================

const getToday = () => {

    const now = new Date();

    return (
        `${now.getFullYear()}-` +
        `${String(
            now.getMonth() + 1
        ).padStart(2, "0")}-` +
        `${String(
            now.getDate()
        ).padStart(2, "0")}`
    );

};


// =============================================================
// FORMAT DATE
// =============================================================

const formatDate = (value) => {

    if (!value) {
        return "—";
    }

    const date = new Date(
        `${value}T00:00:00`
    );

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


const formatDateLong = (value) => {

    if (!value) {
        return "—";
    }

    const date = new Date(
        `${value}T00:00:00`
    );

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


// =============================================================
// RESPONSE HELPER
// =============================================================

const unwrapResponse = (
    response
) => {

    if (!response) {
        return null;
    }

    const data =
        response?.data ??
        response;

    if (
        data?.data !== undefined
    ) {
        return data.data;
    }

    return data;

};


// =============================================================
// NORMALIZE LIST
// =============================================================

const normalizeList = (
    response
) => {

    const result =
        unwrapResponse(
            response
        );

    if (
        Array.isArray(result)
    ) {
        return result;
    }

    if (
        Array.isArray(
            result?.content
        )
    ) {
        return result.content;
    }

    if (
        Array.isArray(
            result?.data
        )
    ) {
        return result.data;
    }

    if (
        Array.isArray(
            result?.data?.content
        )
    ) {
        return result.data.content;
    }

    if (
        Array.isArray(
            result?.content?.content
        )
    ) {
        return result.content.content;
    }

    return [];

};


// =============================================================
// COMPONENT
// =============================================================

function IssueReturn() {

    // =========================================================
    // DATA
    // =========================================================

    const [records, setRecords] =
        useState([]);

    const [departments, setDepartments] =
        useState([]);

    const [inventoryItems, setInventoryItems] =
        useState([]);

    const [summary, setSummary] =
        useState({
            totalIssued: 0,
            returned: 0,
            overdue: 0
        });


    // =========================================================
    // LOADING
    // =========================================================

    const [loading, setLoading] =
        useState(true);

    const [summaryLoading, setSummaryLoading] =
        useState(true);

    const [itemsLoading, setItemsLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [returnSaving, setReturnSaving] =
        useState(false);

    const [deletingId, setDeletingId] =
        useState(null);


    // =========================================================
    // ALERTS
    // =========================================================

    const [error, setError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");


    // =========================================================
    // FILTERS
    // =========================================================

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [issuedToType, setIssuedToType] =
        useState("");

    const [departmentId, setDepartmentId] =
        useState("");


    // =========================================================
    // MODALS
    // =========================================================

    const [showIssueModal, setShowIssueModal] =
        useState(false);

    const [showReturnModal, setShowReturnModal] =
        useState(false);

    const [showDetailsModal, setShowDetailsModal] =
        useState(false);


    const [selectedRecord, setSelectedRecord] =
        useState(null);


    // =========================================================
    // ISSUE FORM
    // =========================================================

    const [issueForm, setIssueForm] =
        useState({

            issueDate:
                getToday(),

            expectedReturnDate:
                "",

            inventoryItemId:
                "",

            quantity:
                "",

            issuedToType:
                "FACULTY",

            issuedToName:
                "",

            employeeNo:
                "",

            departmentId:
                "",

            purpose:
                "",

            remarks:
                ""

        });


    // =========================================================
    // RETURN FORM
    // =========================================================

    const [returnForm, setReturnForm] =
        useState({

            issueReturnId:
                "",

            returnDate:
                getToday(),

            quantityReturned:
                "",

            returnCondition:
                "GOOD",

            remarks:
                ""

        });


    // =========================================================
    // FORM ERRORS
    // =========================================================

    const [issueErrors, setIssueErrors] =
        useState({});

    const [returnErrors, setReturnErrors] =
        useState({});


    // =========================================================
    // ERROR MESSAGE
    // =========================================================

    const getErrorMessage = (
        err,
        fallback
    ) => {

        return (
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.response?.data?.data?.message ||
            err?.message ||
            fallback
        );

    };


    // =========================================================
    // LOAD DEPARTMENTS
    // =========================================================

    const loadDepartments =
        async () => {

            try {

                const response =
                    await departmentService
                        .getAllDepartments(
                            0,
                            1000,
                            "departmentName",
                            "asc",
                            ""
                        );

                const data =
                    normalizeList(
                        response
                    );

                setDepartments(
                    data
                );

            }
            catch (err) {

                console.error(
                    "LOAD DEPARTMENTS ERROR:",
                    err
                );

                setDepartments([]);

            }

        };


    // =========================================================
    // LOAD INVENTORY ITEMS
    // =========================================================

    const loadInventoryItems =
        async () => {

            try {

                setItemsLoading(
                    true
                );

                const response =
                    await api.get(
                        "/inventory",
                        {
                            params: {

                                page:
                                    0,

                                size:
                                    1000,

                                sortBy:
                                    "itemName",

                                sortDirection:
                                    "asc",

                                search:
                                    ""

                            }
                        }
                    );

                const data =
                    normalizeList(
                        response
                    );

                console.log(
                    "ISSUE/RETURN INVENTORY ITEMS:",
                    data
                );

                setInventoryItems(
                    Array.isArray(data)
                        ? data
                        : []
                );

            }
            catch (err) {

                console.error(
                    "LOAD INVENTORY ITEMS ERROR:",
                    err
                );

                setInventoryItems([]);

                setError(
                    getErrorMessage(
                        err,
                        "Unable to load inventory items."
                    )
                );

            }
            finally {

                setItemsLoading(
                    false
                );

            }

        };


    // =========================================================
    // LOAD RECORDS
    // =========================================================

    const loadRecords =
        async () => {

            try {

                setLoading(
                    true
                );

                const response =
                    await getIssueReturnRecords({

                        search:
                            search.trim(),

                        status:
                            status,

                        issuedToType:
                            issuedToType,

                        departmentId:
                            departmentId

                    });

                const data =
                    normalizeList(
                        response
                    );

                setRecords(
                    data
                );

            }
            catch (err) {

                console.error(
                    "LOAD ISSUE/RETURN ERROR:",
                    err
                );

                setRecords([]);

                setError(
                    getErrorMessage(
                        err,
                        "Unable to load Issue / Return records."
                    )
                );

            }
            finally {

                setLoading(
                    false
                );

            }

        };


    // =========================================================
    // LOAD SUMMARY
    // =========================================================

    const loadSummary =
        async () => {

            try {

                setSummaryLoading(
                    true
                );

                const response =
                    await getIssueReturnSummary();

                const data =
                    unwrapResponse(
                        response
                    );

                setSummary({

                    totalIssued:
                        Number(
                            data?.totalIssued ??
                            0
                        ),

                    returned:
                        Number(
                            data?.returned ??
                            0
                        ),

                    overdue:
                        Number(
                            data?.overdue ??
                            0
                        )

                });

            }
            catch (err) {

                console.error(
                    "LOAD SUMMARY ERROR:",
                    err
                );

                setSummary({

                    totalIssued: 0,

                    returned: 0,

                    overdue: 0

                });

            }
            finally {

                setSummaryLoading(
                    false
                );

            }

        };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadDepartments();

        loadInventoryItems();

    }, []);


    // =========================================================
    // FILTER LOAD
    // =========================================================

    useEffect(() => {

        const timer =
            setTimeout(
                () => {

                    loadRecords();

                },
                300
            );

        return () =>
            clearTimeout(
                timer
            );

    }, [
        search,
        status,
        issuedToType,
        departmentId
    ]);


    // =========================================================
    // SUMMARY LOAD
    // =========================================================

    useEffect(() => {

        loadSummary();

    }, []);


    // =========================================================
    // DEPARTMENT NAME
    // =========================================================

    const getDepartmentName =
        (id) => {

            if (!id) {
                return "—";
            }

            const department =
                departments.find(
                    item => {

                        return (
                            Number(
                                item?.id ??
                                item?.departmentId
                            ) ===
                            Number(id)
                        );

                    }
                );

            return (
                department?.departmentName ??
                department?.name ??
                "—"
            );

        };


    // =========================================================
    // ITEM STOCK
    // =========================================================

    const getItemStock =
        (itemId) => {

            const item =
                inventoryItems.find(
                    value => {

                        return (
                            Number(
                                value?.id
                            ) ===
                            Number(
                                itemId
                            )
                        );

                    }
                );

            return Number(
                item?.currentStock ??
                item?.quantity ??
                0
            );

        };


    // =========================================================
    // ITEM NAME
    // =========================================================

    const getItemName =
        (record) => {

            return (
                record?.itemName ??
                record?.inventoryItemName ??
                "—"
            );

        };


    // =========================================================
    // ITEM CODE
    // =========================================================

    const getItemCode =
        (record) => {

            return (
                record?.itemCode ??
                record?.inventoryItemCode ??
                "—"
            );

        };


    // =========================================================
    // ISSUE TYPE LABEL
    // =========================================================

    const getIssueTypeLabel =
        (value) => {

            const type =
                ISSUE_TYPES.find(
                    item =>
                        item.value ===
                        value
                );

            return (
                type?.label ??
                value ??
                "—"
            );

        };


    // =========================================================
    // RESET ISSUE FORM
    // =========================================================

    const resetIssueForm =
        () => {

            setIssueForm({

                issueDate:
                    getToday(),

                expectedReturnDate:
                    "",

                inventoryItemId:
                    "",

                quantity:
                    "",

                issuedToType:
                    "FACULTY",

                issuedToName:
                    "",

                employeeNo:
                    "",

                departmentId:
                    "",

                purpose:
                    "",

                remarks:
                    ""

            });

            setIssueErrors({});

        };


    // =========================================================
    // RESET RETURN FORM
    // =========================================================

    const resetReturnForm =
        () => {

            setReturnForm({

                issueReturnId:
                    "",

                returnDate:
                    getToday(),

                quantityReturned:
                    "",

                returnCondition:
                    "GOOD",

                remarks:
                    ""

            });

            setReturnErrors({});

        };


    // =========================================================
    // OPEN ISSUE MODAL
    // =========================================================

    const openIssueModal =
        () => {

            resetIssueForm();

            setError("");

            setSuccessMessage("");

            setShowIssueModal(
                true
            );

            loadInventoryItems();

        };


    // =========================================================
    // CLOSE ISSUE MODAL
    // =========================================================

    const closeIssueModal =
        () => {

            if (saving) {
                return;
            }

            setShowIssueModal(
                false
            );

            resetIssueForm();

        };


    // =========================================================
    // OPEN RETURN MODAL
    // =========================================================

    const openReturnModal =
        () => {

            resetReturnForm();

            setError("");

            setSuccessMessage("");

            setShowReturnModal(
                true
            );

        };


    // =========================================================
    // CLOSE RETURN MODAL
    // =========================================================

    const closeReturnModal =
        () => {

            if (returnSaving) {
                return;
            }

            setShowReturnModal(
                false
            );

            resetReturnForm();

        };


    // =========================================================
    // HANDLE ISSUE CHANGE
    // =========================================================

    const handleIssueChange =
        (event) => {

            const {
                name,
                value
            } = event.target;

            setIssueForm(
                previous => ({

                    ...previous,

                    [name]:
                        value

                })
            );

            setIssueErrors(
                previous => ({

                    ...previous,

                    [name]:
                        ""

                })
            );

        };


    // =========================================================
    // HANDLE RETURN CHANGE
    // =========================================================

    const handleReturnChange =
        (event) => {

            const {
                name,
                value
            } = event.target;

            setReturnForm(
                previous => ({

                    ...previous,

                    [name]:
                        value

                })
            );

            setReturnErrors(
                previous => ({

                    ...previous,

                    [name]:
                        ""

                })
            );

        };


    // =========================================================
    // VALIDATE ISSUE
    // =========================================================

    const validateIssue =
        () => {

            const errors = {};


            if (
                !issueForm.issueDate
            ) {

                errors.issueDate =
                    "Issue date is required.";

            }


            if (
                !issueForm.inventoryItemId
            ) {

                errors.inventoryItemId =
                    "Please select an item.";

            }


            const quantity =
                Number(
                    issueForm.quantity
                );


            if (
                !Number.isInteger(
                    quantity
                ) ||
                quantity <= 0
            ) {

                errors.quantity =
                    "Quantity must be greater than zero.";

            }


            if (
                issueForm.inventoryItemId &&
                Number.isInteger(quantity) &&
                quantity > 0
            ) {

                const available =
                    getItemStock(
                        issueForm.inventoryItemId
                    );


                if (
                    quantity > available
                ) {

                    errors.quantity =
                        `Only ${available} item(s) available in stock.`;

                }

            }


            if (
                !issueForm.issuedToName.trim()
            ) {

                errors.issuedToName =
                    "Name is required.";

            }


            if (
                !issueForm.departmentId
            ) {

                errors.departmentId =
                    "Department is required.";

            }


            if (
                issueForm.expectedReturnDate &&
                issueForm.issueDate &&
                issueForm.expectedReturnDate <
                issueForm.issueDate
            ) {

                errors.expectedReturnDate =
                    "Expected return date cannot be before issue date.";

            }


            setIssueErrors(
                errors
            );


            return (
                Object.keys(
                    errors
                ).length === 0
            );

        };


    // =============================================================
    // VALIDATE RETURN
    // =============================================================
    //
    // IMPORTANT:
    //
    // NO MIN DATE
    // NO MAX DATE
    //
    // User can select ANY date from the browser calendar.
    //
    // We are intentionally not blocking:
    //
    //     past dates
    //     issue date
    //     today
    //     future dates
    //
    // =============================================================

    const validateReturn =
        () => {

            const errors = {};


            const selectedRecord =
                records.find(
                    record =>
                        Number(
                            record?.id
                        ) ===
                        Number(
                            returnForm.issueReturnId
                        )
                );


            // -------------------------------------------------
            // ISSUE RECORD
            // -------------------------------------------------

            if (
                !returnForm.issueReturnId
            ) {

                errors.issueReturnId =
                    "Please select an issue record.";

            }


            // -------------------------------------------------
            // RETURN DATE
            // -------------------------------------------------

            if (
                !returnForm.returnDate
            ) {

                errors.returnDate =
                    "Return date is required.";

            }


            // -------------------------------------------------
            // QUANTITY
            // -------------------------------------------------

            const quantity =
                Number(
                    returnForm.quantityReturned
                );


            if (
                !Number.isInteger(
                    quantity
                ) ||
                quantity <= 0
            ) {

                errors.quantityReturned =
                    "Return quantity must be greater than zero.";

            }


            // -------------------------------------------------
            // MAX RETURN QUANTITY
            // -------------------------------------------------

            if (
                selectedRecord &&
                Number.isInteger(quantity) &&
                quantity >
                Number(
                    selectedRecord.quantity ??
                    0
                )
            ) {

                errors.quantityReturned =
                    `Maximum return quantity is ${selectedRecord.quantity}.`;

            }


            setReturnErrors(
                errors
            );


            return (
                Object.keys(
                    errors
                ).length === 0
            );

        };


    // =========================================================
    // SUBMIT ISSUE
    // =========================================================

    const handleIssueSubmit =
        async (event) => {

            event.preventDefault();

            setError("");

            setSuccessMessage("");


            if (
                !validateIssue()
            ) {
                return;
            }


            try {

                setSaving(
                    true
                );


                const payload = {

                    inventoryItemId:
                        Number(
                            issueForm.inventoryItemId
                        ),

                    quantity:
                        Number(
                            issueForm.quantity
                        ),

                    issueDate:
                        issueForm.issueDate,

                    expectedReturnDate:
                        issueForm.expectedReturnDate ||
                        null,

                    issuedToType:
                        issueForm.issuedToType,

                    issuedToName:
                        issueForm.issuedToName.trim(),

                    employeeNo:
                        issueForm.employeeNo.trim() ||
                        null,

                    departmentId:
                        Number(
                            issueForm.departmentId
                        ),

                    purpose:
                        issueForm.purpose.trim() ||
                        null,

                    remarks:
                        issueForm.remarks.trim() ||
                        null

                };


                console.log(
                    "ISSUE ITEM PAYLOAD:",
                    payload
                );


                await issueItem(
                    payload
                );


                setSuccessMessage(
                    "Item issued successfully."
                );


                closeIssueModal();


                await Promise.all([
                    loadRecords(),
                    loadSummary(),
                    loadInventoryItems()
                ]);

            }
            catch (err) {

                console.error(
                    "ISSUE ITEM ERROR:",
                    err
                );


                setError(
                    getErrorMessage(
                        err,
                        "Unable to issue item."
                    )
                );

            }
            finally {

                setSaving(
                    false
                );

            }

        };


    // =========================================================
    // SUBMIT RETURN
    // =========================================================

    const handleReturnSubmit =
        async (event) => {

            event.preventDefault();

            setError("");

            setSuccessMessage("");


            if (
                !validateReturn()
            ) {
                return;
            }


            try {

                setReturnSaving(
                    true
                );


                const payload = {

                    issueReturnId:
                        Number(
                            returnForm.issueReturnId
                        ),

                    returnDate:
                        returnForm.returnDate,

                    quantityReturned:
                        Number(
                            returnForm.quantityReturned
                        ),

                    condition:
                        returnForm.returnCondition,

                    remarks:
                        returnForm.remarks.trim() ||
                        null

                };


                console.log(
                    "RETURN ITEM PAYLOAD:",
                    payload
                );


                await recordReturn(
                    payload
                );


                setSuccessMessage(
                    "Item return recorded successfully."
                );


                closeReturnModal();


                await Promise.all([
                    loadRecords(),
                    loadSummary(),
                    loadInventoryItems()
                ]);

            }
            catch (err) {

                console.error(
                    "RECORD RETURN ERROR:",
                    err
                );


                setError(
                    getErrorMessage(
                        err,
                        "Unable to record item return."
                    )
                );

            }
            finally {

                setReturnSaving(
                    false
                );

            }

        };


    // =========================================================
    // VIEW RECORD
    // =========================================================

    const viewRecord =
        async (id) => {

            try {

                setError("");


                const response =
                    await getIssueReturnById(
                        id
                    );


                const data =
                    unwrapResponse(
                        response
                    );


                setSelectedRecord(
                    data
                );


                setShowDetailsModal(
                    true
                );

            }
            catch (err) {

                console.error(
                    "VIEW ISSUE RETURN ERROR:",
                    err
                );


                setError(
                    getErrorMessage(
                        err,
                        "Unable to load issue details."
                    )
                );

            }

        };


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete =
        async (record) => {

            if (!record?.id) {
                return;
            }


            const confirmed =
                window.confirm(
                    "Delete this Issue / Return register record?"
                );


            if (!confirmed) {
                return;
            }


            try {

                setDeletingId(
                    record.id
                );

                setError("");

                setSuccessMessage("");


                await deleteIssueReturn(
                    record.id
                );


                setSuccessMessage(
                    "Issue / Return record deleted successfully."
                );


                await Promise.all([
                    loadRecords(),
                    loadSummary()
                ]);

            }
            catch (err) {

                console.error(
                    "DELETE ISSUE RETURN ERROR:",
                    err
                );


                setError(
                    getErrorMessage(
                        err,
                        "Unable to delete the record."
                    )
                );

            }
            finally {

                setDeletingId(
                    null
                );

            }

        };


    // =========================================================
    // RETURNABLE RECORDS
    // =========================================================

    const returnableRecords =
        useMemo(
            () => {

                return records.filter(
                    record => {

                        const recordStatus =
                            String(
                                record?.status ??
                                record?.issueStatus ??
                                ""
                            ).toUpperCase();


                        return (
                            recordStatus ===
                                "ISSUED" ||
                            recordStatus ===
                                "OVERDUE"
                        ) &&
                        Number(
                            record?.quantity ??
                            0
                        ) > 0;

                    }
                );

            },
            [
                records
            ]
        );


    // =========================================================
    // SELECTED RETURN RECORD
    // =========================================================

    const selectedReturnRecord =
        useMemo(
            () => {

                if (
                    !returnForm.issueReturnId
                ) {
                    return null;
                }


                return (
                    records.find(
                        record =>
                            Number(
                                record.id
                            ) ===
                            Number(
                                returnForm.issueReturnId
                            )
                    ) ||
                    null
                );

            },
            [
                records,
                returnForm.issueReturnId
            ]
        );


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const clearFilters =
        () => {

            setSearch("");

            setStatus("");

            setIssuedToType("");

            setDepartmentId("");

        };


    const hasFilters =
        Boolean(
            search ||
            status ||
            issuedToType ||
            departmentId
        );


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="
                min-h-full
                bg-[#0b0e14]
                text-slate-200
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    mb-6
                    flex
                    flex-col
                    gap-4
                    xl:flex-row
                    xl:items-center
                    xl:justify-between
                "
            >

                <div>

                    <h1
                        className="
                            text-2xl
                            font-extrabold
                            tracking-tight
                            text-white
                        "
                    >
                        Issue / Return Register
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >
                        Track reusable laboratory items issued to faculty, students and departments.
                    </p>

                </div>


                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                    "
                >

                    <button
                        type="button"
                        onClick={() => {

                            loadRecords();

                            loadSummary();

                            loadInventoryItems();

                        }}
                        disabled={
                            loading
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-slate-700
                            bg-slate-900
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-slate-300
                            hover:bg-slate-800
                            disabled:opacity-50
                        "
                    >

                        <RefreshCw
                            className={`
                                h-4
                                w-4
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
                            openIssueModal
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-cyan-500/30
                            bg-cyan-500/10
                            px-4
                            py-2.5
                            text-sm
                            font-bold
                            text-cyan-300
                            hover:bg-cyan-500/20
                        "
                    >

                        <ArrowUpFromLine
                            className="h-4 w-4"
                        />

                        Issue Item

                    </button>


                    <button
                        type="button"
                        onClick={
                            openReturnModal
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-emerald-400/20
                            bg-emerald-400
                            px-4
                            py-2.5
                            text-sm
                            font-bold
                            text-slate-950
                            hover:bg-emerald-300
                        "
                    >

                        <RotateCcw
                            className="h-4 w-4"
                        />

                        Record Return

                    </button>

                </div>

            </div>


            {/* =================================================
                ALERTS
            ================================================= */}

            {
                error && (

                    <AlertMessage
                        type="error"
                        message={
                            error
                        }
                        onClose={() =>
                            setError("")
                        }
                    />

                )
            }


            {
                successMessage && (

                    <AlertMessage
                        type="success"
                        message={
                            successMessage
                        }
                        onClose={() =>
                            setSuccessMessage("")
                        }
                    />

                )
            }


            {/* =================================================
                FILTERS
            ================================================= */}

            <div
                className="
                    mb-6
                    grid
                    grid-cols-1
                    gap-3
                    lg:grid-cols-[minmax(260px,1fr)_150px_150px_180px]
                "
            >

                <div
                    className="
                        relative
                    "
                >

                    <Search
                        className="
                            absolute
                            left-4
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-cyan-400
                        "
                    />


                    <input
                        type="text"
                        value={
                            search
                        }
                        onChange={
                            event =>
                                setSearch(
                                    event.target.value
                                )
                        }
                        placeholder="Search by item, faculty, dept..."
                        className="
                            h-12
                            w-full
                            rounded-lg
                            border
                            border-slate-700
                            bg-[#11151d]
                            pl-11
                            pr-4
                            text-sm
                            text-slate-200
                            outline-none
                            placeholder:text-slate-500
                            focus:border-cyan-500/60
                        "
                    />

                </div>


                <div
                    className="
                        relative
                    "
                >

                    <select
                        value={
                            status
                        }
                        onChange={
                            event =>
                                setStatus(
                                    event.target.value
                                )
                        }
                        className="
                            h-12
                            w-full
                            appearance-none
                            rounded-lg
                            border
                            border-slate-700
                            bg-[#11151d]
                            px-4
                            pr-10
                            text-sm
                            text-slate-300
                            outline-none
                        "
                    >

                        {
                            ISSUE_STATUSES.map(
                                item => (

                                    <option
                                        key={
                                            item.value
                                        }
                                        value={
                                            item.value
                                        }
                                    >
                                        {
                                            item.label
                                        }
                                    </option>

                                )
                            )
                        }

                    </select>


                    <ChevronDown
                        className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-slate-500
                        "
                    />

                </div>


                <div
                    className="
                        relative
                    "
                >

                    <select
                        value={
                            issuedToType
                        }
                        onChange={
                            event =>
                                setIssuedToType(
                                    event.target.value
                                )
                        }
                        className="
                            h-12
                            w-full
                            appearance-none
                            rounded-lg
                            border
                            border-slate-700
                            bg-[#11151d]
                            px-4
                            pr-10
                            text-sm
                            text-slate-300
                            outline-none
                        "
                    >

                        <option value="">
                            All Types
                        </option>


                        {
                            ISSUE_TYPES.map(
                                item => (

                                    <option
                                        key={
                                            item.value
                                        }
                                        value={
                                            item.value
                                        }
                                    >
                                        {
                                            item.label
                                        }
                                    </option>

                                )
                            )
                        }

                    </select>


                    <ChevronDown
                        className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-slate-500
                        "
                    />

                </div>


                <div
                    className="
                        relative
                    "
                >

                    <select
                        value={
                            departmentId
                        }
                        onChange={
                            event =>
                                setDepartmentId(
                                    event.target.value
                                )
                        }
                        className="
                            h-12
                            w-full
                            appearance-none
                            rounded-lg
                            border
                            border-slate-700
                            bg-[#11151d]
                            px-4
                            pr-10
                            text-sm
                            text-slate-300
                            outline-none
                        "
                    >

                        <option value="">
                            All Departments
                        </option>


                        {
                            departments.map(
                                department => {

                                    const id =
                                        department?.id ??
                                        department?.departmentId;


                                    return (

                                        <option
                                            key={
                                                id
                                            }
                                            value={
                                                id
                                            }
                                        >
                                            {
                                                department?.departmentName ??
                                                department?.name ??
                                                "—"
                                            }
                                        </option>

                                    );

                                }
                            )
                        }

                    </select>


                    <ChevronDown
                        className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-slate-500
                        "
                    />

                </div>

            </div>


            {
                hasFilters && (

                    <div
                        className="
                            -mt-3
                            mb-5
                            flex
                            justify-end
                        "
                    >

                        <button
                            type="button"
                            onClick={
                                clearFilters
                            }
                            className="
                                text-xs
                                font-semibold
                                text-cyan-400
                            "
                        >
                            Clear filters
                        </button>

                    </div>

                )
            }


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
                    title="Total Issued"
                    value={
                        summaryLoading
                            ? "..."
                            : summary.totalIssued
                    }
                    icon={
                        <ArrowUpFromLine
                            className="
                                h-5
                                w-5
                                text-blue-400
                            "
                        />
                    }
                    border="border-blue-500/25"
                    iconBackground="
                        border-blue-500/20
                        bg-blue-500/10
                    "
                    valueColor="text-blue-400"
                />


                <SummaryCard
                    title="Returned"
                    value={
                        summaryLoading
                            ? "..."
                            : summary.returned
                    }
                    icon={
                        <ArrowDownToLine
                            className="
                                h-5
                                w-5
                                text-emerald-400
                            "
                        />
                    }
                    border="border-emerald-500/25"
                    iconBackground="
                        border-emerald-500/20
                        bg-emerald-500/10
                    "
                    valueColor="text-emerald-400"
                />


                <SummaryCard
                    title="Overdue"
                    value={
                        summaryLoading
                            ? "..."
                            : summary.overdue
                    }
                    icon={
                        <AlertTriangle
                            className="
                                h-5
                                w-5
                                text-rose-400
                            "
                        />
                    }
                    border="border-rose-500/25"
                    iconBackground="
                        border-rose-500/20
                        bg-rose-500/10
                    "
                    valueColor="text-rose-400"
                />

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
                    bg-[#11151d]
                "
            >

                {
                    loading ? (

                        <div
                            className="
                                flex
                                min-h-[300px]
                                flex-col
                                items-center
                                justify-center
                                gap-3
                            "
                        >

                            <RefreshCw
                                className="
                                    h-7
                                    w-7
                                    animate-spin
                                    text-cyan-400
                                "
                            />

                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Loading Issue / Return records...
                            </p>

                        </div>

                    ) : records.length === 0 ? (

                        <div
                            className="
                                flex
                                min-h-[300px]
                                flex-col
                                items-center
                                justify-center
                                gap-3
                            "
                        >

                            <ClipboardList
                                className="
                                    h-10
                                    w-10
                                    text-slate-700
                                "
                            />

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-400
                                "
                            >
                                No Issue / Return records found.
                            </p>


                            <button
                                type="button"
                                onClick={
                                    openIssueModal
                                }
                                className="
                                    mt-1
                                    inline-flex
                                    items-center
                                    gap-2
                                    text-xs
                                    font-bold
                                    text-cyan-400
                                "
                            >

                                <Plus
                                    className="h-3.5 w-3.5"
                                />

                                Issue an item

                            </button>

                        </div>

                    ) : (

                        <div
                            className="
                                overflow-x-auto
                            "
                        >

                            <table
                                className="
                                    w-full
                                    min-w-[1450px]
                                "
                            >

                                <thead>

                                    <tr
                                        className="
                                            border-b
                                            border-slate-800
                                            bg-[#151922]
                                            text-left
                                        "
                                    >

                                        <TableHeader>
                                            ISSUE DATE
                                        </TableHeader>

                                        <TableHeader>
                                            ITEM
                                        </TableHeader>

                                        <TableHeader>
                                            QTY
                                        </TableHeader>

                                        <TableHeader>
                                            ISSUED TO
                                        </TableHeader>

                                        <TableHeader>
                                            FACULTY / NAME
                                        </TableHeader>

                                        <TableHeader>
                                            DEPARTMENT
                                        </TableHeader>

                                        <TableHeader>
                                            PURPOSE
                                        </TableHeader>

                                        <TableHeader>
                                            EXPECTED RETURN
                                        </TableHeader>

                                        <TableHeader>
                                            ACTUAL RETURN
                                        </TableHeader>

                                        <TableHeader>
                                            STATUS
                                        </TableHeader>

                                        <TableHeader align="right">
                                            ACTIONS
                                        </TableHeader>

                                    </tr>

                                </thead>


                                <tbody>

                                    {
                                        records.map(
                                            record => {

                                                const recordStatus =
                                                    String(
                                                        record?.status ??
                                                        record?.issueStatus ??
                                                        ""
                                                    ).toUpperCase();


                                                const isReturned =
                                                    recordStatus ===
                                                    "RETURNED";


                                                return (

                                                    <tr
                                                        key={
                                                            record.id
                                                        }
                                                        className="
                                                            border-b
                                                            border-slate-800
                                                            last:border-b-0
                                                            hover:bg-slate-900/80
                                                        "
                                                    >

                                                        <td
                                                            className="
                                                                px-3
                                                                py-4
                                                                text-sm
                                                                font-mono
                                                                font-semibold
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
                                                                        h-3.5
                                                                        w-3.5
                                                                        text-blue-400
                                                                    "
                                                                />

                                                                {
                                                                    formatDate(
                                                                        record.issueDate
                                                                    )
                                                                }

                                                            </div>

                                                        </td>


                                                        <td
                                                            className="
                                                                px-3
                                                                py-4
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    font-bold
                                                                    text-slate-100
                                                                "
                                                            >
                                                                {
                                                                    getItemName(
                                                                        record
                                                                    )
                                                                }
                                                            </div>


                                                            <div
                                                                className="
                                                                    mt-1
                                                                    text-xs
                                                                    font-mono
                                                                    text-cyan-500
                                                                "
                                                            >
                                                                {
                                                                    getItemCode(
                                                                        record
                                                                    )
                                                                }
                                                            </div>

                                                        </td>


                                                        <td
                                                            className="
                                                                px-3
                                                                py-4
                                                                font-bold
                                                            "
                                                        >
                                                            {
                                                                record.quantity ??
                                                                0
                                                            }
                                                        </td>


                                                        <td
                                                            className="
                                                                px-3
                                                                py-4
                                                            "
                                                        >

                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    rounded-md
                                                                    border
                                                                    border-blue-500/20
                                                                    bg-blue-500/10
                                                                    px-2.5
                                                                    py-1
                                                                    text-[11px]
                                                                    font-extrabold
                                                                    uppercase
                                                                    text-blue-400
                                                                "
                                                            >
                                                                {
                                                                    getIssueTypeLabel(
                                                                        record.issuedToType
                                                                    )
                                                                }
                                                            </span>

                                                        </td>


                                                        <td
                                                            className="
                                                                px-3
                                                                py-4
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    font-bold
                                                                    text-slate-100
                                                                "
                                                            >
                                                                {
                                                                    record.issuedToName ??
                                                                    "—"
                                                                }
                                                            </div>


                                                            {
                                                                record.employeeNo && (

                                                                    <div
                                                                        className="
                                                                            mt-1
                                                                            text-xs
                                                                            font-mono
                                                                            text-slate-600
                                                                        "
                                                                    >
                                                                        {
                                                                            record.employeeNo
                                                                        }
                                                                    </div>

                                                                )
                                                            }

                                                        </td>


                                                        <td
                                                            className="
                                                                px-3
                                                                py-4
                                                                text-sm
                                                                text-slate-400
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    gap-2
                                                                "
                                                            >

                                                                <Building2
                                                                    className="
                                                                        h-3.5
                                                                        w-3.5
                                                                        text-violet-400
                                                                    "
                                                                />

                                                                {
                                                                    record.departmentName ??
                                                                    getDepartmentName(
                                                                        record.departmentId
                                                                    )
                                                                }

                                                            </div>

                                                        </td>


                                                        <td
                                                            className="
                                                                max-w-[180px]
                                                                px-3
                                                                py-4
                                                                text-sm
                                                                text-slate-400
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    truncate
                                                                "
                                                            >
                                                                {
                                                                    record.purpose ??
                                                                    "—"
                                                                }
                                                            </div>

                                                        </td>


                                                        <td
                                                            className="
                                                                px-3
                                                                py-4
                                                                text-sm
                                                                font-mono
                                                            "
                                                        >
                                                            {
                                                                formatDate(
                                                                    record.expectedReturnDate
                                                                )
                                                            }
                                                        </td>


                                                        <td
                                                            className="
                                                                px-3
                                                                py-4
                                                                text-sm
                                                                font-mono
                                                                font-semibold
                                                                text-emerald-400
                                                            "
                                                        >
                                                            {
                                                                formatDate(
                                                                    record.actualReturnDate
                                                                )
                                                            }
                                                        </td>


                                                        <td
                                                            className="
                                                                px-3
                                                                py-4
                                                            "
                                                        >

                                                            <StatusBadge
                                                                value={
                                                                    recordStatus
                                                                }
                                                            />

                                                        </td>


                                                        <td
                                                            className="
                                                                px-3
                                                                py-4
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    justify-end
                                                                    gap-2
                                                                "
                                                            >

                                                                {
                                                                    !isReturned && (

                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {

                                                                                setReturnForm({

                                                                                    issueReturnId:
                                                                                        record.id,

                                                                                    returnDate:
                                                                                        getToday(),

                                                                                    quantityReturned:
                                                                                        record.quantity ??
                                                                                        "",

                                                                                    returnCondition:
                                                                                        "GOOD",

                                                                                    remarks:
                                                                                        ""

                                                                                });


                                                                                setReturnErrors(
                                                                                    {}
                                                                                );


                                                                                setError(
                                                                                    ""
                                                                                );


                                                                                setShowReturnModal(
                                                                                    true
                                                                                );

                                                                            }}
                                                                            className="
                                                                                inline-flex
                                                                                items-center
                                                                                gap-1.5
                                                                                rounded-lg
                                                                                border
                                                                                border-emerald-500/25
                                                                                bg-emerald-500/10
                                                                                px-3
                                                                                py-2
                                                                                text-xs
                                                                                font-bold
                                                                                text-emerald-400
                                                                            "
                                                                        >

                                                                            <RotateCcw
                                                                                className="
                                                                                    h-3.5
                                                                                    w-3.5
                                                                                "
                                                                            />

                                                                            Return

                                                                        </button>

                                                                    )
                                                                }


                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        viewRecord(
                                                                            record.id
                                                                        )
                                                                    }
                                                                    className="
                                                                        rounded-lg
                                                                        border
                                                                        border-slate-700
                                                                        p-2
                                                                        text-slate-400
                                                                        hover:bg-blue-500/10
                                                                        hover:text-blue-400
                                                                    "
                                                                >

                                                                    <Eye
                                                                        className="
                                                                            h-4
                                                                            w-4
                                                                        "
                                                                    />

                                                                </button>


                                                                <button
                                                                    type="button"
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
                                                                        border-rose-500/25
                                                                        p-2
                                                                        text-rose-400
                                                                        hover:bg-rose-500/10
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


            {/* =================================================
                ISSUE MODAL
            ================================================= */}

            {
                showIssueModal && (

                    <ModalOverlay>

                        <div
                            className="
                                w-full
                                max-w-2xl
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-700
                                bg-[#131720]
                                shadow-2xl
                            "
                        >

                            <ModalHeader
                                title="Issue Item"
                                subtitle="Issue an item from laboratory inventory."
                                icon={
                                    <ArrowUpFromLine
                                        className="
                                            h-5
                                            w-5
                                            text-blue-400
                                        "
                                    />
                                }
                                onClose={
                                    closeIssueModal
                                }
                            />


                            <form
                                onSubmit={
                                    handleIssueSubmit
                                }
                                className="
                                    max-h-[75vh]
                                    overflow-y-auto
                                    p-6
                                "
                            >

                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-5
                                        md:grid-cols-2
                                    "
                                >

                                    <FormField
                                        label="Issue Date"
                                        required
                                        error={
                                            issueErrors.issueDate
                                        }
                                    >

                                        <input
                                            type="date"
                                            name="issueDate"
                                            value={
                                                issueForm.issueDate
                                            }
                                            onChange={
                                                handleIssueChange
                                            }
                                            className={
                                                inputClass(
                                                    issueErrors.issueDate
                                                )
                                            }
                                        />

                                    </FormField>


                                    <FormField
                                        label="Expected Return Date"
                                        error={
                                            issueErrors.expectedReturnDate
                                        }
                                    >

                                        <input
                                            type="date"
                                            name="expectedReturnDate"
                                            value={
                                                issueForm.expectedReturnDate
                                            }
                                            min={
                                                issueForm.issueDate
                                            }
                                            onChange={
                                                handleIssueChange
                                            }
                                            className={
                                                inputClass(
                                                    issueErrors.expectedReturnDate
                                                )
                                            }
                                        />

                                    </FormField>


                                    <FormField
                                        label="Item"
                                        required
                                        error={
                                            issueErrors.inventoryItemId
                                        }
                                    >

                                        <select
                                            name="inventoryItemId"
                                            value={
                                                issueForm.inventoryItemId
                                            }
                                            onChange={
                                                handleIssueChange
                                            }
                                            className={
                                                inputClass(
                                                    issueErrors.inventoryItemId
                                                )
                                            }
                                        >

                                            <option value="">
                                                — Select Item —
                                            </option>


                                            {
                                                itemsLoading ? (

                                                    <option disabled>
                                                        Loading inventory items...
                                                    </option>

                                                ) : (

                                                    inventoryItems.map(
                                                        item => (

                                                            <option
                                                                key={
                                                                    item.id
                                                                }
                                                                value={
                                                                    item.id
                                                                }
                                                            >

                                                                {
                                                                    item.itemName ??
                                                                    "Unnamed Item"
                                                                }

                                                                {" ("}

                                                                {
                                                                    item.itemCode ??
                                                                    "—"
                                                                }

                                                                {") — Stock: "}

                                                                {
                                                                    item.currentStock ??
                                                                    item.quantity ??
                                                                    0
                                                                }

                                                            </option>

                                                        )
                                                    )

                                                )
                                            }

                                        </select>


                                        {
                                            issueForm.inventoryItemId && (

                                                <p
                                                    className="
                                                        mt-2
                                                        text-xs
                                                        text-slate-500
                                                    "
                                                >

                                                    Available stock:

                                                    {" "}

                                                    <span
                                                        className="
                                                            font-bold
                                                            text-cyan-400
                                                        "
                                                    >
                                                        {
                                                            getItemStock(
                                                                issueForm.inventoryItemId
                                                            )
                                                        }
                                                    </span>

                                                </p>

                                            )
                                        }

                                    </FormField>


                                    <FormField
                                        label="Quantity"
                                        required
                                        error={
                                            issueErrors.quantity
                                        }
                                    >

                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            name="quantity"
                                            value={
                                                issueForm.quantity
                                            }
                                            onChange={
                                                handleIssueChange
                                            }
                                            placeholder="0"
                                            className={
                                                inputClass(
                                                    issueErrors.quantity
                                                )
                                            }
                                        />

                                    </FormField>

                                </div>


                                <FormSectionTitle>
                                    Issued To
                                </FormSectionTitle>


                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-5
                                        md:grid-cols-2
                                    "
                                >

                                    <FormField
                                        label="Issued To Type"
                                    >

                                        <select
                                            name="issuedToType"
                                            value={
                                                issueForm.issuedToType
                                            }
                                            onChange={
                                                handleIssueChange
                                            }
                                            className={
                                                inputClass()
                                            }
                                        >

                                            {
                                                ISSUE_TYPES.map(
                                                    type => (

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
                                                )
                                            }

                                        </select>

                                    </FormField>


                                    <FormField
                                        label="Name"
                                        required
                                        error={
                                            issueErrors.issuedToName
                                        }
                                    >

                                        <input
                                            type="text"
                                            name="issuedToName"
                                            value={
                                                issueForm.issuedToName
                                            }
                                            onChange={
                                                handleIssueChange
                                            }
                                            placeholder="Faculty / Student name"
                                            className={
                                                inputClass(
                                                    issueErrors.issuedToName
                                                )
                                            }
                                        />

                                    </FormField>


                                    <FormField
                                        label="ID / Employee No."
                                    >

                                        <input
                                            type="text"
                                            name="employeeNo"
                                            value={
                                                issueForm.employeeNo
                                            }
                                            onChange={
                                                handleIssueChange
                                            }
                                            placeholder="EMP-001 / STU-2024"
                                            className={
                                                inputClass()
                                            }
                                        />

                                    </FormField>


                                    <FormField
                                        label="Department"
                                        required
                                        error={
                                            issueErrors.departmentId
                                        }
                                    >

                                        <select
                                            name="departmentId"
                                            value={
                                                issueForm.departmentId
                                            }
                                            onChange={
                                                handleIssueChange
                                            }
                                            className={
                                                inputClass(
                                                    issueErrors.departmentId
                                                )
                                            }
                                        >

                                            <option value="">
                                                — Select —
                                            </option>


                                            {
                                                departments.map(
                                                    department => {

                                                        const id =
                                                            department?.id ??
                                                            department?.departmentId;


                                                        return (

                                                            <option
                                                                key={
                                                                    id
                                                                }
                                                                value={
                                                                    id
                                                                }
                                                            >
                                                                {
                                                                    department?.departmentName ??
                                                                    department?.name ??
                                                                    "—"
                                                                }
                                                            </option>

                                                        );

                                                    }
                                                )
                                            }

                                        </select>

                                    </FormField>

                                </div>


                                <div className="mt-5">

                                    <FormField
                                        label="Purpose"
                                    >

                                        <input
                                            type="text"
                                            name="purpose"
                                            value={
                                                issueForm.purpose
                                            }
                                            onChange={
                                                handleIssueChange
                                            }
                                            placeholder="Why is item being issued?"
                                            className={
                                                inputClass()
                                            }
                                        />

                                    </FormField>

                                </div>


                                <div className="mt-5">

                                    <FormField
                                        label="Remarks"
                                    >

                                        <textarea
                                            name="remarks"
                                            rows="3"
                                            value={
                                                issueForm.remarks
                                            }
                                            onChange={
                                                handleIssueChange
                                            }
                                            placeholder="Any additional notes..."
                                            className={
                                                inputClass() +
                                                " resize-none"
                                            }
                                        />

                                    </FormField>

                                </div>


                                <ModalFooter>

                                    <button
                                        type="button"
                                        onClick={
                                            closeIssueModal
                                        }
                                        disabled={
                                            saving
                                        }
                                        className="
                                            rounded-lg
                                            border
                                            border-slate-700
                                            bg-slate-900
                                            px-5
                                            py-2.5
                                            text-sm
                                            font-semibold
                                            text-slate-400
                                        "
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        disabled={
                                            saving
                                        }
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-lg
                                            bg-blue-500
                                            px-5
                                            py-2.5
                                            text-sm
                                            font-bold
                                            text-white
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

                                        Issue Item

                                    </button>

                                </ModalFooter>

                            </form>

                        </div>

                    </ModalOverlay>

                )
            }


            {/* =================================================
                RETURN MODAL
            ================================================= */}

            {
                showReturnModal && (

                    <ModalOverlay>

                        <div
                            className="
                                w-full
                                max-w-xl
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-700
                                bg-[#131720]
                                shadow-2xl
                            "
                        >

                            <ModalHeader
                                title="Record Return"
                                subtitle="Record the return of an issued item."
                                icon={
                                    <RotateCcw
                                        className="
                                            h-5
                                            w-5
                                            text-emerald-400
                                        "
                                    />
                                }
                                onClose={
                                    closeReturnModal
                                }
                            />


                            <form
                                onSubmit={
                                    handleReturnSubmit
                                }
                                className="
                                    max-h-[75vh]
                                    overflow-y-auto
                                    p-6
                                "
                            >

                                {/* ==========================================
                                    SELECT ISSUE RECORD
                                =========================================== */}

                                <FormField
                                    label="Select Issue Record"
                                    required
                                    error={
                                        returnErrors.issueReturnId
                                    }
                                >

                                    <select
                                        name="issueReturnId"
                                        value={
                                            returnForm.issueReturnId
                                        }
                                        onChange={
                                            handleReturnChange
                                        }
                                        className={
                                            inputClass(
                                                returnErrors.issueReturnId
                                            )
                                        }
                                    >

                                        <option value="">
                                            — Select issued item —
                                        </option>


                                        {
                                            returnableRecords.map(
                                                record => (

                                                    <option
                                                        key={
                                                            record.id
                                                        }
                                                        value={
                                                            record.id
                                                        }
                                                    >

                                                        #
                                                        {
                                                            record.id
                                                        }

                                                        {" — "}

                                                        {
                                                            getItemName(
                                                                record
                                                            )
                                                        }

                                                        {" to "}

                                                        {
                                                            record.issuedToName ??
                                                            "—"
                                                        }

                                                        {" ("}

                                                        {
                                                            formatDate(
                                                                record.issueDate
                                                            )
                                                        }

                                                        {")"}

                                                    </option>

                                                )
                                            )
                                        }

                                    </select>

                                </FormField>


                                {/* ==========================================
                                    SELECTED RECORD
                                =========================================== */}

                                {
                                    selectedReturnRecord && (

                                        <div
                                            className="
                                                mt-4
                                                rounded-lg
                                                border
                                                border-cyan-500/15
                                                bg-cyan-500/[0.03]
                                                p-4
                                            "
                                        >

                                            <div
                                                className="
                                                    grid
                                                    grid-cols-2
                                                    gap-4
                                                "
                                            >

                                                <div>

                                                    <p
                                                        className="
                                                            text-[10px]
                                                            font-bold
                                                            uppercase
                                                            tracking-wider
                                                            text-slate-600
                                                        "
                                                    >
                                                        Item
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-sm
                                                            font-bold
                                                            text-slate-200
                                                        "
                                                    >
                                                        {
                                                            getItemName(
                                                                selectedReturnRecord
                                                            )
                                                        }
                                                    </p>

                                                </div>


                                                <div>

                                                    <p
                                                        className="
                                                            text-[10px]
                                                            font-bold
                                                            uppercase
                                                            tracking-wider
                                                            text-slate-600
                                                        "
                                                    >
                                                        Currently Issued
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-sm
                                                            font-bold
                                                            text-cyan-400
                                                        "
                                                    >
                                                        {
                                                            selectedReturnRecord.quantity ??
                                                            0
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                }


                                {/* ==========================================
                                    RETURN DATE + QUANTITY
                                =========================================== */}

                                <div
                                    className="
                                        mt-5
                                        grid
                                        grid-cols-1
                                        gap-5
                                        md:grid-cols-2
                                    "
                                >

                                    {/* ======================================
                                        RETURN DATE

                                        IMPORTANT:
                                        NO min
                                        NO max
                                    ======================================= */}

                                    <FormField
                                        label="Return Date"
                                        required
                                        error={
                                            returnErrors.returnDate
                                        }
                                    >

                                        <input
                                            type="date"
                                            name="returnDate"
                                            value={
                                                returnForm.returnDate
                                            }
                                            onChange={
                                                handleReturnChange
                                            }
                                            className={
                                                inputClass(
                                                    returnErrors.returnDate
                                                )
                                            }
                                        />

                                    </FormField>


                                    {/* ======================================
                                        QUANTITY RETURNED
                                    ======================================= */}

                                    <FormField
                                        label="Qty Returned"
                                        required
                                        error={
                                            returnErrors.quantityReturned
                                        }
                                    >

                                        <input
                                            type="number"
                                            min="1"
                                            max={
                                                selectedReturnRecord?.quantity ??
                                                undefined
                                            }
                                            step="1"
                                            name="quantityReturned"
                                            value={
                                                returnForm.quantityReturned
                                            }
                                            onChange={
                                                handleReturnChange
                                            }
                                            placeholder="0"
                                            className={
                                                inputClass(
                                                    returnErrors.quantityReturned
                                                )
                                            }
                                        />

                                    </FormField>

                                </div>


                                {/* ==========================================
                                    CONDITION
                                =========================================== */}

                                <div
                                    className="
                                        mt-5
                                    "
                                >

                                    <FormField
                                        label="Condition"
                                    >

                                        <select
                                            name="returnCondition"
                                            value={
                                                returnForm.returnCondition
                                            }
                                            onChange={
                                                handleReturnChange
                                            }
                                            className={
                                                inputClass()
                                            }
                                        >

                                            {
                                                RETURN_CONDITIONS.map(
                                                    condition => (

                                                        <option
                                                            key={
                                                                condition.value
                                                            }
                                                            value={
                                                                condition.value
                                                            }
                                                        >
                                                            {
                                                                condition.label
                                                            }
                                                        </option>

                                                    )
                                                )
                                            }

                                        </select>

                                    </FormField>

                                </div>


                                {/* ==========================================
                                    REMARKS
                                =========================================== */}

                                <div
                                    className="
                                        mt-5
                                    "
                                >

                                    <FormField
                                        label="Remarks"
                                    >

                                        <textarea
                                            name="remarks"
                                            rows="3"
                                            value={
                                                returnForm.remarks
                                            }
                                            onChange={
                                                handleReturnChange
                                            }
                                            placeholder="Condition notes..."
                                            className={
                                                inputClass() +
                                                " resize-none"
                                            }
                                        />

                                    </FormField>

                                </div>


                                {/* ==========================================
                                    FOOTER
                                =========================================== */}

                                <ModalFooter>

                                    <button
                                        type="button"
                                        onClick={
                                            closeReturnModal
                                        }
                                        disabled={
                                            returnSaving
                                        }
                                        className="
                                            rounded-lg
                                            border
                                            border-slate-700
                                            bg-slate-900
                                            px-5
                                            py-2.5
                                            text-sm
                                            font-semibold
                                            text-slate-400
                                            hover:bg-slate-800
                                        "
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        disabled={
                                            returnSaving
                                        }
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-lg
                                            bg-emerald-400
                                            px-5
                                            py-2.5
                                            text-sm
                                            font-bold
                                            text-slate-950
                                            hover:bg-emerald-300
                                            disabled:opacity-50
                                        "
                                    >

                                        {
                                            returnSaving && (

                                                <RefreshCw
                                                    className="
                                                        h-4
                                                        w-4
                                                        animate-spin
                                                    "
                                                />

                                            )
                                        }

                                        Record Return

                                    </button>

                                </ModalFooter>

                            </form>

                        </div>

                    </ModalOverlay>

                )
            }


            {/* =================================================
                DETAILS MODAL
            ================================================= */}

            {
                showDetailsModal &&
                selectedRecord && (

                    <ModalOverlay>

                        <div
                            className="
                                w-full
                                max-w-2xl
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-700
                                bg-[#131720]
                                shadow-2xl
                            "
                        >

                            <ModalHeader
                                title="Issue / Return Details"
                                subtitle="Register details"
                                icon={
                                    <ClipboardList
                                        className="
                                            h-5
                                            w-5
                                            text-cyan-400
                                        "
                                    />
                                }
                                onClose={() => {

                                    setShowDetailsModal(
                                        false
                                    );

                                    setSelectedRecord(
                                        null
                                    );

                                }}
                            />


                            <div
                                className="
                                    max-h-[75vh]
                                    overflow-y-auto
                                    p-6
                                "
                            >

                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-4
                                        sm:grid-cols-2
                                    "
                                >

                                    <DetailField
                                        label="Issue Number"
                                        value={
                                            selectedRecord.issueNumber ??
                                            "—"
                                        }
                                    />


                                    <DetailField
                                        label="Status"
                                        value={
                                            <StatusBadge
                                                value={
                                                    selectedRecord.status ??
                                                    selectedRecord.issueStatus
                                                }
                                            />
                                        }
                                    />


                                    <DetailField
                                        label="Item"
                                        value={
                                            getItemName(
                                                selectedRecord
                                            )
                                        }
                                    />


                                    <DetailField
                                        label="Item Code"
                                        value={
                                            getItemCode(
                                                selectedRecord
                                            )
                                        }
                                    />


                                    <DetailField
                                        label="Quantity"
                                        value={
                                            selectedRecord.quantity ??
                                            0
                                        }
                                    />


                                    <DetailField
                                        label="Issued To"
                                        value={
                                            getIssueTypeLabel(
                                                selectedRecord.issuedToType
                                            )
                                        }
                                    />


                                    <DetailField
                                        label="Faculty / Name"
                                        value={
                                            selectedRecord.issuedToName ??
                                            "—"
                                        }
                                    />


                                    <DetailField
                                        label="ID / Employee No."
                                        value={
                                            selectedRecord.employeeNo ??
                                            "—"
                                        }
                                    />


                                    <DetailField
                                        label="Department"
                                        value={
                                            selectedRecord.departmentName ??
                                            getDepartmentName(
                                                selectedRecord.departmentId
                                            )
                                        }
                                    />


                                    <DetailField
                                        label="Issue Date"
                                        value={
                                            formatDateLong(
                                                selectedRecord.issueDate
                                            )
                                        }
                                    />


                                    <DetailField
                                        label="Expected Return"
                                        value={
                                            formatDateLong(
                                                selectedRecord.expectedReturnDate
                                            )
                                        }
                                    />


                                    <DetailField
                                        label="Actual Return"
                                        value={
                                            formatDateLong(
                                                selectedRecord.actualReturnDate
                                            )
                                        }
                                    />


                                    <DetailField
                                        label="Return Condition"
                                        value={
                                            formatEnum(
                                                selectedRecord.returnCondition ??
                                                selectedRecord.condition
                                            )
                                        }
                                    />


                                    <DetailField
                                        label="Purpose"
                                        value={
                                            selectedRecord.purpose ??
                                            "—"
                                        }
                                    />


                                    <DetailField
                                        label="Issued By"
                                        value={
                                            selectedRecord.issuedByName ??
                                            "—"
                                        }
                                    />


                                    <DetailField
                                        label="Returned By"
                                        value={
                                            selectedRecord.returnedByName ??
                                            "—"
                                        }
                                    />


                                    <div
                                        className="
                                            sm:col-span-2
                                        "
                                    >

                                        <DetailField
                                            label="Remarks"
                                            value={
                                                selectedRecord.remarks ??
                                                "—"
                                            }
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

                                            setShowDetailsModal(
                                                false
                                            );

                                            setSelectedRecord(
                                                null
                                            );

                                        }}
                                        className="
                                            rounded-lg
                                            border
                                            border-slate-700
                                            bg-slate-900
                                            px-5
                                            py-2.5
                                            text-sm
                                            font-semibold
                                            text-slate-400
                                        "
                                    >
                                        Close
                                    </button>

                                </div>

                            </div>

                        </div>

                    </ModalOverlay>

                )
            }

        </div>

    );

}


// =============================================================
// SUMMARY CARD
// =============================================================

function SummaryCard({
    title,
    value,
    icon,
    border,
    iconBackground,
    valueColor
}) {

    return (

        <div
            className={`
                relative
                overflow-hidden
                rounded-xl
                border
                bg-[#11151d]
                p-5
                ${border}
            `}
        >

            <div
                className="
                    flex
                    items-start
                    justify-between
                "
            >

                <div>

                    <p
                        className="
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-500
                        "
                    >
                        {title}
                    </p>


                    <p
                        className={`
                            mt-3
                            text-4xl
                            font-black
                            ${valueColor}
                        `}
                    >
                        {value}
                    </p>

                </div>


                <div
                    className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-lg
                        border
                        ${iconBackground}
                    `}
                >
                    {icon}
                </div>

            </div>

        </div>

    );

}


// =============================================================
// TABLE HEADER
// =============================================================

function TableHeader({
    children,
    align = "left"
}) {

    return (

        <th
            className={`
                whitespace-nowrap
                px-3
                py-3.5
                text-${align}
                text-[10px]
                font-extrabold
                uppercase
                tracking-wider
                text-slate-500
            `}
        >
            {children}
        </th>

    );

}


// =============================================================
// FORM FIELD
// =============================================================

function FormField({
    label,
    required = false,
    error,
    children
}) {

    return (

        <div>

            <label
                className="
                    mb-2
                    block
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                "
            >

                {label}

                {
                    required && (

                        <span
                            className="
                                ml-1
                                text-rose-400
                            "
                        >
                            *
                        </span>

                    )
                }

            </label>


            {children}


            {
                error && (

                    <p
                        className="
                            mt-1.5
                            text-xs
                            font-medium
                            text-rose-400
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
// INPUT CLASS
// =============================================================

function inputClass(
    error
) {

    return `
        w-full
        rounded-lg
        border
        ${
            error
                ? "border-rose-500/60"
                : "border-slate-700"
        }
        bg-[#0c0f15]
        px-3.5
        py-2.5
        text-sm
        text-slate-200
        outline-none
        placeholder:text-slate-600
        focus:border-cyan-500/60
        focus:ring-1
        focus:ring-cyan-500/20
    `;

}


// =============================================================
// FORM SECTION TITLE
// =============================================================

function FormSectionTitle({
    children
}) {

    return (

        <div
            className="
                mb-4
                mt-7
                border-b
                border-slate-800
                pb-2
            "
        >

            <h3
                className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-cyan-400
                "
            >
                {children}
            </h3>

        </div>

    );

}


// =============================================================
// MODAL OVERLAY
// =============================================================

function ModalOverlay({
    children
}) {

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
            {children}
        </div>

    );

}


// =============================================================
// MODAL HEADER
// =============================================================

function ModalHeader({
    title,
    subtitle,
    icon,
    onClose
}) {

    return (

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
                        rounded-lg
                        border
                        border-slate-700
                        bg-slate-900
                    "
                >
                    {icon}
                </div>


                <div>

                    <h2
                        className="
                            text-lg
                            font-extrabold
                            text-slate-100
                        "
                    >
                        {title}
                    </h2>


                    <p
                        className="
                            mt-0.5
                            text-xs
                            text-slate-500
                        "
                    >
                        {subtitle}
                    </p>

                </div>

            </div>


            <button
                type="button"
                onClick={
                    onClose
                }
                className="
                    rounded-lg
                    p-2
                    text-slate-500
                    hover:bg-slate-800
                    hover:text-slate-200
                "
            >

                <X
                    className="
                        h-5
                        w-5
                    "
                />

            </button>

        </div>

    );

}


// =============================================================
// MODAL FOOTER
// =============================================================

function ModalFooter({
    children
}) {

    return (

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
            {children}
        </div>

    );

}


// =============================================================
// DETAIL FIELD
// =============================================================

function DetailField({
    label,
    value
}) {

    return (

        <div
            className="
                rounded-lg
                border
                border-slate-800
                bg-slate-900/40
                p-4
            "
        >

            <p
                className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-600
                "
            >
                {label}
            </p>


            <div
                className="
                    mt-2
                    break-words
                    text-sm
                    font-semibold
                    text-slate-200
                "
            >
                {value}
            </div>

        </div>

    );

}


// =============================================================
// STATUS BADGE
// =============================================================

function StatusBadge({
    value
}) {

    const status =
        String(
            value ?? ""
        ).toUpperCase();


    if (
        status ===
        "RETURNED"
    ) {

        return (

            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-md
                    border
                    border-emerald-400/20
                    bg-emerald-500/10
                    px-2.5
                    py-1
                    text-[11px]
                    font-extrabold
                    text-emerald-300
                "
            >

                <CheckCircle2
                    className="h-3 w-3"
                />

                RETURNED

            </span>

        );

    }


    if (
        status ===
        "OVERDUE"
    ) {

        return (

            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-md
                    border
                    border-rose-400/20
                    bg-rose-500/10
                    px-2.5
                    py-1
                    text-[11px]
                    font-extrabold
                    text-rose-300
                "
            >

                <AlertTriangle
                    className="h-3 w-3"
                />

                OVERDUE

            </span>

        );

    }


    return (

        <span
            className="
                inline-flex
                items-center
                gap-1.5
                rounded-md
                border
                border-blue-400/20
                bg-blue-500/10
                px-2.5
                py-1
                text-[11px]
                font-extrabold
                text-blue-300
            "
        >

            <ArrowUpFromLine
                className="h-3 w-3"
            />

            ISSUED

        </span>

    );

}


// =============================================================
// ALERT MESSAGE
// =============================================================

function AlertMessage({
    type,
    message,
    onClose
}) {

    const isError =
        type ===
        "error";


    return (

        <div
            className={`
                mb-5
                flex
                items-start
                gap-3
                rounded-lg
                border
                px-4
                py-3
                text-sm
                ${
                    isError
                        ? `
                            border-rose-500/25
                            bg-rose-500/[0.06]
                            text-rose-300
                        `
                        : `
                            border-emerald-500/25
                            bg-emerald-500/[0.06]
                            text-emerald-300
                        `
                }
            `}
        >

            {
                isError
                    ? (
                        <AlertCircle
                            className="
                                mt-0.5
                                h-4
                                w-4
                            "
                        />
                    )
                    : (
                        <CheckCircle2
                            className="
                                mt-0.5
                                h-4
                                w-4
                            "
                        />
                    )
            }


            <span
                className="
                    flex-1
                    font-medium
                "
            >
                {message}
            </span>


            <button
                type="button"
                onClick={
                    onClose
                }
                className="
                    text-slate-500
                    hover:text-slate-200
                "
            >

                <X
                    className="
                        h-4
                        w-4
                    "
                />

            </button>

        </div>

    );

}


// =============================================================
// ENUM FORMATTER
// =============================================================

function formatEnum(
    value
) {

    if (!value) {
        return "—";
    }


    return String(
        value
    )
        .replaceAll(
            "_",
            " "
        )
        .toLowerCase()
        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
        );

}


export default IssueReturn;