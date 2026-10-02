import { Search, SlidersHorizontal } from "lucide-react";

function DepartmentFilters({
    search,
    setSearch,
    status,
    setStatus
}) {

    return (

        <div className="
            rounded-2xl
            border
            border-blue-900/40
            bg-gradient-to-br
            from-[#0b1733]
            via-[#0a142d]
            to-[#081126]
            p-4
            shadow-[0_10px_35px_rgba(0,0,0,0.25)]
        ">

            <div className="
                flex
                flex-col
                gap-3
                lg:flex-row
                lg:items-center
            ">

                <div className="relative flex-1">

                    <Search
                        size={17}
                        className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-slate-500
                        "
                    />

                    <input
                        type="text"
                        placeholder="Search departments..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        className="
                            w-full
                            rounded-xl
                            border
                            border-blue-900/40
                            bg-[#070d1d]
                            py-3
                            pl-11
                            pr-4
                            text-sm
                            text-white
                            placeholder:text-slate-600
                            outline-none
                            transition
                            focus:border-blue-500/70
                            focus:ring-2
                            focus:ring-blue-500/10
                        "
                    />

                </div>

                <div className="relative">

                    <SlidersHorizontal
                        size={15}
                        className="
                            pointer-events-none
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-slate-500
                        "
                    />

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(event.target.value)
                        }
                        className="
                            w-full
                            min-w-[190px]
                            appearance-none
                            rounded-xl
                            border
                            border-blue-900/40
                            bg-[#070d1d]
                            py-3
                            pl-10
                            pr-9
                            text-sm
                            text-slate-300
                            outline-none
                            transition
                            focus:border-blue-500/70
                        "
                    >

                        <option value="ALL">
                            All Departments
                        </option>

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="INACTIVE">
                            Inactive
                        </option>

                    </select>

                </div>

            </div>

        </div>

    );

}

export default DepartmentFilters;