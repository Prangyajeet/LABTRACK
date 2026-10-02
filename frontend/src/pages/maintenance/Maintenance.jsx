import { useEffect, useState } from "react";

import {
    Calendar,
    CheckCircle2,
    Clock3,
    IndianRupee,
    RefreshCw,
    Search,
    Wrench
} from "lucide-react";

import useMaintenance
    from "../../hooks/useMaintenance";


function Maintenance() {

    const {
        maintenanceLogs = [],
        maintenanceDue = [],
        loading,
        error,
        refreshMaintenance
    } = useMaintenance();


    const [search, setSearch] =
        useState("");


    /*
    =========================================================
    REFRESH MAINTENANCE RECORDS WHEN PAGE OPENS
    =========================================================
    */

    useEffect(() => {

        if (refreshMaintenance) {
            refreshMaintenance();
        }

    }, []);


    /*
    =========================================================
    SAFETY
    =========================================================
    */

    const logs = Array.isArray(maintenanceLogs)
        ? maintenanceLogs
        : [];

    const dueRecords = Array.isArray(maintenanceDue)
        ? maintenanceDue
        : [];


    /*
    =========================================================
    SEARCH
    =========================================================
    */

    const filteredLogs =
        logs.filter((log) => {

            const searchText =
                search
                    .trim()
                    .toLowerCase();


            if (!searchText) {
                return true;
            }


            return (

                log.equipmentName
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                log.equipmentCode
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                log.performedBy
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                log.maintenanceType
                    ?.toLowerCase()
                    .includes(searchText)

            );

        });


    /*
    =========================================================
    DATE FORMAT
    =========================================================
    */

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return date;
        }


        return parsedDate.toLocaleDateString(
            "en-IN"
        );

    };


    /*
    =========================================================
    COST FORMAT
    =========================================================
    */

    const formatCost = (cost) => {

        if (
            cost === null ||
            cost === undefined ||
            cost === ""
        ) {
            return "₹0";
        }


        return `₹${Number(cost).toLocaleString(
            "en-IN"
        )}`;

    };


    /*
    =========================================================
    MAINTENANCE TYPE
    =========================================================
    */

    const getMaintenanceTypeLabel = (
        type
    ) => {

        if (!type) {
            return "-";
        }


        return String(type)
            .replaceAll("_", " ");

    };


    /*
    =========================================================
    TOTAL COST
    =========================================================
    */

    const totalMaintenanceCost =
        logs.reduce(
            (total, log) =>
                total +
                Number(log.cost || 0),
            0
        );


    return (

        <div className="space-y-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="
                flex
                items-center
                justify-between
            ">

                <div>

                    <h1 className="
                        text-2xl
                        font-semibold
                        text-white
                    ">

                        Maintenance

                    </h1>


                    <p className="
                        mt-1
                        text-sm
                        text-cyan-300
                    ">

                        Track equipment maintenance
                        <span className="text-violet-300">
                            {" "}and maintenance history.
                        </span>

                    </p>

                </div>


                <button
                    type="button"
                    onClick={refreshMaintenance}
                    disabled={loading}
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-blue-500/30
                        bg-blue-500/10
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-blue-300
                        transition
                        hover:border-blue-400/50
                        hover:bg-blue-500/20
                        hover:text-blue-200
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    <RefreshCw
                        size={16}
                        className={
                            loading
                                ? "animate-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="
                    rounded-lg
                    border
                    border-red-500/30
                    bg-red-500/10
                    p-4
                    text-sm
                    text-red-400
                ">

                    {error}

                </div>

            )}


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="
                grid
                grid-cols-1
                gap-4
                md:grid-cols-3
            ">

                {/* =================================================
                    TOTAL MAINTENANCE
                ================================================= */}

                <div className="
                    rounded-xl
                    border
                    border-blue-500/20
                    bg-slate-900
                    p-5
                    transition
                    hover:border-blue-400/40
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-blue-300
                            ">

                                Total Maintenance

                            </p>


                            <p className="
                                mt-2
                                text-3xl
                                font-semibold
                                text-white
                            ">

                                {logs.length}

                            </p>

                        </div>


                        <div className="
                            rounded-lg
                            border
                            border-blue-500/20
                            bg-blue-500/10
                            p-3
                            text-blue-400
                        ">

                            <Wrench
                                size={22}
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    MAINTENANCE DUE
                ================================================= */}

                <div className="
                    rounded-xl
                    border
                    border-orange-500/20
                    bg-slate-900
                    p-5
                    transition
                    hover:border-orange-400/40
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-orange-300
                            ">

                                Maintenance Due

                            </p>


                            <p className="
                                mt-2
                                text-3xl
                                font-semibold
                                text-orange-400
                            ">

                                {dueRecords.length}

                            </p>

                        </div>


                        <div className="
                            rounded-lg
                            border
                            border-orange-500/20
                            bg-orange-500/10
                            p-3
                            text-orange-400
                        ">

                            <Clock3
                                size={22}
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    TOTAL COST
                ================================================= */}

                <div className="
                    rounded-xl
                    border
                    border-emerald-500/20
                    bg-slate-900
                    p-5
                    transition
                    hover:border-emerald-400/40
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-emerald-300
                            ">

                                Total Maintenance Cost

                            </p>


                            <p className="
                                mt-2
                                text-3xl
                                font-semibold
                                text-emerald-400
                            ">

                                {formatCost(
                                    totalMaintenanceCost
                                )}

                            </p>

                        </div>


                        <div className="
                            rounded-lg
                            border
                            border-emerald-500/20
                            bg-emerald-500/10
                            p-3
                            text-emerald-400
                        ">

                            <IndianRupee
                                size={22}
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                MAINTENANCE DUE
            ================================================= */}

            {dueRecords.length > 0 && (

                <div className="
                    rounded-xl
                    border
                    border-orange-500/30
                    bg-orange-500/5
                    p-5
                ">

                    <div className="
                        mb-4
                        flex
                        items-center
                        gap-3
                    ">

                        <Clock3
                            size={20}
                            className="text-orange-400"
                        />

                        <div>

                            <h2 className="
                                font-semibold
                                text-orange-300
                            ">

                                Maintenance Due

                            </h2>


                            <p className="
                                text-sm
                                text-slate-400
                            ">

                                Equipment requiring
                                <span className="text-orange-300">
                                    {" "}maintenance
                                </span>
                                {" "}within the scheduled period.

                            </p>

                        </div>

                    </div>


                    <div className="
                        grid
                        gap-3
                        md:grid-cols-2
                    ">

                        {dueRecords.map(
                            (equipment) => (

                                <div
                                    key={equipment.id}
                                    className="
                                        rounded-lg
                                        border
                                        border-slate-800
                                        bg-slate-900
                                        p-4
                                    "
                                >

                                    <div className="
                                        flex
                                        items-center
                                        justify-between
                                    ">

                                        <div>

                                            <p className="
                                                font-medium
                                                text-blue-300
                                            ">

                                                {
                                                    equipment.equipmentName
                                                }

                                            </p>


                                            <p className="
                                                text-sm
                                                text-violet-400
                                            ">

                                                {
                                                    equipment.equipmentCode
                                                }

                                            </p>

                                        </div>


                                        <span className="
                                            rounded-full
                                            border
                                            border-orange-500/20
                                            bg-orange-500/10
                                            px-3
                                            py-1
                                            text-xs
                                            font-semibold
                                            text-orange-400
                                        ">

                                            DUE

                                        </span>

                                    </div>


                                    <div className="
                                        mt-3
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        text-slate-400
                                    ">

                                        <Calendar
                                            size={15}
                                            className="text-cyan-400"
                                        />

                                        <span className="text-cyan-300">
                                            Next:
                                        </span>

                                        <span className="
                                            text-amber-300
                                            font-medium
                                        ">

                                            {formatDate(
                                                equipment.nextMaintenanceDate
                                            )}

                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>

            )}


            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="
                rounded-xl
                border
                border-cyan-500/20
                bg-slate-900
                p-4
            ">

                <div className="relative">

                    <Search
                        size={18}
                        className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-cyan-400
                        "
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search equipment, code, type or performed by..."
                        className="
                            w-full
                            rounded-lg
                            border
                            border-slate-700
                            bg-slate-950
                            px-4
                            py-3
                            pl-11
                            text-sm
                            text-white
                            placeholder:text-slate-500
                            outline-none
                            transition
                            focus:border-cyan-400
                            focus:ring-2
                            focus:ring-cyan-400/10
                        "
                    />

                </div>

            </div>


            {/* =================================================
                MAINTENANCE HISTORY
            ================================================= */}

            <div className="
                overflow-hidden
                rounded-xl
                border
                border-violet-500/20
                bg-slate-900
            ">

                {/* HEADER */}

                <div className="
                    border-b
                    border-slate-800
                    p-5
                ">

                    <h2 className="
                        font-semibold
                        text-violet-300
                    ">

                        Maintenance History

                    </h2>


                    <p className="
                        mt-1
                        text-sm
                        text-cyan-300
                    ">

                        Complete equipment
                        <span className="text-blue-300">
                            {" "}maintenance records.
                        </span>

                    </p>

                </div>


                {/* TABLE */}

                <div className="overflow-x-auto">

                    <table className="
                        w-full
                        text-left
                    ">

                        <thead className="
                            border-b
                            border-slate-800
                            bg-slate-950
                        ">

                            <tr>

                                <th className="
                                    px-5
                                    py-4
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-cyan-400
                                ">

                                    Date

                                </th>


                                <th className="
                                    px-5
                                    py-4
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-blue-400
                                ">

                                    Equipment

                                </th>


                                <th className="
                                    px-5
                                    py-4
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-violet-400
                                ">

                                    Type

                                </th>


                                <th className="
                                    px-5
                                    py-4
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-pink-400
                                ">

                                    Performed By

                                </th>


                                <th className="
                                    px-5
                                    py-4
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-emerald-400
                                ">

                                    Cost

                                </th>


                                <th className="
                                    px-5
                                    py-4
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-amber-400
                                ">

                                    Next Scheduled

                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="
                                            px-5
                                            py-12
                                            text-center
                                            text-cyan-300
                                        "
                                    >

                                        Loading maintenance records...

                                    </td>

                                </tr>

                            ) : filteredLogs.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="
                                            px-5
                                            py-12
                                            text-center
                                        "
                                    >

                                        <Wrench
                                            size={42}
                                            className="
                                                mx-auto
                                                mb-3
                                                text-violet-400
                                            "
                                        />


                                        <p className="
                                            text-lg
                                            font-semibold
                                            text-white
                                        ">

                                            No Maintenance Records

                                        </p>


                                        <p className="
                                            mt-1
                                            text-sm
                                            text-slate-400
                                        ">

                                            No equipment maintenance
                                            history found.

                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                filteredLogs.map(
                                    (log) => (

                                        <tr
                                            key={log.id}
                                            className="
                                                border-b
                                                border-slate-800
                                                last:border-0
                                                transition
                                                hover:bg-slate-800/40
                                            "
                                        >

                                            {/* DATE */}

                                            <td className="
                                                px-5
                                                py-4
                                                text-sm
                                                font-medium
                                                text-cyan-300
                                            ">

                                                {formatDate(
                                                    log.maintenanceDate
                                                )}

                                            </td>


                                            {/* EQUIPMENT */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <p className="
                                                    font-semibold
                                                    text-blue-300
                                                ">

                                                    {
                                                        log.equipmentName
                                                    }

                                                </p>


                                                <p className="
                                                    mt-1
                                                    text-xs
                                                    text-violet-400
                                                ">

                                                    {
                                                        log.equipmentCode
                                                    }

                                                </p>

                                            </td>


                                            {/* TYPE */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <span className="
                                                    inline-flex
                                                    rounded-full
                                                    border
                                                    border-violet-500/20
                                                    bg-violet-500/10
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-semibold
                                                    text-violet-300
                                                ">

                                                    {
                                                        getMaintenanceTypeLabel(
                                                            log.maintenanceType
                                                        )
                                                    }

                                                </span>

                                            </td>


                                            {/* PERFORMED BY */}

                                            <td className="
                                                px-5
                                                py-4
                                                text-sm
                                                font-medium
                                                text-pink-300
                                            ">

                                                {
                                                    log.performedBy ||
                                                    "-"
                                                }

                                            </td>


                                            {/* COST */}

                                            <td className="
                                                px-5
                                                py-4
                                                text-sm
                                                font-semibold
                                                text-emerald-400
                                            ">

                                                {formatCost(
                                                    log.cost
                                                )}

                                            </td>


                                            {/* NEXT SCHEDULED */}

                                            <td className="
                                                px-5
                                                py-4
                                                text-sm
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                ">

                                                    <CheckCircle2
                                                        size={15}
                                                        className="
                                                            text-emerald-400
                                                        "
                                                    />

                                                    <span className="
                                                        font-medium
                                                        text-amber-300
                                                    ">

                                                        {formatDate(
                                                            log.nextScheduledDate
                                                        )}

                                                    </span>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default Maintenance;