import {
    useCallback,
    useEffect,
    useState
} from "react";

import maintenanceService
    from "../services/maintenanceService";


function useMaintenance() {

    const [maintenanceLogs, setMaintenanceLogs] =
        useState([]);

    const [maintenanceDue, setMaintenanceDue] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    // =========================================================
    // LOAD MAINTENANCE LOGS
    // =========================================================

    const loadMaintenance = useCallback(
        async () => {

            try {

                setLoading(true);
                setError(null);


                const [
                    logs,
                    due
                ] = await Promise.all([

                    maintenanceService
                        .getAllMaintenance(),

                    maintenanceService
                        .getMaintenanceDue()

                ]);


                setMaintenanceLogs(
                    logs || []
                );

                setMaintenanceDue(
                    due || []
                );

            }
            catch (error) {

                console.error(
                    "Failed to load maintenance:",
                    error
                );


                setError(
                    error?.response?.data?.message ||
                    "Failed to load maintenance records."
                );


                setMaintenanceLogs([]);
                setMaintenanceDue([]);

            }
            finally {

                setLoading(false);

            }

        },
        []
    );


    // =========================================================
    // CREATE MAINTENANCE
    // =========================================================

    const createMaintenance = async (
        maintenanceData
    ) => {

        try {

            setError(null);


            const response =
                await maintenanceService
                    .createMaintenance(
                        maintenanceData
                    );


            await loadMaintenance();


            return response;

        }
        catch (error) {

            console.error(
                "Failed to create maintenance:",
                error
            );


            setError(
                error?.response?.data?.message ||
                "Failed to save maintenance record."
            );


            throw error;

        }

    };


    useEffect(() => {

        loadMaintenance();

    }, [loadMaintenance]);


    return {

        maintenanceLogs,

        maintenanceDue,

        loading,

        error,

        createMaintenance,

        refreshMaintenance:
            loadMaintenance

    };

}


export default useMaintenance;