import {
    useCallback,
    useEffect,
    useState
} from "react";

import inventoryService from "../services/inventoryService";

const useInventory = () => {

    const [inventory, setInventory] = useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState(null);


    const loadInventory = useCallback(
        async () => {

            setLoading(true);
            setError(null);

            try {

                const data =
                    await inventoryService
                        .getAllInventory();

                setInventory(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (err) {

                console.error(
                    "Failed to load inventory:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Failed to load inventory."
                );

                setInventory([]);

            } finally {

                setLoading(false);
            }

        },
        []
    );


    const searchInventory =
        useCallback(
            async (keyword) => {

                if (!keyword?.trim()) {

                    await loadInventory();

                    return;
                }

                setLoading(true);
                setError(null);

                try {

                    const data =
                        await inventoryService
                            .searchInventory(
                                keyword.trim()
                            );

                    setInventory(
                        Array.isArray(data)
                            ? data
                            : []
                    );

                } catch (err) {

                    console.error(
                        "Inventory search failed:",
                        err
                    );

                    setError(
                        err.response?.data?.message ||
                        "Inventory search failed."
                    );

                } finally {

                    setLoading(false);
                }

            },
            [loadInventory]
        );


    const refresh =
        useCallback(
            async () => {

                await loadInventory();

            },
            [loadInventory]
        );


    useEffect(() => {

        loadInventory();

    }, [loadInventory]);


    return {

        inventory,

        loading,

        error,

        loadInventory,

        searchInventory,

        refresh

    };
};

export default useInventory;