import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(

    <>

        <App />

        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={10}
            toastOptions={{

                duration: 3000,

                style: {

                    background: "#0f172a",

                    color: "#ffffff",

                    border: "1px solid #334155",

                    borderRadius: "12px",

                    padding: "14px"

                },

                success: {

                    iconTheme: {

                        primary: "#22c55e",

                        secondary: "#ffffff"

                    }

                },

                error: {

                    iconTheme: {

                        primary: "#ef4444",

                        secondary: "#ffffff"

                    }

                }

            }}
        />

    </>

);