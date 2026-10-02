import api from "./api";

const BASE_URL = "/timetables";


const unwrapResponse = (
    response
) => {

    if (!response) {
        return null;
    }


    const data =
        response?.data ??
        response;


    if (
        data?.data !== undefined
    ) {

        return data.data;
    }


    return data;
};


const normalizeList = (
    response
) => {

    const result =
        unwrapResponse(
            response
        );


    if (
        Array.isArray(result)
    ) {

        return result;
    }


    if (
        Array.isArray(
            result?.content
        )
    ) {

        return result.content;
    }


    if (
        Array.isArray(
            result?.data
        )
    ) {

        return result.data;
    }


    if (
        Array.isArray(
            result?.data?.content
        )
    ) {

        return result.data.content;
    }


    return [];
};


// =========================================================
// GET ALL
// =========================================================

export const getAllTimetables =
    async () => {

        const response =
            await api.get(
                BASE_URL
            );


        return unwrapResponse(
            response
        );
    };


// =========================================================
// GET TIMETABLE
// =========================================================

export const getTimetable =
    async ({
        date = "",
        lab = "",
        day = ""
    } = {}) => {

        const response =
            await api.get(
                BASE_URL,
                {
                    params: {

                        date:
                            date ||
                            undefined,

                        day:
                            day ||
                            undefined,

                        lab:
                            lab ||
                            undefined

                    }
                }
            );


        return response.data;
    };


// =========================================================
// GET BY ID
// =========================================================

export const getTimetableById =
    async (
        id
    ) => {

        if (!id) {

            throw new Error(
                "Timetable ID is required."
            );
        }


        const response =
            await api.get(
                `${BASE_URL}/${id}`
            );


        return unwrapResponse(
            response
        );
    };


// =========================================================
// LIVE OCCUPANCY
// =========================================================

export const getLabOccupancy =
    async ({
        date = "",
        lab = ""
    } = {}) => {

        const response =
            await api.get(
                `${BASE_URL}/occupancy`,
                {
                    params: {

                        date:
                            date ||
                            undefined,

                        lab:
                            lab ||
                            undefined

                    }
                }
            );


        return response.data;
    };


// =========================================================
// MANUAL OCCUPANCY STATUS
// =========================================================
//
// VACANT:
//     Admin makes active lab vacant.
//
// SCHEDULED:
//     Restore automatic live calculation.
//
// =========================================================

export const updateOccupancyStatus =
    async (
        id,
        status
    ) => {

        if (!id) {

            throw new Error(
                "Timetable ID is required."
            );
        }


        if (!status) {

            throw new Error(
                "Occupancy status is required."
            );
        }


        const response =
            await api.patch(
                `${BASE_URL}/${id}/occupancy-status`,
                null,
                {
                    params: {
                        status
                    }
                }
            );


        return response.data;
    };


// =========================================================
// UPLOAD
// =========================================================

export const uploadTimetable =
    async (
        file
    ) => {

        if (!file) {

            throw new Error(
                "Timetable file is required."
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
                `${BASE_URL}/upload`,
                formData
            );


        return response.data;
    };


// =========================================================
// CREATE
// =========================================================

export const createTimetable =
    async (
        data
    ) => {

        const response =
            await api.post(
                BASE_URL,
                data
            );


        return response.data;
    };


// =========================================================
// UPDATE
// =========================================================

export const updateTimetable =
    async (
        id,
        data
    ) => {

        if (!id) {

            throw new Error(
                "Timetable ID is required."
            );
        }


        const response =
            await api.put(
                `${BASE_URL}/${id}`,
                data
            );


        return response.data;
    };


// =========================================================
// DELETE
// =========================================================

export const deleteTimetable =
    async (
        id
    ) => {

        if (!id) {

            throw new Error(
                "Timetable ID is required."
            );
        }


        const response =
            await api.delete(
                `${BASE_URL}/${id}`
            );


        return response.data;
    };


export {
    unwrapResponse,
    normalizeList
};