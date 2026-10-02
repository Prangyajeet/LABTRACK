import {
    Building2,
    LayoutGrid,
    Pencil,
    Trash2,
    RotateCcw,
    ArrowUp,
    ArrowDown
} from "lucide-react";

function CategoryTable({
    categories = [],
    sortBy,
    sortDirection,
    onSort,
    onEdit,
    onDelete,
    onRestore
}) {

    /*
     * =========================================================
     * DESCRIPTION COLORS
     * =========================================================
     */

    const descriptionColors = [
        "text-[#58a6ff]",
        "text-[#3fb950]",
        "text-[#a371f7]",
        "text-[#d29922]",
        "text-[#39c5cf]",
        "text-[#f778ba]"
    ];


    /*
     * =========================================================
     * CATEGORY ICON BOX COLORS
     * =========================================================
     */

    const iconStyles = [
        "border-blue-500/30 bg-blue-500/10 text-[#58a6ff]",
        "border-emerald-500/30 bg-emerald-500/10 text-[#3fb950]",
        "border-violet-500/30 bg-violet-500/10 text-[#a371f7]",
        "border-amber-500/30 bg-amber-500/10 text-[#d29922]",
        "border-cyan-500/30 bg-cyan-500/10 text-[#39c5cf]",
        "border-pink-500/30 bg-pink-500/10 text-[#f778ba]"
    ];


    /*
     * =========================================================
     * SORT ICON
     * =========================================================
     */

    const SortIcon = ({ column }) => {

        if (sortBy !== column) {
            return null;
        }

        return sortDirection === "asc"
            ? (
                <ArrowUp
                    size={13}
                    className="
                        ml-1
                        inline-block
                        text-[#58a6ff]
                    "
                />
            )
            : (
                <ArrowDown
                    size={13}
                    className="
                        ml-1
                        inline-block
                        text-[#58a6ff]
                    "
                />
            );
    };


    /*
     * =========================================================
     * EMPTY STATE
     * =========================================================
     */

    if (!categories.length) {

        return (

            <div
                className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#21375f]
                    bg-[#101a32]
                "
            >

                <div
                    className="
                        flex
                        min-h-[220px]
                        items-center
                        justify-center
                        px-6
                        py-12
                    "
                >

                    <div className="text-center">

                        <div
                            className="
                                mx-auto
                                mb-4
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-blue-500/30
                                bg-[#122746]
                                text-[#58a6ff]
                            "
                        >

                            <LayoutGrid
                                size={22}
                            />

                        </div>


                        <p
                            className="
                                text-sm
                                font-semibold
                                text-[#e6edf3]
                            "
                        >
                            No categories found
                        </p>


                        <p
                            className="
                                mt-1
                                text-xs
                                text-[#8b949e]
                            "
                        >
                            Try changing your search or filter.
                        </p>

                    </div>

                </div>

            </div>

        );
    }


    return (

        <div
            className="
                overflow-hidden
                rounded-xl
                border
                border-[#21375f]
                bg-[#101a32]
            "
        >

            <div
                className="
                    overflow-x-auto
                "
            >

                <table
                    className="
                        w-full
                        min-w-[950px]
                        border-collapse
                    "
                >

                    {/* =================================================
                        TABLE HEADER
                    ================================================= */}

                    <thead>

                        <tr
                            className="
                                border-b
                                border-[#294475]
                                bg-[#172746]
                                text-left
                            "
                        >

                            {/* =============================================
                                CATEGORY
                            ============================================= */}

                            <th
                                onClick={() =>
                                    onSort &&
                                    onSort("categoryName")
                                }
                                className="
                                    cursor-pointer
                                    px-5
                                    py-4
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-[#58a6ff]
                                    transition-colors
                                    hover:text-white
                                "
                            >

                                Category

                                <SortIcon
                                    column="categoryName"
                                />

                            </th>


                            {/* =============================================
                                DEPARTMENT
                            ============================================= */}

                            <th
                                onClick={() =>
                                    onSort &&
                                    onSort("departmentName")
                                }
                                className="
                                    cursor-pointer
                                    px-5
                                    py-4
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-[#3fb950]
                                    transition-colors
                                    hover:text-white
                                "
                            >

                                Department

                                <SortIcon
                                    column="departmentName"
                                />

                            </th>


                            {/* =============================================
                                DESCRIPTION
                            ============================================= */}

                            <th
                                onClick={() =>
                                    onSort &&
                                    onSort("description")
                                }
                                className="
                                    cursor-pointer
                                    px-5
                                    py-4
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-[#a371f7]
                                    transition-colors
                                    hover:text-white
                                "
                            >

                                Description

                                <SortIcon
                                    column="description"
                                />

                            </th>


                            {/* =============================================
                                STATUS
                            ============================================= */}

                            <th
                                className="
                                    px-5
                                    py-4
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-[#39c5cf]
                                "
                            >

                                Status

                            </th>


                            {/* =============================================
                                ACTIONS
                            ============================================= */}

                            <th
                                className="
                                    px-5
                                    py-4
                                    text-right
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-[#d29922]
                                "
                            >

                                Actions

                            </th>

                        </tr>

                    </thead>


                    {/* =================================================
                        TABLE BODY
                    ================================================= */}

                    <tbody>

                        {categories.map(
                            (category, index) => {

                                const descriptionColor =
                                    descriptionColors[
                                        index %
                                        descriptionColors.length
                                    ];


                                const currentIconStyle =
                                    iconStyles[
                                        index %
                                        iconStyles.length
                                    ];


                                const isActive =
                                    category.status === "ACTIVE";


                                return (

                                    <tr
                                        key={
                                            category.id ??
                                            `category-${index}`
                                        }
                                        className="
                                            border-b
                                            border-[#21375f]
                                            bg-[#0f1a33]
                                            transition-colors
                                            duration-200
                                            hover:bg-[#162542]
                                            last:border-b-0
                                        "
                                    >

                                        {/* =================================
                                            CATEGORY
                                        ================================= */}

                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                "
                                            >

                                                <div
                                                    className={`
                                                        flex
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        border
                                                        transition-all
                                                        duration-200
                                                        ${currentIconStyle}
                                                    `}
                                                >

                                                    <LayoutGrid
                                                        size={17}
                                                        strokeWidth={1.8}
                                                    />

                                                </div>


                                                <span
                                                    className="
                                                        text-[13px]
                                                        font-semibold
                                                        text-[#e6edf3]
                                                    "
                                                >

                                                    {
                                                        category.categoryName ??
                                                        category.name ??
                                                        "—"
                                                    }

                                                </span>

                                            </div>

                                        </td>


                                        {/* =================================
                                            DEPARTMENT
                                        ================================= */}

                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                "
                                            >

                                                <Building2
                                                    size={15}
                                                    strokeWidth={1.8}
                                                    className="
                                                        text-[#58a6ff]
                                                    "
                                                />


                                                <span
                                                    className="
                                                        text-[13px]
                                                        font-medium
                                                        text-[#58a6ff]
                                                    "
                                                >

                                                    {
                                                        category.departmentName ??
                                                        category.department?.name ??
                                                        category.department ??
                                                        "—"
                                                    }

                                                </span>

                                            </div>

                                        </td>


                                        {/* =================================
                                            DESCRIPTION
                                        ================================= */}

                                        <td
                                            className="
                                                max-w-[350px]
                                                px-5
                                                py-4
                                            "
                                        >

                                            <div
                                                className={`
                                                    truncate
                                                    text-[13px]
                                                    font-medium
                                                    ${descriptionColor}
                                                `}
                                                title={
                                                    category.description ??
                                                    ""
                                                }
                                            >

                                                {
                                                    category.description ||
                                                    "—"
                                                }

                                            </div>

                                        </td>


                                        {/* =================================
                                            STATUS
                                        ================================= */}

                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >

                                            <span
                                                className={`
                                                    inline-flex
                                                    items-center
                                                    gap-1.5
                                                    rounded-full
                                                    border
                                                    px-3
                                                    py-1
                                                    text-[11px]
                                                    font-semibold
                                                    ${
                                                        isActive
                                                            ? `
                                                                border-emerald-500/30
                                                                bg-emerald-500/10
                                                                text-[#3fb950]
                                                            `
                                                            : `
                                                                border-red-500/30
                                                                bg-red-500/10
                                                                text-[#f85149]
                                                            `
                                                    }
                                                `}
                                            >

                                                <span
                                                    className={`
                                                        h-1.5
                                                        w-1.5
                                                        rounded-full
                                                        ${
                                                            isActive
                                                                ? "bg-[#3fb950]"
                                                                : "bg-[#f85149]"
                                                        }
                                                    `}
                                                />

                                                {
                                                    category.status ||
                                                    "UNKNOWN"
                                                }

                                            </span>

                                        </td>


                                        {/* =================================
                                            ACTIONS
                                        ================================= */}

                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-end
                                                    gap-2
                                                "
                                            >

                                                {isActive ? (

                                                    <>

                                                        {/* EDIT */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onEdit &&
                                                                onEdit(
                                                                    category
                                                                )
                                                            }
                                                            title="Edit category"
                                                            className="
                                                                flex
                                                                h-8
                                                                w-8
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                border
                                                                border-blue-500/30
                                                                bg-blue-500/5
                                                                text-[#58a6ff]
                                                                transition
                                                                hover:border-blue-500/60
                                                                hover:bg-blue-500/15
                                                                hover:text-white
                                                            "
                                                        >

                                                            <Pencil
                                                                size={15}
                                                                strokeWidth={1.8}
                                                            />

                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onDelete &&
                                                                onDelete(
                                                                    category
                                                                )
                                                            }
                                                            title="Delete category"
                                                            className="
                                                                flex
                                                                h-8
                                                                w-8
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                border
                                                                border-red-500/30
                                                                bg-red-500/5
                                                                text-[#f85149]
                                                                transition
                                                                hover:border-red-500/60
                                                                hover:bg-red-500/15
                                                                hover:text-red-300
                                                            "
                                                        >

                                                            <Trash2
                                                                size={15}
                                                                strokeWidth={1.8}
                                                            />

                                                        </button>

                                                    </>

                                                ) : (

                                                    /* RESTORE */

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onRestore &&
                                                            onRestore(
                                                                category
                                                            )
                                                        }
                                                        title="Restore category"
                                                        className="
                                                            flex
                                                            h-8
                                                            w-8
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            border
                                                            border-emerald-500/30
                                                            bg-emerald-500/5
                                                            text-[#3fb950]
                                                            transition
                                                            hover:border-emerald-500/60
                                                            hover:bg-emerald-500/15
                                                            hover:text-emerald-300
                                                        "
                                                    >

                                                        <RotateCcw
                                                            size={15}
                                                            strokeWidth={1.8}
                                                        />

                                                    </button>

                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                );

                            }
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default CategoryTable;