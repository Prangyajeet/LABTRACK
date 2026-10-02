import {
    Eye,
    Pencil,
    Trash2,
    RotateCcw,
    Package,
    AlertTriangle,
    Calendar,
    Building2,
    ShieldAlert
} from "lucide-react";

function ItemTable({
    items = [],
    loading,
    onView,
    onEdit,
    onDelete,
    onRestore
}) {

    if (loading) {
        return (
            <div className="bg-[#111827] border border-[#24324d] rounded-2xl p-10 text-center">
                <p className="text-[#8b949e] text-sm">
                    Loading items...
                </p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="bg-[#111827] border border-[#24324d] rounded-2xl p-10 text-center">

                <Package
                    size={48}
                    className="mx-auto text-[#58a6ff] mb-4"
                />

                <h2 className="text-xl font-semibold text-[#e6edf3]">
                    No Items Found
                </h2>

                <p className="text-[#8b949e] mt-2 text-sm">
                    Start by creating your first laboratory item.
                </p>

            </div>
        );
    }

    return (
        <div className="bg-[#111827] border border-[#24324d] rounded-2xl overflow-hidden">

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    {/* ================= HEADER ================= */}

                    <thead className="bg-[#1a2945]">

                        <tr>

                            <th className="px-6 py-4 text-left text-[12px] font-semibold uppercase tracking-wider text-[#58a6ff]">
                                Item
                            </th>

                            <th className="px-6 py-4 text-left text-[12px] font-semibold uppercase tracking-wider text-[#38bdf8]">
                                Category
                            </th>

                            <th className="px-6 py-4 text-left text-[12px] font-semibold uppercase tracking-wider text-[#a78bfa]">
                                Supplier
                            </th>

                            <th className="px-6 py-4 text-left text-[12px] font-semibold uppercase tracking-wider text-[#3fb950]">
                                Manufacturer
                            </th>

                            <th className="px-6 py-4 text-left text-[12px] font-semibold uppercase tracking-wider text-[#c084fc]">
                                Brand
                            </th>

                            <th className="px-6 py-4 text-center text-[12px] font-semibold uppercase tracking-wider text-[#3fb950]">
                                Stock
                            </th>

                            <th className="px-6 py-4 text-center text-[12px] font-semibold uppercase tracking-wider text-[#58a6ff]">
                                Expiry
                            </th>

                            <th className="px-6 py-4 text-center text-[12px] font-semibold uppercase tracking-wider text-[#d29922]">
                                Hazard
                            </th>

                            <th className="px-6 py-4 text-center text-[12px] font-semibold uppercase tracking-wider text-[#22c55e]">
                                Status
                            </th>

                            <th className="px-6 py-4 text-center text-[12px] font-semibold uppercase tracking-wider text-[#f472b6]">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    {/* ================= BODY ================= */}

                    <tbody>

                        {items.map((item, index) => {

                            const rowColors = [
                                "hover:bg-[#16213a]",
                                "hover:bg-[#132238]",
                                "hover:bg-[#171d38]",
                                "hover:bg-[#182b28]",
                                "hover:bg-[#201a35]",
                                "hover:bg-[#292218]"
                            ];

                            return (

                                <tr
                                    key={item.id}
                                    className={`
                                        border-t
                                        border-[#24324d]
                                        transition-colors
                                        duration-200
                                        ${rowColors[index % rowColors.length]}
                                    `}
                                >

                                    {/* ================= ITEM ================= */}

                                    <td className="px-6 py-4">

                                        <div>

                                            <p className="font-semibold text-[#e6edf3] text-[14px]">
                                                {item.itemName}
                                            </p>

                                            <p className="text-[12px] text-[#58a6ff] mt-1">
                                                {item.itemCode}
                                            </p>

                                        </div>

                                    </td>

                                    {/* ================= CATEGORY ================= */}

                                    <td className="px-6 py-4">

                                        <span className="text-[#38bdf8] font-medium text-[14px]">
                                            {item.categoryName}
                                        </span>

                                    </td>

                                    {/* ================= SUPPLIER ================= */}

                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-2">

                                            <Building2
                                                size={16}
                                                className="text-[#a78bfa]"
                                            />

                                            <span className="text-[#c4b5fd] font-medium text-[14px]">
                                                {item.supplierName || "-"}
                                            </span>

                                        </div>

                                    </td>

                                    {/* ================= MANUFACTURER ================= */}

                                    <td className="px-6 py-4">

                                        <span className="text-[#4ade80] font-medium text-[14px]">
                                            {item.manufacturerName || "-"}
                                        </span>

                                    </td>

                                    {/* ================= BRAND ================= */}

                                    <td className="px-6 py-4">

                                        <span className="text-[#c084fc] font-medium text-[14px]">
                                            {item.brandName || "-"}
                                        </span>

                                    </td>

                                    {/* ================= STOCK ================= */}

                                    <td className="px-6 py-4 text-center">

                                        {item.currentStock <= item.minimumStock ? (

                                            <div className="flex items-center justify-center gap-2">

                                                <AlertTriangle
                                                    size={16}
                                                    className="text-[#f85149]"
                                                />

                                                <span className="font-semibold text-[#f85149] text-[14px]">
                                                    {item.currentStock}
                                                </span>

                                            </div>

                                        ) : (

                                            <span className="font-semibold text-[#3fb950] text-[14px]">
                                                {item.currentStock}
                                            </span>

                                        )}

                                    </td>

                                    {/* ================= EXPIRY ================= */}

                                    <td className="px-6 py-4 text-center">

                                        <div className="flex items-center justify-center gap-2">

                                            <Calendar
                                                size={15}
                                                className="text-[#58a6ff]"
                                            />

                                            <span className="text-[#7dd3fc] font-medium text-[14px]">
                                                {item.expiryDate || "-"}
                                            </span>

                                        </div>

                                    </td>

                                    {/* ================= HAZARD ================= */}

                                    <td className="px-6 py-4 text-center">

                                        {item.hazardLevel ? (

                                            <div className="flex items-center justify-center gap-2">

                                                <ShieldAlert
                                                    size={15}
                                                    className="text-[#d29922]"
                                                />

                                                <span className="text-[#f59e0b] font-medium text-[14px]">
                                                    {item.hazardLevel}
                                                </span>

                                            </div>

                                        ) : (

                                            <span className="text-[#6b7280]">
                                                -
                                            </span>

                                        )}

                                    </td>

                                    {/* ================= STATUS ================= */}

                                    <td className="px-6 py-4 text-center">

                                        {item.status === "ACTIVE" ? (

                                            <span className="
                                                inline-flex
                                                items-center
                                                rounded-full
                                                border
                                                border-[#238636]
                                                bg-[#0d2a1f]
                                                px-3
                                                py-1
                                                text-[11px]
                                                font-semibold
                                                text-[#3fb950]
                                            ">
                                                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#3fb950]" />
                                                ACTIVE
                                            </span>

                                        ) : (

                                            <span className="
                                                inline-flex
                                                items-center
                                                rounded-full
                                                border
                                                border-[#da3633]
                                                bg-[#2a1515]
                                                px-3
                                                py-1
                                                text-[11px]
                                                font-semibold
                                                text-[#f85149]
                                            ">
                                                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#f85149]" />
                                                INACTIVE
                                            </span>

                                        )}

                                    </td>

                                    {/* ================= ACTIONS ================= */}

                                    <td className="px-6 py-4">

                                        <div className="flex justify-center gap-3">

                                            {item.status === "ACTIVE" ? (

                                                <>

                                                    {/* VIEW */}

                                                    <button
                                                        onClick={() =>
                                                            onView(item)
                                                        }
                                                        className="
                                                            text-[#58a6ff]
                                                            hover:text-[#79c0ff]
                                                            transition
                                                        "
                                                        title="View Item"
                                                    >

                                                        <Eye size={18} />

                                                    </button>

                                                    {/* EDIT */}

                                                    <button
                                                        onClick={() =>
                                                            onEdit(item)
                                                        }
                                                        className="
                                                            text-[#22d3ee]
                                                            hover:text-[#67e8f9]
                                                            transition
                                                        "
                                                        title="Edit Item"
                                                    >

                                                        <Pencil size={18} />

                                                    </button>

                                                    {/* DELETE */}

                                                    <button
                                                        onClick={() =>
                                                            onDelete(item)
                                                        }
                                                        className="
                                                            text-[#f85149]
                                                            hover:text-[#ff7b72]
                                                            transition
                                                        "
                                                        title="Delete Item"
                                                    >

                                                        <Trash2 size={18} />

                                                    </button>

                                                </>

                                            ) : (

                                                /* RESTORE */

                                                <button
                                                    onClick={() =>
                                                        onRestore(item)
                                                    }
                                                    className="
                                                        text-[#3fb950]
                                                        hover:text-[#56d364]
                                                        transition
                                                    "
                                                    title="Restore Item"
                                                >

                                                    <RotateCcw size={18} />

                                                </button>

                                            )}

                                        </div>

                                    </td>

                                </tr>

                            );

                        })}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default ItemTable;