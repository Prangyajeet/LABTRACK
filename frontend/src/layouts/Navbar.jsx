import { useEffect, useRef, useState } from "react";
import {
    Bell,
    ChevronDown,
    LogOut,
    Package,
    Wrench,
    AlertTriangle,
    CalendarDays,
    X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../store/authStore";

function Navbar() {

    const navigate = useNavigate();

    const logout = useAuthStore(
        (state) => state.logout
    );

    const user = useAuthStore(
        (state) => state.user
    );

    const [time, setTime] =
        useState(new Date());

    const [showMenu, setShowMenu] =
        useState(false);

    const [showNotifications, setShowNotifications] =
        useState(false);

    const menuRef = useRef(null);

    const notificationRef = useRef(null);


    /*
     * ============================================================
     * NOTIFICATIONS
     * ============================================================
     */

    const notifications = [
        {
            id: 1,
            title: "Low Stock Alert",
            description:
                "An inventory item requires replenishment.",
            icon: Package,
            iconClass:
                "bg-amber-500/10 text-amber-400"
        },
        {
            id: 2,
            title: "Maintenance",
            description:
                "Check equipment maintenance schedules.",
            icon: Wrench,
            iconClass:
                "bg-purple-500/10 text-purple-400"
        },
        {
            id: 3,
            title: "Breakage Register",
            description:
                "Review recent laboratory breakage records.",
            icon: AlertTriangle,
            iconClass:
                "bg-red-500/10 text-red-400"
        },
        {
            id: 4,
            title: "Timetable",
            description:
                "Check laboratory occupancy and timetable.",
            icon: CalendarDays,
            iconClass:
                "bg-blue-500/10 text-blue-400"
        },
        {
            id: 5,
            title: "System Notification",
            description:
                "LabTrack dashboard is ready.",
            icon: Bell,
            iconClass:
                "bg-cyan-500/10 text-cyan-400"
        }
    ];


    /*
     * ============================================================
     * UNREAD COUNT
     * ============================================================
     *
     * Do not show a fake notification number.
     * Backend notification integration can be connected later.
     */

    const unreadCount = 0;


    /*
     * ============================================================
     * CLOCK
     * ============================================================
     */

    useEffect(() => {

        const interval = setInterval(() => {

            setTime(new Date());

        }, 1000);

        return () =>
            clearInterval(interval);

    }, []);


    /*
     * ============================================================
     * CLICK OUTSIDE
     * ============================================================
     */

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {

                setShowMenu(false);

            }

            if (
                notificationRef.current &&
                !notificationRef.current.contains(
                    event.target
                )
            ) {

                setShowNotifications(false);

            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    /*
     * ============================================================
     * LOGOUT
     * ============================================================
     */

    const handleLogout = () => {

        logout();

        navigate(
            "/login",
            {
                replace: true
            }
        );

    };


    /*
     * ============================================================
     * USER INFORMATION
     * ============================================================
     */

    const userName =
        user?.fullName ||
        user?.name ||
        "Administrator";

    const role =
        user?.role ||
        "ADMIN";


    /*
     * ============================================================
     * RENDER
     * ============================================================
     */

    return (

        <header
            className="
                sticky
                top-0
                z-40
                h-[76px]
                border-b
                border-zinc-800
                bg-zinc-950/95
                px-5
                backdrop-blur-xl
                lg:px-8
            "
        >

            <div
                className="
                    flex
                    h-full
                    items-center
                    justify-between
                    gap-6
                "
            >

                {/* ==================================================
                    PAGE CONTEXT
                ================================================== */}

                <div className="min-w-0">

                    <p
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.18em]
                            text-zinc-600
                        "
                    >
                        LabTrack
                    </p>

                    <h2
                        className="
                            mt-0.5
                            truncate
                            text-lg
                            font-semibold
                            tracking-tight
                            text-zinc-100
                        "
                    >
                        Laboratory Management
                    </h2>

                </div>


                {/* ==================================================
                    RIGHT SIDE
                ================================================== */}

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    {/* ==================================================
                        DATE & TIME
                    ================================================== */}

                    <div
                        className="
                            hidden
                            text-right
                            sm:block
                        "
                    >

                        <p
                            className="
                                text-xs
                                font-medium
                                text-zinc-300
                            "
                        >
                            {time.toLocaleDateString(
                                "en-IN",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                }
                            )}
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-[10px]
                                text-zinc-600
                            "
                        >
                            {time.toLocaleTimeString(
                                "en-IN",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit"
                                }
                            )}
                        </p>

                    </div>


                    <div
                        className="
                            hidden
                            h-8
                            w-px
                            bg-zinc-800
                            sm:block
                        "
                    />


                    {/* ==================================================
                        NOTIFICATION
                    ================================================== */}

                    <div
                        className="relative"
                        ref={notificationRef}
                    >

                        <button
                            type="button"
                            onClick={() =>
                                setShowNotifications(
                                    !showNotifications
                                )
                            }
                            className="
                                group
                                relative
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-zinc-800
                                bg-zinc-900/70
                                text-zinc-400
                                transition-all
                                duration-200
                                hover:border-zinc-700
                                hover:bg-zinc-800
                                hover:text-zinc-100
                                active:scale-95
                            "
                            aria-label="Notifications"
                        >

                            <Bell
                                size={17}
                                className="
                                    transition-transform
                                    duration-200
                                    group-hover:scale-105
                                "
                            />

                            {unreadCount > 0 && (

                                <span
                                    className="
                                        absolute
                                        -right-1
                                        -top-1
                                        flex
                                        h-5
                                        min-w-5
                                        items-center
                                        justify-center
                                        rounded-full
                                        border-2
                                        border-zinc-950
                                        bg-red-500
                                        px-1
                                        text-[10px]
                                        font-bold
                                        text-white
                                    "
                                >
                                    {unreadCount}
                                </span>

                            )}

                        </button>


                        {/* ==================================================
                            NOTIFICATION PANEL
                        ================================================== */}

                        {showNotifications && (

                            <div
                                className="
                                    absolute
                                    right-0
                                    top-12
                                    z-50
                                    w-[360px]
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-zinc-800
                                    bg-zinc-900
                                    shadow-2xl
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        border-b
                                        border-zinc-800
                                        px-5
                                        py-4
                                    "
                                >

                                    <div>

                                        <h3
                                            className="
                                                text-sm
                                                font-semibold
                                                text-zinc-100
                                            "
                                        >
                                            Notifications
                                        </h3>

                                        <p
                                            className="
                                                mt-1
                                                text-[11px]
                                                text-zinc-600
                                            "
                                        >
                                            Recent system alerts
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowNotifications(
                                                false
                                            )
                                        }
                                        className="
                                            rounded-md
                                            p-1
                                            text-zinc-600
                                            transition
                                            hover:bg-zinc-800
                                            hover:text-zinc-300
                                        "
                                        aria-label="Close notifications"
                                    >

                                        <X size={16} />

                                    </button>

                                </div>


                                <div
                                    className="
                                        max-h-[380px]
                                        overflow-y-auto
                                    "
                                >

                                    {notifications.length === 0 ? (

                                        <div
                                            className="
                                                px-5
                                                py-10
                                                text-center
                                            "
                                        >

                                            <Bell
                                                size={26}
                                                className="
                                                    mx-auto
                                                    text-zinc-700
                                                "
                                            />

                                            <p
                                                className="
                                                    mt-3
                                                    text-sm
                                                    text-zinc-500
                                                "
                                            >
                                                No notifications
                                            </p>

                                        </div>

                                    ) : (

                                        notifications.map(
                                            (notification) => {

                                                const Icon =
                                                    notification.icon;

                                                return (

                                                    <div
                                                        key={
                                                            notification.id
                                                        }
                                                        className="
                                                            flex
                                                            items-start
                                                            gap-3
                                                            border-b
                                                            border-zinc-800
                                                            px-5
                                                            py-4
                                                            transition
                                                            hover:bg-zinc-800/50
                                                        "
                                                    >

                                                        <div
                                                            className={`
                                                                flex
                                                                h-9
                                                                w-9
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                ${notification.iconClass}
                                                            `}
                                                        >

                                                            <Icon
                                                                size={16}
                                                            />

                                                        </div>


                                                        <div
                                                            className="
                                                                min-w-0
                                                                flex-1
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    justify-between
                                                                    gap-3
                                                                "
                                                            >

                                                                <p
                                                                    className="
                                                                        text-xs
                                                                        font-semibold
                                                                        text-zinc-200
                                                                    "
                                                                >
                                                                    {
                                                                        notification.title
                                                                    }
                                                                </p>

                                                                <span
                                                                    className="
                                                                        shrink-0
                                                                        text-[10px]
                                                                        text-zinc-700
                                                                    "
                                                                >
                                                                    Today
                                                                </span>

                                                            </div>


                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-[11px]
                                                                    leading-relaxed
                                                                    text-zinc-500
                                                                "
                                                            >
                                                                {
                                                                    notification.description
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                );

                                            }
                                        )

                                    )}

                                </div>

                            </div>

                        )}

                    </div>


                    {/* ==================================================
                        USER MENU
                    ================================================== */}

                    <div
                        className="relative"
                        ref={menuRef}
                    >

                        <button
                            type="button"
                            onClick={() =>
                                setShowMenu(
                                    !showMenu
                                )
                            }
                            className="
                                group
                                flex
                                items-center
                                gap-2.5
                                rounded-lg
                                border
                                border-zinc-800
                                bg-zinc-900/70
                                px-2.5
                                py-1.5
                                transition-all
                                duration-200
                                hover:border-zinc-700
                                hover:bg-zinc-800
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-gradient-to-br
                                    from-blue-500
                                    to-cyan-500
                                    text-xs
                                    font-bold
                                    text-white
                                "
                            >
                                {userName
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>


                            <div
                                className="
                                    hidden
                                    text-left
                                    sm:block
                                "
                            >

                                <p
                                    className="
                                        max-w-[130px]
                                        truncate
                                        text-xs
                                        font-semibold
                                        text-zinc-200
                                    "
                                >
                                    {userName}
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-[10px]
                                        uppercase
                                        tracking-wide
                                        text-zinc-600
                                    "
                                >
                                    {role}
                                </p>

                            </div>


                            <ChevronDown
                                size={14}
                                className={`
                                    text-zinc-600
                                    transition-transform
                                    duration-200
                                    ${
                                        showMenu
                                            ? "rotate-180"
                                            : ""
                                    }
                                `}
                            />

                        </button>


                        {showMenu && (

                            <div
                                className="
                                    absolute
                                    right-0
                                    top-12
                                    z-50
                                    w-52
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-zinc-800
                                    bg-zinc-900
                                    shadow-2xl
                                "
                            >

                                <div
                                    className="
                                        border-b
                                        border-zinc-800
                                        px-4
                                        py-3
                                    "
                                >

                                    <p
                                        className="
                                            truncate
                                            text-xs
                                            font-medium
                                            text-zinc-200
                                        "
                                    >
                                        {userName}
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[10px]
                                            uppercase
                                            tracking-wide
                                            text-zinc-600
                                        "
                                    >
                                        {role}
                                    </p>

                                </div>


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
                                        text-xs
                                        font-medium
                                        text-red-400
                                        transition
                                        hover:bg-red-500/10
                                    "
                                >

                                    <LogOut size={16} />

                                    Logout

                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </header>

    );

}

export default Navbar;