import {
    Package,
    FlaskConical,
    AlertTriangle,
    Wrench,
    CalendarClock,
    TrendingUp
} from "lucide-react";

function StatCard({
    label,
    value,
    subLabel,
    footer,
    icon: Icon,
    iconBg,
    iconColor,
    accentColor,
    footerColor,
    alert = false
}) {
    return (
        <div
            className="
                group
                relative
                min-w-0
                rounded-[10px]
                border
                border-[#21262d]
                bg-[#161b22]
                px-6
                py-5
                transition-all
                duration-200
                hover:-translate-y-[1px]
                hover:border-[#30363d]
            "
        >
            {/* Top Row */}
            <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                    <div className="flex items-center gap-2">

                        <p
                            className="truncate text-[11px] font-semibold uppercase tracking-[0.14em]"
                            style={{
                                color: accentColor
                            }}
                        >
                            {label}
                        </p>

                        {alert && (
                            <span
                                className="
                                    h-1.5
                                    w-1.5
                                    flex-shrink-0
                                    rounded-full
                                    bg-[#f85149]
                                "
                            />
                        )}

                    </div>

                </div>

                {/* Icon */}
                <div
                    className="
                        flex
                        h-10
                        w-10
                        flex-shrink-0
                        items-center
                        justify-center
                        rounded-[10px]
                        border
                        transition-transform
                        duration-200
                        group-hover:scale-105
                    "
                    style={{
                        backgroundColor: iconBg,
                        borderColor: `${iconColor}30`
                    }}
                >
                    <Icon
                        size={20}
                        strokeWidth={2}
                        style={{
                            color: iconColor
                        }}
                    />
                </div>

            </div>

            {/* Number */}
            <div className="mt-3">

                <p
                    className="
                        text-[28px]
                        font-bold
                        leading-none
                        tracking-tight
                        text-[#e6edf3]
                    "
                >
                    {value}
                </p>

                <p
                    className="
                        mt-2
                        text-[12px]
                        font-medium
                    "
                    style={{
                        color: "#8b949e"
                    }}
                >
                    {subLabel}
                </p>

            </div>

            {/* Divider */}
            <div
                className="
                    my-4
                    h-px
                    w-full
                    bg-[#21262d]
                "
            />

            {/* Footer */}
            <div className="flex items-center gap-2">

                <TrendingUp
                    size={13}
                    strokeWidth={2}
                    style={{
                        color: footerColor
                    }}
                />

                <p
                    className="
                        text-[11px]
                        font-medium
                        tracking-wide
                    "
                    style={{
                        color: footerColor
                    }}
                >
                    {footer}
                </p>

            </div>

        </div>
    );
}


function DashboardStats({
    inventory = [],
    lowStock = [],
    expiringSoon = [],
    equipment = [],
    maintenanceDue = []
}) {

    /*
     * Keep these values connected to the existing dashboard data.
     * No demo numbers are introduced here.
     */

    const inventoryCount = Array.isArray(inventory)
        ? inventory.length
        : Number(inventory || 0);

    const lowStockCount = Array.isArray(lowStock)
        ? lowStock.length
        : Number(lowStock || 0);

    const expiringSoonCount = Array.isArray(expiringSoon)
        ? expiringSoon.length
        : Number(expiringSoon || 0);

    const equipmentCount = Array.isArray(equipment)
        ? equipment.length
        : Number(equipment || 0);

    const maintenanceDueCount = Array.isArray(maintenanceDue)
        ? maintenanceDue.length
        : Number(maintenanceDue || 0);

    /*
     * Consumables:
     * If inventory is an array, count items marked as consumable.
     * Otherwise fall back to inventory count.
     */
    const consumablesCount = Array.isArray(inventory)
        ? inventory.filter(
              (item) =>
                  item?.consumable === true ||
                  item?.isConsumable === true ||
                  item?.itemType === "CONSUMABLE" ||
                  item?.type === "CONSUMABLE"
          ).length
        : inventoryCount;

    return (

        <div
            className="
                grid
                grid-cols-1
                gap-[14px]
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-5
            "
        >

            {/* =====================================================
                INVENTORY ITEMS
            ====================================================== */}

            <StatCard
                label="Inventory Items"
                value={inventoryCount}
                subLabel="Current total"
                footer="LabTrack system metric"
                icon={Package}
                iconBg="#1a2332"
                iconColor="#58a6ff"
                accentColor="#58a6ff"
                footerColor="#58a6ff"
            />

            {/* =====================================================
                CONSUMABLES
            ====================================================== */}

            <StatCard
                label="Consumables"
                value={consumablesCount}
                subLabel="Current total"
                footer="LabTrack system metric"
                icon={FlaskConical}
                iconBg="#0d2a1f"
                iconColor="#3fb950"
                accentColor="#3fb950"
                footerColor="#3fb950"
            />

            {/* =====================================================
                LOW STOCK
            ====================================================== */}

            <StatCard
                label="Low Stock"
                value={lowStockCount}
                subLabel="Requires attention"
                footer="Attention required"
                icon={AlertTriangle}
                iconBg="#2a1e0d"
                iconColor="#d29922"
                accentColor="#d29922"
                footerColor="#f85149"
                alert={true}
            />

            {/* =====================================================
                EQUIPMENT
            ====================================================== */}

            <StatCard
                label="Equipment"
                value={equipmentCount}
                subLabel="Current total"
                footer="LabTrack system metric"
                icon={Wrench}
                iconBg="#2d2250"
                iconColor="#a371f7"
                accentColor="#a371f7"
                footerColor="#a371f7"
            />

            {/* =====================================================
                MAINTENANCE DUE
            ====================================================== */}

            <StatCard
                label="Maintenance Due"
                value={maintenanceDueCount}
                subLabel="Current total"
                footer="LabTrack system metric"
                icon={CalendarClock}
                iconBg="#1a1a2a"
                iconColor="#58a6ff"
                accentColor="#58a6ff"
                footerColor="#58a6ff"
            />

        </div>
    );
}

export default DashboardStats;