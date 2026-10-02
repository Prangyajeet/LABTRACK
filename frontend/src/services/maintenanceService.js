import api from "./api";

const maintenanceService = {

    // =========================================================
    // MAINTENANCE LOGS
    // =========================================================

    createMaintenance: async (maintenanceData) => {

        const response = await api.post(
            "/equipment/maintenance",
            maintenanceData
        );

        return response.data?.data ?? response.data;

    },


    // =========================================================
    // GET ALL MAINTENANCE
    // =========================================================

    getAllMaintenance: async () => {

        const response = await api.get(
            "/equipment/maintenance"
        );

        return response.data?.data ?? response.data ?? [];

    },


    // =========================================================
    // GET MAINTENANCE BY EQUIPMENT
    // =========================================================

    getMaintenanceByEquipment: async (
        equipmentId
    ) => {

        const response = await api.get(
            `/equipment/${equipmentId}/maintenance`
        );

        return response.data?.data ?? response.data ?? [];

    },


    // =========================================================
    // GET MAINTENANCE DUE
    // =========================================================

    getMaintenanceDue: async () => {

        const response = await api.get(
            "/equipment/maintenance/due"
        );

        return response.data?.data ?? response.data ?? [];

    }

};

export default maintenanceService;