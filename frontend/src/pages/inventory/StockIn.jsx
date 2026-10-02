import { useEffect, useMemo, useState } from "react";

import {
    ArrowDownToLine,
    CalendarDays,
    CheckCircle2,
    FileText,
    Package,
    RefreshCw,
    Truck
} from "lucide-react";

import inventoryService from "../../services/inventoryService";


function StockIn() {

    const [inventoryItems, setInventoryItems] = useState([]);

    const [loading, setLoading] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        inventoryItemId: "",
        quantity: "",
        remarks: ""
    });


    /*
     * =========================================================
     * LOAD INVENTORY
     * =========================================================
     */

    const loadInventory = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await inventoryService.getAllInventory();

            let items = [];

            if (Array.isArray(response)) {

                items = response;

            } else if (
                response &&
                Array.isArray(response.data)
            ) {

                items = response.data;

            } else if (
                response &&
                Array.isArray(response.content)
            ) {

                items = response.content;

            }

            setInventoryItems(items);

            if (items.length === 0) {

                console.warn(
                    "Inventory API returned no inventory items.",
                    response
                );

            }

        } catch (err) {

            console.error(
                "Failed to load inventory:",
                err
            );

            setInventoryItems([]);

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to load inventory items."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadInventory();

    }, []);


    /*
     * =========================================================
     * SELECTED ITEM
     * =========================================================
     */

    const selectedItem = useMemo(() => {

        if (!formData.inventoryItemId) {

            return null;

        }

        return inventoryItems.find(
            (item) =>
                String(item.id) ===
                String(formData.inventoryItemId)
        ) || null;

    }, [
        inventoryItems,
        formData.inventoryItemId
    ]);


    /*
     * =========================================================
     * STOCK CALCULATIONS
     * =========================================================
     */

    const currentStock =
        Number(
            selectedItem?.quantity ?? 0
        );

    const receivedQuantity =
        Number(
            formData.quantity || 0
        );

    const newStock =
        currentStock +
        receivedQuantity;


    /*
     * =========================================================
     * FORM CHANGE
     * =========================================================
     */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );

        setError("");
        setSuccess("");
    };


    /*
     * =========================================================
     * RESET
     * =========================================================
     */

    const handleReset = () => {

        setFormData({
            inventoryItemId: "",
            quantity: "",
            remarks: ""
        });

        setError("");
        setSuccess("");
    };


    /*
     * =========================================================
     * SUBMIT STOCK IN
     * =========================================================
     */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.inventoryItemId) {

            setError(
                "Please select an inventory item."
            );

            return;
        }

        const quantity =
            Number(formData.quantity);

        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {

            setError(
                "Quantity received must be a whole number greater than zero."
            );

            return;
        }

        try {

            setSubmitting(true);

            const result =
                await inventoryService.createStockIn({

                    inventoryItemId:
                        Number(
                            formData.inventoryItemId
                        ),

                    quantity,

                    remarks:
                        formData.remarks?.trim() ||
                        null
                });

            console.log(
                "Stock In transaction created:",
                result
            );

            setSuccess(
                "Stock received successfully."
            );

            setFormData({
                inventoryItemId: "",
                quantity: "",
                remarks: ""
            });

            await loadInventory();

        } catch (err) {

            console.error(
                "Stock In failed:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Unable to receive stock. Please try again."
            );

        } finally {

            setSubmitting(false);

        }
    };


    return (

        <div className="min-h-full bg-[#020617] px-6 py-8 text-slate-100">

            {/* =====================================================
                PAGE HEADER
            ====================================================== */}

            <div className="mb-7 flex items-start justify-between">

                <div>

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-cyan-400/30
                                bg-cyan-400/10
                                shadow-lg
                                shadow-cyan-500/10
                            "
                        >

                            <ArrowDownToLine
                                size={23}
                                className="text-cyan-400"
                            />

                        </div>

                        <div>

                            <h1
                                className="
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-cyan-300
                                "
                            >
                                Stock In
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-blue-300
                                "
                            >
                                Receive new stock into
                                <span className="text-violet-300">
                                    {" "}laboratory inventory.
                                </span>
                            </p>

                        </div>

                    </div>

                </div>


                <button
                    type="button"
                    onClick={loadInventory}
                    disabled={loading}
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-blue-500/30
                        bg-blue-500/10
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-blue-300
                        transition
                        hover:border-cyan-400/50
                        hover:bg-cyan-400/10
                        hover:text-cyan-300
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    <RefreshCw
                        size={16}
                        className={
                            loading
                                ? "animate-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* =====================================================
                ALERTS
            ====================================================== */}

            {error && (

                <div
                    className="
                        mb-5
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        border-red-500/30
                        bg-red-500/10
                        px-4
                        py-3
                    "
                >

                    <div
                        className="
                            mt-1
                            h-2
                            w-2
                            rounded-full
                            bg-red-400
                        "
                    />

                    <p className="text-sm text-red-300">
                        {error}
                    </p>

                </div>

            )}


            {success && (

                <div
                    className="
                        mb-5
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        border-emerald-500/30
                        bg-emerald-500/10
                        px-4
                        py-3
                    "
                >

                    <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-emerald-400"
                    />

                    <p className="text-sm text-emerald-300">
                        {success}
                    </p>

                </div>

            )}


            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-6
                    xl:grid-cols-[minmax(0,1fr)_340px]
                "
            >

                {/* =================================================
                    RECEIVE STOCK FORM
                ================================================== */}

                <div
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-blue-500/20
                        bg-[#0b1220]
                        shadow-xl
                    "
                >

                    {/* CARD HEADER */}

                    <div
                        className="
                            border-b
                            border-blue-500/20
                            px-6
                            py-5
                        "
                    >

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-blue-500/20
                                    bg-blue-500/10
                                "
                            >

                                <Package
                                    size={20}
                                    className="text-blue-400"
                                />

                            </div>

                            <div>

                                <h2
                                    className="
                                        text-base
                                        font-semibold
                                        text-blue-300
                                    "
                                >
                                    Receive Stock
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-violet-300
                                    "
                                >
                                    Enter the details of the
                                    <span className="text-cyan-300">
                                        {" "}stock received.
                                    </span>
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
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

                            {/* =================================================
                                ITEM
                            ================================================== */}

                            <div className="md:col-span-2">

                                <label
                                    htmlFor="inventoryItemId"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-cyan-300
                                    "
                                >

                                    Item

                                    <span className="ml-1 text-red-400">
                                        *
                                    </span>

                                </label>


                                <div className="relative">

                                    <Package
                                        size={17}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-violet-400
                                        "
                                    />


                                    <select
                                        id="inventoryItemId"
                                        name="inventoryItemId"
                                        value={
                                            formData.inventoryItemId
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={loading}
                                        className="
                                            w-full
                                            appearance-none
                                            rounded-lg
                                            border
                                            border-cyan-500/30
                                            bg-[#080f1c]
                                            py-3
                                            pl-10
                                            pr-10
                                            text-sm
                                            font-medium
                                            text-white
                                            outline-none
                                            transition
                                            focus:border-cyan-400
                                            focus:ring-2
                                            focus:ring-cyan-400/10
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                        "
                                    >

                                        <option
                                            value=""
                                            className="
                                                bg-[#080f1c]
                                                text-slate-400
                                            "
                                        >

                                            {loading
                                                ? "Loading inventory..."
                                                : inventoryItems.length === 0
                                                    ? "No inventory items found"
                                                    : "Select item"}

                                        </option>


                                        {inventoryItems.map(
                                            (item) => (

                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                    className="
                                                        bg-[#080f1c]
                                                        text-white
                                                    "
                                                >

                                                    {item.itemName}

                                                    {item.itemCode
                                                        ? ` (${item.itemCode})`
                                                        : ""}

                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                {!loading &&
                                    inventoryItems.length === 0 && (

                                        <p className="mt-2 text-xs text-amber-400">
                                            No active inventory items are available.
                                        </p>

                                    )}

                            </div>


                            {/* =================================================
                                QUANTITY
                            ================================================== */}

                            <div>

                                <label
                                    htmlFor="quantity"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-emerald-300
                                    "
                                >

                                    Quantity Received

                                    <span className="ml-1 text-red-400">
                                        *
                                    </span>

                                </label>


                                <input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={
                                        formData.quantity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter quantity received"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-emerald-500/30
                                        bg-[#080f1c]
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        text-white
                                        placeholder:text-slate-600
                                        outline-none
                                        transition
                                        focus:border-emerald-400
                                        focus:ring-2
                                        focus:ring-emerald-400/10
                                    "
                                />

                            </div>


                            {/* =================================================
                                CURRENT STOCK
                            ================================================== */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-blue-300
                                    "
                                >
                                    Current Stock
                                </label>


                                <div
                                    className="
                                        rounded-lg
                                        border
                                        border-blue-500/20
                                        bg-blue-500/5
                                        px-4
                                        py-3
                                    "
                                >

                                    <div className="flex items-center justify-between">

                                        <span className="text-sm text-violet-300">
                                            Available
                                        </span>

                                        <span
                                            className="
                                                text-base
                                                font-bold
                                                text-blue-300
                                            "
                                        >

                                            {selectedItem
                                                ? currentStock
                                                : "—"}

                                            {selectedItem?.unit
                                                ? ` ${selectedItem.unit}`
                                                : ""}

                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                SUPPLIER
                            ================================================== */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-amber-300
                                    "
                                >
                                    Supplier
                                </label>


                                <div
                                    className="
                                        rounded-lg
                                        border
                                        border-amber-500/20
                                        bg-amber-500/5
                                        px-4
                                        py-3
                                    "
                                >

                                    <div className="flex items-center gap-2">

                                        <Truck
                                            size={16}
                                            className="text-cyan-400"
                                        />

                                        <span
                                            className="
                                                truncate
                                                text-sm
                                                font-medium
                                                text-amber-300
                                            "
                                        >

                                            {selectedItem?.supplierName ||
                                                "—"}

                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                NEW STOCK
                            ================================================== */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-emerald-300
                                    "
                                >
                                    New Stock
                                </label>


                                <div
                                    className="
                                        rounded-lg
                                        border
                                        border-emerald-500/30
                                        bg-emerald-500/5
                                        px-4
                                        py-3
                                    "
                                >

                                    <div className="flex items-center justify-between">

                                        <span className="text-sm text-cyan-300">
                                            After receiving
                                        </span>

                                        <span
                                            className="
                                                text-base
                                                font-bold
                                                text-emerald-400
                                            "
                                        >

                                            {selectedItem
                                                ? newStock
                                                : "—"}

                                            {selectedItem?.unit
                                                ? ` ${selectedItem.unit}`
                                                : ""}

                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                REMARKS
                            ================================================== */}

                            <div className="md:col-span-2">

                                <label
                                    htmlFor="remarks"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-violet-300
                                    "
                                >
                                    Remarks
                                </label>


                                <div className="relative">

                                    <FileText
                                        size={17}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3
                                            top-3
                                            text-violet-400
                                        "
                                    />


                                    <textarea
                                        id="remarks"
                                        name="remarks"
                                        rows="4"
                                        value={
                                            formData.remarks
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter receiving remarks..."
                                        className="
                                            w-full
                                            resize-none
                                            rounded-lg
                                            border
                                            border-violet-500/30
                                            bg-[#080f1c]
                                            px-10
                                            py-3
                                            text-sm
                                            text-white
                                            placeholder:text-slate-600
                                            outline-none
                                            transition
                                            focus:border-violet-400
                                            focus:ring-2
                                            focus:ring-violet-400/10
                                        "
                                    />

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            FORM ACTIONS
                        ================================================== */}

                        <div
                            className="
                                mt-6
                                flex
                                items-center
                                justify-end
                                gap-3
                                border-t
                                border-slate-800
                                pt-6
                            "
                        >

                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={submitting}
                                className="
                                    rounded-lg
                                    border
                                    border-slate-700
                                    bg-slate-900
                                    px-5
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-slate-300
                                    transition
                                    hover:border-violet-500/40
                                    hover:bg-violet-500/10
                                    hover:text-violet-300
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                Reset
                            </button>


                            <button
                                type="submit"
                                disabled={
                                    submitting ||
                                    loading ||
                                    inventoryItems.length === 0
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    bg-emerald-600
                                    px-5
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    shadow-emerald-600/20
                                    transition
                                    hover:bg-emerald-500
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                {submitting ? (

                                    <>

                                        <RefreshCw
                                            size={16}
                                            className="animate-spin"
                                        />

                                        Receiving...

                                    </>

                                ) : (

                                    <>

                                        <ArrowDownToLine
                                            size={16}
                                        />

                                        Receive Stock

                                    </>

                                )}

                            </button>

                        </div>

                    </form>

                </div>


                {/* =================================================
                    RIGHT SIDEBAR
                ================================================== */}

                <div className="space-y-5">


                    {/* =================================================
                        SELECTED ITEM
                    ================================================== */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-cyan-500/25
                            bg-[#0b1220]
                            p-5
                            shadow-lg
                            shadow-cyan-500/5
                        "
                    >

                        <div className="mb-4 flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-cyan-500/20
                                    bg-cyan-500/10
                                "
                            >

                                <Package
                                    size={18}
                                    className="text-cyan-400"
                                />

                            </div>

                            <div>

                                <h3
                                    className="
                                        text-sm
                                        font-semibold
                                        text-cyan-300
                                    "
                                >
                                    Selected Item
                                </h3>

                                <p className="text-xs text-blue-400">
                                    Stock information
                                </p>

                            </div>

                        </div>


                        {selectedItem ? (

                            <div className="space-y-4">

                                <div>

                                    <p className="text-xs uppercase tracking-wider text-cyan-400">
                                        Item
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-bold
                                            text-blue-300
                                        "
                                    >
                                        {selectedItem.itemName}
                                    </p>

                                </div>


                                <div className="grid grid-cols-2 gap-4">

                                    <div>

                                        <p className="text-xs uppercase tracking-wider text-violet-400">
                                            Code
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-violet-300">
                                            {selectedItem.itemCode ||
                                                "—"}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs uppercase tracking-wider text-amber-400">
                                            Unit
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-amber-300">
                                            {selectedItem.unit ||
                                                "—"}
                                        </p>

                                    </div>

                                </div>


                                <div className="border-t border-slate-800 pt-4">

                                    <div className="flex items-center justify-between">

                                        <span className="text-sm text-blue-300">
                                            Current
                                        </span>

                                        <span className="font-bold text-blue-400">
                                            {currentStock}
                                        </span>

                                    </div>


                                    <div className="mt-2 flex items-center justify-between">

                                        <span className="text-sm text-cyan-300">
                                            Receiving
                                        </span>

                                        <span className="font-bold text-cyan-400">
                                            +{receivedQuantity || 0}
                                        </span>

                                    </div>


                                    <div
                                        className="
                                            mt-3
                                            flex
                                            items-center
                                            justify-between
                                            rounded-lg
                                            border
                                            border-emerald-500/20
                                            bg-emerald-500/10
                                            px-3
                                            py-3
                                        "
                                    >

                                        <span className="text-sm font-semibold text-emerald-300">
                                            New Stock
                                        </span>

                                        <span className="text-lg font-bold text-emerald-400">
                                            {newStock}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        ) : (

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-dashed
                                    border-violet-500/30
                                    bg-violet-500/5
                                    px-4
                                    py-8
                                    text-center
                                "
                            >

                                <Package
                                    size={28}
                                    className="
                                        mx-auto
                                        mb-3
                                        text-violet-500
                                    "
                                />

                                <p className="text-sm text-violet-300">
                                    Select an item to view
                                    <span className="text-cyan-300">
                                        {" "}stock information.
                                    </span>
                                </p>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        WORKFLOW
                    ================================================== */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-blue-500/25
                            bg-[#0b1220]
                            p-5
                            shadow-lg
                            shadow-blue-500/5
                        "
                    >

                        <div className="mb-4 flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-blue-500/20
                                    bg-blue-500/10
                                "
                            >

                                <CalendarDays
                                    size={18}
                                    className="text-blue-400"
                                />

                            </div>

                            <div>

                                <h3
                                    className="
                                        text-sm
                                        font-semibold
                                        text-blue-300
                                    "
                                >
                                    Stock In Workflow
                                </h3>

                                <p className="text-xs text-violet-400">
                                    Inventory operation
                                </p>

                            </div>

                        </div>


                        <div className="space-y-3">

                            {/* STEP 1 */}

                            <div className="flex gap-3">

                                <div
                                    className="
                                        mt-1
                                        h-2
                                        w-2
                                        shrink-0
                                        rounded-full
                                        bg-blue-400
                                        shadow-lg
                                        shadow-blue-400/50
                                    "
                                />

                                <p className="text-sm leading-5 text-blue-300">
                                    Select the inventory item.
                                </p>

                            </div>


                            {/* STEP 2 */}

                            <div className="flex gap-3">

                                <div
                                    className="
                                        mt-1
                                        h-2
                                        w-2
                                        shrink-0
                                        rounded-full
                                        bg-emerald-400
                                        shadow-lg
                                        shadow-emerald-400/50
                                    "
                                />

                                <p className="text-sm leading-5 text-emerald-300">
                                    Enter the quantity received.
                                </p>

                            </div>


                            {/* STEP 3 */}

                            <div className="flex gap-3">

                                <div
                                    className="
                                        mt-1
                                        h-2
                                        w-2
                                        shrink-0
                                        rounded-full
                                        bg-violet-400
                                        shadow-lg
                                        shadow-violet-400/50
                                    "
                                />

                                <p className="text-sm leading-5 text-violet-300">
                                    Submit to increase the
                                    <span className="text-cyan-300">
                                        {" "}inventory stock.
                                    </span>
                                </p>

                            </div>


                            {/* STEP 4 */}

                            <div className="flex gap-3">

                                <div
                                    className="
                                        mt-1
                                        h-2
                                        w-2
                                        shrink-0
                                        rounded-full
                                        bg-cyan-400
                                        shadow-lg
                                        shadow-cyan-400/50
                                    "
                                />

                                <p className="text-sm leading-5 text-cyan-300">
                                    A
                                    <span className="font-semibold text-emerald-300">
                                        {" "}STOCK_IN
                                    </span>
                                    {" "}transaction is recorded
                                    <span className="text-emerald-400">
                                        {" "}automatically.
                                    </span>
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default StockIn;