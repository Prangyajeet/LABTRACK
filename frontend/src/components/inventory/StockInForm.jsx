import { useEffect, useState } from "react";
import useStockIn from "../../hooks/useStockIn";

function StockInForm({
    items = [],
    onSuccess,
    onCancel
}) {

    const {
        loading,
        error,
        submitStockIn,
        clearMessages
    } = useStockIn();

    const [inventoryItemId, setInventoryItemId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [remarks, setRemarks] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);

    /* =========================================================
       SELECTED ITEM
    ========================================================== */

    useEffect(() => {

        if (!inventoryItemId) {
            setSelectedItem(null);
            return;
        }

        const item = items.find(
            (item) =>
                String(
                    item.id ?? item.inventoryItemId
                ) === String(inventoryItemId)
        );

        setSelectedItem(item || null);

    }, [inventoryItemId, items]);

    /* =========================================================
       CURRENT STOCK
    ========================================================== */

    const currentStock =
        selectedItem?.currentStock ??
        selectedItem?.quantity ??
        0;

    /* =========================================================
       REQUESTED QUANTITY
    ========================================================== */

    const requestedQuantity =
        Number(quantity) || 0;

    /* =========================================================
       AFTER STOCK IN
    ========================================================== */

    const newStock =
        Number(currentStock) +
        requestedQuantity;

    /* =========================================================
       SUBMIT
    ========================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        clearMessages();

        if (!inventoryItemId) {
            return;
        }

        const requestedQuantity =
            Number(quantity);

        if (
            !requestedQuantity ||
            requestedQuantity <= 0
        ) {
            return;
        }

        try {

            await submitStockIn({
                inventoryItemId:
                    Number(inventoryItemId),

                quantity:
                    requestedQuantity,

                remarks:
                    remarks.trim()
            });

            setInventoryItemId("");
            setQuantity("");
            setRemarks("");

            if (onSuccess) {
                onSuccess();
            }

        } catch (error) {
            // Error is already handled by useStockIn.
        }
    };

    return (

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* =================================================
                MAIN FORM
            ================================================== */}

            <div className="xl:col-span-2">

                <div
                    className="
                        rounded-xl
                        border
                        border-slate-800
                        bg-slate-950
                        overflow-hidden
                    "
                >

                    {/* FORM HEADER */}

                    <div
                        className="
                            flex
                            items-center
                            gap-4
                            px-6
                            py-5
                            border-b
                            border-slate-800
                        "
                    >

                        <div
                            className="
                                w-11
                                h-11
                                rounded-lg
                                bg-blue-500/10
                                border
                                border-blue-500/20
                                flex
                                items-center
                                justify-center
                                text-blue-400
                                text-xl
                                font-bold
                            "
                        >
                            ↑
                        </div>

                        <div>

                            <h2
                                className="
                                    text-lg
                                    font-semibold
                                    text-blue-300
                                "
                            >
                                Receive Stock
                            </h2>

                            <p
                                className="
                                    text-sm
                                    text-cyan-300
                                "
                            >
                                Enter the details of the{" "}
                                <span className="text-emerald-300 font-medium">
                                    stock received.
                                </span>
                            </p>

                        </div>

                    </div>

                    {/* FORM BODY */}

                    <div className="p-6">

                        {/* ERROR */}

                        {error && (

                            <div
                                className="
                                    mb-6
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

                                <div className="flex items-center gap-2">

                                    <span
                                        className="
                                            flex
                                            h-6
                                            w-6
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-red-500/20
                                            text-red-400
                                            font-bold
                                        "
                                    >
                                        !
                                    </span>

                                    <span className="text-red-300">
                                        {error}
                                    </span>

                                </div>

                            </div>

                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >

                            {/* =================================================
                                ITEM
                            ================================================== */}

                            <div>

                                <label
                                    className="
                                        block
                                        mb-2
                                        text-sm
                                        font-semibold
                                        text-cyan-300
                                    "
                                >
                                    Item

                                    <span className="text-red-400 ml-1">
                                        *
                                    </span>
                                </label>

                                <select
                                    value={inventoryItemId}
                                    onChange={(event) =>
                                        setInventoryItemId(
                                            event.target.value
                                        )
                                    }
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-700
                                        bg-slate-950
                                        px-4
                                        py-3
                                        text-sm
                                        text-blue-100
                                        outline-none
                                        focus:border-cyan-500
                                        focus:ring-2
                                        focus:ring-cyan-500/10
                                    "
                                    disabled={loading}
                                >

                                    <option
                                        value=""
                                        className="text-slate-400"
                                    >
                                        Select Item
                                    </option>

                                    {items.map((item) => (

                                        <option
                                            key={
                                                item.id ??
                                                item.inventoryItemId
                                            }
                                            value={
                                                item.id ??
                                                item.inventoryItemId
                                            }
                                        >
                                            {item.itemName ?? item.name}
                                            {" "}
                                            ({item.itemCode})
                                        </option>

                                    ))}

                                </select>

                            </div>

                            {/* =================================================
                                SELECTED ITEM SUMMARY
                            ================================================== */}

                            {selectedItem && (

                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-cyan-500/20
                                        bg-slate-900/60
                                        p-5
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            mb-5
                                        "
                                    >

                                        <div>

                                            <p
                                                className="
                                                    text-xs
                                                    uppercase
                                                    tracking-wide
                                                    text-cyan-400
                                                "
                                            >
                                                Selected Item
                                            </p>

                                            <h3
                                                className="
                                                    mt-1
                                                    text-lg
                                                    font-semibold
                                                    text-violet-300
                                                "
                                            >
                                                {
                                                    selectedItem.itemName ??
                                                    selectedItem.name
                                                }
                                            </h3>

                                        </div>

                                        <span
                                            className="
                                                rounded-md
                                                border
                                                border-amber-500/20
                                                bg-amber-500/10
                                                px-3
                                                py-1
                                                text-xs
                                                font-medium
                                                text-amber-300
                                            "
                                        >
                                            {
                                                selectedItem.itemCode ?? ""
                                            }
                                        </span>

                                    </div>

                                    <div
                                        className="
                                            grid
                                            grid-cols-1
                                            md:grid-cols-3
                                            gap-3
                                        "
                                    >

                                        {/* CURRENT STOCK */}

                                        <div
                                            className="
                                                rounded-lg
                                                border
                                                border-blue-500/20
                                                bg-blue-500/5
                                                p-4
                                            "
                                        >

                                            <p
                                                className="
                                                    text-xs
                                                    uppercase
                                                    tracking-wide
                                                    text-blue-400
                                                "
                                            >
                                                Current Stock
                                            </p>

                                            <p
                                                className="
                                                    mt-2
                                                    text-xl
                                                    font-semibold
                                                    text-blue-300
                                                "
                                            >
                                                {currentStock}
                                            </p>

                                        </div>

                                        {/* UNIT */}

                                        <div
                                            className="
                                                rounded-lg
                                                border
                                                border-violet-500/20
                                                bg-violet-500/5
                                                p-4
                                            "
                                        >

                                            <p
                                                className="
                                                    text-xs
                                                    uppercase
                                                    tracking-wide
                                                    text-violet-400
                                                "
                                            >
                                                Unit
                                            </p>

                                            <p
                                                className="
                                                    mt-2
                                                    text-xl
                                                    font-semibold
                                                    text-violet-300
                                                "
                                            >
                                                {
                                                    selectedItem.unit ?? "-"
                                                }
                                            </p>

                                        </div>

                                        {/* AFTER STOCK IN */}

                                        <div
                                            className="
                                                rounded-lg
                                                border
                                                border-emerald-500/20
                                                bg-emerald-500/5
                                                p-4
                                            "
                                        >

                                            <p
                                                className="
                                                    text-xs
                                                    uppercase
                                                    tracking-wide
                                                    text-emerald-400
                                                "
                                            >
                                                After Stock In
                                            </p>

                                            <p
                                                className="
                                                    mt-2
                                                    text-xl
                                                    font-semibold
                                                    text-emerald-400
                                                "
                                            >
                                                {newStock}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            )}

                            {/* =================================================
                                QUANTITY
                            ================================================== */}

                            <div>

                                <label
                                    className="
                                        block
                                        mb-2
                                        text-sm
                                        font-semibold
                                        text-emerald-300
                                    "
                                >
                                    Quantity Received

                                    <span className="text-red-400 ml-1">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(event) =>
                                        setQuantity(
                                            event.target.value
                                        )
                                    }
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-700
                                        bg-slate-950
                                        px-4
                                        py-3
                                        text-sm
                                        text-emerald-100
                                        outline-none
                                        focus:border-emerald-500
                                        focus:ring-2
                                        focus:ring-emerald-500/10
                                    "
                                    placeholder="Enter quantity received"
                                    disabled={
                                        loading ||
                                        !inventoryItemId
                                    }
                                />

                                {selectedItem && (

                                    <p
                                        className="
                                            mt-2
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        Current stock:{" "}

                                        <span
                                            className="
                                                font-medium
                                                text-blue-300
                                            "
                                        >
                                            {currentStock}{" "}
                                            {selectedItem.unit ?? ""}
                                        </span>
                                    </p>

                                )}

                            </div>

                            {/* =================================================
                                REMARKS
                            ================================================== */}

                            <div>

                                <label
                                    className="
                                        block
                                        mb-2
                                        text-sm
                                        font-semibold
                                        text-amber-300
                                    "
                                >
                                    Remarks
                                </label>

                                <textarea
                                    value={remarks}
                                    onChange={(event) =>
                                        setRemarks(
                                            event.target.value
                                        )
                                    }
                                    rows="4"
                                    maxLength="500"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-700
                                        bg-slate-950
                                        px-4
                                        py-3
                                        text-sm
                                        text-amber-100
                                        outline-none
                                        resize-none
                                        focus:border-amber-500
                                        focus:ring-2
                                        focus:ring-amber-500/10
                                    "
                                    placeholder="Enter reason or remarks for this stock receipt..."
                                    disabled={loading}
                                />

                                <div
                                    className="
                                        mt-1
                                        text-right
                                        text-xs
                                    "
                                >
                                    <span className="text-cyan-400">
                                        {remarks.length}
                                    </span>

                                    <span className="text-slate-500">
                                        /500
                                    </span>
                                </div>

                            </div>

                            {/* =================================================
                                BUTTONS
                            ================================================== */}

                            <div
                                className="
                                    flex
                                    justify-end
                                    gap-3
                                    pt-5
                                    border-t
                                    border-slate-800
                                "
                            >

                                {onCancel && (

                                    <button
                                        type="button"
                                        onClick={onCancel}
                                        disabled={loading}
                                        className="
                                            rounded-lg
                                            border
                                            border-slate-700
                                            bg-slate-900
                                            px-5
                                            py-3
                                            text-sm
                                            font-medium
                                            text-slate-300
                                            hover:bg-slate-800
                                            transition
                                        "
                                    >
                                        Cancel
                                    </button>

                                )}

                                <button
                                    type="submit"
                                    disabled={
                                        loading ||
                                        !inventoryItemId ||
                                        !quantity ||
                                        Number(quantity) <= 0
                                    }
                                    className="
                                        rounded-lg
                                        bg-blue-600
                                        px-6
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        hover:bg-blue-500
                                        transition
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    {loading
                                        ? "Saving..."
                                        : "↑  Receive Stock"
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

            {/* =================================================
                RIGHT SIDEBAR
            ================================================== */}

            <div className="space-y-6">

                {/* =================================================
                    SELECTED ITEM
                ================================================== */}

                <div
                    className="
                        rounded-xl
                        border
                        border-cyan-500/20
                        bg-slate-950
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            mb-5
                        "
                    >

                        <div
                            className="
                                w-9
                                h-9
                                rounded-lg
                                bg-cyan-500/10
                                border
                                border-cyan-500/20
                                flex
                                items-center
                                justify-center
                                text-cyan-400
                            "
                        >
                            □
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

                            <p
                                className="
                                    text-xs
                                    text-violet-400
                                "
                            >
                                Stock information
                            </p>

                        </div>

                    </div>

                    {selectedItem ? (

                        <>

                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-wide
                                    text-amber-400
                                "
                            >
                                Item
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    font-semibold
                                    text-blue-300
                                "
                            >
                                {
                                    selectedItem.itemName ??
                                    selectedItem.name
                                }
                            </p>

                            <div
                                className="
                                    grid
                                    grid-cols-2
                                    gap-4
                                    mt-5
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            text-violet-400
                                        "
                                    >
                                        Code
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-violet-300
                                        "
                                    >
                                        {
                                            selectedItem.itemCode ?? "-"
                                        }
                                    </p>

                                </div>

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            text-amber-400
                                        "
                                    >
                                        Unit
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-amber-300
                                        "
                                    >
                                        {
                                            selectedItem.unit ?? "-"
                                        }
                                    </p>

                                </div>

                            </div>

                            <div
                                className="
                                    mt-5
                                    pt-4
                                    border-t
                                    border-slate-800
                                    space-y-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        justify-between
                                        text-sm
                                    "
                                >

                                    <span className="text-blue-400">
                                        Current
                                    </span>

                                    <span
                                        className="
                                            font-semibold
                                            text-blue-300
                                        "
                                    >
                                        {currentStock}
                                    </span>

                                </div>

                                <div
                                    className="
                                        flex
                                        justify-between
                                        text-sm
                                    "
                                >

                                    <span className="text-cyan-400">
                                        Receiving
                                    </span>

                                    <span
                                        className="
                                            font-semibold
                                            text-cyan-300
                                        "
                                    >
                                        +{requestedQuantity}
                                    </span>

                                </div>

                                <div
                                    className="
                                        flex
                                        justify-between
                                        rounded-lg
                                        bg-emerald-500/5
                                        border
                                        border-emerald-500/10
                                        px-3
                                        py-3
                                    "
                                >

                                    <span
                                        className="
                                            text-sm
                                            font-medium
                                            text-emerald-300
                                        "
                                    >
                                        New Stock
                                    </span>

                                    <span
                                        className="
                                            text-lg
                                            font-semibold
                                            text-emerald-400
                                        "
                                    >
                                        {newStock}
                                    </span>

                                </div>

                            </div>

                        </>

                    ) : (

                        <div
                            className="
                                py-5
                                text-sm
                                text-violet-300
                            "
                        >
                            Select an inventory item to{" "}
                            <span className="text-cyan-300">
                                view stock information.
                            </span>
                        </div>

                    )}

                </div>

                {/* =================================================
                    WORKFLOW
                ================================================== */}

                <div
                    className="
                        rounded-xl
                        border
                        border-blue-500/20
                        bg-slate-950
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            mb-5
                        "
                    >

                        <div
                            className="
                                w-9
                                h-9
                                rounded-lg
                                bg-blue-500/10
                                border
                                border-blue-500/20
                                flex
                                items-center
                                justify-center
                                text-blue-400
                            "
                        >
                            ↑
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

                            <p
                                className="
                                    text-xs
                                    text-violet-400
                                "
                            >
                                Inventory operation
                            </p>

                        </div>

                    </div>

                    <div className="space-y-4">

                        <div className="flex gap-3">

                            <span
                                className="
                                    mt-1
                                    w-2
                                    h-2
                                    rounded-full
                                    bg-blue-400
                                    flex-shrink-0
                                "
                            />

                            <p className="text-sm text-blue-300">
                                Select the inventory item.
                            </p>

                        </div>

                        <div className="flex gap-3">

                            <span
                                className="
                                    mt-1
                                    w-2
                                    h-2
                                    rounded-full
                                    bg-emerald-400
                                    flex-shrink-0
                                "
                            />

                            <p className="text-sm text-emerald-300">
                                Enter the quantity received.
                            </p>

                        </div>

                        <div className="flex gap-3">

                            <span
                                className="
                                    mt-1
                                    w-2
                                    h-2
                                    rounded-full
                                    bg-violet-400
                                    flex-shrink-0
                                "
                            />

                            <p className="text-sm text-violet-300">
                                Submit to increase inventory stock.
                            </p>

                        </div>

                        <div className="flex gap-3">

                            <span
                                className="
                                    mt-1
                                    w-2
                                    h-2
                                    rounded-full
                                    bg-cyan-400
                                    flex-shrink-0
                                "
                            />

                            <p className="text-sm text-cyan-300">
                                A{" "}
                                <span className="text-emerald-400 font-medium">
                                    STOCK_IN
                                </span>{" "}
                                transaction is recorded automatically.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default StockInForm;