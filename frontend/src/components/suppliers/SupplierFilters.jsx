import {
    Search,
    RefreshCw,
    Download,
    Plus,
    ArrowUpAZ,
    ArrowDownAZ
} from "lucide-react";

function SupplierFilters({
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    refreshSuppliers,
    onAdd,
    onExport
}) {

    return (

        <div className="
            rounded-xl
            border
            border-[#263653]
            bg-[#111827]
            p-6
        ">

            <div className="
                grid
                grid-cols-1
                gap-4
                lg:grid-cols-12
            ">

                {/* SEARCH */}

                <div className="
                    relative
                    lg:col-span-4
                ">

                    <Search
                        size={18}
                        className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-cyan-400
                        "
                    />

                    <input
                        type="text"
                        placeholder="Search supplier..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="
                            w-full
                            rounded-xl
                            border
                            border-[#31415f]
                            bg-[#1c2a42]
                            py-3
                            pl-10
                            pr-4
                            text-sm
                            text-[#e6edf3]
                            placeholder:text-slate-500
                            outline-none
                            transition
                            focus:border-cyan-500
                            focus:ring-2
                            focus:ring-cyan-500/20
                        "
                    />

                </div>


                {/* SORT BY */}

                <div className="lg:col-span-2">

                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(e.target.value)
                        }
                        className="
                            w-full
                            cursor-pointer
                            rounded-xl
                            border
                            border-[#31415f]
                            bg-[#1c2a42]
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-cyan-300
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-500/20
                        "
                    >

                        <option
                            value="supplierName"
                            className="bg-[#111827] text-white"
                        >
                            Supplier Name
                        </option>

                        <option
                            value="contactPerson"
                            className="bg-[#111827] text-white"
                        >
                            Contact Person
                        </option>

                        <option
                            value="email"
                            className="bg-[#111827] text-white"
                        >
                            Email
                        </option>

                        <option
                            value="createdAt"
                            className="bg-[#111827] text-white"
                        >
                            Created Date
                        </option>

                    </select>

                </div>


                {/* SORT DIRECTION */}

                <div className="lg:col-span-2">

                    <button
                        type="button"
                        onClick={() =>
                            setSortDirection(
                                sortDirection === "asc"
                                    ? "desc"
                                    : "asc"
                            )
                        }
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-[#31415f]
                            bg-[#1c2a42]
                            py-3
                            text-sm
                            font-medium
                            text-blue-300
                            transition
                            hover:border-blue-500
                            hover:bg-[#223452]
                            hover:text-blue-200
                        "
                    >

                        {sortDirection === "asc" ? (
                            <ArrowUpAZ
                                size={18}
                                className="text-blue-400"
                            />
                        ) : (
                            <ArrowDownAZ
                                size={18}
                                className="text-blue-400"
                            />
                        )}

                        {sortDirection === "asc"
                            ? "Ascending"
                            : "Descending"
                        }

                    </button>

                </div>


                {/* REFRESH */}

                <div className="lg:col-span-1">

                    <button
                        type="button"
                        onClick={refreshSuppliers}
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-[#31415f]
                            bg-[#1c2a42]
                            py-3
                            text-blue-300
                            transition
                            hover:border-blue-500
                            hover:bg-[#223452]
                            hover:text-blue-200
                        "
                        title="Refresh suppliers"
                    >

                        <RefreshCw size={18} />

                    </button>

                </div>


                {/* EXPORT */}

                <div className="lg:col-span-1">

                    <button
                        type="button"
                        onClick={onExport}
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            rounded-xl
                            bg-emerald-600
                            py-3
                            text-white
                            transition
                            hover:bg-emerald-500
                            hover:shadow-lg
                            hover:shadow-emerald-500/10
                        "
                        title="Export suppliers"
                    >

                        <Download size={18} />

                    </button>

                </div>


                {/* ADD SUPPLIER */}

                <div className="lg:col-span-2">

                    <button
                        type="button"
                        onClick={onAdd}
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-cyan-600
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-cyan-500
                            hover:shadow-lg
                            hover:shadow-cyan-500/10
                        "
                    >

                        <Plus size={18} />

                        Add Supplier

                    </button>

                </div>

            </div>

        </div>

    );
}

export default SupplierFilters;