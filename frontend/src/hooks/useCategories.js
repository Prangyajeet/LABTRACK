import { useCallback, useEffect, useState } from "react";

import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    restoreCategory
} from "../services/categoryService";

function useCategories() {

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);

    const [size, setSize] = useState(10);

    const [search, setSearch] = useState("");

    const [totalPages, setTotalPages] = useState(0);

    const [totalElements, setTotalElements] = useState(0);

    const [sortBy, setSortBy] = useState("categoryName");

    const [sortDirection, setSortDirection] = useState("asc");


    const loadCategories = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getAllCategories(
                page,
                size,
                sortBy,
                sortDirection,
                search
            );


            /*
             * =====================================================
             * NORMALIZE BACKEND RESPONSE
             * =====================================================
             *
             * The current backend returns:
             *
             * ApiResponse<List<CategoryResponseDTO>>
             *
             * Therefore categoryService returns an ARRAY.
             *
             * The old recovered frontend expected:
             *
             * {
             *     content: [],
             *     totalPages: 0,
             *     totalElements: 0
             * }
             *
             * which caused:
             *
             * response.content === undefined
             *
             * and eventually:
             *
             * categories.map(...)
             *
             * to crash.
             */

            let allCategories = [];

            if (Array.isArray(response)) {

                allCategories = response;

            } else if (Array.isArray(response?.content)) {

                allCategories = response.content;

            } else {

                allCategories = [];

            }


            /*
             * =====================================================
             * CLIENT-SIDE SEARCH
             * =====================================================
             */

            const normalizedSearch =
                search.trim().toLowerCase();

            if (normalizedSearch) {

                allCategories = allCategories.filter(
                    (category) =>
                        category?.categoryName
                            ?.toLowerCase()
                            .includes(normalizedSearch) ||

                        category?.description
                            ?.toLowerCase()
                            .includes(normalizedSearch) ||

                        category?.departmentName
                            ?.toLowerCase()
                            .includes(normalizedSearch)
                );

            }


            /*
             * =====================================================
             * CLIENT-SIDE SORT
             * =====================================================
             */

            allCategories.sort((a, b) => {

                const valueA =
                    String(a?.[sortBy] ?? "").toLowerCase();

                const valueB =
                    String(b?.[sortBy] ?? "").toLowerCase();

                if (valueA < valueB) {

                    return sortDirection === "asc"
                        ? -1
                        : 1;

                }

                if (valueA > valueB) {

                    return sortDirection === "asc"
                        ? 1
                        : -1;

                }

                return 0;

            });


            /*
             * =====================================================
             * PAGINATION
             * =====================================================
             */

            const calculatedTotalElements =
                allCategories.length;

            const calculatedTotalPages =
                calculatedTotalElements === 0
                    ? 0
                    : Math.ceil(
                        calculatedTotalElements / size
                    );


            /*
             * Prevent page from going outside the available range.
             */

            const safePage =
                calculatedTotalPages > 0
                    ? Math.min(
                        page,
                        calculatedTotalPages - 1
                    )
                    : 0;


            if (safePage !== page) {

                setPage(safePage);

            }


            const startIndex =
                safePage * size;

            const endIndex =
                startIndex + size;

            const paginatedCategories =
                allCategories.slice(
                    startIndex,
                    endIndex
                );


            /*
             * =====================================================
             * UPDATE STATE
             * =====================================================
             */

            setCategories(
                paginatedCategories
            );

            setTotalPages(
                calculatedTotalPages
            );

            setTotalElements(
                calculatedTotalElements
            );

        }

        catch (error) {

            console.error(
                "Failed to load categories:",
                error
            );

            setCategories([]);

            setTotalPages(0);

            setTotalElements(0);

        }

        finally {

            setLoading(false);

        }

    }, [

        page,

        size,

        search,

        sortBy,

        sortDirection

    ]);


    useEffect(() => {

        loadCategories();

    }, [loadCategories]);


    /*
     * =========================================================
     * CREATE
     * =========================================================
     */

    const addCategory = async (category) => {

        await createCategory(category);

        await loadCategories();

    };


    /*
     * =========================================================
     * UPDATE
     * =========================================================
     */

    const editCategory = async (
        id,
        category
    ) => {

        await updateCategory(
            id,
            category
        );

        await loadCategories();

    };


    /*
     * =========================================================
     * DELETE
     * =========================================================
     */

    const removeCategory = async (id) => {

        await deleteCategory(id);

        await loadCategories();

    };


    /*
     * =========================================================
     * RESTORE
     * =========================================================
     */

    const recoverCategory = async (id) => {

        await restoreCategory(id);

        await loadCategories();

    };


    return {

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

        recoverCategory,

        refreshCategories:
            loadCategories

    };

}

export default useCategories;