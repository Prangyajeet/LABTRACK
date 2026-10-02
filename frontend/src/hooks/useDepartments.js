import { useCallback, useEffect, useState } from "react";

import {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    restoreDepartment
} from "../services/departmentService";

function useDepartments() {

    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);

    const [size, setSize] = useState(10);

    const [search, setSearch] = useState("");

    const [totalPages, setTotalPages] = useState(0);

    const [totalElements, setTotalElements] = useState(0);

    const [sortBy, setSortBy] = useState("departmentName");

    const [sortDirection, setSortDirection] = useState("asc");


    const loadDepartments = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getAllDepartments(
                page,
                size,
                sortBy,
                sortDirection,
                search
            );

            console.log(
                "Departments API response:",
                response
            );


            /*
             * Current backend returns:
             *
             * ApiResponse<List<DepartmentResponseDTO>>
             *
             * Therefore departmentService returns an ARRAY.
             *
             * Older frontend expected:
             *
             * {
             *     content: [],
             *     totalPages: 0,
             *     totalElements: 0
             * }
             */


            let allDepartments = [];


            if (Array.isArray(response)) {

                allDepartments = response;

            }

            else if (
                Array.isArray(response?.content)
            ) {

                allDepartments = response.content;

            }

            else {

                console.error(
                    "Invalid departments API response:",
                    response
                );

                allDepartments = [];

            }


            /*
             * SEARCH
             */

            const normalizedSearch =
                search.trim().toLowerCase();


            if (normalizedSearch) {

                allDepartments =
                    allDepartments.filter(
                        (department) =>

                            department?.departmentName
                                ?.toLowerCase()
                                .includes(
                                    normalizedSearch
                                )

                            ||

                            department?.description
                                ?.toLowerCase()
                                .includes(
                                    normalizedSearch
                                )
                    );

            }


            /*
             * SORT
             */

            allDepartments.sort((a, b) => {

                const valueA =
                    String(
                        a?.[sortBy] ?? ""
                    ).toLowerCase();

                const valueB =
                    String(
                        b?.[sortBy] ?? ""
                    ).toLowerCase();


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
             * PAGINATION
             */

            const calculatedTotalElements =
                allDepartments.length;


            const calculatedTotalPages =
                calculatedTotalElements === 0

                    ? 0

                    : Math.ceil(
                        calculatedTotalElements / size
                    );


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


            const paginatedDepartments =
                allDepartments.slice(
                    startIndex,
                    endIndex
                );


            setDepartments(
                paginatedDepartments
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
                "Failed to load departments:",
                error
            );

            setDepartments([]);

            setTotalPages(0);

            setTotalElements(0);

        }

        finally {

            setLoading(false);

        }

    }, [

        page,

        size,

        sortBy,

        sortDirection,

        search

    ]);


    useEffect(() => {

        loadDepartments();

    }, [loadDepartments]);


    const addDepartment = async (
        department
    ) => {

        await createDepartment(
            department
        );

        await loadDepartments();

    };


    const editDepartment = async (
        id,
        department
    ) => {

        await updateDepartment(
            id,
            department
        );

        await loadDepartments();

    };


    const removeDepartment = async (
        id
    ) => {

        await deleteDepartment(id);

        await loadDepartments();

    };


    const recoverDepartment = async (
        id
    ) => {

        await restoreDepartment(id);

        await loadDepartments();

    };


    return {

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

        recoverDepartment,

        refreshDepartments:
            loadDepartments

    };

}

export default useDepartments;