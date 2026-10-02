import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from "lucide-react";

function Pagination({
    page,
    totalPages,
    totalElements,
    size,
    setPage,
    setSize
}) {

    if (totalPages === 0) {
        return null;
    }

    const disabled = page === 0;

    const lastPage =
        page + 1 === totalPages;

    const buttonClass = `
        inline-flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg
        border
        border-blue-900/60
        bg-[#142446]
        text-blue-300
        transition-all
        duration-200
        hover:border-blue-500/50
        hover:bg-blue-500/10
        hover:text-blue-200
        disabled:cursor-not-allowed
        disabled:border-slate-800
        disabled:bg-[#0d1930]
        disabled:text-slate-700
        disabled:opacity-70
    `;

    return (

        <div className="
            mt-6
            flex
            flex-col
            gap-4
            rounded-xl
            border
            border-blue-900/60
            bg-[#0f1b33]
            p-4
            shadow-lg
            sm:flex-row
            sm:items-center
            sm:justify-between
        ">

            {/* TOTAL RECORDS */}

            <div className="
                text-sm
                text-cyan-300
            ">

                Total Records

                <span className="
                    ml-2
                    font-bold
                    text-white
                ">
                    {totalElements}
                </span>

            </div>


            {/* ROW SIZE */}

            <div className="
                flex
                items-center
                gap-3
            ">

                <span className="
                    text-sm
                    font-medium
                    text-blue-300
                ">
                    Rows
                </span>

                <select
                    value={size}
                    onChange={(e) => {

                        setSize(
                            Number(e.target.value)
                        );

                        setPage(0);

                    }}
                    className="
                        cursor-pointer
                        rounded-lg
                        border
                        border-blue-900/60
                        bg-[#142446]
                        px-3
                        py-2
                        text-sm
                        font-semibold
                        text-white
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-500/20
                    "
                >

                    <option
                        value={10}
                        className="
                            bg-[#0f1b33]
                            text-white
                        "
                    >
                        10
                    </option>

                    <option
                        value={25}
                        className="
                            bg-[#0f1b33]
                            text-white
                        "
                    >
                        25
                    </option>

                    <option
                        value={50}
                        className="
                            bg-[#0f1b33]
                            text-white
                        "
                    >
                        50
                    </option>

                    <option
                        value={100}
                        className="
                            bg-[#0f1b33]
                            text-white
                        "
                    >
                        100
                    </option>

                </select>

            </div>


            {/* PAGINATION */}

            <div className="
                flex
                items-center
                gap-1.5
            ">

                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setPage(0)}
                    className={buttonClass}
                    title="First page"
                >
                    <ChevronsLeft size={17} />
                </button>


                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setPage(page - 1)}
                    className={buttonClass}
                    title="Previous page"
                >
                    <ChevronLeft size={17} />
                </button>


                <span className="
                    min-w-[70px]
                    px-2
                    text-center
                    text-sm
                    font-bold
                    text-white
                ">

                    <span className="text-cyan-300">
                        {page + 1}
                    </span>

                    <span className="
                        mx-1
                        text-slate-500
                    ">
                        /
                    </span>

                    <span className="text-blue-300">
                        {totalPages}
                    </span>

                </span>


                <button
                    type="button"
                    disabled={lastPage}
                    onClick={() => setPage(page + 1)}
                    className={buttonClass}
                    title="Next page"
                >
                    <ChevronRight size={17} />
                </button>


                <button
                    type="button"
                    disabled={lastPage}
                    onClick={() =>
                        setPage(totalPages - 1)
                    }
                    className={buttonClass}
                    title="Last page"
                >
                    <ChevronsRight size={17} />
                </button>

            </div>

        </div>

    );
}

export default Pagination;