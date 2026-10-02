import {
    Search,
    Download,
    Plus,
    RotateCcw
} from "lucide-react";

function ItemFilters({

    search,
    setSearch,

    sortBy,
    setSortBy,

    sortDirection,
    setSortDirection,

    refreshItems,

    onAdd,

    onExport

}) {

    return (

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

                <div className="flex flex-col md:flex-row gap-4 flex-1">

                    {/* Search */}

                    <div className="relative flex-1">

                        <Search

                            size={18}

                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"

                        />

                        <input

                            type="text"

                            value={search}

                            onChange={(e) =>

                                setSearch(e.target.value)

                            }

                            placeholder="Search item..."

                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"

                        />

                    </div>

                    {/* Sort By */}

                    <select

                        value={sortBy}

                        onChange={(e) =>

                            setSortBy(e.target.value)

                        }

                        className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"

                    >

                        <option value="itemName">

                            Item Name

                        </option>

                        <option value="itemCode">

                            Item Code

                        </option>

                        <option value="currentStock">

                            Current Stock

                        </option>

                        <option value="createdAt">

                            Created Date

                        </option>

                    </select>

                    {/* Sort Direction */}

                    <select

                        value={sortDirection}

                        onChange={(e) =>

                            setSortDirection(e.target.value)

                        }

                        className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"

                    >

                        <option value="asc">

                            Ascending

                        </option>

                        <option value="desc">

                            Descending

                        </option>

                    </select>

                </div>

                {/* Buttons */}

                <div className="flex flex-wrap gap-3">

                    <button

                        onClick={refreshItems}

                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition"

                    >

                        <RotateCcw size={18} />

                        Refresh

                    </button>

                    <button

                        onClick={onExport}

                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"

                    >

                        <Download size={18} />

                        Export

                    </button>

                    <button

                        onClick={onAdd}

                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white transition"

                    >

                        <Plus size={18} />

                        Add Item

                    </button>

                </div>

            </div>

        </div>

    );

}

export default ItemFilters;