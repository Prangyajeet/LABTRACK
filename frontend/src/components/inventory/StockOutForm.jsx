import { useEffect, useState } from "react";

import useStockOut
    from "../../hooks/useStockOut";


function StockOutForm({

    items = [],

    onSuccess,

    onCancel

}) {

    const {

        loading,

        error,

        submitStockOut,

        clearMessages

    } = useStockOut();


    const [inventoryItemId, setInventoryItemId] =
        useState("");

    const [quantity, setQuantity] =
        useState("");

    const [remarks, setRemarks] =
        useState("");

    const [selectedItem, setSelectedItem] =
        useState(null);


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
                    item.id ??
                    item.inventoryItemId
                ) === String(inventoryItemId)

        );


        setSelectedItem(
            item || null
        );

    }, [
        inventoryItemId,
        items
    ]);


    /* =========================================================
       CURRENT STOCK
    ========================================================== */

    const availableStock =

        selectedItem?.currentStock ??

        selectedItem?.quantity ??

        0;


    /* =========================================================
       AFTER STOCK OUT
    ========================================================== */

    const requestedQuantity =
        Number(quantity) || 0;


    const newStock =

        Math.max(

            0,

            Number(availableStock) -
            requestedQuantity

        );


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


        if (

            requestedQuantity >
            Number(availableStock)

        ) {

            return;

        }


        try {

            await submitStockOut({

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

        }

        catch (error) {

            // Error is already handled
            // by useStockOut.

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

                    {/* =================================================
                        FORM HEADER
                    ================================================== */}

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
                                bg-amber-500/10
                                border
                                border-amber-500/20
                                flex
                                items-center
                                justify-center
                                text-amber-400
                                text-xl
                            "
                        >

                            ↓

                        </div>


                        <div>

                            <h2
                                className="
                                    text-lg
                                    font-semibold
                                    text-amber-300
                                "
                            >

                                Issue Stock

                            </h2>


                            <p
                                className="
                                    text-sm
                                    text-slate-400
                                "
                            >

                                Issue an inventory item from
                                <span className="text-blue-300">
                                    {" "}laboratory stock.
                                </span>

                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        FORM BODY
                    ================================================== */}

                    <div className="p-6">

                        {/* =================================================
                            ERROR
                        ================================================== */}

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

                                    <span>

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
                                        font-medium
                                        text-blue-300
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
                                        text-white
                                        outline-none
                                        focus:border-blue-500
                                    "
                                    disabled={loading}
                                >

                                    <option value="">

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

                                            {
                                                item.itemName ??
                                                item.name
                                            }

                                            {" "}

                                            (

                                            {
                                                item.itemCode
                                            }

                                            )

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
                                        border-blue-500/20
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
                                                    text-blue-300
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
                                                border-violet-500/20
                                                bg-violet-500/10
                                                px-3
                                                py-1
                                                text-xs
                                                font-medium
                                                text-violet-300
                                            "
                                        >

                                            {
                                                selectedItem.itemCode ??
                                                ""
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

                                                {
                                                    availableStock
                                                }

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
                                                    selectedItem.unit ??
                                                    "-"
                                                }

                                            </p>

                                        </div>


                                        {/* AFTER STOCK OUT */}

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

                                                After Stock Out

                                            </p>


                                            <p
                                                className="
                                                    mt-2
                                                    text-xl
                                                    font-semibold
                                                    text-emerald-400
                                                "
                                            >

                                                {
                                                    newStock
                                                }

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
                                        font-medium
                                        text-amber-300
                                    "
                                >

                                    Quantity

                                    <span className="text-red-400 ml-1">

                                        *

                                    </span>

                                </label>


                                <input
                                    type="number"
                                    min="1"
                                    max={availableStock}
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
                                        text-white
                                        outline-none
                                        focus:border-amber-500
                                    "
                                    placeholder="Enter quantity to issue"
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

                                        Maximum quantity that can be issued:

                                        {" "}

                                        <span
                                            className="
                                                font-medium
                                                text-amber-300
                                            "
                                        >

                                            {
                                                availableStock
                                            }

                                            {" "}

                                            {
                                                selectedItem.unit ??
                                                ""
                                            }

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
                                        font-medium
                                        text-cyan-300
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
                                        text-white
                                        outline-none
                                        resize-none
                                        focus:border-cyan-500
                                    "
                                    placeholder="Enter reason or remarks for this stock issue..."
                                    disabled={loading}
                                />


                                <div
                                    className="
                                        mt-1
                                        text-right
                                        text-xs
                                        text-slate-600
                                    "
                                >

                                    <span className="text-cyan-400">
                                        {remarks.length}
                                    </span>

                                    <span className="text-slate-600">
                                        /500
                                    </span>

                                </div>

                            </div>


                            {/* =================================================
                                VALIDATION
                            ================================================== */}

                            {inventoryItemId &&

                                Number(quantity) >

                                Number(availableStock) && (

                                    <div
                                        className="
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

                                        Quantity cannot exceed
                                        <span className="font-semibold text-red-300">
                                            {" "}available stock.
                                        </span>

                                    </div>

                                )
                            }


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

                                        Number(quantity) <= 0 ||

                                        Number(quantity) >
                                        Number(availableStock)

                                    }
                                    className="
                                        rounded-lg
                                        bg-amber-600
                                        px-6
                                        py-3
                                        text-sm
                                        font-medium
                                        text-white
                                        hover:bg-amber-500
                                        transition
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    {loading

                                        ? "Saving..."

                                        : "↓  Save Stock Out"

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
                                    text-blue-400
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
                                    text-cyan-400
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
                                            selectedItem.itemCode ??
                                            "-"
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
                                            selectedItem.unit ??
                                            "-"
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

                                        {
                                            availableStock
                                        }

                                    </span>

                                </div>


                                <div
                                    className="
                                        flex
                                        justify-between
                                        text-sm
                                    "
                                >

                                    <span className="text-amber-400">

                                        Issuing

                                    </span>


                                    <span
                                        className="
                                            font-semibold
                                            text-red-400
                                        "
                                    >

                                        -

                                        {
                                            requestedQuantity
                                        }

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

                                        {
                                            newStock
                                        }

                                    </span>

                                </div>

                            </div>

                        </>

                    ) : (

                        <div
                            className="
                                py-5
                                text-sm
                                text-blue-400
                            "
                        >

                            Select an inventory item to
                            view stock information.

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
                        border-amber-500/20
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
                                bg-amber-500/10
                                border
                                border-amber-500/20
                                flex
                                items-center
                                justify-center
                                text-amber-400
                            "
                        >

                            ▣

                        </div>


                        <div>

                            <h3
                                className="
                                    text-sm
                                    font-semibold
                                    text-amber-300
                                "
                            >

                                Stock Out Workflow

                            </h3>


                            <p
                                className="
                                    text-xs
                                    text-cyan-400
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
                                    bg-amber-400
                                    flex-shrink-0
                                "
                            />

                            <p className="text-sm text-amber-300">

                                Enter the quantity to issue.

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

                                Submit to decrease inventory stock.

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

                                A STOCK_OUT transaction is recorded
                                automatically.

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default StockOutForm;