import { useCallback, useEffect, useState } from "react";

import inventoryService
    from "../services/inventoryService";


function useDailyConsumables() {

    const [consumables, setConsumables] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    const loadDailyConsumables =
        useCallback(async () => {

            try {

                setLoading(true);
                setError(null);


                /* =================================================
                   TODAY'S DATE RANGE
                ================================================= */

                const today =
                    new Date();


                const startDate =
                    new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        today.getDate(),
                        0,
                        0,
                        0
                    );


                const endDate =
                    new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        today.getDate(),
                        23,
                        59,
                        59
                    );


                /* =================================================
                   GET TODAY'S TRANSACTIONS
                ================================================= */

                const transactions =
                    await inventoryService
                        .getTransactionsByDateRange(
                            startDate.toISOString(),
                            endDate.toISOString()
                        );


                /* =================================================
                   ONLY STOCK OUT
                ================================================= */

                const stockOutTransactions =
                    (transactions || []).filter(
                        (transaction) =>
                            transaction.transactionType ===
                            "STOCK_OUT"
                    );


                /* =================================================
                   GET INVENTORY
                ================================================= */

                const inventory =
                    await inventoryService
                        .getAllInventory();


                /* =================================================
                   FIND CONSUMABLE ITEMS
                ================================================= */

                const consumableIds =
    new Set(
        (inventory || [])
            .filter(
                (item) =>
                    String(
                        item.itemType ?? ""
                    ).toUpperCase() === "CONSUMABLE"
            )
            .map(
                (item) =>
                    Number(
                        item.id ??
                        item.inventoryItemId
                    )
            )
    );


                /* =================================================
                   FINAL DAILY CONSUMABLES
                ================================================= */

                const dailyConsumables =
                    stockOutTransactions.filter(
                        (transaction) =>
                            consumableIds.has(
                                Number(
                                    transaction.inventoryItemId
                                )
                            )
                    );


                setConsumables(
                    dailyConsumables
                );

            }
            catch (error) {

                console.error(
                    "Failed to load daily consumables:",
                    error
                );


                setError(
                    error?.response?.data?.message ||
                    "Failed to load daily consumables."
                );


                setConsumables([]);

            }
            finally {

                setLoading(false);

            }

        }, []);


    useEffect(() => {

        loadDailyConsumables();

    }, [
        loadDailyConsumables
    ]);


    return {

        consumables,

        loading,

        error,

        refreshDailyConsumables:
            loadDailyConsumables

    };

}


export default useDailyConsumables;