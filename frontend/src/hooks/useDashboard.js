import {
    useCallback,
    useEffect,
    useState
} from "react";

import dashboardService
    from "../services/dashboardService";


function useDashboard() {

    const [inventory, setInventory] =
        useState([]);

    const [lowStock, setLowStock] =
        useState([]);

    const [expired, setExpired] =
        useState([]);

    const [expiringSoon, setExpiringSoon] =
        useState([]);

    const [transactions, setTransactions] =
        useState([]);

    const [equipment, setEquipment] =
        useState([]);

    const [maintenance, setMaintenance] =
        useState([]);

    const [maintenanceDue, setMaintenanceDue] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    const loadDashboard = useCallback(
        async () => {

            try {

                setLoading(true);

                setError(null);


                const results =
                    await Promise.allSettled([

                        dashboardService
                            .getInventory(),

                        dashboardService
                            .getLowStock(),

                        dashboardService
                            .getExpired(),

                        dashboardService
                            .getExpiringSoon(30),

                        dashboardService
                            .getTransactions(),

                        dashboardService
                            .getEquipment(),

                        dashboardService
                            .getMaintenance(),

                        dashboardService
                            .getMaintenanceDue()

                    ]);


                const [
                    inventoryResult,
                    lowStockResult,
                    expiredResult,
                    expiringSoonResult,
                    transactionsResult,
                    equipmentResult,
                    maintenanceResult,
                    maintenanceDueResult

                ] = results;


                if (
                    inventoryResult.status ===
                    "fulfilled"
                ) {

                    setInventory(
                        inventoryResult.value || []
                    );

                }
                else {

                    setInventory([]);

                }


                if (
                    lowStockResult.status ===
                    "fulfilled"
                ) {

                    setLowStock(
                        lowStockResult.value || []
                    );

                }
                else {

                    setLowStock([]);

                }


                if (
                    expiredResult.status ===
                    "fulfilled"
                ) {

                    setExpired(
                        expiredResult.value || []
                    );

                }
                else {

                    setExpired([]);

                }


                if (
                    expiringSoonResult.status ===
                    "fulfilled"
                ) {

                    setExpiringSoon(
                        expiringSoonResult.value || []
                    );

                }
                else {

                    setExpiringSoon([]);

                }


                if (
                    transactionsResult.status ===
                    "fulfilled"
                ) {

                    setTransactions(
                        transactionsResult.value || []
                    );

                }
                else {

                    setTransactions([]);

                }


                if (
                    equipmentResult.status ===
                    "fulfilled"
                ) {

                    setEquipment(
                        equipmentResult.value || []
                    );

                }
                else {

                    setEquipment([]);

                }


                if (
                    maintenanceResult.status ===
                    "fulfilled"
                ) {

                    setMaintenance(
                        maintenanceResult.value || []
                    );

                }
                else {

                    setMaintenance([]);

                }


                if (
                    maintenanceDueResult.status ===
                    "fulfilled"
                ) {

                    setMaintenanceDue(
                        maintenanceDueResult.value || []
                    );

                }
                else {

                    setMaintenanceDue([]);

                }


                const failedRequests =
                    results.filter(
                        (result) =>
                            result.status ===
                            "rejected"
                    );


                if (
                    failedRequests.length ===
                    results.length
                ) {

                    throw failedRequests[0].reason;

                }

            }
            catch (error) {

                console.error(
                    "Failed to load dashboard:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    "Failed to load dashboard data."
                );

            }
            finally {

                setLoading(false);

            }

        },
        []
    );


    useEffect(() => {

        loadDashboard();

    }, [
        loadDashboard
    ]);


    return {

        inventory,

        lowStock,

        expired,

        expiringSoon,

        transactions,

        equipment,

        maintenance,

        maintenanceDue,

        loading,

        error,

        refreshDashboard:
            loadDashboard

    };

}


export default useDashboard;