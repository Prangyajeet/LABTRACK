import { useMemo, useState } from "react";

import {
    ArrowDownToLine,
    ArrowUpFromLine,
    History,
    Search,
    X
} from "lucide-react";


function RecentActivity({
    transactions
}) {

    const [searchTerm, setSearchTerm] =
        useState("");


    /*
     * ============================================================
     * SORT + FILTER TRANSACTIONS
     * ============================================================
     *
     * Existing transaction logic is preserved.
     *
     * Search is only a UI-level filter.
     * No API or backend changes are made.
     *
     * ============================================================
     */

    const recentTransactions = useMemo(() => {

        const sortedTransactions =
            [...(transactions || [])]
                .sort(
                    (a, b) =>
                        new Date(
                            b.transactionDate ||
                            b.createdAt ||
                            0
                        ) -
                        new Date(
                            a.transactionDate ||
                            a.createdAt ||
                            0
                        )
                );


        const filteredTransactions =
            sortedTransactions.filter(
                (transaction) => {

                    if (!searchTerm.trim()) {
                        return true;
                    }

                    const query =
                        searchTerm
                            .trim()
                            .toLowerCase();


                    const itemName =
                        transaction.itemName ||
                        transaction.inventoryItemName ||
                        "";


                    const transactionType =
                        transaction.transactionType ||
                        "";


                    return (
                        String(itemName)
                            .toLowerCase()
                            .includes(query) ||

                        String(transactionType)
                            .toLowerCase()
                            .includes(query)
                    );

                }
            );


        return filteredTransactions.slice(0, 8);

    }, [
        transactions,
        searchTerm
    ]);


    /*
     * ============================================================
     * DATE FORMAT
     * ============================================================
     */

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }


        return new Date(value)
            .toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    };


    /*
     * ============================================================
     * RENDER
     * ============================================================
     */

    return (

        <section
            className="
                overflow-hidden
                rounded-2xl
                border
                border-zinc-800
                bg-zinc-900/60
                shadow-md
                backdrop-blur-md
            "
        >

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div
                className="
                    border-b
                    border-zinc-800
                    px-5
                    py-5
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    {/* TITLE */}

                    <div>

                        <div
                            className="
                                flex
                                items-center
                                gap-2.5
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
                                    bg-blue-500/10
                                    text-blue-400
                                "
                            >

                                <History
                                    size={16}
                                />

                            </div>


                            <h2
                                className="
                                    text-sm
                                    font-semibold
                                    tracking-wide
                                    text-zinc-100
                                "
                            >
                                Recent Inventory Activity
                            </h2>

                        </div>


                        <p
                            className="
                                mt-2
                                text-xs
                                text-zinc-500
                            "
                        >
                            Latest stock movements across the laboratory.
                        </p>

                    </div>


                    {/* =================================================
                        SEARCH / FILTER
                    ================================================= */}

                    <div
                        className="
                            flex
                            w-full
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-zinc-800
                            bg-zinc-950/60
                            px-3
                            py-2
                            transition
                            focus-within:border-zinc-700
                            focus-within:bg-zinc-950
                            sm:w-56
                        "
                    >

                        <Search
                            size={15}
                            className="
                                shrink-0
                                text-zinc-500
                            "
                        />


                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                            placeholder="Filter activity..."
                            className="
                                min-w-0
                                flex-1
                                bg-transparent
                                text-xs
                                text-zinc-200
                                outline-none
                                placeholder:text-zinc-600
                            "
                        />


                        {searchTerm && (

                            <button
                                type="button"
                                onClick={() =>
                                    setSearchTerm("")
                                }
                                className="
                                    text-zinc-600
                                    transition
                                    hover:text-zinc-300
                                "
                                aria-label="Clear activity search"
                            >

                                <X size={14} />

                            </button>

                        )}

                    </div>

                </div>

            </div>


            {/* =====================================================
                ACTIVITY LIST
            ===================================================== */}

            {recentTransactions.length === 0 ? (

                <div
                    className="
                        flex
                        min-h-[240px]
                        flex-col
                        items-center
                        justify-center
                        px-6
                        py-10
                        text-center
                    "
                >

                    <div
                        className="
                            mb-4
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-zinc-800
                            bg-zinc-950
                            text-zinc-600
                        "
                    >

                        <History size={20} />

                    </div>


                    <p
                        className="
                            text-sm
                            font-medium
                            text-zinc-400
                        "
                    >
                        {searchTerm
                            ? "No matching activity"
                            : "No inventory activity found."
                        }
                    </p>


                    <p
                        className="
                            mt-1
                            text-xs
                            text-zinc-600
                        "
                    >
                        {searchTerm
                            ? "Try a different item or transaction type."
                            : "Recent inventory movements will appear here."
                        }
                    </p>

                </div>

            ) : (

                <div>

                    {recentTransactions.map(
                        (
                            transaction,
                            index
                        ) => {

                            const isStockIn =
                                String(
                                    transaction.transactionType ||
                                    ""
                                ).toUpperCase() ===
                                "STOCK_IN";


                            const itemName =
                                transaction.itemName ||
                                transaction.inventoryItemName ||
                                "Inventory Item";


                            return (

                                <div
                                    key={
                                        transaction.id ??
                                        index
                                    }
                                    className="
                                        group
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                        border-b
                                        border-zinc-800/80
                                        px-5
                                        py-4
                                        transition
                                        last:border-b-0
                                        hover:bg-zinc-800/30
                                    "
                                >

                                    {/* =================================================
                                        LEFT SIDE
                                    ================================================= */}

                                    <div
                                        className="
                                            flex
                                            min-w-0
                                            items-center
                                            gap-3
                                        "
                                    >

                                        {/* TRANSACTION ICON */}

                                        <div
                                            className={`
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                ${
                                                    isStockIn
                                                        ? "bg-emerald-500/10 text-emerald-400"
                                                        : "bg-amber-500/10 text-amber-400"
                                                }
                                            `}
                                        >

                                            {isStockIn ? (

                                                <ArrowDownToLine
                                                    size={16}
                                                />

                                            ) : (

                                                <ArrowUpFromLine
                                                    size={16}
                                                />

                                            )}

                                        </div>


                                        {/* ITEM DETAILS */}

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
                                                    text-zinc-200
                                                    transition
                                                    group-hover:text-white
                                                "
                                                title={
                                                    itemName
                                                }
                                            >
                                                {itemName}
                                            </p>


                                            <div
                                                className="
                                                    mt-1
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-1.5
                                                    text-[11px]
                                                "
                                            >

                                                <span
                                                    className={`
                                                        rounded-md
                                                        px-1.5
                                                        py-0.5
                                                        font-medium
                                                        ${
                                                            isStockIn
                                                                ? "bg-emerald-500/10 text-emerald-400"
                                                                : "bg-amber-500/10 text-amber-400"
                                                        }
                                                    `}
                                                >

                                                    {isStockIn
                                                        ? "Stock In"
                                                        : "Stock Out"
                                                    }

                                                </span>


                                                <span
                                                    className="
                                                        text-zinc-700
                                                    "
                                                >
                                                    •
                                                </span>


                                                <span
                                                    className="
                                                        truncate
                                                        text-zinc-500
                                                    "
                                                >
                                                    {
                                                        formatDate(
                                                            transaction.transactionDate ||
                                                            transaction.createdAt
                                                        )
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        QUANTITY
                                    ================================================= */}

                                    <div
                                        className="
                                            shrink-0
                                        "
                                    >

                                        <span
                                            className={`
                                                inline-flex
                                                min-w-[48px]
                                                items-center
                                                justify-center
                                                rounded-lg
                                                px-2.5
                                                py-1.5
                                                text-xs
                                                font-semibold
                                                ${
                                                    isStockIn
                                                        ? "bg-emerald-500/10 text-emerald-400"
                                                        : "bg-amber-500/10 text-amber-400"
                                                }
                                            `}
                                        >

                                            {isStockIn
                                                ? "+"
                                                : "-"
                                            }

                                            {
                                                transaction.quantity ??
                                                0
                                            }

                                        </span>

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>

            )}

        </section>

    );

}


export default RecentActivity;