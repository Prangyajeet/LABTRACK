import api from "./api";
import { API_ENDPOINTS } from "../constants/apiConstants";
import { storage } from "../utils/storage";


export const login = async (credentials) => {

    const response =
        await api.post(
            API_ENDPOINTS.LOGIN,
            credentials
        );


    const data =
        response?.data;


    /*
     * ========================================================
     * VALIDATE LOGIN RESPONSE
     * ========================================================
     *
     * Backend login response contains:
     *
     *     token
     *     userId
     *     email
     *     role
     *     fullName
     *     department
     *
     * Example:
     *
     * {
     *     "token": "...",
     *     "userId": 1,
     *     "email": "admin@labtrack.com",
     *     "role": "ADMIN",
     *     "fullName": "System Administrator",
     *     "department": "Biology"
     * }
     *
     * The backend response is returned directly,
     * so response.data is the actual login object.
     */

    if (
        !data ||
        !data.token
    ) {

        console.error(
            "LOGIN RESPONSE DATA MISSING:",
            data
        );

        throw new Error(
            "Invalid login response."
        );

    }


    /*
     * ========================================================
     * STORE AUTHENTICATION DATA
     * ========================================================
     *
     * The api.js interceptor reads the same token through:
     *
     *     storage.getToken()
     */

    storage.setToken(
        data.token
    );


    /*
     * ========================================================
     * STORE USER INFORMATION
     * ========================================================
     */

    if (
        data?.userId !== undefined &&
        data?.userId !== null
    ) {

        localStorage.setItem(
            "labtrack_user_id",
            String(data.userId)
        );

    }


    if (data?.email) {

        localStorage.setItem(
            "labtrack_email",
            data.email
        );

    }


    if (data?.role) {

        localStorage.setItem(
            "labtrack_role",
            data.role
        );

    }


    if (data?.fullName) {

        localStorage.setItem(
            "labtrack_full_name",
            data.fullName
        );

    }


    if (data?.department) {

        localStorage.setItem(
            "labtrack_department",
            data.department
        );

    }


    /*
     * ========================================================
     * RETURN LOGIN DATA
     * ========================================================
     */

    return data;

};


export const logout = () => {

    storage.clear();

    localStorage.removeItem(
        "labtrack_user_id"
    );

    localStorage.removeItem(
        "labtrack_email"
    );

    localStorage.removeItem(
        "labtrack_role"
    );

    localStorage.removeItem(
        "labtrack_full_name"
    );

    localStorage.removeItem(
        "labtrack_department"
    );

};


export default {
    login,
    logout
};