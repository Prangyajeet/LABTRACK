const TOKEN_KEY = "labtrack_token";
const USER_KEY = "labtrack_user";

const USER_ID_KEY = "labtrack_user_id";
const EMAIL_KEY = "labtrack_email";
const ROLE_KEY = "labtrack_role";

export const storage = {

    setToken(token) {

        localStorage.setItem(
            TOKEN_KEY,
            token
        );
    },


    getToken() {

        return localStorage.getItem(
            TOKEN_KEY
        );
    },


    removeToken() {

        localStorage.removeItem(
            TOKEN_KEY
        );
    },


    setUser(user) {

        localStorage.setItem(
            USER_KEY,
            JSON.stringify(user)
        );
    },


    getUser() {

        const user =
            localStorage.getItem(
                USER_KEY
            );

        if (!user) {
            return null;
        }

        try {

            return JSON.parse(user);

        } catch (error) {

            console.error(
                "Invalid stored LabTrack user:",
                error
            );

            localStorage.removeItem(
                USER_KEY
            );

            return null;
        }
    },


    removeUser() {

        localStorage.removeItem(
            USER_KEY
        );
    },


    clear() {

        localStorage.removeItem(
            TOKEN_KEY
        );

        localStorage.removeItem(
            USER_KEY
        );

        localStorage.removeItem(
            USER_ID_KEY
        );

        localStorage.removeItem(
            EMAIL_KEY
        );

        localStorage.removeItem(
            ROLE_KEY
        );
    }

};