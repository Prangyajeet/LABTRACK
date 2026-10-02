import api from "./api";

const BASE_URL = "/equipment";

// =========================================================
// EQUIPMENT
// =========================================================

const getAllEquipment = async () => {
    const response = await api.get(BASE_URL);

    return response.data?.data ?? response.data ?? [];
};


const getEquipmentById = async (id) => {
    const response = await api.get(
        `${BASE_URL}/${id}`
    );

    return response.data?.data ?? response.data ?? null;
};


const searchEquipment = async (query) => {
    const response = await api.get(
        `${BASE_URL}/search`,
        {
            params: {
                query
            }
        }
    );

    return response.data?.data ?? response.data ?? [];
};


const getEquipmentByCategory = async (category) => {
    const response = await api.get(
        `${BASE_URL}/category/${category}`
    );

    return response.data?.data ?? response.data ?? [];
};


const createEquipment = async (data) => {
    const response = await api.post(
        BASE_URL,
        data
    );

    return response.data?.data ?? response.data ?? null;
};


const updateEquipment = async (id, data) => {
    const response = await api.put(
        `${BASE_URL}/${id}`,
        data
    );

    return response.data?.data ?? response.data ?? null;
};


const deleteEquipment = async (id) => {
    const response = await api.delete(
        `${BASE_URL}/${id}`
    );

    return response.data;
};


const restoreEquipment = async (id) => {
    const response = await api.put(
        `${BASE_URL}/${id}/restore`
    );

    return response.data;
};


// =========================================================
// AMC
// =========================================================

const getAmcExpiringSoon = async () => {
    const response = await api.get(
        `${BASE_URL}/amc/expiring`
    );

    return response.data?.data ?? response.data ?? [];
};


const getAmcExpired = async () => {
    const response = await api.get(
        `${BASE_URL}/amc/expired`
    );

    return response.data?.data ?? response.data ?? [];
};


// =========================================================
// MAINTENANCE DUE
// =========================================================

const getMaintenanceDue = async () => {
    const response = await api.get(
        `${BASE_URL}/maintenance/due`
    );

    return response.data?.data ?? response.data ?? [];
};


// =========================================================
// MAINTENANCE LOGS
// =========================================================

const createMaintenanceLog = async (data) => {
    const response = await api.post(
        `${BASE_URL}/maintenance`,
        data
    );

    return response.data?.data ?? response.data ?? null;
};


const getMaintenanceLogs = async (equipmentId) => {
    const response = await api.get(
        `${BASE_URL}/${equipmentId}/maintenance`
    );

    return response.data?.data ?? response.data ?? [];
};


const getAllMaintenanceLogs = async () => {
    const response = await api.get(
        `${BASE_URL}/maintenance`
    );

    return response.data?.data ?? response.data ?? [];
};


// =========================================================
// SERVICE OBJECT
// =========================================================

const equipmentService = {

    // Equipment
    getAllEquipment,
    getEquipmentById,
    searchEquipment,
    getEquipmentByCategory,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    restoreEquipment,

    // AMC
    getAmcExpiringSoon,
    getAmcExpired,

    // Maintenance
    getMaintenanceDue,
    createMaintenanceLog,
    getMaintenanceLogs,
    getAllMaintenanceLogs
};


// =========================================================
// DEFAULT EXPORT
// =========================================================

export default equipmentService;


// =========================================================
// NAMED EXPORTS
// =========================================================

export {
    getAllEquipment,
    getEquipmentById,
    searchEquipment,
    getEquipmentByCategory,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    restoreEquipment,
    getAmcExpiringSoon,
    getAmcExpired,
    getMaintenanceDue,
    createMaintenanceLog,
    getMaintenanceLogs,
    getAllMaintenanceLogs
};