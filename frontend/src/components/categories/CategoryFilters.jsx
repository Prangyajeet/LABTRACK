import {
    Search,
    SlidersHorizontal
} from "lucide-react";


function CategoryFilters({
    search,
    setSearch,
    status,
    setStatus
}) {

    return (

        <div
            className="
                flex
                flex-col
                gap-3
                rounded-xl
                border
                border-blue-900/70
                bg-[#0f1a33]
                p-4
                shadow-md
                md:flex-row
                md:items-center
            "
        >

            {/* SEARCH */}

            <div
                className="
                    relative
                    flex-1
                "
            >

                <Search
                    size={18}
                    className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-blue-300
                    "
                />

                <input
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    placeholder="Search categories..."
                    className="
                        h-11
                        w-full
                        rounded-lg
                        border
                        border-blue-900/70
                        bg-[#0b1428]
                        pl-11
                        pr-4
                        text-[14px]
                        text-white
                        outline-none
                        placeholder:text-blue-300/60
                        transition
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-500/20
                    "
                />

            </div>


            {/* STATUS */}

            <div
                className="
                    flex
                    h-11
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-blue-900/70
                    bg-[#0b1428]
                    px-3
                "
            >

                <SlidersHorizontal
                    size={17}
                    className="
                        text-blue-300
                    "
                />

                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(
                            e.target.value
                        )
                    }
                    className="
                        min-w-[150px]
                        cursor-pointer
                        bg-transparent
                        text-[14px]
                        font-medium
                        text-blue-100
                        outline-none
                    "
                >

                    <option
                        value="ALL"
                        className="
                            bg-[#0f1a33]
                            text-white
                        "
                    >
                        All Categories
                    </option>

                    <option
                        value="ACTIVE"
                        className="
                            bg-[#0f1a33]
                            text-white
                        "
                    >
                        Active
                    </option>

                    <option
                        value="INACTIVE"
                        className="
                            bg-[#0f1a33]
                            text-white
                        "
                    >
                        Inactive
                    </option>

                </select>

            </div>

        </div>

    );

}


export default CategoryFilters;