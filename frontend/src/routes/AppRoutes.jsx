import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes
} from "react-router-dom";

import useAuthStore from "../store/authStore";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

import Login from "../pages/auth/Login";

import Dashboard
    from "../components/dashboard/Dashboard";

import DepartmentPage
    from "../pages/departments/DepartmentPage";

import CategoryPage
    from "../pages/categories/CategoryPage";

import ItemPage
    from "../pages/items/ItemPage";

import SupplierPage
    from "../pages/suppliers/SupplierPage";

import Inventory
    from "../pages/inventory/Inventory";

import StockIn
    from "../pages/inventory/StockIn";

import StockOut
    from "../pages/inventory/StockOut";

import DailyConsumables
    from "../pages/inventory/DailyConsumables";


/*
 * =========================================================
 * ISSUE / RETURN
 * =========================================================
 */
import IssueReturn
    from "../pages/inventory/IssueReturn";


import Equipment
    from "../pages/equipment/Equipment";

import Maintenance
    from "../pages/maintenance/Maintenance";

import BreakageRegister
    from "../pages/breakage/BreakageRegister";

import Reports
    from "../pages/reports/Reports";


/*
 * =========================================================
 * TIMETABLE
 * =========================================================
 */
import Timetable
    from "../pages/timetable/Timetable";


/*
 * =========================================================
 * SOP LIBRARY
 * =========================================================
 */
import SopLibrary
    from "../pages/sop/SopLibrary";


import ProtectedRoute
    from "./ProtectedRoute";


/*
 * =========================================================
 * PUBLIC ROUTE
 * =========================================================
 */

function PublicRoute() {

    const isAuthenticated =
        useAuthStore(
            (state) =>
                state.isAuthenticated
        );


    return isAuthenticated ? (

        <Navigate
            to="/dashboard"
            replace
        />

    ) : (

        <Outlet />

    );
}


/*
 * =========================================================
 * APP ROUTES
 * =========================================================
 */

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>


                {/* =====================================================
                   PUBLIC
                ===================================================== */}

                <Route
                    element={
                        <PublicRoute />
                    }
                >

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />


                    <Route
                        path="/login"
                        element={
                            <AuthLayout>
                                <Login />
                            </AuthLayout>
                        }
                    />

                </Route>



                {/* =====================================================
                   PROTECTED
                ===================================================== */}

                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >


                    {/* =================================================
                       DASHBOARD
                    ================================================= */}

                    <Route
                        path="/dashboard"
                        element={
                            <Dashboard />
                        }
                    />



                    {/* =================================================
                       MASTERS
                    ================================================= */}

                    <Route
                        path="/departments"
                        element={
                            <DepartmentPage />
                        }
                    />


                    <Route
                        path="/categories"
                        element={
                            <CategoryPage />
                        }
                    />


                    <Route
                        path="/items"
                        element={
                            <ItemPage />
                        }
                    />


                    <Route
                        path="/suppliers"
                        element={
                            <SupplierPage />
                        }
                    />



                    {/* =================================================
                       INVENTORY
                    ================================================= */}

                    <Route
                        path="/inventory"
                        element={
                            <Inventory />
                        }
                    />


                    <Route
                        path="/stock-in"
                        element={
                            <StockIn />
                        }
                    />


                    <Route
                        path="/stock-out"
                        element={
                            <StockOut />
                        }
                    />


                    <Route
                        path="/daily-consumables"
                        element={
                            <DailyConsumables />
                        }
                    />


                    {/* =================================================
                       ISSUE / RETURN REGISTER
                    ================================================= */}

                    <Route
                        path="/issue-return"
                        element={
                            <IssueReturn />
                        }
                    />



                    {/* =================================================
                       EQUIPMENT & AMC
                    ================================================= */}

                    <Route
                        path="/equipment"
                        element={
                            <Equipment />
                        }
                    />


                    <Route
                        path="/maintenance"
                        element={
                            <Maintenance />
                        }
                    />



                    {/* =================================================
                       BREAKAGE
                    ================================================= */}

                    <Route
                        path="/breakage"
                        element={
                            <BreakageRegister />
                        }
                    />



                    {/* =================================================
                       REPORTS
                    ================================================= */}

                    <Route
                        path="/reports"
                        element={
                            <Reports />
                        }
                    />



                    {/* =================================================
                       TIMETABLE & LAB OCCUPANCY
                    ================================================= */}

                    <Route
                        path="/timetable"
                        element={
                            <Timetable />
                        }
                    />


                    {/* =================================================
                       SOP LIBRARY
                    ================================================= */}

                    <Route
                        path="/sop-library"
                        element={
                            <SopLibrary />
                        }
                    />

                </Route>



                {/* =====================================================
                   404
                ===================================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );
}


export default AppRoutes;