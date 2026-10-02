import api from "./api";

const BASE_URL = "/categories";

export const getAllCategories = async (

    page = 0,

    size = 100,

    sortBy = "categoryName",

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

export const getCategoryById = async (id) => {

    const response = await api.get(

        `${BASE_URL}/${id}`

    );

    return response.data.data;

};

export const createCategory = async (category) => {

    const response = await api.post(

        BASE_URL,

        category

    );

    return response.data.data;

};

export const updateCategory = async (

    id,

    category

) => {

    const response = await api.put(

        `${BASE_URL}/${id}`,

        category

    );

    return response.data.data;

};

export const deleteCategory = async (id) => {

    await api.delete(

        `${BASE_URL}/${id}`

    );

};

export const restoreCategory = async (id) => {

    const response = await api.put(

        `${BASE_URL}/${id}/restore`

    );

    return response.data.data;

};

export const exportCategories = async () => {

    const response = await api.get(

        `${BASE_URL}/export`,

        {

            responseType: "blob"

        }

    );

    return response.data;

};