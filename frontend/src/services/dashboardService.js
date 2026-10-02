import inventoryService from "./inventoryService";
import equipmentService from "./equipmentService";
import maintenanceService from "./maintenanceService";

const dashboardService = {

    // =========================================================
    // INVENTORY
    // =========================================================

    getInventory: async () => {

        return await inventoryService.getAllInventory();

    },


    getLowStock: async () => {

        return await inventoryService.getLowStock();

    },


    getExpired: async () => {

        return await inventoryService.getExpired();

    },


    getExpiringSoon: async (
        days = 30
    ) => {

        return await inventoryService.getExpiringSoon(
            days
        );

    },


    // =========================================================
    // INVENTORY TRANSACTIONS
    // =========================================================

    getTransactions: async () => {

        return await inventoryService.getAllTransactions();

    },


    // =========================================================
    // EQUIPMENT
    // =========================================================

    getEquipment: async () => {

        const response =
            await equipmentService.getAllEquipment();

        return response || [];

    },


    // =========================================================
    // MAINTENANCE
    // =========================================================

    getMaintenance: async () => {

        return await maintenanceService.getAllMaintenance();

    },


    getMaintenanceDue: async () => {

        return await maintenanceService.getMaintenanceDue();

    }

};

export default dashboardService;