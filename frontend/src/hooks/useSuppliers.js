import { useCallback, useEffect, useState } from "react";

import {
    getAllSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    restoreSupplier
} from "../services/supplierService";

function useSuppliers() {

    const [suppliers, setSuppliers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);

    const [size, setSize] = useState(10);

    const [search, setSearch] = useState("");

    const [totalPages, setTotalPages] = useState(0);

    const [totalElements, setTotalElements] = useState(0);

    const [sortBy, setSortBy] = useState("supplierName");

    const [sortDirection, setSortDirection] = useState("asc");


    const loadSuppliers = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getAllSuppliers(
                page,
                size,
                sortBy,
                sortDirection,
                search
            );

            /*
             * Backend currently returns:
             *
             * {
             *     success: true,
             *     message: "...",
             *     data: [...]
             * }
             *
             * Therefore response is directly the array.
             */

            const supplierList = Array.isArray(response)
                ? response
                : [];

            setSuppliers(supplierList);

            /*
             * Current SupplierController does not return
             * pagination information.
             */
            setTotalElements(supplierList.length);

            setTotalPages(
                supplierList.length > 0
                    ? Math.ceil(supplierList.length / size)
                    : 0
            );

        } catch (error) {

            console.error(
                "Failed to load suppliers:",
                error
            );

            setSuppliers([]);

            setTotalElements(0);

            setTotalPages(0);

        } finally {

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

        loadSuppliers();

    }, [
        loadSuppliers
    ]);


    const addSupplier = async (supplier) => {

        await createSupplier(supplier);

        await loadSuppliers();

    };


    const editSupplier = async (
        id,
        supplier
    ) => {

        await updateSupplier(
            id,
            supplier
        );

        await loadSuppliers();

    };


    const removeSupplier = async (id) => {

        await deleteSupplier(id);

        await loadSuppliers();

    };


    const recoverSupplier = async (id) => {

        await restoreSupplier(id);

        await loadSuppliers();

    };


    return {

        suppliers,

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

        addSupplier,

        editSupplier,

        removeSupplier,

        recoverSupplier,

        refreshSuppliers: loadSuppliers

    };

}

export default useSuppliers;