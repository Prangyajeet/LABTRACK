import {
    RefreshCw
} from "lucide-react";


function DashboardHeader({
    onRefresh,
    loading
}) {

    return (

        <div
            className="
                flex
                flex-col
                gap-5
                border-b
                border-zinc-800/80
                pb-6
                md:flex-row
                md:items-end
                md:justify-between
            "
        >

            <div>

                <div
                    className="
                        mb-2
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
                            bg-emerald-400
                            shadow-[0_0_8px_rgba(52,211,153,0.5)]
                        "
                    />

                    <p
                        className="
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-[0.16em]
                            text-zinc-500
                        "
                    >
                        Laboratory Overview
                    </p>

                </div>


                <h1
                    className="
                        text-3xl
                        font-semibold
                        tracking-tight
                        text-zinc-100
                    "
                >
                    Dashboard
                </h1>


                <p
                    className="
                        mt-2
                        max-w-2xl
                        text-sm
                        leading-6
                        text-zinc-500
                    "
                >
                    Monitor inventory, equipment, maintenance and laboratory activity from one place.
                </p>

            </div>


            <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                className="
                    group
                    inline-flex
                    w-fit
                    items-center
                    gap-2.5
                    rounded-lg
                    border
                    border-zinc-800
                    bg-zinc-900/80
                    px-4
                    py-2.5
                    text-xs
                    font-medium
                    text-zinc-300
                    shadow-sm
                    transition-all
                    duration-200
                    hover:border-zinc-700
                    hover:bg-zinc-800
                    hover:text-white
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >

                <RefreshCw
                    size={15}
                    className={`
                        transition-transform
                        duration-500
                        ${
                            loading
                                ? "animate-spin"
                                : "group-hover:rotate-180"
                        }
                    `}
                />

                {loading
                    ? "Refreshing..."
                    : "Refresh"
                }

            </button>

        </div>

    );

}


export default DashboardHeader;