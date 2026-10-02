import {
    ClipboardList,
    PackagePlus,
    Wrench,
    ArrowUpRight
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";


function QuickActions() {

    const navigate =
        useNavigate();


    const actions = [

        {
            label: "Stock In",

            description:
                "Receive inventory",

            path: "/stock-in",

            icon: PackagePlus,

            iconClass:
                "bg-[#0d2a1f] text-[#3fb950]",

            hoverClass:
                "group-hover:border-[#3fb950]/40",

            labelHover:
                "group-hover:text-[#3fb950]",

            arrowHover:
                "group-hover:text-[#3fb950]"
        },

        {
            label: "Stock Out",

            description:
                "Issue inventory",

            path: "/stock-out",

            icon: ClipboardList,

            iconClass:
                "bg-[#2a1e0d] text-[#d29922]",

            hoverClass:
                "group-hover:border-[#d29922]/40",

            labelHover:
                "group-hover:text-[#d29922]",

            arrowHover:
                "group-hover:text-[#d29922]"
        },

        {
            label: "Equipment",

            description:
                "Manage equipment",

            path: "/equipment",

            icon: Wrench,

            iconClass:
                "bg-[#2d2250] text-[#a371f7]",

            hoverClass:
                "group-hover:border-[#a371f7]/40",

            labelHover:
                "group-hover:text-[#a371f7]",

            arrowHover:
                "group-hover:text-[#a371f7]"
        }

    ];


    return (

        <section
            className="
                overflow-hidden
                rounded-[10px]
                border
                border-[#21262d]
                bg-[#161b22]
                p-5
                shadow-md
            "
        >

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div
                className="
                    mb-5
                    flex
                    items-end
                    justify-between
                    gap-4
                "
            >

                <div>

                    <p
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.15em]
                            text-[#58a6ff]
                        "
                    >
                        Operations
                    </p>


                    <h2
                        className="
                            mt-1
                            text-[16px]
                            font-semibold
                            tracking-wide
                            text-[#e6edf3]
                        "
                    >
                        Quick Actions
                    </h2>


                    <p
                        className="
                            mt-1
                            text-[12px]
                            text-[#8b949e]
                        "
                    >
                        Frequently used laboratory operations.
                    </p>

                </div>

            </div>


            {/* =====================================================
                ACTIONS
            ===================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-3
                    md:grid-cols-3
                "
            >

                {actions.map((action) => {

                    const Icon =
                        action.icon;


                    return (

                        <button
                            key={action.path}
                            type="button"
                            onClick={() =>
                                navigate(
                                    action.path
                                )
                            }
                            className={`
                                group
                                relative
                                flex
                                items-center
                                gap-4
                                overflow-hidden
                                rounded-[10px]
                                border
                                border-[#21262d]
                                bg-[#111827]
                                p-4
                                text-left
                                shadow-sm
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:bg-[#1a2332]
                                ${action.hoverClass}
                            `}
                        >

                            {/* =================================================
                                TOP HIGHLIGHT
                            ================================================= */}

                            <div
                                className="
                                    absolute
                                    left-0
                                    right-0
                                    top-0
                                    h-px
                                    bg-[#58a6ff]
                                    opacity-0
                                    transition
                                    duration-300
                                    group-hover:opacity-60
                                "
                            />


                            {/* =================================================
                                ICON
                            ================================================= */}

                            <div
                                className={`
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-[10px]
                                    border
                                    border-white/5
                                    transition-all
                                    duration-300
                                    group-hover:scale-105
                                    ${action.iconClass}
                                `}
                            >

                                <Icon
                                    size={20}
                                    strokeWidth={1.8}
                                />

                            </div>


                            {/* =================================================
                                CONTENT
                            ================================================= */}

                            <div
                                className="
                                    min-w-0
                                    flex-1
                                "
                            >

                                <p
                                    className={`
                                        text-[13px]
                                        font-semibold
                                        text-[#e6edf3]
                                        transition
                                        duration-200
                                        ${action.labelHover}
                                    `}
                                >
                                    {action.label}
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[11px]
                                        text-[#8b949e]
                                    "
                                >
                                    {action.description}
                                </p>

                            </div>


                            {/* =================================================
                                ARROW
                            ================================================= */}

                            <ArrowUpRight
                                size={17}
                                className={`
                                    shrink-0
                                    text-[#8b949e]
                                    transition-all
                                    duration-300
                                    group-hover:-translate-y-0.5
                                    group-hover:translate-x-0.5
                                    ${action.arrowHover}
                                `}
                            />

                        </button>

                    );

                })}

            </div>

        </section>

    );

}


export default QuickActions;