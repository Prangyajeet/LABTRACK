import api from "./api";

const BASE_URL = "/suppliers";

export async function getAllSuppliers(

    page = 0,

    size = 10,

    sortBy = "supplierName",

    sortDirection = "asc",

    search = ""

) {

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

}

export async function getSupplierById(id) {

    const response = await api.get(

        `${BASE_URL}/${id}`

    );

    return response.data.data;

}

export async function createSupplier(supplier) {

    const response = await api.post(

        BASE_URL,

        supplier

    );

    return response.data.data;

}

export async function updateSupplier(

    id,

    supplier

) {

    const response = await api.put(

        `${BASE_URL}/${id}`,

        supplier

    );

    return response.data.data;

}

export async function deleteSupplier(id) {

    const response = await api.delete(

        `${BASE_URL}/${id}`

    );

    return response.data;

}

export async function restoreSupplier(id) {

    const response = await api.put(

        `${BASE_URL}/${id}/restore`

    );

    return response.data.data;

}

export async function exportSuppliers() {

    const response = await api.get(

        `${BASE_URL}/export`,

        {

            responseType: "blob"

        }

    );

    return response.data;

}