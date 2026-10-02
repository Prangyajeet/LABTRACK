import api from "./api";

const BASE_URL = "/daily-consumables";

/**
 * ============================================================
 * RESPONSE NORMALIZER
 * ============================================================
 */
const unwrap = (response) => {
    if (response?.data?.data !== undefined) {
        return response.data.data;
    }

    if (response?.data !== undefined) {
        return response.data;
    }

    return response;
};

/**
 * ============================================================
 * GET CONSUMABLE ITEMS
 * ============================================================
 *
 * Existing endpoint.
 *
 * Used by the Log Usage form.
 *
 */
export const getConsumableItems = async () => {
    const response = await api.get(
        BASE_URL
    );

    return unwrap(response) || [];
};

/**
 * ============================================================
 * GET USAGE RECORDS
 * ============================================================
 */
export const getUsageRecords = async ({
    date = "",
    departmentId = "",
    search = ""
} = {}) => {
    const params = {};

    if (date) {
        params.date = date;
    }

    if (departmentId) {
        params.departmentId =
            departmentId;
    }

    if (search?.trim()) {
        params.search =
            search.trim();
    }

    const response =
        await api.get(
            `${BASE_URL}/usage`,
            {
                params
            }
        );

    return unwrap(response) || [];
};

/**
 * ============================================================
 * GET TODAY'S USAGE
 * ============================================================
 */
export const getTodayUsage = async () => {
    const response =
        await api.get(
            `${BASE_URL}/today`
        );

    return unwrap(response) || [];
};

/**
 * ============================================================
 * GET SUMMARY
 * ============================================================
 */
export const getUsageSummary = async ({
    date = "",
    departmentId = "",
    search = ""
} = {}) => {
    const params = {};

    if (date) {
        params.date = date;
    }

    if (departmentId) {
        params.departmentId =
            departmentId;
    }

    if (search?.trim()) {
        params.search =
            search.trim();
    }

    const response =
        await api.get(
            `${BASE_URL}/summary`,
            {
                params
            }
        );

    return unwrap(response) || {};
};

/**
 * ============================================================
 * LOG USAGE
 * ============================================================
 */
export const logConsumableUsage = async (
    payload
) => {
    const response =
        await api.post(
            BASE_URL,
            payload
        );

    return unwrap(response);
};

/**
 * ============================================================
 * GET SINGLE USAGE
 * ============================================================
 */
export const getUsageById = async (
    id
) => {
    const response =
        await api.get(
            `${BASE_URL}/usage/${id}`
        );

    return unwrap(response);
};

/**
 * ============================================================
 * UPDATE USAGE
 * ============================================================
 */
export const updateUsage = async (
    id,
    payload
) => {
    const response =
        await api.put(
            `${BASE_URL}/usage/${id}`,
            payload
        );

    return unwrap(response);
};

/**
 * ============================================================
 * DELETE / CORRECT USAGE
 * ============================================================
 */
export const deleteUsage = async (
    id
) => {
    const response =
        await api.delete(
            `${BASE_URL}/usage/${id}`
        );

    return unwrap(response);
};

/**
 * ============================================================
 * UPLOAD USAGE PHOTO
 * ============================================================
 *
 * Adds a photo of what was consumed.
 *
 * If a photo already exists, the backend replaces
 * the existing photo.
 *
 */
export const uploadUsagePhoto = async (
    id,
    photo
) => {
    const formData = new FormData();

    formData.append(
        "photo",
        photo
    );

    const response =
        await api.post(
            `${BASE_URL}/usage/${id}/photo`,
            formData
        );

    return unwrap(response);
};

/**
 * ============================================================
 * GET USAGE PHOTO
 * ============================================================
 *
 * Returns the actual image file.
 *
 * Used by Usage Details.
 *
 */
export const getUsagePhoto = async (
    id
) => {
    const response =
        await api.get(
            `${BASE_URL}/usage/${id}/photo`,
            {
                responseType: "blob"
            }
        );

    return response.data;
};

/**
 * ============================================================
 * DELETE USAGE PHOTO
 * ============================================================
 *
 * Removes the currently attached photo.
 *
 * This allows the user to remove the old photo
 * before uploading another one.
 *
 */
export const deleteUsagePhoto = async (
    id
) => {
    const response =
        await api.delete(
            `${BASE_URL}/usage/${id}/photo`
        );

    return unwrap(response);
};