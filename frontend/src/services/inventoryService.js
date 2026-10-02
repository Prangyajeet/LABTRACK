import api from "./api";

const inventoryService = {

    // =========================================================
    // INVENTORY
    // =========================================================

    getAllInventory: async () => {

        const response = await api.get(
            "/inventory"
        );

        return response.data?.data ?? [];
    },


    getInventoryById: async (id) => {

        const response = await api.get(
            `/inventory/${id}`
        );

        return response.data?.data ?? null;
    },


    createInventory: async (inventoryData) => {

        const response = await api.post(
            "/inventory",
            inventoryData
        );

        return response.data?.data ?? null;
    },


    updateInventory: async (
        id,
        inventoryData
    ) => {

        const response = await api.put(
            `/inventory/${id}`,
            inventoryData
        );

        return response.data?.data ?? null;
    },


    deleteInventory: async (id) => {

        const response = await api.delete(
            `/inventory/${id}`
        );

        return response.data;
    },


    // =========================================================
    // INVENTORY SEARCH
    // =========================================================

    searchInventory: async (keyword) => {

        const response = await api.get(
            "/inventory/search",
            {
                params: {
                    keyword
                }
            }
        );

        return response.data?.data ?? [];
    },


    getInventoryByCategory: async (
        categoryId
    ) => {

        const response = await api.get(
            `/inventory/category/${categoryId}`
        );

        return response.data?.data ?? [];
    },


    getInventoryBySupplier: async (
        supplierId
    ) => {

        const response = await api.get(
            `/inventory/supplier/${supplierId}`
        );

        return response.data?.data ?? [];
    },


    getInventoryByStorageLocation: async (
        locationId
    ) => {

        const response = await api.get(
            `/inventory/storage-location/${locationId}`
        );

        return response.data?.data ?? [];
    },


    // =========================================================
    // INVENTORY STOCK STATUS
    // =========================================================

    getLowStock: async () => {

        const response = await api.get(
            "/inventory/low-stock"
        );

        return response.data?.data ?? [];
    },


    getExpired: async () => {

        const response = await api.get(
            "/inventory/expired"
        );

        return response.data?.data ?? [];
    },


    getExpiringSoon: async (
        days = 30
    ) => {

        const response = await api.get(
            "/inventory/expiring-soon",
            {
                params: {
                    days
                }
            }
        );

        return response.data?.data ?? [];
    },


    // =========================================================
    // INVENTORY TRANSACTIONS
    // =========================================================

    getAllTransactions: async () => {

        const response = await api.get(
            "/inventory-transactions"
        );

        return response.data?.data ?? [];
    },


    getTransactionById: async (id) => {

        const response = await api.get(
            `/inventory-transactions/${id}`
        );

        return response.data?.data ?? null;
    },


    createTransaction: async (
        transactionData
    ) => {

        const response = await api.post(
            "/inventory-transactions",
            transactionData
        );

        return response.data?.data ?? null;
    },


    // =========================================================
    // STOCK IN
    //
    // Stock In is an Inventory Transaction with:
    //
    // transactionType = STOCK_IN
    // =========================================================

    createStockIn: async ({
        inventoryItemId,
        quantity,
        remarks
    }) => {

        return await inventoryService.createTransaction({

            inventoryItemId: Number(
                inventoryItemId
            ),

            transactionType: "STOCK_IN",

            quantity: Number(
                quantity
            ),

            remarks:
                remarks?.trim() || null
        });
    },


    // =========================================================
    // STOCK OUT
    //
    // Stock Out is an Inventory Transaction with:
    //
    // transactionType = STOCK_OUT
    // =========================================================

    createStockOut: async ({
        inventoryItemId,
        quantity,
        remarks
    }) => {

        return await inventoryService.createTransaction({

            inventoryItemId: Number(
                inventoryItemId
            ),

            transactionType: "STOCK_OUT",

            quantity: Number(
                quantity
            ),

            remarks:
                remarks?.trim() || null
        });
    },


    getTransactionsByInventoryItem: async (
        inventoryItemId
    ) => {

        const response = await api.get(
            `/inventory-transactions/inventory/${inventoryItemId}`
        );

        return response.data?.data ?? [];
    },


    getTransactionsByType: async (
        transactionType
    ) => {

        const response = await api.get(
            `/inventory-transactions/type/${transactionType}`
        );

        return response.data?.data ?? [];
    },


    getTransactionsByDateRange: async (
        startDate,
        endDate
    ) => {

        const response = await api.get(
            "/inventory-transactions/date-range",
            {
                params: {
                    startDate,
                    endDate
                }
            }
        );

        return response.data?.data ?? [];
    },


    deleteTransaction: async (id) => {

        const response = await api.delete(
            `/inventory-transactions/${id}`
        );

        return response.data;
    },


    // =========================================================
    // DAILY CONSUMABLES
    // =========================================================

    getDailyConsumables: async () => {

        const response = await api.get(
            "/daily-consumables"
        );

        return response.data?.data ?? [];
    },


    getDailyConsumableById: async (id) => {

        const response = await api.get(
            `/daily-consumables/${id}`
        );

        return response.data?.data ?? null;
    },


    getLowStockConsumables: async () => {

        const response = await api.get(
            "/daily-consumables/low-stock"
        );

        return response.data?.data ?? [];
    }

};

export default inventoryService;