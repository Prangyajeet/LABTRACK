import { useEffect, useState } from "react";

import {
    getLabOccupancy
} from "../../services/timetableService";


const LabOccupancy = ({
    date,
    lab,
    refreshKey
}) => {

    const [records, setRecords] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    /* =========================================================
       LOAD OCCUPANCY
       ========================================================= */

    useEffect(() => {

        if (!date) {

            setRecords([]);

            return;
        }


        loadOccupancy();

    }, [
        date,
        lab,
        refreshKey
    ]);


    const loadOccupancy = async () => {

        try {

            setLoading(true);

            setError("");


            const data =
                await getLabOccupancy({
                    date,
                    lab
                });


            setRecords(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Lab occupancy loading error:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to load lab occupancy."
            );

        } finally {

            setLoading(false);
        }
    };


    /* =========================================================
       FORMAT TIME
       ========================================================= */

    const formatTime = (
        time
    ) => {

        if (!time) {
            return "--";
        }

        return String(time)
            .substring(0, 5);
    };


    /* =========================================================
       FORMAT DATE
       ========================================================= */

    const formatDate = (
        value
    ) => {

        if (!value) {
            return "--";
        }

        try {

            return new Date(
                `${value}T00:00:00`
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

        } catch {
            return value;
        }
    };


    /* =========================================================
       LOADING
       ========================================================= */

    if (loading) {

        return (

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

                <div className="py-16 text-center">

                    <div className="mx-auto mb-4 h-8 w-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />

                    <p className="text-sm text-slate-500">
                        Loading lab occupancy...
                    </p>

                </div>

            </div>

        );
    }


    /* =========================================================
       ERROR
       ========================================================= */

    if (error) {

        return (

            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">

                <p className="text-sm font-medium text-red-700">
                    {error}
                </p>

            </div>

        );
    }


    return (

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

            {/* HEADER */}

            <div className="px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                <div>

                    <h2 className="text-lg font-semibold text-slate-800">
                        Lab Occupancy
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Laboratory availability based on the uploaded timetable.
                    </p>

                </div>


                {date && (

                    <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-2">

                        <p className="text-xs text-slate-400">
                            Selected Date
                        </p>

                        <p className="text-sm font-semibold text-slate-700">
                            {formatDate(date)}
                        </p>

                    </div>

                )}

            </div>


            {/* EMPTY */}

            {records.length === 0 ? (

                <div className="py-16 text-center px-6">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-2xl">
                        ✓
                    </div>


                    <p className="text-slate-700 font-semibold">
                        No occupied slots
                    </p>


                    <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                        There are no scheduled classes for the selected date and laboratory.
                    </p>


                    <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-2">

                        <span className="h-2 w-2 rounded-full bg-green-500" />

                        <span className="text-xs font-semibold text-green-700">
                            AVAILABLE
                        </span>

                    </div>

                </div>

            ) : (

                /* TABLE */

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="border-b border-slate-200 bg-slate-50">

                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Time
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Lab
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Faculty
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Class
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Subject
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {records.map(
                                (
                                    record,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            record.id ||
                                            `${record.lab}-${record.timeFrom}-${index}`
                                        }
                                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                                    >

                                        {/* TIME */}

                                        <td className="px-6 py-4">

                                            <div className="text-sm font-semibold text-slate-800 whitespace-nowrap">

                                                {formatTime(
                                                    record.timeFrom
                                                )}

                                                <span className="mx-1 text-slate-400">
                                                    -
                                                </span>

                                                {formatTime(
                                                    record.timeTo
                                                )}

                                            </div>

                                        </td>


                                        {/* LAB */}

                                        <td className="px-6 py-4">

                                            <span className="text-sm font-medium text-slate-700">
                                                {record.lab || "--"}
                                            </span>

                                        </td>


                                        {/* FACULTY */}

                                        <td className="px-6 py-4">

                                            <span className="text-sm text-slate-700">
                                                {record.faculty || "--"}
                                            </span>

                                        </td>


                                        {/* CLASS */}

                                        <td className="px-6 py-4">

                                            <span className="text-sm text-slate-700">
                                                {record.className || "--"}
                                            </span>

                                        </td>


                                        {/* SUBJECT */}

                                        <td className="px-6 py-4">

                                            <span className="text-sm text-slate-700">
                                                {record.subject || "--"}
                                            </span>

                                        </td>


                                        {/* STATUS */}

                                        <td className="px-6 py-4">

                                            {String(
                                                record.status || "VACANT"
                                            ).toUpperCase() === "OCCUPIED" ? (

                                                <span className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">

                                                    <span className="h-2 w-2 rounded-full bg-red-500" />

                                                    OCCUPIED

                                                </span>

                                            ) : (

                                                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1.5 text-xs font-semibold text-green-700">

                                                    <span className="h-2 w-2 rounded-full bg-green-500" />

                                                    VACANT

                                                </span>

                                            )}

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
};


export default LabOccupancy;