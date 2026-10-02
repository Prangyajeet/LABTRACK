import { useEffect, useMemo, useState } from "react";

import { getAllCategories } from "../../services/categoryService";

import {
    createEquipment,
    deleteEquipment,
    getAllEquipment,
    getEquipmentByCategory,
    searchEquipment,
    updateEquipment
} from "../../services/equipmentService";

import EquipmentForm from "./EquipmentForm";
import MaintenanceLogModal from "./MaintenanceLogModal";
import AmcDocumentSection from "./AmcDocumentSection";


const EQUIPMENT_CATEGORIES = [
    "CENTRIFUGE",
    "AUTOCLAVE",
    "MICROSCOPE",
    "SPECTROPHOTOMETER",
    "PCR_MACHINE",
    "REFRIGERATOR",
    "INCUBATOR",
    "BALANCE",
    "OTHER"
];


const initialForm = {
    equipmentName: "",
    equipmentCode: "",
    category: "OTHER",
    manufacturer: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    purchaseCost: "",
    warrantyUntil: "",
    location: "",
    amcProvider: "",
    amcContact: "",
    amcStart: "",
    amcEnd: "",
    amcCostPerYear: "",
    amcType: "COMPREHENSIVE",
    amcCoverageNotes: "",
    lastMaintenanceDate: "",
    nextMaintenanceDate: ""
};


function Equipment() {

    const [equipment, setEquipment] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);


    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [amcFilter, setAmcFilter] =
        useState("");


    const [showForm, setShowForm] =
        useState(false);

    const [showMaintenance, setShowMaintenance] =
        useState(false);

    const [showView, setShowView] =
        useState(false);


    const [editingEquipment, setEditingEquipment] =
        useState(null);

    const [maintenanceEquipment, setMaintenanceEquipment] =
        useState(null);

    const [viewEquipment, setViewEquipment] =
        useState(null);


    const [error, setError] =
        useState("");


    const [categoryOptions, setCategoryOptions] =
        useState(EQUIPMENT_CATEGORIES);


    /*
     * =========================================================
     * LOAD CATEGORY MODULE CATEGORIES
     * =========================================================
     */

    useEffect(() => {

        let active = true;

        const loadMasterCategories = async () => {

            try {

                const response =
                    await getAllCategories(
                        0,
                        100,
                        "categoryName",
                        "asc",
                        ""
                    );

                const data =
                    Array.isArray(response)
                        ? response
                        : Array.isArray(response?.content)
                            ? response.content
                            : Array.isArray(response?.items)
                                ? response.items
                                : [];

                const names = data
                    .map((item) =>
                        typeof item === "string"
                            ? item
                            : item?.categoryName
                    )
                    .filter(
                        (name) =>
                            typeof name === "string" &&
                            name.trim()
                    )
                    .map((name) => name.trim());

                const merged = [
                    ...EQUIPMENT_CATEGORIES,
                    ...names.filter(
                        (categoryName) =>
                            !EQUIPMENT_CATEGORIES.some(
                                (existingCategory) =>
                                    existingCategory.toLowerCase() ===
                                    categoryName.toLowerCase()
                            )
                    )
                ];

                if (active) {
                    setCategoryOptions(merged);
                }

            } catch (categoryError) {

                if (active) {
                    setCategoryOptions(
                        EQUIPMENT_CATEGORIES
                    );
                }

            }

        };

        loadMasterCategories();

        return () => {
            active = false;
        };

    }, []);


    /*
     * =========================================================
     * LOAD EQUIPMENT
     * =========================================================
     */

    const loadEquipment = async () => {

        try {

            setLoading(true);

            setError("");


            let data;


            if (search.trim()) {

                data =
                    await searchEquipment(
                        search.trim()
                    );

            } else if (category) {

                data =
                    await getEquipmentByCategory(
                        category
                    );

            } else {

                data =
                    await getAllEquipment();

            }


            setEquipment(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to load equipment."
            );

        } finally {

            setLoading(false);

        }

    };


    /*
     * =========================================================
     * INITIAL / FILTER LOAD
     * =========================================================
     */

    useEffect(() => {

        const timer =
            setTimeout(() => {

                loadEquipment();

            }, 300);


        return () =>
            clearTimeout(timer);

    }, [
        search,
        category
    ]);


    /*
     * =========================================================
     * AMC FILTER
     * =========================================================
     */

    const filteredEquipment =
        useMemo(() => {

            if (!amcFilter) {

                return equipment;

            }


            return equipment.filter(
                (item) =>
                    item.amcStatus ===
                    amcFilter
            );

        }, [
            equipment,
            amcFilter
        ]);


    /*
     * =========================================================
     * STATISTICS
     * =========================================================
     */

    const stats =
        useMemo(() => {

            return {

                total:
                    equipment.length,


                active:
                    equipment.filter(
                        (item) =>
                            item.status ===
                            "ACTIVE"
                    ).length,


                amcExpiring:
                    equipment.filter(
                        (item) =>
                            item.amcStatus ===
                            "EXPIRING_SOON"
                    ).length,


                maintenanceDue:
                    equipment.filter(
                        (item) => {

                            if (
                                !item.nextMaintenanceDate
                            ) {

                                return false;

                            }


                            const today =
                                new Date();

                            const limit =
                                new Date();

                            limit.setDate(
                                today.getDate() +
                                14
                            );


                            const maintenanceDate =
                                new Date(
                                    item.nextMaintenanceDate
                                );


                            return (
                                maintenanceDate >=
                                today &&
                                maintenanceDate <=
                                limit
                            );

                        }
                    ).length

            };

        }, [
            equipment
        ]);


    /*
     * =========================================================
     * ADD
     * =========================================================
     */

    const openAdd = () => {

        setEditingEquipment(
            null
        );

        setShowForm(
            true
        );

    };


    /*
     * =========================================================
     * EDIT
     * =========================================================
     */

    const openEdit = (
        item
    ) => {

        setEditingEquipment(
            item
        );

        setShowForm(
            true
        );

    };


    /*
     * =========================================================
     * VIEW
     * =========================================================
     */

    const openView = (
        item
    ) => {

        setViewEquipment(
            item
        );

        setShowView(
            true
        );

    };


    /*
     * =========================================================
     * MAINTENANCE
     * =========================================================
     */

    const openMaintenance = (
        item
    ) => {

        setMaintenanceEquipment(
            item
        );

        setShowMaintenance(
            true
        );

    };


    /*
     * =========================================================
     * SAVE
     * =========================================================
     */

    const handleSave = async (
        form
    ) => {

        try {

            setSaving(
                true
            );

            setError("");


            if (
                editingEquipment
            ) {

                await updateEquipment(
                    editingEquipment.id,
                    form
                );

            } else {

                await createEquipment(
                    form
                );

            }


            setShowForm(
                false
            );

            setEditingEquipment(
                null
            );


            await loadEquipment();

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to save equipment."
            );

        } finally {

            setSaving(
                false
            );

        }

    };


    /*
     * =========================================================
     * DELETE / DEACTIVATE
     * =========================================================
     */

    const handleDelete = async (
        id
    ) => {

        if (
            !window.confirm(
                "Deactivate this equipment?"
            )
        ) {

            return;

        }


        try {

            setError("");


            await deleteEquipment(
                id
            );


            await loadEquipment();

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to deactivate equipment."
            );

        }

    };


    /*
     * =========================================================
     * DATE
     * =========================================================
     */

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
     * =========================================================
     * CURRENCY
     * =========================================================
     */

    const formatCurrency = (
        value
    ) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "—";

        }


        return `₹${Number(
            value
        ).toLocaleString(
            "en-IN"
        )}`;

    };


    /*
     * =========================================================
     * AMC LABEL
     * =========================================================
     */

    const getAmcLabel = (
        status
    ) => {

        const labels = {

            ACTIVE:
                "Active",

            EXPIRING_SOON:
                "Expiring Soon",

            EXPIRED:
                "Expired",

            NO_AMC:
                "No AMC",

            NOT_STARTED:
                "Not Started"

        };


        return (
            labels[status] ||
            status ||
            "—"
        );

    };


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

                    {/* KEEP WHITE */}

                    <h1
                        className="
                            text-2xl
                            font-bold
                            text-white
                        "
                    >
                        Equipment
                    </h1>


                    {/* KEEP WHITE */}

                    <p
                        className="
                            mt-1
                            text-sm
                            text-white
                        "
                    >
                        Manage laboratory equipment,
                        AMC and maintenance
                    </p>

                </div>


                <button
                    type="button"
                    onClick={openAdd}
                    className="
                        rounded-lg
                        bg-blue-600
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-blue-500
                    "
                >
                    + Add Equipment
                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

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
                STAT CARDS
            ================================================= */}

            <div
                className="
                    mb-6
                    grid
                    grid-cols-1
                    gap-4
                    md:grid-cols-2
                    xl:grid-cols-4
                "
            >

                {/* TOTAL */}

                <div
                    className="
                        rounded-xl
                        border
                        border-blue-500/20
                        bg-[#101729]
                        p-5
                    "
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
                                className="
                                    text-sm
                                    text-blue-300
                                "
                            >
                                Total Equipment
                            </p>

                            <p
                                className="
                                    mt-2
                                    text-3xl
                                    font-bold
                                    text-blue-400
                                "
                            >
                                {stats.total}
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
                                bg-blue-500/15
                                text-2xl
                            "
                        >
                            🔬
                        </div>

                    </div>

                </div>


                {/* ACTIVE */}

                <div
                    className="
                        rounded-xl
                        border
                        border-emerald-500/20
                        bg-[#101729]
                        p-5
                    "
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
                                className="
                                    text-sm
                                    text-emerald-300
                                "
                            >
                                Active
                            </p>

                            <p
                                className="
                                    mt-2
                                    text-3xl
                                    font-bold
                                    text-emerald-400
                                "
                            >
                                {stats.active}
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
                                bg-emerald-500/15
                                text-2xl
                            "
                        >
                            ✓
                        </div>

                    </div>

                </div>


                {/* AMC EXPIRING */}

                <div
                    className="
                        rounded-xl
                        border
                        border-amber-500/20
                        bg-[#101729]
                        p-5
                    "
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
                                className="
                                    text-sm
                                    text-amber-300
                                "
                            >
                                AMC Expiring Soon
                            </p>

                            <p
                                className="
                                    mt-2
                                    text-3xl
                                    font-bold
                                    text-amber-400
                                "
                            >
                                {stats.amcExpiring}
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
                                bg-amber-500/15
                                text-2xl
                            "
                        >
                            ⚠
                        </div>

                    </div>

                </div>


                {/* MAINTENANCE */}

                <div
                    className="
                        rounded-xl
                        border
                        border-red-500/20
                        bg-[#101729]
                        p-5
                    "
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
                                className="
                                    text-sm
                                    text-red-300
                                "
                            >
                                Maintenance Due
                            </p>

                            <p
                                className="
                                    mt-2
                                    text-3xl
                                    font-bold
                                    text-red-400
                                "
                            >
                                {stats.maintenanceDue}
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
                                bg-red-500/15
                                text-2xl
                            "
                        >
                            🔧
                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div
                className="
                    mb-5
                    rounded-xl
                    border
                    border-slate-800
                    bg-[#101729]
                    p-4
                "
            >

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-3
                        lg:grid-cols-12
                    "
                >

                    <div
                        className="
                            lg:col-span-8
                        "
                    >

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search equipment..."
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-700
                                bg-[#080d1b]
                                px-4
                                py-3
                                text-sm
                                text-white
                                outline-none
                                placeholder:text-slate-500
                                focus:border-blue-500
                            "
                        />

                    </div>


                    <div
                        className="
                            lg:col-span-2
                        "
                    >

                        <select
                            value={category}
                            onChange={(event) =>
                                setCategory(
                                    event.target.value
                                )
                            }
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-700
                                bg-[#080d1b]
                                px-4
                                py-3
                                text-sm
                                text-white
                                outline-none
                                focus:border-blue-500
                            "
                        >

                            <option value="">
                                All Categories
                            </option>

                            {categoryOptions.map(
                                (item) => (

                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    <div
                        className="
                            lg:col-span-2
                        "
                    >

                        <select
                            value={amcFilter}
                            onChange={(event) =>
                                setAmcFilter(
                                    event.target.value
                                )
                            }
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-700
                                bg-[#080d1b]
                                px-4
                                py-3
                                text-sm
                                text-white
                                outline-none
                                focus:border-blue-500
                            "
                        >

                            <option value="">
                                All AMC Status
                            </option>

                            <option value="ACTIVE">
                                Active
                            </option>

                            <option value="EXPIRING_SOON">
                                Expiring Soon
                            </option>

                            <option value="EXPIRED">
                                Expired
                            </option>

                            <option value="NO_AMC">
                                No AMC
                            </option>

                            <option value="NOT_STARTED">
                                Not Started
                            </option>

                        </select>

                    </div>

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
                "
            >

                <div className="overflow-x-auto">

                    <table
                        className="
                            min-w-[1350px]
                            w-full
                        "
                    >

                        <thead
                            className="
                                bg-[#0b1224]
                            "
                        >

                            <tr>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-blue-300">
                                    Equipment
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-green-300">
                                    Purchase Cost
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-violet-300">
                                    Category
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-cyan-300">
                                    Manufacturer
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-pink-300">
                                    Model
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-amber-300">
                                    Serial Number
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-emerald-300">
                                    Location
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-purple-300">
                                    AMC
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-orange-300">
                                    AMC End
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-green-300">
                                    Maintenance
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-cyan-300">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="11"
                                        className="
                                            px-5
                                            py-10
                                            text-center
                                            text-blue-300
                                        "
                                    >
                                        Loading equipment...
                                    </td>

                                </tr>

                            ) : filteredEquipment.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="11"
                                        className="
                                            px-5
                                            py-10
                                            text-center
                                            text-slate-400
                                        "
                                    >
                                        No equipment found.
                                    </td>

                                </tr>

                            ) : (

                                filteredEquipment.map(
                                    (item) => (

                                        <tr
                                            key={item.id}
                                            className="
                                                border-t
                                                border-slate-800
                                                transition
                                                hover:bg-slate-800/40
                                            "
                                        >

                                            <td className="px-5 py-4">

                                                <div
                                                    className="
                                                        font-semibold
                                                        text-blue-300
                                                    "
                                                >
                                                    {item.equipmentName}
                                                </div>

                                                <div
                                                    className="
                                                        mt-1
                                                        text-xs
                                                        text-slate-500
                                                    "
                                                >
                                                    {item.equipmentCode}
                                                </div>

                                            </td>


                                            <td
                                                className="
                                                    px-5
                                                    py-4
                                                    font-semibold
                                                    text-green-300
                                                    whitespace-nowrap
                                                "
                                            >
                                                {formatCurrency(
                                                    item.purchaseCost
                                                )}
                                            </td>


                                            <td
                                                className="
                                                    px-5
                                                    py-4
                                                    text-violet-300
                                                "
                                            >
                                                {item.category || "—"}
                                            </td>


                                            <td
                                                className="
                                                    px-5
                                                    py-4
                                                    text-cyan-300
                                                "
                                            >
                                                {item.manufacturer || "—"}
                                            </td>


                                            <td
                                                className="
                                                    px-5
                                                    py-4
                                                    text-pink-300
                                                "
                                            >
                                                {item.model || "—"}
                                            </td>


                                            <td
                                                className="
                                                    px-5
                                                    py-4
                                                    text-amber-300
                                                "
                                            >
                                                {item.serialNumber || "—"}
                                            </td>


                                            <td
                                                className="
                                                    px-5
                                                    py-4
                                                    text-emerald-300
                                                "
                                            >
                                                {item.location || "—"}
                                            </td>


                                            <td className="px-5 py-4">

                                                <span
                                                    className={`
                                                        inline-flex
                                                        rounded-md
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-semibold
                                                        ${
                                                            item.amcStatus ===
                                                            "EXPIRING_SOON"
                                                                ? "bg-amber-500/15 text-amber-300"
                                                                : item.amcStatus ===
                                                                  "EXPIRED"
                                                                    ? "bg-red-500/15 text-red-300"
                                                                    : item.amcStatus ===
                                                                      "ACTIVE"
                                                                        ? "bg-emerald-500/15 text-emerald-300"
                                                                        : "bg-slate-700/50 text-slate-300"
                                                        }
                                                    `}
                                                >
                                                    {
                                                        getAmcLabel(
                                                            item.amcStatus
                                                        )
                                                    }
                                                </span>

                                            </td>


                                            <td
                                                className="
                                                    px-5
                                                    py-4
                                                    text-orange-300
                                                "
                                            >
                                                {
                                                    formatDate(
                                                        item.amcEnd
                                                    )
                                                }
                                            </td>


                                            <td className="px-5 py-4">

                                                <span
                                                    className={`
                                                        inline-flex
                                                        rounded-md
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-semibold
                                                        ${
                                                            item.nextMaintenanceDate
                                                                ? "bg-emerald-500/15 text-emerald-300"
                                                                : "bg-slate-700/50 text-slate-300"
                                                        }
                                                    `}
                                                >
                                                    {
                                                        item.nextMaintenanceDate
                                                            ? formatDate(
                                                                item.nextMaintenanceDate
                                                            )
                                                            : "OK"
                                                    }
                                                </span>

                                            </td>


                                            <td className="px-5 py-4">

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
                                                            openView(
                                                                item
                                                            )
                                                        }
                                                        className="
                                                            rounded-lg
                                                            border
                                                            border-blue-500/30
                                                            px-3
                                                            py-2
                                                            text-xs
                                                            text-blue-300
                                                            transition
                                                            hover:bg-blue-500/10
                                                        "
                                                    >
                                                        View
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEdit(
                                                                item
                                                            )
                                                        }
                                                        className="
                                                            rounded-lg
                                                            border
                                                            border-cyan-500/30
                                                            px-3
                                                            py-2
                                                            text-xs
                                                            text-cyan-300
                                                            transition
                                                            hover:bg-cyan-500/10
                                                        "
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openMaintenance(
                                                                item
                                                            )
                                                        }
                                                        className="
                                                            rounded-lg
                                                            border
                                                            border-violet-500/30
                                                            px-3
                                                            py-2
                                                            text-xs
                                                            text-violet-300
                                                            transition
                                                            hover:bg-violet-500/10
                                                        "
                                                    >
                                                        Maintenance
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
                                                            )
                                                        }
                                                        className="
                                                            rounded-lg
                                                            border
                                                            border-red-500/30
                                                            px-3
                                                            py-2
                                                            text-xs
                                                            text-red-300
                                                            transition
                                                            hover:bg-red-500/10
                                                        "
                                                    >
                                                        Deactivate
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =================================================
                EQUIPMENT FORM
            ================================================= */}

            {showForm && (

                <EquipmentForm

                    initialData={
                        editingEquipment ||
                        initialForm
                    }

                    equipment={
                        editingEquipment
                    }

                    saving={
                        saving
                    }

                    onSave={
                        handleSave
                    }

                    onClose={() => {

                        if (saving) {
                            return;
                        }

                        setShowForm(
                            false
                        );

                        setEditingEquipment(
                            null
                        );

                    }}

                />

            )}


            {/* =================================================
                MAINTENANCE MODAL
            ================================================= */}

            {showMaintenance &&
                maintenanceEquipment && (

                    <MaintenanceLogModal

                        equipment={
                            maintenanceEquipment
                        }

                        onClose={() => {

                            setShowMaintenance(
                                false
                            );

                            setMaintenanceEquipment(
                                null
                            );

                        }}

                        onSaved={async () => {

                            setShowMaintenance(
                                false
                            );

                            setMaintenanceEquipment(
                                null
                            );

                            await loadEquipment();

                        }}

                    />

                )}


            {/* =================================================
                VIEW MODAL
            ================================================= */}

            {showView &&
                viewEquipment && (

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
                                border-slate-700
                                bg-[#101729]
                                shadow-2xl
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
                                            text-xl
                                            font-bold
                                            text-white
                                        "
                                    >
                                        Equipment Details
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-blue-300
                                        "
                                    >
                                        {
                                            viewEquipment.equipmentName
                                        }
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={() => {

                                        setShowView(
                                            false
                                        );

                                        setViewEquipment(
                                            null
                                        );

                                    }}
                                    className="
                                        text-2xl
                                        text-slate-500
                                        transition
                                        hover:text-white
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

                                <ViewInfo
                                    label="Equipment"
                                    value={
                                        viewEquipment.equipmentName
                                    }
                                    color="text-blue-300"
                                />

                                <ViewInfo
                                    label="Equipment Code"
                                    value={
                                        viewEquipment.equipmentCode
                                    }
                                    color="text-cyan-300"
                                />

                                <ViewInfo
                                    label="Category"
                                    value={
                                        viewEquipment.category
                                    }
                                    color="text-violet-300"
                                />

                                <ViewInfo
                                    label="Manufacturer"
                                    value={
                                        viewEquipment.manufacturer
                                    }
                                    color="text-emerald-300"
                                />

                                <ViewInfo
                                    label="Model"
                                    value={
                                        viewEquipment.model
                                    }
                                    color="text-pink-300"
                                />

                                <ViewInfo
                                    label="Serial Number"
                                    value={
                                        viewEquipment.serialNumber
                                    }
                                    color="text-amber-300"
                                />

                                <ViewInfo
                                    label="Location"
                                    value={
                                        viewEquipment.location
                                    }
                                    color="text-cyan-300"
                                />

                                <ViewInfo
                                    label="Purchase Cost"
                                    value={
                                        formatCurrency(
                                            viewEquipment.purchaseCost
                                        )
                                    }
                                    color="text-green-300"
                                />

                                <ViewInfo
                                    label="AMC Provider"
                                    value={
                                        viewEquipment.amcProvider
                                    }
                                    color="text-purple-300"
                                />

                                <ViewInfo
                                    label="AMC Contact"
                                    value={
                                        viewEquipment.amcContact
                                    }
                                    color="text-blue-300"
                                />

                                <ViewInfo
                                    label="AMC Start"
                                    value={
                                        formatDate(
                                            viewEquipment.amcStart
                                        )
                                    }
                                    color="text-emerald-300"
                                />

                                <ViewInfo
                                    label="AMC End"
                                    value={
                                        formatDate(
                                            viewEquipment.amcEnd
                                        )
                                    }
                                    color="text-orange-300"
                                />

                                <ViewInfo
                                    label="Last Maintenance"
                                    value={
                                        formatDate(
                                            viewEquipment.lastMaintenanceDate
                                        )
                                    }
                                    color="text-cyan-300"
                                />

                                <ViewInfo
                                    label="Next Maintenance"
                                    value={
                                        formatDate(
                                            viewEquipment.nextMaintenanceDate
                                        )
                                    }
                                    color="text-red-300"
                                />

                            </div>


                            {/* =================================================
                                AMC DOCUMENTS
                                Read-only view inside Equipment Details.
                            ================================================= */}

                            <div className="px-6 pb-6">

                                <AmcDocumentSection
                                    equipment={viewEquipment}
                                    readOnly
                                />

                            </div>

                        </div>

                    </div>

                )}

        </div>

    );

}


/*
 * =============================================================
 * VIEW INFO
 * =============================================================
 */

function ViewInfo({
    label,
    value,
    color = "text-white"
}) {

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
                className="
                    text-xs
                    uppercase
                    tracking-wide
                    text-slate-500
                "
            >
                {label}
            </p>


            <p
                className={`
                    mt-1
                    text-sm
                    font-semibold
                    ${color}
                `}
            >
                {value || "—"}
            </p>

        </div>

    );

}


export default Equipment;