import { create } from "zustand";
import { storage } from "../utils/storage";

const storedUser = storage.getUser();
const storedToken = storage.getToken();

const useAuthStore = create((set) => ({

    token: storedToken,

    user: storedUser,

    isAuthenticated: !!storedToken,


    login: (response) => {

        console.log(
            "AUTH LOGIN RESPONSE:",
            response
        );

        /*
         * ========================================================
         * BACKEND LOGIN RESPONSE
         * ========================================================
         *
         * The backend returns the login data directly:
         *
         * {
         *     token: "...",
         *     userId: 1,
         *     email: "admin@labtrack.com",
         *     role: "ADMIN",
         *     fullName: "System Administrator",
         *     department: "Biology"
         * }
         *
         * authService.login() already returns:
         *
         *     response.data
         *
         * Therefore, the object received here is already
         * the actual login data.
         */


        const loginData = response;


        if (
            !loginData ||
            !loginData.token
        ) {

            console.error(
                "LOGIN RESPONSE DATA MISSING:",
                response
            );

            throw new Error(
                "Invalid login response."
            );
        }


        /*
         * ========================================================
         * GET JWT TOKEN
         * ========================================================
         */

        const token = loginData.token;


        if (!token) {

            console.error(
                "JWT TOKEN NOT FOUND IN LOGIN RESPONSE:",
                response
            );

            throw new Error(
                "Login succeeded but no authentication token was returned."
            );
        }


        /*
         * ========================================================
         * STORE AUTHENTICATION DATA
         * ========================================================
         */

        storage.setToken(
            token
        );


        /*
         * ========================================================
         * STORE USER DATA
         * ========================================================
         */

        storage.setUser(
            loginData
        );


        /*
         * ========================================================
         * UPDATE ZUSTAND STATE
         * ========================================================
         */

        set({

            token: token,

            user: loginData,

            isAuthenticated: true

        });

    },


    logout: () => {

        storage.clear();

        set({

            token: null,

            user: null,

            isAuthenticated: false

        });

    }

}));


export default useAuthStore;