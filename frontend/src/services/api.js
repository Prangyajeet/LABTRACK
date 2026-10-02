import axios from "axios";

import { storage } from "../utils/storage";


const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8080/api";


const api = axios.create({

    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json"
    }

});


/*
 * ============================================================
 * REQUEST INTERCEPTOR
 * ============================================================
 *
 * 1. Attach JWT to every protected request.
 * 2. Keep JSON requests as application/json.
 * 3. When uploading FormData, remove Content-Type so Axios
 *    automatically creates the multipart boundary.
 * ============================================================
 */

api.interceptors.request.use(

    (config) => {

        /*
         * ----------------------------------------------------
         * JWT TOKEN
         * ----------------------------------------------------
         */

        const token =
            storage.getToken();

        if (token) {

            config.headers =
                config.headers || {};

            config.headers.Authorization =
                token.startsWith("Bearer ")
                    ? token
                    : `Bearer ${token}`;
        }


        /*
         * ----------------------------------------------------
         * FORM DATA REQUEST
         * ----------------------------------------------------
         */

        if (
            typeof FormData !== "undefined" &&
            config.data instanceof FormData
        ) {

            if (config.headers) {

                /*
                 * AxiosHeaders support
                 */

                if (
                    typeof config.headers.delete ===
                    "function"
                ) {

                    config.headers.delete(
                        "Content-Type"
                    );

                } else {

                    /*
                     * Normal object fallback
                     */

                    delete config.headers[
                        "Content-Type"
                    ];

                    delete config.headers[
                        "content-type"
                    ];
                }
            }

        } else {

            /*
             * ------------------------------------------------
             * NORMAL JSON REQUEST
             * ------------------------------------------------
             */

            if (
                config.data !== undefined &&
                config.data !== null
            ) {

                config.headers =
                    config.headers || {};

                const hasContentType =
                    config.headers["Content-Type"] ||
                    config.headers["content-type"];

                if (!hasContentType) {

                    config.headers[
                        "Content-Type"
                    ] = "application/json";
                }
            }
        }


        return config;
    },

    (error) => {

        return Promise.reject(error);

    }

);


/*
 * ============================================================
 * RESPONSE INTERCEPTOR
 * ============================================================
 *
 * 401:
 * JWT missing, invalid or expired.
 *
 * 403:
 * Valid authentication but insufficient permission.
 * Do NOT clear JWT automatically.
 * ============================================================
 */

api.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

        const status =
            error?.response?.status;


        /*
         * ----------------------------------------------------
         * 401 - UNAUTHENTICATED
         * ----------------------------------------------------
         */

        if (status === 401) {

            storage.clear();

            if (
                !window.location.pathname.includes(
                    "/login"
                )
            ) {

                window.location.href =
                    "/login";
            }
        }


        /*
         * ----------------------------------------------------
         * 403 - FORBIDDEN
         * ----------------------------------------------------
         *
         * Do NOT remove JWT.
         */

        if (status === 403) {

            console.error(
                "LabTrack API 403 Forbidden:",
                error?.config?.method?.toUpperCase(),
                error?.config?.url
            );
        }


        return Promise.reject(error);

    }

);


export default api;