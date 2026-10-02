import api from "./api";


const BASE_URL = "/sops";


export const getAllSops = async () => {

    const response =
        await api.get(
            BASE_URL
        );

    return response.data;
};


export const getSopsByDepartment = async (
    departmentId
) => {

    const response =
        await api.get(
            `${BASE_URL}/department/${departmentId}`
        );

    return response.data;
};


export const uploadSop = async (
    departmentId,
    file
) => {

    if (!departmentId) {

        throw new Error(
            "Department is required."
        );
    }


    if (!file) {

        throw new Error(
            "Please select an SOP file."
        );
    }


    const formData =
        new FormData();


    formData.append(
        "departmentId",
        departmentId
    );


    formData.append(
        "file",
        file
    );


    const response =
        await api.post(
            BASE_URL,
            formData
        );


    return response.data;
};


const getSopBlob = async (
    id,
    download = false
) => {

    const response =
        await api.get(
            download
                ? `${BASE_URL}/${id}/download`
                : `${BASE_URL}/${id}/file`,
            {
                responseType: "blob"
            }
        );


    return response;
};


export const viewSop = async (
    sop
) => {

    const id =
        sop?.id;


    if (!id) {

        throw new Error(
            "SOP ID is missing."
        );
    }


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
            "Loading SOP...";


        const response =
            await getSopBlob(
                id,
                false
            );


        const contentType =
            response.headers?.[
                "content-type"
            ] ||
            sop?.contentType ||
            "application/octet-stream";


        const blob =
            new Blob(
                [
                    response.data
                ],
                {
                    type: contentType
                }
            );


        const blobUrl =
            window.URL.createObjectURL(
                blob
            );


        previewWindow.location.href =
            blobUrl;


        setTimeout(
            () => {

                window.URL.revokeObjectURL(
                    blobUrl
                );

            },
            60000
        );

    } catch (error) {

        try {

            previewWindow.close();

        } catch (ignored) {

            // Nothing required.

        }


        throw error;
    }
};


export const downloadSop = async (
    sop
) => {

    const id =
        sop?.id;


    if (!id) {

        throw new Error(
            "SOP ID is missing."
        );
    }


    const response =
        await getSopBlob(
            id,
            true
        );


    const contentType =
        response.headers?.[
            "content-type"
        ] ||
        sop?.contentType ||
        "application/octet-stream";


    const blob =
        new Blob(
            [
                response.data
            ],
            {
                type: contentType
            }
        );


    const blobUrl =
        window.URL.createObjectURL(
            blob
        );


    const link =
        window.document.createElement(
            "a"
        );


    link.href =
        blobUrl;


    link.download =
        sop?.originalFileName ||
        "SOP";


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
 * DELETE SOP
 * ============================================================
 */

export const deleteSop = async (
    id
) => {

    if (!id) {

        throw new Error(
            "SOP ID is missing."
        );
    }


    await api.delete(
        `${BASE_URL}/${id}`
    );
};