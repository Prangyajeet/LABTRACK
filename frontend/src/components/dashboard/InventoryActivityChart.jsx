import {
    ArrowDownToLine,
    ArrowUpFromLine,
    Activity
} from "lucide-react";

import { useMemo } from "react";


function InventoryActivityChart({
    transactions = []
}) {

    const activity = useMemo(() => {

        const result = {
            stockIn: 0,
            stockOut: 0
        };

        transactions.forEach((transaction) => {

            const type =
                String(
                    transaction.transactionType || ""
                ).toUpperCase();

            const quantity =
                Number(
                    transaction.quantity || 0
                );

            if (type === "STOCK_IN") {
                result.stockIn += quantity;
            }

            if (type === "STOCK_OUT") {
                result.stockOut += quantity;
            }

        });

        return result;

    }, [transactions]);


    const maximum =
        Math.max(
            activity.stockIn,
            activity.stockOut,
            1
        );


    const stockInWidth =
        (activity.stockIn / maximum) * 100;


    const stockOutWidth =
        (activity.stockOut / maximum) * 100;


    return (

        <div
            className="
                overflow-hidden
                rounded-[10px]
                border
                border-[#263657]
                bg-[#111b31]
                shadow-sm
                transition-all
                duration-200
                hover:border-[#315080]
            "
        >

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    border-b
                    border-[#263657]
                    px-6
                    py-5
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
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                bg-[#1a2332]
                                text-[#58a6ff]
                            "
                        >

                            <Activity size={18} />

                        </div>


                        <div>

                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.14em]
                                    text-[#58a6ff]
                                "
                            >
                                Inventory
                            </p>


                            <h2
                                className="
                                    mt-1
                                    text-[16px]
                                    font-semibold
                                    tracking-tight
                                    text-[#e6edf3]
                                "
                            >
                                Inventory Activity
                            </h2>

                        </div>

                    </div>


                    <p
                        className="
                            mt-3
                            text-[12px]
                            text-[#8b949e]
                        "
                    >
                        Stock movement across inventory.
                    </p>

                </div>


                {/* 21 transactions - BLUE */}

                <span
                    className="
                        rounded-md
                        border
                        border-[#1f6feb]/40
                        bg-[#1a2a4a]
                        px-3
                        py-1.5
                        text-[11px]
                        font-semibold
                        text-[#58a6ff]
                    "
                >
                    {transactions.length} transactions
                </span>

            </div>


            {/* =====================================================
                ACTIVITY CONTENT
            ===================================================== */}

            <div className="p-6">

                <div className="space-y-6">

                    {/* STOCK IN */}

                    <div>

                        <div
                            className="
                                mb-3
                                flex
                                items-center
                                justify-between
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
                                        bg-[#0d2a1f]
                                        text-[#3fb950]
                                    "
                                >

                                    <ArrowDownToLine
                                        size={15}
                                    />

                                </div>


                                <span
                                    className="
                                        text-[13px]
                                        font-medium
                                        text-[#e6edf3]
                                    "
                                >
                                    Stock In
                                </span>

                            </div>


                            <span
                                className="
                                    rounded-md
                                    bg-[#0d2a1f]
                                    px-2.5
                                    py-1
                                    text-[12px]
                                    font-semibold
                                    text-[#3fb950]
                                "
                            >
                                +{activity.stockIn}
                            </span>

                        </div>


                        <div
                            className="
                                h-1.5
                                overflow-hidden
                                rounded-full
                                bg-[#21262d]
                            "
                        >

                            <div
                                className="
                                    h-full
                                    rounded-full
                                    bg-[#3fb950]
                                    transition-all
                                    duration-700
                                "
                                style={{
                                    width:
                                        `${stockInWidth}%`
                                }}
                            />

                        </div>

                    </div>


                    {/* STOCK OUT */}

                    <div>

                        <div
                            className="
                                mb-3
                                flex
                                items-center
                                justify-between
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
                                        bg-[#2a1e0d]
                                        text-[#d29922]
                                    "
                                >

                                    <ArrowUpFromLine
                                        size={15}
                                    />

                                </div>


                                <span
                                    className="
                                        text-[13px]
                                        font-medium
                                        text-[#e6edf3]
                                    "
                                >
                                    Stock Out
                                </span>

                            </div>


                            <span
                                className="
                                    rounded-md
                                    bg-[#2a1e0d]
                                    px-2.5
                                    py-1
                                    text-[12px]
                                    font-semibold
                                    text-[#d29922]
                                "
                            >
                                -{activity.stockOut}
                            </span>

                        </div>


                        <div
                            className="
                                h-1.5
                                overflow-hidden
                                rounded-full
                                bg-[#21262d]
                            "
                        >

                            <div
                                className="
                                    h-full
                                    rounded-full
                                    bg-[#d29922]
                                    transition-all
                                    duration-700
                                "
                                style={{
                                    width:
                                        `${stockOutWidth}%`
                                }}
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    MINI STAT CARDS
                ================================================= */}

                <div
                    className="
                        mt-7
                        grid
                        grid-cols-1
                        gap-4
                        sm:grid-cols-2
                    "
                >

                    {/* TOTAL STOCK IN */}

                    <div
                        className="
                            rounded-[10px]
                            border
                            border-[#263657]
                            bg-[#14203a]
                            p-5
                            transition-all
                            duration-200
                            hover:border-[#315080]
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.1em]
                                    text-[#8b949e]
                                "
                            >
                                Total Stock In
                            </p>


                            <span
                                className="
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-[#3fb950]
                                "
                            />

                        </div>


                        <p
                            className="
                                mt-2
                                text-[22px]
                                font-bold
                                tracking-tight
                                text-[#3fb950]
                            "
                        >
                            {activity.stockIn}
                        </p>


                        <p
                            className="
                                mt-1
                                text-[11px]
                                text-[#8b949e]
                            "
                        >
                            Units received
                        </p>

                    </div>


                    {/* TOTAL STOCK OUT */}

                    <div
                        className="
                            rounded-[10px]
                            border
                            border-[#263657]
                            bg-[#14203a]
                            p-5
                            transition-all
                            duration-200
                            hover:border-[#315080]
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.1em]
                                    text-[#8b949e]
                                "
                            >
                                Total Stock Out
                            </p>


                            <span
                                className="
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-[#d29922]
                                "
                            />

                        </div>


                        <p
                            className="
                                mt-2
                                text-[22px]
                                font-bold
                                tracking-tight
                                text-[#d29922]
                            "
                        >
                            {activity.stockOut}
                        </p>


                        <p
                            className="
                                mt-1
                                text-[11px]
                                text-[#8b949e]
                            "
                        >
                            Units issued
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default InventoryActivityChart;