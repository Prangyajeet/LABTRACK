import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";

function DashboardLayout() {
    return (
        <div
            className="
                flex
                min-h-screen
                bg-slate-950
                text-slate-100
            "
        >

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main
                className="
                    min-w-0
                    flex-1
                    overflow-auto
                    bg-slate-950
                    p-5
                    sm:p-6
                    lg:p-8
                "
            >

                <div
                    className="
                        mx-auto
                        w-full
                        max-w-[1600px]
                    "
                >
                    <Outlet />
                </div>

            </main>

        </div>
    );
}

export default DashboardLayout;