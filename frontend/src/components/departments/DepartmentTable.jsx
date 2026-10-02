import {
    Pencil,
    Trash2,
    RotateCcw,
    ArrowUp,
    ArrowDown
} from "lucide-react";


function DepartmentTable({
    departments,
    onEdit,
    onDelete,
    onRestore,
    sortBy,
    sortDirection,
    onSort
}) {

    const renderSortIcon = (column) => {

        if (sortBy !== column) {
            return null;
        }

        return sortDirection === "asc"
            ?
            <ArrowUp
                size={16}
                className="inline ml-2"
            />
            :
            <ArrowDown
                size={16}
                className="inline ml-2"
            />;
    };


    // ============================================================
    // DEPARTMENT NAME
    // ============================================================

    const getDepartmentName = (
        department
    ) => {

        return (
            department?.departmentName ??
            department?.name ??
            department?.department_name ??
            "—"
        );
    };


    // ============================================================
    // DESCRIPTION
    // ============================================================

    const getDescription = (
        department
    ) => {

        return (
            department?.description ??
            department?.departmentDescription ??
            department?.department_description ??
            "—"
        );
    };


    // ============================================================
    // CREATED DATE
    // ============================================================

    const getCreatedDate = (
        department
    ) => {

        if (!department?.createdAt) {
            return "—";
        }

        const date =
            new Date(
                department.createdAt
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "—";

        }


        return date.toLocaleDateString();
    };


    // ============================================================
    // STATUS
    // ============================================================

    const getStatus = (
        department
    ) => {

        return String(
            department?.status ??
            "ACTIVE"
        ).toUpperCase();

    };


    // ============================================================
    // STATUS BADGE
    // ============================================================

    const renderStatusBadge = (
        status
    ) => {

        const normalized =
            String(
                status ??
                "ACTIVE"
            ).toUpperCase();


        // --------------------------------------------------------
        // ACTIVE
        // --------------------------------------------------------

        if (
            normalized ===
            "ACTIVE"
        ) {

            return (

                <span
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-emerald-500/30
                        bg-emerald-500/10
                        px-3
                        py-1
                        text-[11px]
                        font-semibold
                        text-emerald-400
                    "
                >

                    <span
                        className="
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-emerald-400
                        "
                    />

                    ACTIVE

                </span>

            );

        }


        // --------------------------------------------------------
        // INACTIVE
        // --------------------------------------------------------

        if (
            normalized ===
            "INACTIVE"
        ) {

            return (

                <span
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-red-500/30
                        bg-red-500/10
                        px-3
                        py-1
                        text-[11px]
                        font-semibold
                        text-red-400
                    "
                >

                    <span
                        className="
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-red-400
                        "
                    />

                    INACTIVE

                </span>

            );

        }


        // --------------------------------------------------------
        // OTHER STATUS
        // --------------------------------------------------------

        return (

            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-slate-500/30
                    bg-slate-500/10
                    px-3
                    py-1
                    text-[11px]
                    font-semibold
                    text-slate-400
                "
            >

                <span
                    className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-slate-400
                    "
                />

                {
                    normalized
                }

            </span>

        );

    };


    return (

        <div
            className="
                rounded-3xl
                bg-slate-900
                border
                border-slate-800
                overflow-hidden
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
                        table-fixed
                    "
                >

                    {/* =================================================
                        TABLE HEADER
                    ================================================= */}

                    <thead
                        className="
                            bg-slate-950
                        "
                    >

                        <tr>

                            {/* =================================================
                                DEPARTMENT
                            ================================================= */}

                            <th
                                onClick={() =>
                                    onSort(
                                        "departmentName"
                                    )
                                }
                                className="
                                    w-[24%]
                                    text-left
                                    px-6
                                    py-4
                                    text-slate-300
                                    cursor-pointer
                                    hover:text-white
                                    transition-colors
                                "
                            >

                                Department

                                {
                                    renderSortIcon(
                                        "departmentName"
                                    )
                                }

                            </th>


                            {/* =================================================
                                DESCRIPTION
                            ================================================= */}

                            <th
                                className="
                                    w-[30%]
                                    text-left
                                    px-6
                                    py-4
                                    text-slate-300
                                "
                            >

                                Description

                            </th>


                            {/* =================================================
                                CREATED
                            ================================================= */}

                            <th
                                onClick={() =>
                                    onSort(
                                        "createdAt"
                                    )
                                }
                                className="
                                    w-[16%]
                                    text-left
                                    px-6
                                    py-4
                                    text-slate-300
                                    cursor-pointer
                                    hover:text-white
                                    transition-colors
                                "
                            >

                                Created

                                {
                                    renderSortIcon(
                                        "createdAt"
                                    )
                                }

                            </th>


                            {/* =================================================
                                STATUS
                            ================================================= */}

                            <th
                                onClick={() =>
                                    onSort(
                                        "status"
                                    )
                                }
                                className="
                                    w-[15%]
                                    text-left
                                    px-6
                                    py-4
                                    text-slate-300
                                    cursor-pointer
                                    hover:text-white
                                    transition-colors
                                "
                            >

                                Status

                                {
                                    renderSortIcon(
                                        "status"
                                    )
                                }

                            </th>


                            {/* =================================================
                                ACTIONS
                            ================================================= */}

                            <th
                                className="
                                    w-[15%]
                                    text-center
                                    px-6
                                    py-4
                                    text-slate-300
                                "
                            >

                                Actions

                            </th>

                        </tr>

                    </thead>


                    {/* =====================================================
                        TABLE BODY
                    ===================================================== */}

                    <tbody>

                        {

                            departments.length === 0

                                ?

                                (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="
                                                py-10
                                                text-center
                                                text-slate-400
                                            "
                                        >

                                            No Departments Found

                                        </td>

                                    </tr>

                                )

                                :

                                departments.map(
                                    (
                                        department
                                    ) => {

                                        const departmentName =
                                            getDepartmentName(
                                                department
                                            );


                                        const description =
                                            getDescription(
                                                department
                                            );


                                        const createdDate =
                                            getCreatedDate(
                                                department
                                            );


                                        const status =
                                            getStatus(
                                                department
                                            );


                                        return (

                                            <tr
                                                key={
                                                    department.id
                                                }
                                                className="
                                                    border-t
                                                    border-slate-800
                                                    hover:bg-slate-800/40
                                                "
                                            >

                                                {/* =================================================
                                                    DEPARTMENT NAME
                                                ================================================= */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
                                                        align-middle
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            text-white
                                                            font-semibold
                                                            truncate
                                                        "
                                                        title={
                                                            departmentName
                                                        }
                                                    >

                                                        {
                                                            departmentName
                                                        }

                                                    </p>

                                                </td>


                                                {/* =================================================
                                                    DESCRIPTION
                                                ================================================= */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
                                                        align-middle
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            text-slate-300
                                                            truncate
                                                        "
                                                        title={
                                                            description
                                                        }
                                                    >

                                                        {
                                                            description
                                                        }

                                                    </p>

                                                </td>


                                                {/* =================================================
                                                    CREATED
                                                ================================================= */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
                                                        text-slate-400
                                                        align-middle
                                                        whitespace-nowrap
                                                    "
                                                >

                                                    {
                                                        createdDate
                                                    }

                                                </td>


                                                {/* =================================================
                                                    STATUS
                                                ================================================= */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
                                                        align-middle
                                                    "
                                                >

                                                    {
                                                        renderStatusBadge(
                                                            status
                                                        )
                                                    }

                                                </td>


                                                {/* =================================================
                                                    ACTIONS
                                                ================================================= */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
                                                        align-middle
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            justify-center
                                                            items-center
                                                            gap-3
                                                        "
                                                    >

                                                        {

                                                            status ===
                                                            "ACTIVE"

                                                                ?

                                                                <>

                                                                    {/* EDIT */}

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            onEdit(
                                                                                department
                                                                            )
                                                                        }
                                                                        className="
                                                                            p-2
                                                                            rounded-lg
                                                                            bg-blue-600
                                                                            hover:bg-blue-700
                                                                            transition
                                                                        "
                                                                        title="Edit Department"
                                                                    >

                                                                        <Pencil
                                                                            size={
                                                                                18
                                                                            }
                                                                            className="
                                                                                text-white
                                                                            "
                                                                        />

                                                                    </button>


                                                                    {/* DELETE */}

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            onDelete(
                                                                                department
                                                                            )
                                                                        }
                                                                        className="
                                                                            p-2
                                                                            rounded-lg
                                                                            bg-red-600
                                                                            hover:bg-red-700
                                                                            transition
                                                                        "
                                                                        title="Delete Department"
                                                                    >

                                                                        <Trash2
                                                                            size={
                                                                                18
                                                                            }
                                                                            className="
                                                                                text-white
                                                                            "
                                                                        />

                                                                    </button>

                                                                </>

                                                                :

                                                                /* RESTORE */

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        onRestore(
                                                                            department
                                                                        )
                                                                    }
                                                                    className="
                                                                        flex
                                                                        items-center
                                                                        gap-2
                                                                        px-4
                                                                        py-2
                                                                        rounded-lg
                                                                        bg-green-600
                                                                        hover:bg-green-700
                                                                        text-white
                                                                        transition
                                                                    "
                                                                    title="Restore Department"
                                                                >

                                                                    <RotateCcw
                                                                        size={
                                                                            16
                                                                        }
                                                                    />

                                                                    Restore

                                                                </button>

                                                        }

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );
}


export default DepartmentTable;