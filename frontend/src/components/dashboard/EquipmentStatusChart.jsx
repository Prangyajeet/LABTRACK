import {
    Activity,
    CheckCircle2,
    CircleAlert
} from "lucide-react";

import { useMemo } from "react";


function EquipmentStatusChart({
    equipment = []
}) {

    const statusData = useMemo(() => {

        const counts = {};

        equipment.forEach((item) => {

            const status =
                item.status ||
                "UNKNOWN";

            const normalizedStatus =
                String(status)
                    .replaceAll("_", " ")
                    .toLowerCase()
                    .replace(
                        /\b\w/g,
                        (character) =>
                            character.toUpperCase()
                    );

            counts[normalizedStatus] =
                (counts[normalizedStatus] || 0) + 1;

        });


        return Object.entries(counts)
            .map(([status, count]) => ({
                status,
                count
            }))
            .sort(
                (a, b) =>
                    b.count - a.count
            );

    }, [equipment]);


    const total =
        equipment.length;


    const getStatusStyle = (status) => {

        const normalized =
            status.toUpperCase();


        if (
            normalized.includes("ACTIVE") ||
            normalized.includes("OPERATIONAL") ||
            normalized.includes("WORKING")
        ) {

            return {
                icon: CheckCircle2,

                iconClass:
                    "bg-[#0d2a1f] text-[#3fb950]",

                barClass:
                    "bg-[#3fb950]",

                dotClass:
                    "bg-[#3fb950]"
            };

        }


        if (
            normalized.includes("MAINTENANCE") ||
            normalized.includes("REPAIR")
        ) {

            return {
                icon: CircleAlert,

                iconClass:
                    "bg-[#2a1e0d] text-[#d29922]",

                barClass:
                    "bg-[#d29922]",

                dotClass:
                    "bg-[#d29922]"
            };

        }


        if (
            normalized.includes("INACTIVE") ||
            normalized.includes("DAMAGED") ||
            normalized.includes("FAILED")
        ) {

            return {
                icon: CircleAlert,

                iconClass:
                    "bg-[#2a1417] text-[#f85149]",

                barClass:
                    "bg-[#f85149]",

                dotClass:
                    "bg-[#f85149]"
            };

        }


        return {
            icon: Activity,

            iconClass:
                "bg-[#2d2250] text-[#a371f7]",

            barClass:
                "bg-[#a371f7]",

            dotClass:
                "bg-[#a371f7]"
        };

    };


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
                                bg-[#2d2250]
                                text-[#a371f7]
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
                                Equipment
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
                                Equipment Status
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
                        Current equipment status overview.
                    </p>

                </div>


                {/* 1 Total - PURPLE */}

                <div
                    className="
                        rounded-md
                        border
                        border-[#a371f7]/40
                        bg-[#2d2250]
                        px-3
                        py-1.5
                    "
                >

                    <span
                        className="
                            text-[11px]
                            font-semibold
                            text-[#a371f7]
                        "
                    >
                        {total} Total
                    </span>

                </div>

            </div>


            {/* =====================================================
                EQUIPMENT CONTENT
            ===================================================== */}

            <div className="p-6">

                {statusData.length === 0 ? (

                    <div
                        className="
                            flex
                            min-h-[180px]
                            items-center
                            justify-center
                            rounded-[10px]
                            border
                            border-dashed
                            border-[#263657]
                            bg-[#14203a]
                        "
                    >

                        <div className="text-center">

                            <Activity
                                size={24}
                                className="
                                    mx-auto
                                    text-[#8b949e]
                                "
                            />

                            <p
                                className="
                                    mt-3
                                    text-[13px]
                                    text-[#8b949e]
                                "
                            >
                                No equipment data available.
                            </p>

                        </div>

                    </div>

                ) : (

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                        "
                    >

                        {statusData.map((item) => {

                            const percentage =
                                total > 0
                                    ? Math.round(
                                        (
                                            item.count /
                                            total
                                        ) * 100
                                    )
                                    : 0;


                            const statusStyle =
                                getStatusStyle(
                                    item.status
                                );


                            const StatusIcon =
                                statusStyle.icon;


                            return (

                                <div
                                    key={item.status}
                                    className="
                                        rounded-[10px]
                                        border
                                        border-[#263657]
                                        bg-[#14203a]
                                        p-5
                                        transition-all
                                        duration-200
                                        hover:-translate-y-0.5
                                        hover:border-[#315080]
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-3
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

                                            <div
                                                className={`
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    ${statusStyle.iconClass}
                                                `}
                                            >

                                                <StatusIcon
                                                    size={18}
                                                />

                                            </div>


                                            <div className="min-w-0">

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    "
                                                >

                                                    <span
                                                        className={`
                                                            h-2
                                                            w-2
                                                            rounded-full
                                                            ${statusStyle.dotClass}
                                                        `}
                                                    />


                                                    <p
                                                        className="
                                                            truncate
                                                            text-[13px]
                                                            font-medium
                                                            text-[#e6edf3]
                                                        "
                                                    >
                                                        {item.status}
                                                    </p>

                                                </div>


                                                <p
                                                    className="
                                                        mt-1
                                                        text-[28px]
                                                        font-bold
                                                        tracking-tight
                                                        text-[#e6edf3]
                                                    "
                                                >
                                                    {item.count}
                                                </p>

                                            </div>

                                        </div>


                                        {/* 100% - GREEN */}

                                        <span
                                            className="
                                                rounded-md
                                                border
                                                border-[#3fb950]/40
                                                bg-[#0d2a1f]
                                                px-2.5
                                                py-1
                                                text-[11px]
                                                font-semibold
                                                text-[#3fb950]
                                            "
                                        >
                                            {percentage}%
                                        </span>

                                    </div>


                                    {/* PROGRESS BAR */}

                                    <div
                                        className="
                                            mt-5
                                            h-1.5
                                            overflow-hidden
                                            rounded-full
                                            bg-[#21262d]
                                        "
                                    >

                                        <div
                                            className={`
                                                h-full
                                                rounded-full
                                                transition-all
                                                duration-700
                                                ${statusStyle.barClass}
                                            `}
                                            style={{
                                                width:
                                                    `${percentage}%`
                                            }}
                                        />

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

        </div>

    );
}


export default EquipmentStatusChart;