import api from "./api";

/*
 * ============================================================
 * AMC DOCUMENT SERVICE
 * ============================================================
 *
 * AMC documents belong directly to an Equipment record.
 *
 * Base API:
 *
 * /api/equipment/{equipmentId}/amc-documents
 *
 * Supported operations:
 *
 * GET     - Get documents
 * POST    - Upload document
 * GET     - View/download document
 * DELETE  - Delete document
 *
 * IMPORTANT:
 *
 * All protected file requests go through Axios so that the
 * existing authentication interceptor remains active.
 * ============================================================
 */


/*
 * ============================================================
 * BASE URL
 * ============================================================
 */

const getBaseUrl = (
    equipmentId
) => {

    if (!equipmentId) {

        throw new Error(
            "Equipment ID is required."
        );

    }

    return (
        `/equipment/${equipmentId}/amc-documents`
    );

};


/*
 * ============================================================
 * GET AMC DOCUMENTS
 * ============================================================
 */

export const getAmcDocuments = async (
    equipmentId
) => {

    const response =
        await api.get(
            getBaseUrl(
                equipmentId
            )
        );

    return response.data;

};


/*
 * ============================================================
 * UPLOAD AMC DOCUMENT
 * ============================================================
 *
 * POST
 *
 * /api/equipment/{equipmentId}/amc-documents
 *
 * multipart/form-data
 *
 * file
 * documentType
 *
 * IMPORTANT:
 *
 * Do NOT manually set Content-Type.
 *
 * Axios/browser automatically generates the multipart
 * boundary when FormData is used.
 * ============================================================
 */

export const uploadAmcDocument = async (
    equipmentId,
    file,
    documentType
) => {

    if (!equipmentId) {

        throw new Error(
            "Equipment ID is required."
        );

    }

    if (!file) {

        throw new Error(
            "Please select an AMC document."
        );

    }

    if (!documentType) {

        throw new Error(
            "Document type is required."
        );

    }


    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    formData.append(
        "documentType",
        documentType
    );


    const response =
        await api.post(
            getBaseUrl(
                equipmentId
            ),
            formData
        );


    return response.data;

};


/*
 * ============================================================
 * GET DOCUMENT FILE
 * ============================================================
 *
 * This is the common authenticated file request used by both
 * View and Download.
 *
 * responseType = blob
 *
 * This is important because the backend returns raw file bytes.
 * ============================================================
 */

const getAmcDocumentBlob = async (
    equipmentId,
    documentId
) => {

    if (!equipmentId) {

        throw new Error(
            "Equipment ID is required."
        );

    }

    if (!documentId) {

        throw new Error(
            "Document ID is missing."
        );

    }


    const response =
        await api.get(
            `${getBaseUrl(
                equipmentId
            )}/${documentId}`,
            {
                responseType: "blob"
            }
        );


    return response;

};


/*
 * ============================================================
 * VIEW AMC DOCUMENT
 * ============================================================
 *
 * IMPORTANT:
 *
 * We CANNOT simply do:
 *
 * window.open(api-url)
 *
 * because the backend endpoint requires JWT authentication.
 *
 * Instead:
 *
 * 1. Open a new browser tab immediately.
 * 2. Request the document through Axios.
 * 3. Axios attaches the JWT.
 * 4. Convert response to Blob.
 * 5. Create a temporary Blob URL.
 * 6. Open the Blob URL in the new tab.
 *
 * This fixes authenticated preview problems.
 * ============================================================
 */

export const viewAmcDocument = async (
    equipmentId,
    documentRecord
) => {

    const documentId =
        documentRecord?.id ??
        documentRecord?.documentId;


    if (!equipmentId) {

        throw new Error(
            "Equipment ID is required."
        );

    }

    if (!documentId) {

        throw new Error(
            "Document ID is missing."
        );

    }


    /*
     * Open the tab BEFORE the async Axios request.
     *
     * This prevents browsers from treating the new tab as
     * an unwanted popup.
     */

    const previewWindow =
        window.open(
            "about:blank",
            "_blank"
        );


    if (!previewWindow) {

        throw new Error(
            "The browser blocked the document preview. Please allow pop-ups for LabTrack."
        );

    }


    try {

        previewWindow.document.title =
            "Loading document...";


        const response =
            await getAmcDocumentBlob(
                equipmentId,
                documentId
            );


        const contentType =
            response.headers[
                "content-type"
            ] ||
            documentRecord?.contentType ||
            "application/octet-stream";


        const blob =
            new Blob(
                [response.data],
                {
                    type: contentType
                }
            );


        const blobUrl =
            window.URL.createObjectURL(
                blob
            );


        /*
         * Navigate the already-open tab to the authenticated
         * document Blob.
         */

        previewWindow.location.href =
            blobUrl;


        /*
         * Keep the Blob URL alive long enough for the browser
         * to load the document.
         */

        setTimeout(
            () => {

                window.URL.revokeObjectURL(
                    blobUrl
                );

            },
            60000
        );


    } catch (error) {

        /*
         * Close the blank preview tab when the authenticated
         * request fails.
         */

        try {

            previewWindow.close();

        } catch (ignored) {

            // Nothing required.

        }


        throw error;

    }

};


/*
 * ============================================================
 * DOWNLOAD AMC DOCUMENT
 * ============================================================
 *
 * Downloads the document through Axios so JWT authentication
 * is preserved.
 *
 * IMPORTANT:
 *
 * The parameter is called documentRecord instead of document.
 *
 * This prevents shadowing the browser's global document object.
 * ============================================================
 */

export const downloadAmcDocument = async (
    equipmentId,
    documentRecord
) => {

    const documentId =
        documentRecord?.id ??
        documentRecord?.documentId;


    if (!equipmentId) {

        throw new Error(
            "Equipment ID is required."
        );

    }

    if (!documentId) {

        throw new Error(
            "Document ID is missing."
        );

    }


    const response =
        await getAmcDocumentBlob(
            equipmentId,
            documentId
        );


    const contentType =
        response.headers[
            "content-type"
        ] ||
        documentRecord?.contentType ||
        "application/octet-stream";


    const blob =
        new Blob(
            [response.data],
            {
                type: contentType
            }
        );


    const blobUrl =
        window.URL.createObjectURL(
            blob
        );


    /*
     * Browser global document.
     *
     * The function parameter is deliberately named
     * documentRecord so this works correctly.
     */

    const link =
        window.document.createElement(
            "a"
        );


    link.href =
        blobUrl;


    link.download =
        documentRecord?.originalFileName ||
        documentRecord?.fileName ||
        documentRecord?.documentName ||
        "AMC-Document";


    window.document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(
        () => {

            window.URL.revokeObjectURL(
                blobUrl
            );

        },
        1000
    );

};


/*
 * ============================================================
 * DELETE AMC DOCUMENT
 * ============================================================
 */

export const deleteAmcDocument = async (
    equipmentId,
    documentId
) => {

    if (!equipmentId) {

        throw new Error(
            "Equipment ID is required."
        );

    }

    if (!documentId) {

        throw new Error(
            "Document ID is required."
        );

    }


    const response =
        await api.delete(
            `${getBaseUrl(
                equipmentId
            )}/${documentId}`
        );


    return response.data;

};


/*
 * ============================================================
 * BUILD DOCUMENT URL
 * ============================================================
 *
 * Kept for compatibility with any existing code that may still
 * use this helper.
 *
 * IMPORTANT:
 *
 * This URL is suitable for reference/debugging only.
 *
 * Do NOT use window.open() directly with this URL because the
 * endpoint requires JWT authentication.
 * ============================================================
 */

export const getAmcDocumentUrl = (
    equipmentId,
    documentId
) => {

    if (
        !equipmentId ||
        !documentId
    ) {

        return "";

    }


    const baseURL =
        api.defaults.baseURL ||
        "";


    return (
        `${baseURL}` +
        `${getBaseUrl(
            equipmentId
        )}` +
        `/${documentId}`
    );

};