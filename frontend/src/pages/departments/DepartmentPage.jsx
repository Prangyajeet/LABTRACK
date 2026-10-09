import { useState } from "react";

import {
    Plus,
    Download
} from "lucide-react";

import toast from "react-hot-toast";

import useDepartments from "../../hooks/useDepartments";

import DepartmentStats
    from "../../components/departments/departmentStats";

import DepartmentFilters
    from "../../components/departments/DepartmentFilters";

import DepartmentTable
    from "../../components/departments/DepartmentTable";

import DepartmentFormModal
    from "../../components/departments/DepartmentFormModal";

import DeleteDepartmentDialog
    from "../../components/departments/DeleteDepartmentDialog";

import TableSkeleton
    from "../../components/common/TableSkeleton";

import Pagination
    from "../../components/common/Pagination";

import {
    exportDepartments
} from "../../services/departmentService";


function DepartmentPage() {

    const {
        departments,
        loading,
        page,
        size,
        search,
        totalPages,
        totalElements,
        sortBy,
        sortDirection,
        setPage,
        setSize,
        setSearch,
        setSortBy,
        setSortDirection,
        addDepartment,
        editDepartment,
        removeDepartment,
        recoverDepartment
    } = useDepartments();


    const [status, setStatus] = useState("ALL");

    const [showModal, setShowModal] =
        useState(false);

    const [editingDepartment, setEditingDepartment] =
        useState(null);

    const [showDeleteDialog, setShowDeleteDialog] =
        useState(false);

    const [selectedDepartment, setSelectedDepartment] =
        useState(null);


    /*
     * ============================================================
     * SAFE DEPARTMENT DATA
     * ============================================================
     *
     * The DepartmentTable expects:
     *
     * departmentName
     * description
     * createdAt
     * status
     *
     * Some responses can expose the department name using
     * a different property such as:
     *
     * name
     * department_name
     *
     * Normalize it here so the existing DepartmentTable
     * structure does not need to be changed.
     */

    const safeDepartments =
        Array.isArray(departments)
            ? departments.map((department) => {

                const normalizedDepartmentName =
                    department?.departmentName ??
                    department?.name ??
                    department?.department_name ??
                    department?.title ??
                    "";

                return {
                    ...department,

                    departmentName:
                        normalizedDepartmentName
                };
            })
            : [];


    /*
     * ============================================================
     * STATUS FILTER
     * ============================================================
     */

    const filteredDepartments =
        status === "ALL"
            ? safeDepartments
            : safeDepartments.filter(
                (department) =>
                    String(
                        department?.status ?? ""
                    ).toUpperCase() ===
                    String(status).toUpperCase()
            );


    /*
     * ============================================================
     * ADD DEPARTMENT
     * ============================================================
     */

    const handleAddClick = () => {

        setEditingDepartment(null);

        setShowModal(true);
    };


    /*
     * ============================================================
     * EDIT DEPARTMENT
     * ============================================================
     */

    const handleEditClick = (department) => {

        setEditingDepartment(department);

        setShowModal(true);
    };


    /*
     * ============================================================
     * DELETE DEPARTMENT
     * ============================================================
     */

    const handleDeleteClick = (department) => {

        setSelectedDepartment(department);

        setShowDeleteDialog(true);
    };


    /*
     * ============================================================
     * RESTORE DEPARTMENT
     * ============================================================
     */

    const handleRestore = async (department) => {

        try {

            await recoverDepartment(
                department.id
            );

            toast.success(
                "Department restored successfully."
            );

        }
        catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Restore failed."
            );
        }
    };


    /*
     * ============================================================
     * SORT
     * ============================================================
     */

    const handleSort = (column) => {

        if (sortBy === column) {

            setSortDirection(
                sortDirection === "asc"
                    ? "desc"
                    : "asc"
            );

        }
        else {

            setSortBy(column);

            setSortDirection("asc");
        }

        setPage(0);
    };


    /*
     * ============================================================
     * CREATE / UPDATE
     * ============================================================
     */

    const handleSubmit = async (data) => {

        try {

            if (editingDepartment) {

                await editDepartment(
                    editingDepartment.id,
                    data
                );

                toast.success(
                    "Department updated successfully."
                );

            }
            else {

                await addDepartment(data);

                toast.success(
                    "Department created successfully."
                );
            }

            setShowModal(false);

            setEditingDepartment(null);

        }
        catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Operation failed."
            );
        }
    };


    /*
     * ============================================================
     * DELETE
     * ============================================================
     */

    const handleDelete = async () => {

        if (!selectedDepartment) {
            return;
        }


        try {

            await removeDepartment(
                selectedDepartment.id
            );

            toast.success(
                "Department deleted successfully."
            );

            setShowDeleteDialog(false);

            setSelectedDepartment(null);

        }
        catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Delete failed."
            );
        }
    };


    /*
     * ============================================================
     * EXPORT EXCEL
     * ============================================================
     */

    const handleExport = async () => {

        try {

            const data =
                await exportDepartments();

            const url =
                window.URL.createObjectURL(
                    new Blob([data])
                );


            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "Departments.xlsx";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);


            toast.success(
                "Departments exported successfully."
            );

        }
        catch (error) {

            console.error(error);

            toast.error(
                "Failed to export departments."
            );
        }
    };


    return (

        <div className="space-y-8">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <div>

                    <h1
                        className="
                            text-4xl
                            font-bold
                            text-white
                        "
                    >
                        Departments
                    </h1>


                    <p
                        className="
                            text-slate-400
                            mt-2
                        "
                    >
                        Manage Laboratory Departments
                    </p>

                </div>


                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <button
                        onClick={handleExport}
                        className="
                            flex
                            items-center
                            gap-2
                            bg-emerald-600
                            hover:bg-emerald-700
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            transition
                        "
                    >

                        <Download size={18} />

                        Export Excel

                    </button>


                    <button
                        onClick={handleAddClick}
                        className="
                            flex
                            items-center
                            gap-2
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            transition
                        "
                    >

                        <Plus size={18} />

                        Add Department

                    </button>

                </div>

            </div>


            {/* =====================================================
                STATS
            ===================================================== */}

            <DepartmentStats
                departments={safeDepartments}
            />


            {/* =====================================================
                FILTERS
            ===================================================== */}

            <DepartmentFilters
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
            />


            {/* =====================================================
                TABLE
            ===================================================== */}

            {
                loading

                    ?

                    <TableSkeleton />

                    :

                    <>

                        {/*
                         * DepartmentTable owns the actual <td>
                         * content.
                         *
                         * safeDepartments above guarantees that
                         * departmentName is available in the
                         * expected property.
                         *
                         * These Tailwind descendant selectors force
                         * department table cell text to white without
                         * changing DepartmentTable itself.
                         */}

                        <div
                            className="
                                [&_tbody_td]:!text-white
                                [&_tbody_td_p]:!text-white
                                [&_tbody_td_div]:!text-white
                                [&_tbody_td_span]:!text-white
                            "
                        >

                            <DepartmentTable

                                departments={
                                    filteredDepartments
                                }

                                sortBy={
                                    sortBy
                                }

                                sortDirection={
                                    sortDirection
                                }

                                onSort={
                                    handleSort
                                }

                                onEdit={
                                    handleEditClick
                                }

                                onDelete={
                                    handleDeleteClick
                                }

                                onRestore={
                                    handleRestore
                                }

                            />

                        </div>


                        <Pagination

                            page={
                                page
                            }

                            totalPages={
                                totalPages
                            }

                            totalElements={
                                totalElements
                            }

                            size={
                                size
                            }

                            setPage={
                                setPage
                            }

                            setSize={
                                setSize
                            }

                        />

                    </>

            }


            {/* =====================================================
                FORM MODAL
            ===================================================== */}

            <DepartmentFormModal

                isOpen={
                    showModal
                }

                initialData={
                    editingDepartment
                }

                onClose={() => {

                    setShowModal(false);

                    setEditingDepartment(null);

                }}

                onSubmit={
                    handleSubmit
                }

            />


            {/* =====================================================
                DELETE DIALOG
            ===================================================== */}

            <DeleteDepartmentDialog

                isOpen={
                    showDeleteDialog
                }

                department={
                    selectedDepartment
                }

                onClose={() => {

                    setShowDeleteDialog(false);

                    setSelectedDepartment(null);

                }}

                onConfirm={
                    handleDelete
                }

            />

        </div>

    );
}


export default DepartmentPage;