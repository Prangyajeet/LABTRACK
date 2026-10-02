import {
    Package,
    Boxes,
    CheckCircle2,
    AlertTriangle
} from "lucide-react";

function ItemStats({ items = [] }) {

    const totalItems = items.length;

    const consumables = items.filter(
        (item) =>
            item.itemType?.toUpperCase() === "CONSUMABLE"
    ).length;

    const nonConsumables = items.filter(
        (item) =>
            item.itemType?.toUpperCase() === "NON_CONSUMABLE" ||
            item.itemType?.toUpperCase() === "NON-CONSUMABLE"
    ).length;

    const lowStock = items.filter(
        (item) =>
            Number(item.currentStock) <=
            Number(item.minimumStock)
    ).length;

    const stats = [
        {
            label: "Total Items",
            value: totalItems,
            icon: Package,

            // BLUE
            labelClass: "text-[#58a6ff]",
            iconClass: "bg-[#1f6feb] text-white"
        },
        {
            label: "Consumables",
            value: consumables,
            icon: Boxes,

            // GREEN
            labelClass: "text-[#3fb950]",
            iconClass: "bg-[#009e70] text-white"
        },
        {
            label: "Non-Consumables",
            value: nonConsumables,
            icon: CheckCircle2,

            // PURPLE
            labelClass: "text-[#a371f7]",
            iconClass: "bg-[#7c3aed] text-white"
        },
        {
            label: "Low Stock",
            value: lowStock,
            icon: AlertTriangle,

            // RED
            labelClass: "text-[#f85149]",
            iconClass: "bg-[#f00014] text-white"
        }
    ];

    return (
        <div className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
        ">

            {stats.map((stat) => {

                const Icon = stat.icon;

                return (
                    <div
                        key={stat.label}
                        className="
                            group
                            relative
                            rounded-xl
                            border
                            border-[#24324d]
                            bg-[#111827]
                            px-5
                            py-5
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:border-[#334d73]
                        "
                    >

                        {/* TOP ROW */}

                        <div className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        ">

                            {/* COLORFUL LABEL */}

                            <p
                                className={`
                                    text-[13px]
                                    font-semibold
                                    tracking-wide
                                    ${stat.labelClass}
                                `}
                            >
                                {stat.label}
                            </p>

                            {/* COLORFUL ICON BOX */}

                            <div
                                className={`
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    ${stat.iconClass}
                                    shadow-sm
                                    transition-transform
                                    duration-200
                                    group-hover:scale-105
                                `}
                            >
                                <Icon
                                    size={23}
                                    strokeWidth={2}
                                />
                            </div>

                        </div>

                        {/* NUMBER */}

                        <p className="
                            mt-3
                            text-[28px]
                            font-bold
                            leading-none
                            text-[#e6edf3]
                        ">
                            {stat.value}
                        </p>

                    </div>
                );

            })}

        </div>
    );
}

export default ItemStats;