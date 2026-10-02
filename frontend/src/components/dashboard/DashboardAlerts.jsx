import {
    AlertCircle,
    AlertTriangle,
    CalendarClock,
    CheckCircle2,
    ChevronRight
} from "lucide-react";


function DashboardAlerts({

    lowStock,

    expired,

    expiringSoon,

    maintenanceDue

}) {

    const alerts = [];


    if (lowStock.length > 0) {

        alerts.push({

            key: "low-stock",

            title: "Low Stock",

            description:
                `${lowStock.length} item${
                    lowStock.length === 1
                        ? ""
                        : "s"
                } require replenishment.`,

            icon: AlertTriangle,

            className:
                "border-amber-500/20 bg-amber-500/[0.06] text-amber-400",

            badge:
                "bg-amber-500/10 text-amber-400"

        });

    }


    if (expired.length > 0) {

        alerts.push({

            key: "expired",

            title: "Expired Items",

            description:
                `${expired.length} expired item${
                    expired.length === 1
                        ? ""
                        : "s"
                } require attention.`,

            icon: AlertCircle,

            className:
                "border-red-500/20 bg-red-500/[0.06] text-red-400",

            badge:
                "bg-red-500/10 text-red-400"

        });

    }


    if (expiringSoon.length > 0) {

        alerts.push({

            key: "expiring",

            title: "Expiring Soon",

            description:
                `${expiringSoon.length} item${
                    expiringSoon.length === 1
                        ? ""
                        : "s"
                } will expire within 30 days.`,

            icon: CalendarClock,

            className:
                "border-yellow-500/20 bg-yellow-500/[0.06] text-yellow-400",

            badge:
                "bg-yellow-500/10 text-yellow-400"

        });

    }


    if (maintenanceDue.length > 0) {

        alerts.push({

            key: "maintenance",

            title: "Maintenance Due",

            description:
                `${maintenanceDue.length} equipment item${
                    maintenanceDue.length === 1
                        ? ""
                        : "s"
                } require maintenance.`,

            icon: CalendarClock,

            className:
                "border-red-500/20 bg-red-500/[0.06] text-red-400",

            badge:
                "bg-red-500/10 text-red-400"

        });

    }


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
                    flex
                    items-center
                    justify-between
                    border-b
                    border-zinc-800
                    px-5
                    py-5
                "
            >

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
                                bg-red-500/10
                                text-red-400
                            "
                        >

                            <AlertTriangle
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
                            Alerts & Notifications
                        </h2>

                    </div>


                    <p
                        className="
                            mt-2
                            text-xs
                            text-zinc-500
                        "
                    >
                        Items requiring attention.
                    </p>

                </div>


                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    {alerts.length > 0 && (

                        <span
                            className="
                                h-2
                                w-2
                                animate-pulse
                                rounded-full
                                bg-red-400
                            "
                        />

                    )}


                    <span
                        className="
                            min-w-7
                            rounded-md
                            border
                            border-zinc-800
                            bg-zinc-950
                            px-2
                            py-1
                            text-center
                            text-xs
                            font-medium
                            text-zinc-400
                        "
                    >
                        {alerts.length}
                    </span>

                </div>

            </div>


            {/* =====================================================
                ALERT CONTENT
            ===================================================== */}

            {alerts.length === 0 ? (

                <div className="p-5">

                    <div
                        className="
                            flex
                            items-center
                            gap-4
                            rounded-xl
                            border
                            border-emerald-500/20
                            bg-emerald-500/[0.05]
                            p-4
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-emerald-500/10
                                text-emerald-400
                            "
                        >

                            <CheckCircle2
                                size={19}
                            />

                        </div>


                        <div>

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-emerald-400
                                "
                            >
                                Everything looks good
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-zinc-500
                                "
                            >
                                No critical alerts at the moment.
                            </p>

                        </div>

                    </div>

                </div>

            ) : (

                <div>

                    {alerts.map((alert) => {

                        const Icon =
                            alert.icon;


                        return (

                            <div
                                key={alert.key}
                                className="
                                    group
                                    border-b
                                    border-zinc-800/80
                                    p-4
                                    transition
                                    last:border-b-0
                                    hover:bg-zinc-800/30
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
                                        className={`
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg
                                            border
                                            ${alert.className}
                                        `}
                                    >

                                        <Icon
                                            size={18}
                                        />

                                    </div>


                                    <div className="min-w-0 flex-1">

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                            "
                                        >

                                            <p
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-zinc-200
                                                "
                                            >
                                                {alert.title}
                                            </p>


                                            <span
                                                className={`
                                                    hidden
                                                    rounded-md
                                                    px-2
                                                    py-1
                                                    text-[10px]
                                                    font-medium
                                                    sm:inline-flex
                                                    ${alert.badge}
                                                `}
                                            >
                                                Attention
                                            </span>

                                        </div>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                leading-5
                                                text-zinc-500
                                            "
                                        >
                                            {alert.description}
                                        </p>

                                    </div>


                                    <ChevronRight
                                        size={16}
                                        className="
                                            shrink-0
                                            text-zinc-700
                                            transition
                                            group-hover:translate-x-0.5
                                            group-hover:text-zinc-400
                                        "
                                    />

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </section>

    );

}


export default DashboardAlerts;