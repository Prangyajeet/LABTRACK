import api from "./api";

const BASE_URL = "/breakages";

/*
 * Upload breakage evidence photo
 *
 * Backend endpoint:
 * POST /api/breakages/{breakageId}/evidence
 *
 * IMPORTANT:
 * This request MUST be multipart/form-data.
 */

export const createBreakageEvidence = async (
    breakageId,
    file
) => {

    if (!breakageId) {
        throw new Error(
            "Breakage ID is required."
        );
    }

    if (!file) {
        throw new Error(
            "Breakage photo is required."
        );
    }

    const formData = new FormData();

    /*
     * IMPORTANT:
     * The backend MultipartFile parameter
     * must receive the file as "file".
     */
    formData.append(
        "file",
        file
    );

    console.log(
        "BREAKAGE EVIDENCE FORMDATA:",
        {
            breakageId,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size
        }
    );

    const response = await api.post(
        `${BASE_URL}/${breakageId}/evidence`,
        formData,
        {
            headers: {
                /*
                 * DO NOT set:
                 * Content-Type: application/json
                 *
                 * Axios/browser will automatically
                 * generate:
                 *
                 * multipart/form-data;
                 * boundary=....
                 */
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};


/*
 * Get evidence for a breakage
 */

export const getBreakageEvidence = async (
    breakageId
) => {

    const response = await api.get(
        `${BASE_URL}/${breakageId}/evidence`
    );

    return response.data;
};


/*
 * Delete evidence
 */

export const deleteBreakageEvidence = async (
    breakageId,
    evidenceId
) => {

    const response = await api.delete(
        `${BASE_URL}/${breakageId}/evidence/${evidenceId}`
    );

    return response.data;
};