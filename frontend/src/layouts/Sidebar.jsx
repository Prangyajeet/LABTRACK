import { useState } from "react";

import {
    NavLink,
    useNavigate
} from "react-router-dom";

import {
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    LogOut
} from "lucide-react";

import navigation from "./navigation";

import logo from "../assets/logo/logo.svg";
import logoIcon from "../assets/logo/logo-icon.svg";

import useAuthStore from "../store/authStore";


function Sidebar() {

    const navigate = useNavigate();

    const [collapsed, setCollapsed] =
        useState(false);

    const [openMenus, setOpenMenus] =
        useState({
            Masters: true,
            Inventory: true,
            Equipment: true,
            "Administration / Operations": true
        });

    const [showUserMenu, setShowUserMenu] =
        useState(false);

    const user =
        useAuthStore(
            (state) => state.user
        );

    const logout =
        useAuthStore(
            (state) => state.logout
        );

    const userName =
        user?.fullName ||
        user?.name ||
        "System Administrator";

    const userEmail =
        user?.email ||
        "admin@labtrack.com";

    const initials =
        userName
            .split(" ")
            .map(
                (word) =>
                    word.charAt(0)
            )
            .join("")
            .substring(0, 2)
            .toUpperCase();

    const toggleMenu = (menu) => {

        setOpenMenus((previous) => ({

            ...previous,

            [menu]:
                !previous[menu]

        }));

    };

    /*
     * =====================================================
     * MASTERS NAVIGATION ORDER
     * =====================================================
     *
     * Keep the existing navigation configuration and
     * rendering structure. Only enforce the requested
     * Masters order here.
     */
    const getOrderedChildren = (item) => {

        if (
            item.title !== "Masters" ||
            !Array.isArray(item.children)
        ) {
            return item.children || [];
        }

        const mastersOrder = {
            Departments: 1,
            Categories: 2,
            Suppliers: 3,
            Items: 4
        };

        return [...item.children].sort(
            (first, second) =>
                (mastersOrder[first.title] ?? 999) -
                (mastersOrder[second.title] ?? 999)
        );
    };

    const handleLogout = () => {

        logout();

        navigate(
            "/login",
            {
                replace: true
            }
        );

    };


    return (

        <aside
            className={`
                sticky
                top-0
                flex
                h-screen
                shrink-0
                flex-col
                border-r
                border-slate-800
                bg-slate-900
                transition-all
                duration-300
                ${
                    collapsed
                        ? "w-20"
                        : "w-72"
                }
            `}
        >

            {/* =====================================================
                LOGO
            ===================================================== */}

            <div
                className="
                    relative
                    flex
                    h-20
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-slate-800
                    px-4
                "
            >

                <div
                    className={`
                        flex
                        items-center
                        ${
                            collapsed
                                ? "w-full justify-center"
                                : ""
                        }
                    `}
                >

                    {collapsed ? (

                        <img
                            src={logoIcon}
                            className="
                                h-9
                                w-9
                                object-contain
                            "
                            alt="LabTrack"
                        />

                    ) : (

                        <img
                            src={logo}
                            className="
                                w-40
                                object-contain
                            "
                            alt="LabTrack"
                        />

                    )}

                </div>


                {/* =================================================
                    COLLAPSE BUTTON
                ================================================= */}

                <button
                    type="button"
                    onClick={() =>
                        setCollapsed(
                            !collapsed
                        )
                    }
                    className="
                        absolute
                        -right-3
                        top-7
                        z-20
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-slate-700
                        bg-slate-800
                        text-slate-400
                        shadow-lg
                        transition
                        hover:bg-slate-700
                        hover:text-white
                    "
                >

                    {collapsed ? (

                        <ChevronRight
                            size={14}
                        />

                    ) : (

                        <ChevronLeft
                            size={14}
                        />

                    )}

                </button>

            </div>


            {/* =====================================================
                NAVIGATION
            ===================================================== */}

            <div
                className="
                    flex-1
                    overflow-y-auto
                    overflow-x-hidden
                    px-3
                    py-5
                "
            >

                {navigation.map((item) => (

                    item.children ? (

                        <div
                            key={item.title}
                            className="
                                mb-5
                            "
                        >

                            {/* SECTION LABEL */}

                            {!collapsed && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        toggleMenu(
                                            item.title
                                        )
                                    }
                                    className="
                                        mb-2
                                        flex
                                        w-full
                                        items-center
                                        justify-between
                                        rounded-lg
                                        px-3
                                        py-2
                                        text-left
                                        text-[11px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.15em]
                                        text-slate-500
                                        transition
                                        hover:bg-slate-800
                                        hover:text-slate-300
                                    "
                                >

                                    <span>
                                        {item.title}
                                    </span>


                                    {openMenus[
                                        item.title
                                    ] ? (

                                        <ChevronDown
                                            size={14}
                                        />

                                    ) : (

                                        <ChevronRight
                                            size={14}
                                        />

                                    )}

                                </button>

                            )}


                            {/* COLLAPSED DIVIDER */}

                            {collapsed && (

                                <div
                                    className="
                                        mb-2
                                        h-px
                                        bg-slate-800
                                    "
                                />

                            )}


                            {/* CHILD NAVIGATION */}

                            {openMenus[item.title] &&
                                getOrderedChildren(item).map(
                                    (child) => {

                                        const Icon =
                                            child.icon;


                                        return (

                                            <NavLink
                                                key={
                                                    child.title
                                                }
                                                to={
                                                    child.path
                                                }
                                                title={
                                                    collapsed
                                                        ? child.title
                                                        : undefined
                                                }
                                                className={({
                                                    isActive
                                                }) => `
                                                    group
                                                    relative
                                                    mx-1
                                                    my-1
                                                    flex
                                                    items-center
                                                    gap-3
                                                    rounded-lg
                                                    px-3
                                                    py-2.5
                                                    text-[14px]
                                                    font-medium
                                                    transition-all
                                                    duration-200
                                                    ${
                                                        collapsed
                                                            ? "justify-center"
                                                            : ""
                                                    }
                                                    ${
                                                        isActive
                                                            ? "bg-blue-600 text-white"
                                                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                                    }
                                                `
                                                }
                                            >

                                                {({
                                                    isActive
                                                }) => (

                                                    <>

                                                        <span
                                                            className={`
                                                                absolute
                                                                left-0
                                                                top-1/2
                                                                h-6
                                                                w-0.5
                                                                -translate-y-1/2
                                                                rounded-full
                                                                bg-blue-400
                                                                ${
                                                                    isActive
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                }
                                                            `}
                                                        />


                                                        <Icon
                                                            size={18}
                                                            strokeWidth={
                                                                1.8
                                                            }
                                                        />


                                                        {!collapsed && (

                                                            <span>
                                                                {
                                                                    child.title
                                                                }
                                                            </span>

                                                        )}

                                                    </>

                                                )}

                                            </NavLink>

                                        );

                                    }
                                )
                            }

                        </div>

                    ) : (

                        (() => {

                            const Icon =
                                item.icon;


                            return (

                                <NavLink
                                    key={item.title}
                                    to={item.path}
                                    title={
                                        collapsed
                                            ? item.title
                                            : undefined
                                    }
                                    className={({
                                        isActive
                                    }) => `
                                        group
                                        relative
                                        mx-1
                                        my-1
                                        mb-5
                                        flex
                                        items-center
                                        gap-3
                                        rounded-lg
                                        px-3
                                        py-2.5
                                        text-[14px]
                                        font-medium
                                        transition-all
                                        duration-200
                                        ${
                                            collapsed
                                                ? "justify-center"
                                                : ""
                                        }
                                        ${
                                            isActive
                                                ? "bg-blue-600 text-white"
                                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                        }
                                    `
                                    }
                                >

                                    {({
                                        isActive
                                    }) => (

                                        <>

                                            <span
                                                className={`
                                                    absolute
                                                    left-0
                                                    top-1/2
                                                    h-6
                                                    w-0.5
                                                    -translate-y-1/2
                                                    rounded-full
                                                    bg-blue-400
                                                    ${
                                                        isActive
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    }
                                                `}
                                            />


                                            <Icon
                                                size={18}
                                                strokeWidth={
                                                    1.8
                                                }
                                            />


                                            {!collapsed && (

                                                <span>
                                                    {item.title}
                                                </span>

                                            )}

                                        </>

                                    )}

                                </NavLink>

                            );

                        })()

                    )

                ))}

            </div>


            {/* =====================================================
                USER SECTION
            ===================================================== */}

            <div
                className="
                    relative
                    shrink-0
                    border-t
                    border-slate-800
                    p-3
                "
            >

                {collapsed ? (

                    <div
                        className="
                            relative
                            flex
                            justify-center
                        "
                    >

                        <button
                            type="button"
                            onClick={() =>
                                setShowUserMenu(
                                    !showUserMenu
                                )
                            }
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-600
                                text-xs
                                font-bold
                                text-white
                                shadow-lg
                                transition
                                hover:bg-blue-700
                            "
                            title="System Administrator"
                        >

                            {initials}

                        </button>


                        {showUserMenu && (

                            <div
                                className="
                                    absolute
                                    bottom-0
                                    left-14
                                    z-50
                                    w-40
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-slate-700
                                    bg-slate-800
                                    shadow-2xl
                                "
                            >

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        gap-3
                                        px-4
                                        py-3
                                        text-left
                                        text-[14px]
                                        font-medium
                                        text-red-400
                                        transition
                                        hover:bg-red-500/10
                                    "
                                >

                                    <LogOut
                                        size={18}
                                    />

                                    Logout

                                </button>

                            </div>

                        )}

                    </div>

                ) : (

                    <div
                        className="
                            relative
                        "
                    >

                        <button
                            type="button"
                            onClick={() =>
                                setShowUserMenu(
                                    !showUserMenu
                                )
                            }
                            className="
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-800
                                p-3
                                text-left
                                transition
                                hover:bg-slate-700
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-blue-600
                                    text-sm
                                    font-bold
                                    text-white
                                "
                            >

                                {initials}

                            </div>


                            <div
                                className="
                                    min-w-0
                                    flex-1
                                "
                            >

                                <p
                                    className="
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-white
                                    "
                                >
                                    {userName}
                                </p>


                                <p
                                    className="
                                        mt-1
                                        truncate
                                        text-[11px]
                                        text-slate-400
                                    "
                                >
                                    {userEmail}
                                </p>

                            </div>


                            <ChevronDown
                                size={16}
                                className={`
                                    text-slate-400
                                    transition-transform
                                    ${
                                        showUserMenu
                                            ? "rotate-180"
                                            : ""
                                    }
                                `}
                            />

                        </button>


                        {showUserMenu && (

                            <div
                                className="
                                    absolute
                                    bottom-full
                                    left-0
                                    right-0
                                    z-50
                                    mb-2
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-slate-700
                                    bg-slate-800
                                    shadow-2xl
                                "
                            >

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        gap-3
                                        px-4
                                        py-3
                                        text-left
                                        text-[14px]
                                        font-medium
                                        text-red-400
                                        transition
                                        hover:bg-red-500/10
                                        hover:text-red-300
                                    "
                                >

                                    <LogOut
                                        size={18}
                                    />

                                    Logout

                                </button>

                            </div>

                        )}

                    </div>

                )}

            </div>

        </aside>

    );

}


export default Sidebar;