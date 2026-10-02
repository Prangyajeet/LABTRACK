import InventoryActivityChart from "./InventoryActivityChart";
import EquipmentStatusChart from "./EquipmentStatusChart";
import CategoryDistributionChart from "./CategoryDistributionChart";

function DashboardCharts({
    transactions = [],
    equipment = [],
    inventory = []
}) {
    return (
        <section className="space-y-7">

            {/* =====================================================
                ANALYTICS HEADER
            ===================================================== */}

            <div>
                <p
                    className="
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-[0.15em]
                        text-[#58a6ff]
                    "
                >
                    Insights
                </p>

                <h2
                    className="
                        mt-1
                        text-[22px]
                        font-semibold
                        tracking-tight
                        text-[#e6edf3]
                    "
                >
                    Analytics Overview
                </h2>

                <p
                    className="
                        mt-1
                        text-[13px]
                        text-[#8b949e]
                    "
                >
                    Key laboratory inventory and equipment insights.
                </p>
            </div>


            {/* =====================================================
                INVENTORY + EQUIPMENT
            ===================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-5
                    xl:grid-cols-[1.35fr_1fr]
                "
            >

                {/* INVENTORY ACTIVITY */}

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
                    <InventoryActivityChart
                        transactions={transactions}
                    />
                </div>


                {/* EQUIPMENT STATUS */}

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
                    <EquipmentStatusChart
                        equipment={equipment}
                    />
                </div>

            </div>


            {/* =====================================================
                CATEGORY DISTRIBUTION
            ===================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-5
                    xl:grid-cols-[1.35fr_1fr]
                "
            >

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
                    <CategoryDistributionChart
                        inventory={inventory}
                    />
                </div>

            </div>

        </section>
    );
}

export default DashboardCharts;