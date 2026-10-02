import DashboardHeader from "./DashboardHeader";

import DashboardStats from "./DashboardStats";
import DashboardAlerts from "./DashboardAlerts";
import RecentActivity from "./RecentActivity";
import DashboardCharts from "./DashboardCharts";
import QuickActions from "./QuickActions";

import useDashboard from "../../hooks/useDashboard";

function Dashboard() {

    const {
        inventory,
        lowStock,
        expired,
        expiringSoon,
        transactions,
        equipment,
        maintenanceDue,
        loading,
        error,
        refreshDashboard
    } = useDashboard();

    return (
        <>
            {/* =========================================================
                DASHBOARD TYPOGRAPHY + NAVY THEME
            ========================================================= */}

            <style>{`

                /* =====================================================
                   DASHBOARD BASE
                ===================================================== */

                .labtrack-dashboard {
                    color: #e2e8f0;
                    font-size: 15px;
                }


                /* =====================================================
                   NAVY CARD COLORS
                ===================================================== */

                .labtrack-dashboard .bg-zinc-950,
                .labtrack-dashboard .bg-zinc-950\\/40,
                .labtrack-dashboard .bg-zinc-950\\/60,
                .labtrack-dashboard .bg-zinc-950\\/80,
                .labtrack-dashboard .bg-zinc-900,
                .labtrack-dashboard .bg-zinc-900\\/40,
                .labtrack-dashboard .bg-zinc-900\\/50,
                .labtrack-dashboard .bg-zinc-900\\/60,
                .labtrack-dashboard .bg-zinc-900\\/70 {
                    background-color: #111a2e !important;
                }


                /* =====================================================
                   INNER NAVY AREAS
                ===================================================== */

                .labtrack-dashboard .bg-zinc-800 {
                    background-color: #1b2941 !important;
                }


                /* =====================================================
                   CARD BORDERS
                ===================================================== */

                .labtrack-dashboard .border-zinc-800,
                .labtrack-dashboard .border-zinc-700,
                .labtrack-dashboard .border-zinc-800\\/50,
                .labtrack-dashboard .border-zinc-800\\/60 {
                    border-color: #263653 !important;
                }


                /* =====================================================
                   MAIN DASHBOARD TITLE
                   Similar visual size to Items/Suppliers.
                ===================================================== */

                .labtrack-dashboard h1 {
                    font-size: 36px !important;
                    line-height: 1.2 !important;
                    font-weight: 700 !important;
                    letter-spacing: -0.02em;
                }


                /* =====================================================
                   SECTION HEADINGS
                ===================================================== */

                .labtrack-dashboard h2 {
                    font-size: 18px !important;
                    line-height: 1.5 !important;
                    font-weight: 600 !important;
                }

                .labtrack-dashboard h3 {
                    font-size: 16px !important;
                    line-height: 1.5 !important;
                    font-weight: 600 !important;
                }


                /* =====================================================
                   NORMAL PARAGRAPH TEXT
                ===================================================== */

                .labtrack-dashboard p {
                    font-size: 14px;
                }


                /* =====================================================
                   SECTION SUBTITLE
                ===================================================== */

                .labtrack-dashboard
                .text-sm {
                    font-size: 14px !important;
                }


                /* =====================================================
                   STAT CARD LABELS
                ===================================================== */

                .labtrack-dashboard
                .text-\\[10px\\] {
                    font-size: 12px !important;
                    line-height: 1.4 !important;
                }

                .labtrack-dashboard
                .text-\\[11px\\] {
                    font-size: 12px !important;
                    line-height: 1.5 !important;
                }


                /* =====================================================
                   STAT CARD NUMBERS
                ===================================================== */

                .labtrack-dashboard
                .text-3xl {
                    font-size: 28px !important;
                    line-height: 34px !important;
                    font-weight: 700 !important;
                }

                .labtrack-dashboard
                .text-2xl {
                    font-size: 26px !important;
                    line-height: 32px !important;
                    font-weight: 700 !important;
                }


                /* =====================================================
                   STAT CARD SUPPORTING TEXT
                ===================================================== */

                .labtrack-dashboard
                .text-xs {
                    font-size: 12px !important;
                    line-height: 1.5 !important;
                }


                /* =====================================================
                   ACTIVITY ITEM NAMES
                ===================================================== */

                .labtrack-dashboard
                .font-semibold {
                    font-size: 14px;
                }


                /* =====================================================
                   ACTIVITY META INFORMATION
                ===================================================== */

                .labtrack-dashboard
                .text-zinc-500 {
                    font-size: 12px;
                }


                /* =====================================================
                   CARD TITLES
                ===================================================== */

                .labtrack-dashboard
                .font-medium {
                    font-size: 14px;
                }


                /* =====================================================
                   INPUT TEXT
                ===================================================== */

                .labtrack-dashboard input {
                    font-size: 14px !important;
                }

                .labtrack-dashboard input::placeholder {
                    font-size: 13px;
                }


                /* =====================================================
                   SELECT TEXT
                ===================================================== */

                .labtrack-dashboard select {
                    font-size: 14px !important;
                }


                /* =====================================================
                   BUTTON TEXT
                ===================================================== */

                .labtrack-dashboard button {
                    font-size: 14px;
                }


                /* =====================================================
                   NAVY INPUT BACKGROUND
                ===================================================== */

                .labtrack-dashboard input.bg-zinc-950,
                .labtrack-dashboard input.bg-zinc-950\\/80,
                .labtrack-dashboard select.bg-zinc-900,
                .labtrack-dashboard select.bg-zinc-950 {
                    background-color: #0d172b !important;
                    border-color: #263653 !important;
                }


                /* =====================================================
                   HOVER
                ===================================================== */

                .labtrack-dashboard
                .hover\\:bg-zinc-800:hover,
                .labtrack-dashboard
                .hover\\:bg-zinc-900:hover {
                    background-color: #192742 !important;
                }


                /* =====================================================
                   CARD SHADOW
                ===================================================== */

                .labtrack-dashboard .rounded-2xl,
                .labtrack-dashboard .rounded-xl {
                    box-shadow:
                        0 8px 24px rgba(2, 8, 23, 0.16);
                }


                /* =====================================================
                   SECTION SPACING
                ===================================================== */

                .labtrack-dashboard {
                    line-height: 1.5;
                }


                /* =====================================================
                   DESKTOP
                ===================================================== */

                @media (min-width: 1440px) {

                    .labtrack-dashboard h1 {
                        font-size: 38px !important;
                    }

                    .labtrack-dashboard
                    .text-3xl {
                        font-size: 30px !important;
                    }

                    .labtrack-dashboard
                    .text-sm {
                        font-size: 15px !important;
                    }
                }


                /* =====================================================
                   LAPTOP
                ===================================================== */

                @media (max-width: 1280px) {

                    .labtrack-dashboard h1 {
                        font-size: 34px !important;
                    }

                    .labtrack-dashboard
                    .text-3xl {
                        font-size: 27px !important;
                    }
                }


                /* =====================================================
                   TABLET / MOBILE
                ===================================================== */

                @media (max-width: 768px) {

                    .labtrack-dashboard h1 {
                        font-size: 30px !important;
                    }

                    .labtrack-dashboard h2 {
                        font-size: 17px !important;
                    }

                    .labtrack-dashboard
                    .text-3xl {
                        font-size: 25px !important;
                    }

                    .labtrack-dashboard p {
                        font-size: 13px;
                    }
                }

            `}</style>


            {/* =========================================================
                DASHBOARD
            ========================================================= */}

            <div
                className="
                    labtrack-dashboard
                    min-h-full
                    space-y-10
                    pb-10
                "
            >

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <DashboardHeader
                    onRefresh={refreshDashboard}
                    loading={loading}
                />


                {/* =====================================================
                    ERROR
                ===================================================== */}

                {error && (
                    <div
                        className="
                            rounded-xl
                            border
                            border-red-500/20
                            bg-red-500/[0.06]
                            px-5
                            py-4
                            text-red-400
                            shadow-sm
                        "
                    >

                        <div className="flex items-center gap-3">

                            <span
                                className="
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-red-400
                                    animate-pulse
                                "
                            />

                            <span className="text-sm">
                                {error}
                            </span>

                        </div>

                    </div>
                )}


                {/* =====================================================
                    LABORATORY OVERVIEW
                ===================================================== */}

                <section className="space-y-5">

                    <div>

                        <p
                            className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.15em]
                                text-blue-400
                            "
                        >
                            Laboratory Overview
                        </p>

                        <p
                            className="
                                mt-2
                                text-[15px]
                                text-slate-400
                            "
                        >
                            Current inventory, equipment and maintenance status.
                        </p>

                    </div>


                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-[#263653]
                            bg-[#0d172b]
                            p-1.5
                            shadow-lg
                        "
                    >

                        <DashboardStats
                            inventory={inventory}
                            lowStock={lowStock}
                            expiringSoon={expiringSoon}
                            equipment={equipment}
                            maintenanceDue={maintenanceDue}
                        />

                    </div>

                </section>


                {/* =====================================================
                    OPERATIONAL ACTIVITY
                ===================================================== */}

                <section className="space-y-5">

                    <div>

                        <p
                            className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.15em]
                                text-blue-400
                            "
                        >
                            Operational Activity
                        </p>

                        <p
                            className="
                                mt-2
                                text-[15px]
                                text-slate-400
                            "
                        >
                            Recent inventory movements and items requiring attention.
                        </p>

                    </div>


                    {/* =================================================
                        ACTIVITY + ALERTS
                    ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-6
                            xl:grid-cols-[1.35fr_1fr]
                        "
                    >

                        {/* =================================================
                            RECENT ACTIVITY
                        ================================================= */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-[#263653]
                                bg-[#111a2e]
                                overflow-hidden
                                shadow-lg
                            "
                        >

                            <RecentActivity
                                transactions={transactions}
                            />

                        </div>


                        {/* =================================================
                            ALERTS
                        ================================================= */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-[#263653]
                                bg-[#111a2e]
                                overflow-hidden
                                shadow-lg
                            "
                        >

                            <DashboardAlerts
                                lowStock={lowStock}
                                expired={expired}
                                expiringSoon={expiringSoon}
                                maintenanceDue={maintenanceDue}
                            />

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    ANALYTICS
                ===================================================== */}

                <section className="space-y-5">

                    <div>

                        <p
                            className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.15em]
                                text-blue-400
                            "
                        >
                            Analytics Overview
                        </p>

                        <p
                            className="
                                mt-2
                                text-[15px]
                                text-slate-400
                            "
                        >
                            Operational trends across laboratory inventory and equipment.
                        </p>

                    </div>


                    <div
                        className="
                            rounded-2xl
                            border
                            border-[#263653]
                            bg-[#111a2e]
                            p-1.5
                            shadow-lg
                            overflow-hidden
                        "
                    >

                        <DashboardCharts
                            transactions={transactions}
                            equipment={equipment}
                            inventory={inventory}
                        />

                    </div>

                </section>


                {/* =====================================================
                    QUICK ACTIONS
                ===================================================== */}

                <section className="space-y-5">

                    <div>

                        <p
                            className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.15em]
                                text-blue-400
                            "
                        >
                            Quick Actions
                        </p>

                    </div>


                    <div
                        className="
                            rounded-2xl
                            border
                            border-[#263653]
                            bg-[#111a2e]
                            p-1.5
                            shadow-lg
                            overflow-hidden
                        "
                    >

                        <QuickActions />

                    </div>

                </section>

            </div>
        </>
    );
}

export default Dashboard;