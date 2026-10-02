import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";

function MainLayout() {

    return (

        <div
            className="
                h-screen
                flex
                bg-slate-950
            "
        >

            <Sidebar />

            <main
                className="
                    flex-1
                    min-w-0
                    overflow-y-auto
                    bg-slate-950
                    p-8
                "
            >

                <Outlet />

            </main>

        </div>

    );

}

export default MainLayout;