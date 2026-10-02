import api from "./api";

export const getDepartmentDropdown = async () => {

    const response = await api.get(
        "/departments/dropdown"
    );

    return response.data.data;

}; 