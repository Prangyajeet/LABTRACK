import {
    LayoutDashboard,
    Building2,
    LayoutGrid,
    Package,
    Truck,
    Boxes,
    ClipboardList,
    Wrench,
    FlaskConical,
    ShoppingCart,
    BarChart3,
    Settings,
    AlertTriangle,
    CalendarDays,
    ArrowLeftRight,
    FileText
} from "lucide-react";


const navigation = [

    // =========================================================
    // DASHBOARD
    // =========================================================

    {
        title: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard
    },


    // =========================================================
    // MASTERS
    // =========================================================

    {
        title: "Masters",

        children: [

            {
                title: "Departments",
                path: "/departments",
                icon: Building2
            },

            {
                title: "Categories",
                path: "/categories",
                icon: LayoutGrid
            },

            {
                title: "Items",
                path: "/items",
                icon: Package
            },

            {
                title: "Suppliers",
                path: "/suppliers",
                icon: Truck
            }

        ]
    },


    // =========================================================
    // INVENTORY
    // =========================================================

    {
        title: "Inventory",

        children: [

            {
                title: "Inventory",
                path: "/inventory",
                icon: Boxes
            },

            {
                title: "Stock In",
                path: "/stock-in",
                icon: ShoppingCart
            },

            {
                title: "Stock Out",
                path: "/stock-out",
                icon: ClipboardList
            },

            {
                title: "Daily Consumables",
                path: "/daily-consumables",
                icon: FlaskConical
            },

            {
                title: "Issue / Return",
                path: "/issue-return",
                icon: ArrowLeftRight
            }

        ]
    },


    // =========================================================
    // EQUIPMENT
    // =========================================================

    {
        title: "Equipment",

        children: [

            {
                title: "Equipment",
                path: "/equipment",
                icon: Wrench
            },

            {
                title: "Maintenance",
                path: "/maintenance",
                icon: Settings
            },

            {
                title: "Breakage Register",
                path: "/breakage",
                icon: AlertTriangle
            }

        ]
    },


    // =========================================================
    // ADMINISTRATION / OPERATIONS
    // =========================================================

    {
        title: "Administration / Operations",

        children: [

            {
                title: "Timetable",
                path: "/timetable",
                icon: CalendarDays
            },

            {
                title: "SOP Library",
                path: "/sop-library",
                icon: FileText
            }

        ]
    },


    // =========================================================
    // REPORTS
    // =========================================================

    {
        title: "Reports",
        path: "/reports",
        icon: BarChart3
    }

];


export default navigation;