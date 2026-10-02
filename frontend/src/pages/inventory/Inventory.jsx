import { useEffect, useState } from "react";

import inventoryService
    from "../../services/inventoryService";

import {
    RefreshCw,
    Package,
    Boxes,
    Tag,
    Hash,
    Layers3
} from "lucide-react";


function Inventory() {

    const [inventory, setInventory] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    const loadInventory = async () => {

        try {

            setLoading(true);
            setError(null);

            const response =
                await inventoryService
                    .getAllInventory();

            setInventory(
                response || []
            );

        }
        catch (error) {

            console.error(
                "Failed to load inventory:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Failed to load inventory."
            );

            setInventory([]);

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadInventory();

    }, []);


    return (

        <div
            className="
                w-full
                min-h-full
                bg-slate-950
                text-slate-100
            "
        >

            {/* =====================================================
                PAGE HEADER
            ====================================================== */}

            <div
                className="
                    mb-7
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >

                <div>

                    <h1
                        className="
                            text-3xl
                            font-bold
                            tracking-tight
                            text-white
                        "
                    >
                        Inventory
                    </h1>

                    <p
                        className="
                            mt-2
                            text-sm
                            font-medium
                            text-blue-300
                        "
                    >
                        View and manage current laboratory inventory stock.
                    </p>

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
                        border-blue-800
                        bg-slate-900
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-blue-300
                        transition-all
                        duration-200
                        hover:border-blue-500
                        hover:bg-blue-500/10
                        hover:text-blue-200
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
                ERROR
            ====================================================== */}

            {error && (

                <div
                    className="
                        mb-6
                        rounded-xl
                        border
                        border-red-500/30
                        bg-red-500/10
                        px-5
                        py-4
                        text-sm
                        font-medium
                        text-red-400
                    "
                >

                    {error}

                </div>

            )}


            {/* =====================================================
                INVENTORY CARD
            ====================================================== */}

            <div
                className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-blue-900/70
                    bg-slate-900
                    shadow-lg
                    shadow-black/20
                "
            >

                {/* =================================================
                    CARD HEADER
                ================================================== */}

                <div
                    className="
                        border-b
                        border-blue-900/60
                        bg-[#101b35]
                        px-6
                        py-6
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            gap-4
                        "
                    >

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-blue-500/30
                                bg-blue-500/10
                                text-blue-400
                            "
                        >

                            <Boxes
                                size={22}
                                strokeWidth={1.8}
                            />

                        </div>


                        <div>

                            <h2
                                className="
                                    text-lg
                                    font-bold
                                    text-white
                                "
                            >
                                Current Inventory
                            </h2>

                            <p
                                className="
                                    mt-1.5
                                    text-sm
                                    font-medium
                                    text-blue-300
                                "
                            >
                                Current stock available in the laboratory.
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    LOADING
                ================================================== */}

                {loading ? (

                    <div
                        className="
                            flex
                            min-h-[220px]
                            items-center
                            justify-center
                            bg-slate-950
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                text-sm
                                font-medium
                                text-blue-300
                            "
                        >

                            <RefreshCw
                                size={18}
                                className="animate-spin text-blue-400"
                            />

                            Loading inventory...

                        </div>

                    </div>

                ) : inventory.length === 0 ? (

                    /* =================================================
                       EMPTY STATE
                    ================================================== */

                    <div
                        className="
                            flex
                            min-h-[220px]
                            flex-col
                            items-center
                            justify-center
                            bg-slate-950
                            px-6
                            text-center
                        "
                    >

                        <div
                            className="
                                mb-4
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-blue-500/30
                                bg-blue-500/10
                                text-blue-400
                            "
                        >

                            <Package size={26} />

                        </div>

                        <p
                            className="
                                text-lg
                                font-semibold
                                text-white
                            "
                        >
                            No inventory items found.
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            Inventory records will appear here when available.
                        </p>

                    </div>

                ) : (

                    /* =================================================
                       INVENTORY TABLE
                    ================================================== */

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr
                                    className="
                                        border-b
                                        border-blue-900/60
                                        bg-[#172746]
                                        text-left
                                    "
                                >

                                    {/* ITEM */}

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.12em]
                                            text-blue-400
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >

                                            <Package size={14} />

                                            Item

                                        </div>

                                    </th>


                                    {/* CODE */}

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.12em]
                                            text-cyan-400
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >

                                            <Hash size={14} />

                                            Code

                                        </div>

                                    </th>


                                    {/* CATEGORY */}

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.12em]
                                            text-violet-400
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >

                                            <Tag size={14} />

                                            Category

                                        </div>

                                    </th>


                                    {/* STOCK */}

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.12em]
                                            text-emerald-400
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >

                                            <Boxes size={14} />

                                            Stock

                                        </div>

                                    </th>


                                    {/* UNIT */}

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.12em]
                                            text-amber-400
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >

                                            <Layers3 size={14} />

                                            Unit

                                        </div>

                                    </th>


                                    {/* TYPE */}

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.12em]
                                            text-pink-400
                                        "
                                    >

                                        Type

                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {inventory.map(
                                    (item, index) => (

                                        <tr
                                            key={
                                                item.id ??
                                                item.inventoryItemId
                                            }
                                            className="
                                                border-b
                                                border-slate-800
                                                bg-slate-900
                                                last:border-b-0
                                                transition-colors
                                                duration-200
                                                hover:bg-[#14213d]
                                            "
                                        >

                                            {/* =================================
                                                ITEM
                                            ================================== */}

                                            <td
                                                className="
                                                    px-6
                                                    py-5
                                                "
                                            >

                                                <div>

                                                    <p
                                                        className="
                                                            text-sm
                                                            font-bold
                                                            text-blue-300
                                                            transition
                                                            hover:text-blue-200
                                                        "
                                                    >

                                                        {
                                                            item.itemName ??
                                                            "-"
                                                        }

                                                    </p>


                                                    {item.batchNumber && (

                                                        <p
                                                            className="
                                                                mt-1
                                                                text-xs
                                                                font-medium
                                                                text-slate-500
                                                            "
                                                        >

                                                            <span className="text-slate-600">
                                                                Batch:
                                                            </span>

                                                            {" "}

                                                            <span className="text-cyan-400">
                                                                {item.batchNumber}
                                                            </span>

                                                        </p>

                                                    )}

                                                </div>

                                            </td>


                                            {/* =================================
                                                CODE
                                            ================================== */}

                                            <td
                                                className="
                                                    px-6
                                                    py-5
                                                "
                                            >

                                                <span
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-cyan-300
                                                    "
                                                >

                                                    {
                                                        item.itemCode ??
                                                        "-"
                                                    }

                                                </span>

                                            </td>


                                            {/* =================================
                                                CATEGORY
                                            ================================== */}

                                            <td
                                                className="
                                                    px-6
                                                    py-5
                                                "
                                            >

                                                <span
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-violet-300
                                                    "
                                                >

                                                    {
                                                        item.categoryName ??
                                                        "-"
                                                    }

                                                </span>

                                            </td>


                                            {/* =================================
                                                STOCK
                                            ================================== */}

                                            <td
                                                className="
                                                    px-6
                                                    py-5
                                                "
                                            >

                                                <span
                                                    className={`
                                                        inline-flex
                                                        min-w-[42px]
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        border
                                                        px-2.5
                                                        py-1
                                                        text-sm
                                                        font-bold
                                                        ${
                                                            Number(item.quantity ?? 0) <= 0
                                                                ? "border-red-500/30 bg-red-500/10 text-red-400"
                                                                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                                        }
                                                    `}
                                                >

                                                    {
                                                        item.quantity ??
                                                        0
                                                    }

                                                </span>

                                            </td>


                                            {/* =================================
                                                UNIT
                                            ================================== */}

                                            <td
                                                className="
                                                    px-6
                                                    py-5
                                                "
                                            >

                                                <span
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-amber-300
                                                    "
                                                >

                                                    {
                                                        item.unit ??
                                                        "-"
                                                    }

                                                </span>

                                            </td>


                                            {/* =================================
                                                TYPE
                                            ================================== */}

                                            <td
                                                className="
                                                    px-6
                                                    py-5
                                                "
                                            >

                                                {(
                                                    item.isConsumable === true ||
                                                    item.isConsumable === "true"
                                                ) ? (

                                                    <span
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            rounded-full
                                                            border
                                                            border-emerald-500/30
                                                            bg-emerald-500/10
                                                            px-3
                                                            py-1.5
                                                            text-[11px]
                                                            font-bold
                                                            uppercase
                                                            tracking-wide
                                                            text-emerald-400
                                                        "
                                                    >

                                                        <span
                                                            className="
                                                                mr-1.5
                                                                h-1.5
                                                                w-1.5
                                                                rounded-full
                                                                bg-emerald-400
                                                            "
                                                        />

                                                        CONSUMABLE

                                                    </span>

                                                ) : (

                                                    <span
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            rounded-full
                                                            border
                                                            border-violet-500/30
                                                            bg-violet-500/10
                                                            px-3
                                                            py-1.5
                                                            text-[11px]
                                                            font-bold
                                                            uppercase
                                                            tracking-wide
                                                            text-violet-400
                                                        "
                                                    >

                                                        <span
                                                            className="
                                                                mr-1.5
                                                                h-1.5
                                                                w-1.5
                                                                rounded-full
                                                                bg-violet-400
                                                            "
                                                        />

                                                        NON-CONSUMABLE

                                                    </span>

                                                )}

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}


export default Inventory;