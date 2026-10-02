import {
    LayoutGrid,
    CheckCircle2,
    Archive
} from "lucide-react";

function CategoryStats({ categories = [] }) {

    const totalCategories = categories.length;

    const activeCategories = categories.filter(
        (category) => category.status === "ACTIVE"
    ).length;

    const inactiveCategories = categories.filter(
        (category) => category.status === "INACTIVE"
    ).length;


    const stats = [
        {
            label: "Total Categories",
            value: totalCategories,
            icon: LayoutGrid,

            labelColor: "text-[#58a6ff]",

            iconWrapper:
                "bg-blue-600 text-white border-blue-500/30"
        },

        {
            label: "Active",
            value: activeCategories,
            icon: CheckCircle2,

            labelColor: "text-[#3fb950]",

            iconWrapper:
                "bg-emerald-600 text-white border-emerald-500/30"
        },

        {
            label: "Inactive",
            value: inactiveCategories,
            icon: Archive,

            labelColor: "text-[#f85149]",

            iconWrapper:
                "bg-red-600 text-white border-red-500/30"
        }
    ];


    return (

        <div
            className="
                grid
                grid-cols-1
                gap-5
                md:grid-cols-3
            "
        >

            {stats.map((stat) => {

                const Icon = stat.icon;

                return (

                    <div
                        key={stat.label}
                        className="
                            group
                            relative
                            overflow-hidden
                            rounded-xl
                            border
                            border-[#21375f]
                            bg-[#101a32]
                            px-6
                            py-5
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:border-[#31558f]
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                                gap-4
                            "
                        >

                            {/* ==============================
                                CARD LABEL
                            ============================== */}

                            <div>

                                <p
                                    className={`
                                        text-[13px]
                                        font-semibold
                                        ${stat.labelColor}
                                    `}
                                >
                                    {stat.label}
                                </p>


                                {/* ==============================
                                    NUMBER
                                ============================== */}

                                <p
                                    className="
                                        mt-3
                                        text-[28px]
                                        font-bold
                                        leading-none
                                        text-[#e6edf3]
                                    "
                                >
                                    {stat.value}
                                </p>

                            </div>


                            {/* ==============================
                                ICON
                            ============================== */}

                            <div
                                className={`
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    transition-transform
                                    duration-200
                                    group-hover:scale-105
                                    ${stat.iconWrapper}
                                `}
                            >

                                <Icon
                                    size={24}
                                    strokeWidth={2}
                                />

                            </div>

                        </div>

                    </div>

                );

            })}

        </div>

    );

}

export default CategoryStats;