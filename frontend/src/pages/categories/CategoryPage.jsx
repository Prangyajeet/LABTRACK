import { useState } from "react";

import {
    Plus,
    Download
} from "lucide-react";

import toast from "react-hot-toast";

import useCategories from "../../hooks/useCategories";

import CategoryStats
    from "../../components/categories/CategoryStats";

import CategoryFilters
    from "../../components/categories/CategoryFilters";

import CategoryTable
    from "../../components/categories/CategoryTable";

import CategoryFormModal
    from "../../components/categories/CategoryFormModal";

import DeleteCategoryDialog
    from "../../components/categories/DeleteCategoryDialog";

import TableSkeleton
    from "../../components/common/TableSkeleton";

import Pagination
    from "../../components/common/Pagination";

import {
    exportCategories
} from "../../services/categoryService";


function CategoryPage() {

    const {

        categories,

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

        addCategory,

        editCategory,

        removeCategory,

        recoverCategory

    } = useCategories();


    const [status, setStatus] =
        useState("ALL");


    const [showModal, setShowModal] =
        useState(false);


    const [editingCategory, setEditingCategory] =
        useState(null);


    const [showDeleteDialog, setShowDeleteDialog] =
        useState(false);


    const [selectedCategory, setSelectedCategory] =
        useState(null);


    /*
     * Always guarantee an array.
     *
     * Prevents errors when categories
     * are temporarily undefined.
     */

    const safeCategories =
        Array.isArray(categories)
            ? categories
            : [];


    /*
     * STATUS FILTER
     */

    const filteredCategories =
        status === "ALL"
            ? safeCategories
            : safeCategories.filter(
                (category) =>
                    category?.status === status
            );


    /*
     * ADD CATEGORY
     */

    const handleAddClick = () => {

        setEditingCategory(null);

        setShowModal(true);

    };


    /*
     * EDIT CATEGORY
     */

    const handleEditClick = (category) => {

        setEditingCategory(category);

        setShowModal(true);

    };


    /*
     * DELETE CATEGORY
     */

    const handleDeleteClick = (category) => {

        setSelectedCategory(category);

        setShowDeleteDialog(true);

    };


    /*
     * RESTORE CATEGORY
     */

    const handleRestore = async (category) => {

        try {

            await recoverCategory(
                category.id
            );

            toast.success(
                "Category restored successfully."
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
     * TABLE SORT
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
     * CREATE / UPDATE CATEGORY
     */

    const handleSubmit = async (data) => {

        try {

            if (editingCategory) {

                await editCategory(
                    editingCategory.id,
                    data
                );

                toast.success(
                    "Category updated successfully."
                );

            }
            else {

                await addCategory(data);

                toast.success(
                    "Category created successfully."
                );

            }

            setShowModal(false);

            setEditingCategory(null);

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
     * DELETE
     */

    const handleDelete = async () => {

        if (!selectedCategory) {
            return;
        }


        try {

            await removeCategory(
                selectedCategory.id
            );

            toast.success(
                "Category deleted successfully."
            );

            setShowDeleteDialog(false);

            setSelectedCategory(null);

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
     * EXPORT EXCEL
     */

    const handleExport = async () => {

        try {

            const data =
                await exportCategories();


            const url =
                window.URL.createObjectURL(
                    new Blob([data])
                );


            const link =
                document.createElement("a");


            link.href = url;


            link.download =
                "Categories.xlsx";


            document.body.appendChild(link);


            link.click();


            document.body.removeChild(link);


            window.URL.revokeObjectURL(url);


            toast.success(
                "Categories exported successfully."
            );

        }
        catch (error) {

            console.error(error);

            toast.error(
                "Failed to export categories."
            );

        }

    };


    return (

        <div
            className="
                space-y-8
            "
        >

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-5
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
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
                        Categories
                    </h1>


                    <p
                        className="
                            mt-2
                            text-[14px]
                            text-blue-300
                        "
                    >
                        Manage Laboratory Categories
                    </p>

                </div>


                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    {/* EXPORT */}

                    <button
                        type="button"
                        onClick={handleExport}
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-emerald-600
                            px-6
                            py-3
                            text-[14px]
                            font-semibold
                            text-white
                            transition
                            hover:bg-emerald-500
                            focus:outline-none
                            focus:ring-2
                            focus:ring-emerald-500/40
                        "
                    >

                        <Download
                            size={18}
                        />

                        Export Excel

                    </button>


                    {/* ADD */}

                    <button
                        type="button"
                        onClick={handleAddClick}
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-6
                            py-3
                            text-[14px]
                            font-semibold
                            text-white
                            transition
                            hover:bg-blue-500
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500/40
                        "
                    >

                        <Plus
                            size={18}
                        />

                        Add Category

                    </button>

                </div>

            </div>


            {/* =====================================================
                STATISTICS
            ===================================================== */}

            <CategoryStats
                categories={safeCategories}
            />


            {/* =====================================================
                FILTERS
            ===================================================== */}

            <CategoryFilters
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
            />


            {/* =====================================================
                CATEGORY TABLE
            ===================================================== */}

            {loading ? (

                <TableSkeleton />

            ) : (

                <>

                    {/*
                     * IMPORTANT:
                     *
                     * CategoryTable is responsible for rendering
                     * the actual category rows.
                     *
                     * The descendant selectors below force all
                     * normal table values to WHITE.
                     *
                     * !text-white is intentional because the
                     * CategoryTable may currently have classes
                     * such as text-blue-400, text-green-400,
                     * text-purple-400, etc.
                     */}

                    <div
                        className="
                            [&_table]:text-white

                            [&_tbody]:text-white

                            [&_tbody_tr]:text-white

                            [&_tbody_td]:!text-white

                            [&_tbody_td_*]:!text-white

                            [&_tbody_td_p]:!text-white

                            [&_tbody_td_span]:!text-white

                            [&_tbody_td_div]:!text-white

                            [&_tbody_td_a]:!text-white

                            [&_tbody_td_button]:!text-white
                        "
                    >

                        <CategoryTable

                            categories={
                                filteredCategories
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


                    {/* =================================================
                        PAGINATION
                    ================================================== */}

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

            )}


            {/* =====================================================
                CATEGORY FORM MODAL
            ===================================================== */}

            <CategoryFormModal

                isOpen={
                    showModal
                }

                initialData={
                    editingCategory
                }

                onClose={() => {

                    setShowModal(false);

                    setEditingCategory(null);

                }}

                onSubmit={
                    handleSubmit
                }

            />


            {/* =====================================================
                DELETE CATEGORY DIALOG
            ===================================================== */}

            <DeleteCategoryDialog

                isOpen={
                    showDeleteDialog
                }

                category={
                    selectedCategory
                }

                onClose={() => {

                    setShowDeleteDialog(false);

                    setSelectedCategory(null);

                }}

                onConfirm={
                    handleDelete
                }

            />

        </div>

    );

}


export default CategoryPage;