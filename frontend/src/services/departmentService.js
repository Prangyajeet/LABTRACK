import api from "./api";


const BASE_URL = "/departments";


export const getAllDepartments = async (

    page = 0,

    size = 10,

    sortBy = "departmentName",

    sortDirection = "asc",

    search = ""

) => {

    const response = await api.get(
        BASE_URL,
        {

            params: {

                page,

                size,

                sortBy,

                sortDirection,

                search

            }

        }
    );

    return response.data.data;

};


export const getDepartmentById = async (id) => {

    const response =
        await api.get(
            `${BASE_URL}/${id}`
        );

    return response.data.data;

};


export const createDepartment = async (
    department
) => {

    const response =
        await api.post(
            BASE_URL,
            department
        );

    return response.data.data;

};


export const updateDepartment = async (

    id,

    department

) => {

    const response =
        await api.put(
            `${BASE_URL}/${id}`,
            department
        );

    return response.data.data;

};


export const deleteDepartment = async (id) => {

    await api.delete(
        `${BASE_URL}/${id}`
    );

};


export const restoreDepartment = async (id) => {

    const response =
        await api.put(
            `${BASE_URL}/${id}/restore`
        );

    return response.data.data;

};


export const exportDepartments = async () => {

    const response =
        await api.get(
            "/departments/export",
            {
                responseType: "blob"
            }
        );

    return response.data;

};