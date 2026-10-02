import {
    BarChart3,
    Layers3
} from "lucide-react";

import { useMemo } from "react";


function CategoryDistributionChart({
    inventory = []
}) {

    const categoryData = useMemo(() => {

        const counts = {};


        inventory.forEach((item) => {

            const category =
                item.categoryName ||
                item.category?.name ||
                "Uncategorized";


            counts[category] =
                (counts[category] || 0) + 1;

        });


        return Object.entries(counts)
            .map(([category, count]) => ({
                category,
                count
            }))
            .sort(
                (a, b) =>
                    b.count - a.count
            )
            .slice(0, 6);

    }, [inventory]);


    /*
     * ============================================================
     * EMPTY STATE
     * ============================================================
     */

    if (categoryData.length === 0) {

        return (

            <div
                className="
                    overflow-hidden
                    rounded-[10px]
                    border
                    border-[#21262d]
                    bg-[#161b22]
                    shadow-md
                    transition-all
                    duration-200
                    hover:border-[#315080]
                "
            >

                {/* HEADER */}

                <div
                    className="
                        border-b
                        border-[#21262d]
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
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                bg-[#1a2332]
                                text-[#58a6ff]
                            "
                        >

                            <BarChart3
                                size={18}
                            />

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
                                    text-[#e6edf3]
                                "
                            >
                                Category Distribution
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
                        Inventory items grouped by category.
                    </p>

                </div>


                {/* EMPTY CONTENT */}

                <div
                    className="
                        flex
                        min-h-[180px]
                        items-center
                        justify-center
                        p-6
                    "
                >

                    <div
                        className="
                            w-full
                            rounded-[10px]
                            border
                            border-dashed
                            border-[#263657]
                            bg-[#111827]
                            px-6
                            py-10
                            text-center
                        "
                    >

                        <Layers3
                            size={24}
                            className="
                                mx-auto
                                text-[#58a6ff]/50
                            "
                        />


                        <p
                            className="
                                mt-3
                                text-[13px]
                                font-medium
                                text-[#8b949e]
                            "
                        >
                            No inventory category data available.
                        </p>


                        <p
                            className="
                                mt-1
                                text-[11px]
                                text-[#586579]
                            "
                        >
                            Category distribution will appear here.
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    /*
     * ============================================================
     * MAXIMUM CATEGORY COUNT
     * ============================================================
     */

    const maxCount =
        Math.max(
            ...categoryData.map(
                (item) => item.count
            )
        );


    /*
     * ============================================================
     * TOTAL ITEMS
     * ============================================================
     */

    const totalItems =
        categoryData.reduce(
            (total, item) =>
                total + item.count,
            0
        );


    /*
     * ============================================================
     * MAIN COMPONENT
     * ============================================================
     */

    return (

        <div
            className="
                overflow-hidden
                rounded-[10px]
                border
                border-[#21262d]
                bg-[#161b22]
                shadow-md
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
                    border-[#21262d]
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

                        {/* ICON */}

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

                            <BarChart3
                                size={18}
                            />

                        </div>


                        <div>

                            {/* EYEBROW */}

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


                            {/* TITLE */}

                            <h2
                                className="
                                    mt-1
                                    text-[16px]
                                    font-semibold
                                    text-[#e6edf3]
                                "
                            >
                                Category Distribution
                            </h2>

                        </div>

                    </div>


                    {/* DESCRIPTION */}

                    <p
                        className="
                            mt-3
                            text-[12px]
                            text-[#8b949e]
                        "
                    >
                        Inventory items grouped by category.
                    </p>

                </div>


                {/* =================================================
                    ITEMS BADGE
                ================================================= */}

                <div
                    className="
                        rounded-md
                        border
                        border-[#315080]
                        bg-[#1a2a4a]
                        px-3
                        py-1.5
                    "
                >

                    <span
                        className="
                            text-[11px]
                            font-semibold
                            text-[#58a6ff]
                        "
                    >
                        {totalItems} Items
                    </span>

                </div>

            </div>


            {/* =====================================================
                CATEGORY LIST
            ===================================================== */}

            <div className="p-6">

                <div className="space-y-5">

                    {categoryData.map(
                        (item, index) => {

                            /*
                             * Percentage relative to
                             * highest category.
                             */

                            const percentage =
                                maxCount > 0
                                    ? (
                                        item.count /
                                        maxCount
                                    ) * 100
                                    : 0;


                            /*
                             * Percentage share
                             * of total items.
                             */

                            const share =
                                totalItems > 0
                                    ? Math.round(
                                        (
                                            item.count /
                                            totalItems
                                        ) * 100
                                    )
                                    : 0;


                            return (

                                <div
                                    key={item.category}
                                    className="
                                        group
                                    "
                                >

                                    {/* =================================================
                                        CATEGORY INFORMATION
                                    ================================================= */}

                                    <div
                                        className="
                                            mb-2
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                min-w-0
                                                items-center
                                                gap-3
                                            "
                                        >

                                            {/* RANK */}

                                            <span
                                                className="
                                                    flex
                                                    h-7
                                                    w-7
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    border
                                                    border-[#263657]
                                                    bg-[#111827]
                                                    text-[10px]
                                                    font-semibold
                                                    text-[#58a6ff]
                                                    transition-all
                                                    duration-200
                                                    group-hover:border-[#315080]
                                                    group-hover:bg-[#1a2a4a]
                                                "
                                            >
                                                {index + 1}
                                            </span>


                                            {/* CATEGORY NAME */}

                                            <span
                                                className="
                                                    truncate
                                                    text-[13px]
                                                    font-medium
                                                    text-[#e6edf3]
                                                    transition-colors
                                                    duration-200
                                                    group-hover:text-[#58a6ff]
                                                "
                                            >
                                                {item.category}
                                            </span>

                                        </div>


                                        {/* =================================================
                                            PERCENTAGE + COUNT
                                        ================================================= */}

                                        <div
                                            className="
                                                flex
                                                shrink-0
                                                items-center
                                                gap-3
                                            "
                                        >

                                            {/* PERCENTAGE */}

                                            <span
                                                className="
                                                    rounded-md
                                                    bg-[#1a2332]
                                                    px-2
                                                    py-1
                                                    text-[11px]
                                                    font-semibold
                                                    text-[#58a6ff]
                                                "
                                            >
                                                {share}%
                                            </span>


                                            {/* COUNT */}

                                            <span
                                                className="
                                                    min-w-[24px]
                                                    text-right
                                                    text-[13px]
                                                    font-bold
                                                    text-[#e6edf3]
                                                "
                                            >
                                                {item.count}
                                            </span>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        PROGRESS BAR
                                    ================================================= */}

                                    <div
                                        className="
                                            ml-10
                                            h-[6px]
                                            overflow-hidden
                                            rounded-full
                                            bg-[#21262d]
                                        "
                                    >

                                        <div
                                            className="
                                                h-full
                                                rounded-full
                                                bg-[#58a6ff]
                                                transition-all
                                                duration-700
                                                ease-out
                                                group-hover:bg-[#1f6feb]
                                            "
                                            style={{
                                                width:
                                                    `${percentage}%`
                                            }}
                                        />

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>


                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <div
                    className="
                        mt-6
                        flex
                        items-center
                        justify-between
                        border-t
                        border-[#21262d]
                        pt-4
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-[#3fb950]
                            "
                        />


                        <span
                            className="
                                text-[11px]
                                font-medium
                                text-[#8b949e]
                            "
                        >
                            Top 6 categories
                        </span>

                    </div>


                    <span
                        className="
                            text-[11px]
                            font-medium
                            text-[#58a6ff]
                        "
                    >
                        By item count
                    </span>

                </div>

            </div>

        </div>

    );

}


export default CategoryDistributionChart;