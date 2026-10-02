import {
    Eye,
    Pencil,
    Trash2,
    RotateCcw,
    Truck,
    Phone
} from "lucide-react";

function SupplierTable({
    suppliers = [],
    loading,
    onView,
    onContact,
    onEdit,
    onDelete,
    onRestore
}) {

    if (loading) {

        return (

            <div className="
                rounded-xl
                border
                border-[#263653]
                bg-[#111827]
                p-10
                text-center
            ">

                <p className="
                    text-sm
                    text-blue-300
                ">
                    Loading suppliers...
                </p>

            </div>

        );

    }


    if (suppliers.length === 0) {

        return (

            <div className="
                rounded-xl
                border
                border-[#263653]
                bg-[#111827]
                p-10
                text-center
            ">

                <Truck
                    size={48}
                    className="
                        mx-auto
                        mb-4
                        text-cyan-400
                    "
                />

                <h2 className="
                    text-xl
                    font-semibold
                    text-white
                ">
                    No Suppliers Found
                </h2>

                <p className="
                    mt-2
                    text-sm
                    text-slate-400
                ">
                    Start by creating your first supplier.
                </p>

            </div>

        );

    }


    return (

        <div className="
            overflow-hidden
            rounded-xl
            border
            border-[#263653]
            bg-[#111827]
        ">

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead className="bg-[#1a2b4d]">

                        <tr>

                            <th className="
                                whitespace-nowrap
                                px-6
                                py-4
                                text-left
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wider
                                text-cyan-300
                            ">
                                Supplier
                            </th>

                            <th className="
                                whitespace-nowrap
                                px-6
                                py-4
                                text-left
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wider
                                text-blue-300
                            ">
                                Code
                            </th>

                            <th className="
                                whitespace-nowrap
                                px-6
                                py-4
                                text-left
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wider
                                text-violet-300
                            ">
                                Contact Person
                            </th>

                            <th className="
                                whitespace-nowrap
                                px-6
                                py-4
                                text-left
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wider
                                text-cyan-300
                            ">
                                Phone
                            </th>

                            <th className="
                                whitespace-nowrap
                                px-6
                                py-4
                                text-left
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wider
                                text-purple-300
                            ">
                                Email
                            </th>

                            <th className="
                                whitespace-nowrap
                                px-6
                                py-4
                                text-left
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wider
                                text-amber-300
                            ">
                                GST Number
                            </th>

                            <th className="
                                whitespace-nowrap
                                px-6
                                py-4
                                text-center
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wider
                                text-emerald-300
                            ">
                                Status
                            </th>

                            <th className="
                                whitespace-nowrap
                                px-6
                                py-4
                                text-center
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wider
                                text-blue-300
                            ">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {suppliers.map((supplier, index) => {

                            const rowColors = [
                                "border-cyan-500/10",
                                "border-blue-500/10",
                                "border-violet-500/10",
                                "border-emerald-500/10",
                                "border-amber-500/10",
                                "border-purple-500/10"
                            ];

                            const rowBorder =
                                rowColors[index % rowColors.length];

                            return (

                                <tr
                                    key={supplier.id}
                                    className={`
                                        border-t
                                        ${rowBorder}
                                        transition
                                        duration-200
                                        hover:bg-[#18263e]
                                    `}
                                >

                                    {/* SUPPLIER */}

                                    <td className="px-6 py-5">

                                        <div>

                                            <p className="
                                                text-sm
                                                font-semibold
                                                text-white
                                            ">
                                                {supplier.supplierName}
                                            </p>

                                            <p className="
                                                mt-1
                                                text-xs
                                                text-cyan-400
                                            ">
                                                {supplier.city || "-"}
                                            </p>

                                        </div>

                                    </td>


                                    {/* CODE */}

                                    <td className="
                                        whitespace-nowrap
                                        px-6
                                        py-5
                                        text-sm
                                        font-medium
                                        text-blue-300
                                    ">
                                        {supplier.supplierCode || "-"}
                                    </td>


                                    {/* CONTACT */}

                                    <td className="
                                        px-6
                                        py-5
                                        text-sm
                                        font-medium
                                        text-violet-300
                                    ">
                                        {supplier.contactPerson || "-"}
                                    </td>


                                    {/* PHONE */}

                                    <td className="px-6 py-5">

                                        {supplier.phoneNumber ? (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onContact &&
                                                    onContact(supplier)
                                                }
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    text-sm
                                                    font-medium
                                                    text-cyan-400
                                                    transition
                                                    hover:text-cyan-300
                                                    hover:underline
                                                    focus:outline-none
                                                "
                                                title="Contact Supplier"
                                            >

                                                <Phone size={15} />

                                                <span>
                                                    {supplier.phoneNumber}
                                                </span>

                                            </button>

                                        ) : (

                                            <span className="
                                                text-sm
                                                text-slate-600
                                            ">
                                                -
                                            </span>

                                        )}

                                    </td>


                                    {/* EMAIL */}

                                    <td className="
                                        px-6
                                        py-5
                                        text-sm
                                        font-medium
                                        text-purple-300
                                    ">
                                        {supplier.email || "-"}
                                    </td>


                                    {/* GST */}

                                    <td className="
                                        px-6
                                        py-5
                                        text-sm
                                        font-medium
                                        text-amber-300
                                    ">
                                        {supplier.gstNumber || "-"}
                                    </td>


                                    {/* STATUS */}

                                    <td className="
                                        px-6
                                        py-5
                                        text-center
                                    ">

                                        {supplier.status === "ACTIVE" ? (

                                            <span className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                border
                                                border-emerald-500/30
                                                bg-emerald-500/10
                                                px-3
                                                py-1
                                                text-xs
                                                font-semibold
                                                text-emerald-400
                                            ">

                                                <span className="
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full
                                                    bg-emerald-400
                                                " />

                                                ACTIVE

                                            </span>

                                        ) : (

                                            <span className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                border
                                                border-red-500/30
                                                bg-red-500/10
                                                px-3
                                                py-1
                                                text-xs
                                                font-semibold
                                                text-red-400
                                            ">

                                                <span className="
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full
                                                    bg-red-400
                                                " />

                                                INACTIVE

                                            </span>

                                        )}

                                    </td>


                                    {/* ACTIONS */}

                                    <td className="px-6 py-5">

                                        <div className="
                                            flex
                                            items-center
                                            justify-center
                                            gap-3
                                        ">

                                            {/* VIEW */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onView &&
                                                    onView(supplier)
                                                }
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-blue-500/20
                                                    bg-blue-500/5
                                                    p-1.5
                                                    text-blue-400
                                                    transition
                                                    hover:border-blue-500/40
                                                    hover:bg-blue-500/10
                                                    hover:text-blue-300
                                                "
                                                title="View Supplier"
                                            >
                                                <Eye size={17} />
                                            </button>


                                            {supplier.status === "ACTIVE" ? (

                                                <>

                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onEdit &&
                                                            onEdit(supplier)
                                                        }
                                                        className="
                                                            rounded-lg
                                                            border
                                                            border-cyan-500/20
                                                            bg-cyan-500/5
                                                            p-1.5
                                                            text-cyan-400
                                                            transition
                                                            hover:border-cyan-500/40
                                                            hover:bg-cyan-500/10
                                                            hover:text-cyan-300
                                                        "
                                                        title="Edit Supplier"
                                                    >
                                                        <Pencil size={17} />
                                                    </button>


                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onDelete &&
                                                            onDelete(supplier)
                                                        }
                                                        className="
                                                            rounded-lg
                                                            border
                                                            border-red-500/20
                                                            bg-red-500/5
                                                            p-1.5
                                                            text-red-400
                                                            transition
                                                            hover:border-red-500/40
                                                            hover:bg-red-500/10
                                                            hover:text-red-300
                                                        "
                                                        title="Delete Supplier"
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>

                                                </>

                                            ) : (

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onRestore &&
                                                        onRestore(supplier)
                                                    }
                                                    className="
                                                        rounded-lg
                                                        border
                                                        border-emerald-500/20
                                                        bg-emerald-500/5
                                                        p-1.5
                                                        text-emerald-400
                                                        transition
                                                        hover:border-emerald-500/40
                                                        hover:bg-emerald-500/10
                                                        hover:text-emerald-300
                                                    "
                                                    title="Restore Supplier"
                                                >
                                                    <RotateCcw size={17} />
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

export default SupplierTable;