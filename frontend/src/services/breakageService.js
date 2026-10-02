import api from "./api";

const BASE_URL = "/breakages";


/* =========================================================
 * BREAKAGE
 * ========================================================= */

export const getBreakages = async ({
    page = 0,
    size = 10,
    search = "",
    personType = "",
    recoveryStatus = "",
    sortBy = "breakageDate",
    sortDirection = "desc"
} = {}) => {

    const response = await api.get(
        BASE_URL,
        {
            params: {
                page,
                size,
                search,
                personType:
                    personType || undefined,
                recoveryStatus:
                    recoveryStatus || undefined,
                sortBy,
                sortDirection
            }
        }
    );

    return response.data;
};


export const getBreakageById = async (
    id
) => {

    const response = await api.get(
        `${BASE_URL}/${id}`
    );

    return response.data;
};


export const createBreakage = async (
    data
) => {

    const response = await api.post(
        BASE_URL,
        data
    );

    return response.data;
};


export const updateBreakage = async (
    id,
    data
) => {

    const response = await api.put(
        `${BASE_URL}/${id}`,
        data
    );

    return response.data;
};


export const updateRecoveryStatus = async (
    id,
    recoveryStatus
) => {

    const response = await api.patch(
        `${BASE_URL}/${id}/recovery-status`,
        null,
        {
            params: {
                recoveryStatus
            }
        }
    );

    return response.data;
};


export const deleteBreakage = async (
    id
) => {

    const response = await api.delete(
        `${BASE_URL}/${id}`
    );

    return response.data;
};


export const getBreakageSummary = async () => {

    const response = await api.get(
        `${BASE_URL}/summary`
    );

    return response.data;
};


/* =========================================================
 * ACTIVE ITEMS FOR BREAKAGE
 * ========================================================= */

export const getBreakageItems = async () => {

    const response = await api.get(
        "/items",
        {
            params: {
                page: 0,
                size: 1000,
                sortBy: "itemName",
                sortDirection: "asc",
                search: ""
            }
        }
    );

    return response.data;
};


/* =========================================================
 * BREAKAGE EVIDENCE / PHOTO
 * ========================================================= */


/*
 * ---------------------------------------------------------
 * UPLOAD BREAKAGE PHOTO
 * ---------------------------------------------------------
 *
 * POST
 * /api/breakages/{breakageId}/evidence
 *
 * IMPORTANT:
 * Do NOT manually set Content-Type.
 * Axios will automatically create the multipart boundary.
 */

export const uploadBreakageEvidence = async (
    breakageId,
    file
) => {

    if (!breakageId) {

        throw new Error(
            "Breakage ID is required for photo upload."
        );

    }

    if (!file) {

        throw new Error(
            "Photo file is required."
        );

    }


    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );


    const response =
        await api.post(
            `${BASE_URL}/${breakageId}/evidence`,
            formData
        );


    return response.data;
};


/*
 * ---------------------------------------------------------
 * GET EVIDENCE LIST
 * ---------------------------------------------------------
 *
 * GET
 * /api/breakages/{breakageId}/evidence
 */

export const getBreakageEvidence = async (
    breakageId
) => {

    if (!breakageId) {

        throw new Error(
            "Breakage ID is required."
        );

    }


    const response =
        await api.get(
            `${BASE_URL}/${breakageId}/evidence`
        );


    return response.data;
};


/*
 * ---------------------------------------------------------
 * GET ACTUAL IMAGE AS BLOB
 * ---------------------------------------------------------
 *
 * IMPORTANT:
 *
 * The image endpoint is protected by JWT.
 *
 * Therefore we MUST use Axios here instead of:
 *
 * <img src="http://localhost:8080/api/...">
 *
 * Axios automatically attaches the JWT through api.js.
 */

export const getBreakageEvidenceImage = async (
    breakageId,
    evidenceId
) => {

    if (!breakageId) {

        throw new Error(
            "Breakage ID is required."
        );

    }

    if (!evidenceId) {

        throw new Error(
            "Evidence ID is required."
        );

    }


    const response =
        await api.get(
            `${BASE_URL}/${breakageId}/evidence/${evidenceId}`,
            {
                responseType: "blob"
            }
        );


    return response.data;
};


/*
 * ---------------------------------------------------------
 * BUILD IMAGE URL
 * ---------------------------------------------------------
 *
 * Kept for compatibility with existing code.
 */

export const getBreakageEvidenceUrl = (
    breakageId,
    evidenceId
) => {

    return (
        `${api.defaults.baseURL}` +
        `${BASE_URL}/${breakageId}/evidence/${evidenceId}`
    );

};