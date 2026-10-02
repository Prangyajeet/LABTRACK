import { useEffect, useMemo, useState } from "react";

import {
    BarChart3,
    CalendarDays,
    FileBarChart,
    FileDown,
    HeartPulse,
    Package,
    RefreshCw,
    ShieldAlert,
    Wrench
} from "lucide-react";

import reportsService from "../../services/reportsService";


const DATE_RANGES = [
    {
        value: "TODAY",
        label: "Today"
    },
    {
        value: "LAST_7_DAYS",
        label: "Last 7 Days"
    },
    {
        value: "LAST_30_DAYS",
        label: "Last 30 Days"
    },
    {
        value: "THIS_YEAR",
        label: "This Year"
    }
];


const REPORT_TYPES = [
    {
        value: "FULL_REPORT",
        label: "Full Report"
    },
    {
        value: "INVENTORY_STOCK",
        label: "Inventory Stock"
    },
    {
        value: "LOW_STOCK",
        label: "Low Stock"
    },
    {
        value: "OUT_OF_STOCK",
        label: "Out of Stock"
    },
    {
        value: "STOCK_IN",
        label: "Stock In"
    },
    {
        value: "STOCK_OUT",
        label: "Stock Out"
    },
    {
        value: "DAILY_CONSUMABLES",
        label: "Daily Consumable Usage"
    },
    {
        value: "EXPIRY",
        label: "Expiry"
    },
    {
        value: "SUPPLIER_PURCHASES",
        label: "Supplier-wise Purchases"
    },
    {
        value: "SUPPLIER_ITEMS",
        label: "Supplier-wise Items"
    },
    {
        value: "EQUIPMENT_REGISTER",
        label: "Equipment Register"
    },
    {
        value: "WARRANTY",
        label: "Warranty"
    },
    {
        value: "AMC",
        label: "AMC"
    },
    {
        value: "AMC_EXPIRY",
        label: "AMC Expiry"
    },
    {
        value: "MAINTENANCE_HISTORY",
        label: "Maintenance History"
    },
    {
        value: "MAINTENANCE_COST",
        label: "Maintenance Cost"
    },
    {
        value: "BREAKAGE_REGISTER",
        label: "Breakage Register"
    },
    {
        value: "DEPARTMENT_BREAKAGE",
        label: "Department-wise Breakage"
    },
    {
        value: "PERSON_BREAKAGE",
        label: "Person-wise Breakage"
    },
    {
        value: "PENDING_RECOVERY",
        label: "Pending Recovery"
    },
    {
        value: "PAID_RECOVERY",
        label: "Paid Recovery"
    },
    {
        value: "WAIVED_RECOVERY",
        label: "Waived Recovery"
    },
    {
        value: "BREAKAGE_COST",
        label: "Breakage Cost"
    }
];


const EMPTY_MONTHS = [
    {
        month: "Mar",
        value: 0
    },
    {
        month: "Apr",
        value: 0
    },
    {
        month: "May",
        value: 0
    },
    {
        month: "Jun",
        value: 0
    },
    {
        month: "Jul",
        value: 0
    },
    {
        month: "Aug",
        value: 0
    }
];


function normalizeNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    if (
        typeof value === "number" &&
        Number.isFinite(value)
    ) {
        return value;
    }

    const number =
        Number(
            String(value)
                .replace(/[₹,\s]/g, "")
                .trim()
        );

    return Number.isFinite(number)
        ? number
        : 0;
}


function formatCurrency(value) {

    const amount =
        normalizeNumber(value);

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);
}


function getErrorMessage(
    error,
    fallback
) {

    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        fallback
    );
}


function formatDate(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getDateRangeValues(
    dateRange
) {

    const today =
        new Date();

    const toDate =
        new Date(today);

    let fromDate =
        new Date(today);

    switch (dateRange) {

        case "TODAY":

            fromDate =
                new Date(today);

            break;

        case "LAST_7_DAYS":

            fromDate.setDate(
                today.getDate() - 6
            );

            break;

        case "LAST_30_DAYS":

            fromDate.setDate(
                today.getDate() - 29
            );

            break;

        case "THIS_YEAR":

            fromDate =
                new Date(
                    today.getFullYear(),
                    0,
                    1
                );

            break;

        default:

            fromDate.setDate(
                today.getDate() - 29
            );

            break;
    }

    return {
        fromDate:
            formatDate(fromDate),

        toDate:
            formatDate(toDate)
    };
}


function getLastSixMonths() {

    const result = [];

    const today =
        new Date();

    for (
        let index = 5;
        index >= 0;
        index -= 1
    ) {

        const date =
            new Date(
                today.getFullYear(),
                today.getMonth() - index,
                1
            );

        result.push({
            month:
                date.toLocaleString(
                    "en-IN",
                    {
                        month: "short"
                    }
                ),

            value: 0
        });
    }

    return result;
}


function normalizeChartData(
    data
) {

    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {
        return getLastSixMonths();
    }

    return data.map(
        (
            item,
            index
        ) => {

            return {
                month:
                    item?.label ||
                    item?.month ||
                    item?.name ||
                    item?.date ||
                    item?.period ||
                    `Month ${index + 1}`,

                value:
                    normalizeNumber(
                        item?.value
                    )
            };
        }
    );
}


function findMetric(
    metrics,
    metricName
) {

    if (
        !Array.isArray(metrics)
    ) {
        return null;
    }

    const normalizedTarget =
        String(
            metricName
        )
            .trim()
            .toLowerCase();

    return (
        metrics.find(
            (item) => {

                const currentMetric =
                    String(
                        item?.metric ||
                        ""
                    )
                        .trim()
                        .toLowerCase();

                return (
                    currentMetric ===
                    normalizedTarget
                );
            }
        ) ||
        null
    );
}


function getMetricValue(
    metrics,
    metricName
) {

    const metric =
        findMetric(
            metrics,
            metricName
        );

    if (!metric) {
        return 0;
    }

    return normalizeNumber(
        metric.value
    );
}


function getMetricChange(
    metrics,
    metricName
) {

    const metric =
        findMetric(
            metrics,
            metricName
        );

    if (!metric) {
        return "Live";
    }

    if (
        metric.change === null ||
        metric.change === undefined ||
        metric.change === "" ||
        metric.change === "—"
    ) {
        return "Live";
    }

    return metric.change;
}


/*
 * ============================================================
 * REPORT ROW HELPERS
 * ============================================================
 *
 * Backend returns:
 *
 * rows: [
 *     {
 *         values: {
 *             itemCode: "...",
 *             itemName: "...",
 *             ...
 *         }
 *     }
 * ]
 *
 * This section converts those dynamic values into a table.
 */


function getReportRowValues(row) {

    if (
        row === null ||
        row === undefined
    ) {
        return {};
    }

    if (
        row?.values &&
        typeof row.values === "object" &&
        !Array.isArray(row.values)
    ) {
        return row.values;
    }

    if (
        typeof row === "object" &&
        !Array.isArray(row)
    ) {
        return row;
    }

    return {};
}


function formatColumnName(
    column
) {

    if (!column) {
        return "";
    }

    return String(column)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
}


function formatReportCellValue(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }

    if (
        typeof value === "object"
    ) {

        if (
            Array.isArray(value)
        ) {
            return value.join(", ");
        }

        try {

            return JSON.stringify(
                value
            );

        } catch (
            error
        ) {

            return String(value);
        }
    }

    return String(value);
}


function getReportColumns(
    rows
) {

    if (
        !Array.isArray(rows) ||
        rows.length === 0
    ) {
        return [];
    }

    const columns = [];

    rows.forEach(
        (row) => {

            const values =
                getReportRowValues(
                    row
                );

            Object.keys(
                values
            ).forEach(
                (key) => {

                    if (
                        !columns.includes(
                            key
                        )
                    ) {
                        columns.push(
                            key
                        );
                    }

                }
            );

        }
    );

    return columns;
}


function MiniBarChart({
    data,
    type
}) {

    const safeData =
        data?.length
            ? data
            : EMPTY_MONTHS;

    const maximum =
        Math.max(
            ...safeData.map(
                (item) =>
                    normalizeNumber(
                        item.value
                    )
            ),
            1
        );

    return (

        <div className="flex h-full w-full items-end gap-3 px-3 pb-2 pt-5 sm:gap-5">

            {safeData.map(
                (
                    item,
                    index
                ) => {

                    const value =
                        normalizeNumber(
                            item.value
                        );

                    const percentage =
                        value === 0
                            ? 4
                            : Math.max(
                                  8,
                                  (
                                      value /
                                      maximum
                                  ) *
                                  100
                              );

                    const barClass =
                        type === "breakage"
                            ? "from-pink-500 to-rose-400"
                            : "from-cyan-400 to-blue-500";

                    return (

                        <div
                            key={
                                `${item.month}-${index}`
                            }
                            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                        >

                            <div className="mb-2 text-[10px] font-medium text-slate-500">
                                {value}
                            </div>


                            <div className="flex h-[175px] w-full items-end justify-center">

                                <div
                                    className={`w-full max-w-[42px] rounded-t-lg bg-gradient-to-t ${barClass} shadow-lg transition-all duration-500`}
                                    style={{
                                        height:
                                            `${percentage}%`
                                    }}
                                    title={
                                        `${item.month}: ${value}`
                                    }
                                />

                            </div>


                            <div className="mt-3 text-[11px] font-medium text-slate-500">
                                {item.month}
                            </div>

                        </div>
                    );
                }
            )}

        </div>
    );
}


function MetricIcon({
    type
}) {

    switch (type) {

        case "items":

            return (
                <Package size={17} />
            );

        case "consumables":

            return (
                <BarChart3 size={17} />
            );

        case "breakages":

            return (
                <HeartPulse size={17} />
            );

        case "pending":

            return (
                <FileBarChart size={17} />
            );

        case "cost":

            return (
                <ShieldAlert size={17} />
            );

        case "amc":

            return (
                <Wrench size={17} />
            );

        default:

            return (
                <BarChart3 size={17} />
            );
    }
}


function Reports() {

    const [
        dateRange,
        setDateRange
    ] =
        useState(
            "LAST_30_DAYS"
        );


    const [
        department,
        setDepartment
    ] =
        useState("");


    const [
        reportType,
        setReportType
    ] =
        useState(
            "FULL_REPORT"
        );


    const [
        departments,
        setDepartments
    ] =
        useState([]);


    const [
        summary,
        setSummary
    ] =
        useState({

            totalItems: 0,

            consumableLogs: 0,

            breakages: 0,

            pendingReturns: 0,

            breakageCost: 0,

            amcActive: 0
        });


    const [
        metricChanges,
        setMetricChanges
    ] =
        useState({});


    const [
        consumableUsage,
        setConsumableUsage
    ] =
        useState(
            getLastSixMonths
        );


    const [
        breakageTrend,
        setBreakageTrend
    ] =
        useState(
            getLastSixMonths
        );


    /*
     * NEW:
     *
     * Stores the actual rows returned for the selected
     * report type.
     */

    const [
        reportRows,
        setReportRows
    ] =
        useState([]);


    const [
        loading,
        setLoading
    ] =
        useState(false);


    const [
        exportingPdf,
        setExportingPdf
    ] =
        useState(false);


    const [
        exportingExcel,
        setExportingExcel
    ] =
        useState(false);


    const [
        error,
        setError
    ] =
        useState("");


    const selectedDateRange =
        useMemo(
            () =>
                DATE_RANGES.find(
                    (item) =>
                        item.value ===
                        dateRange
                ),
            [dateRange]
        );


    const selectedReport =
        useMemo(
            () =>
                REPORT_TYPES.find(
                    (item) =>
                        item.value ===
                        reportType
                ),
            [reportType]
        );


    /*
     * NEW:
     *
     * Generate table columns dynamically from backend rows.
     */

    const reportColumns =
        useMemo(
            () =>
                getReportColumns(
                    reportRows
                ),
            [reportRows]
        );


    /*
     * ============================================================
     * LOAD DEPARTMENTS
     * ============================================================
     */

    const loadDepartments =
        async () => {

            try {

                const response =
                    await reportsService
                        .getDepartments();


                console.log(
                    "DEPARTMENTS RESPONSE:",
                    response
                );


                const root =
                    response?.data ||
                    response ||
                    {};


                const data =
                    root?.data ||
                    root?.content ||
                    root;


                if (
                    Array.isArray(data)
                ) {

                    setDepartments(
                        data
                    );

                } else {

                    setDepartments(
                        []
                    );
                }

            } catch (
                departmentError
            ) {

                console.error(
                    "DEPARTMENT LOAD ERROR:",
                    departmentError
                );

                setDepartments(
                    []
                );
            }
        };


    /*
     * ============================================================
     * LOAD REPORT
     * ============================================================
     */

    const loadReportData =
        async () => {

            try {

                setLoading(
                    true
                );

                setError(
                    ""
                );


                const {
                    fromDate,
                    toDate
                } =
                    getDateRangeValues(
                        dateRange
                    );


                /*
                 * Send the selected report type
                 * directly to backend.
                 */

                const response =
                    await reportsService
                        .getReportSummary(
                            {
                                fromDate,

                                toDate,

                                departmentId:
                                    department ||
                                    null,

                                reportType
                            }
                        );


                console.log(
                    "REPORT API RESPONSE:",
                    response
                );


                const data =
                    response?.data ||
                    response ||
                    {};


                /*
                 * =================================================
                 * REPORT ROWS
                 * =================================================
                 *
                 * THIS IS THE IMPORTANT FIX.
                 *
                 * Backend returns:
                 *
                 * rows: [...]
                 *
                 * Previously these rows were completely ignored.
                 */

                const backendRows =
                    Array.isArray(
                        data?.rows
                    )
                        ? data.rows
                        : [];


                console.log(
                    "SELECTED REPORT TYPE:",
                    reportType
                );


                console.log(
                    "REPORT ROWS:",
                    backendRows
                );


                setReportRows(
                    backendRows
                );


                /*
                 * =================================================
                 * METRICS
                 * =================================================
                 */

                const backendMetrics =
                    Array.isArray(
                        data?.metrics
                    )
                        ? data.metrics
                        : [];


                console.log(
                    "REPORT METRICS:",
                    backendMetrics
                );


                const totalItems =
                    getMetricValue(
                        backendMetrics,
                        "Total Items"
                    );


                const consumableLogs =
                    getMetricValue(
                        backendMetrics,
                        "Consumable Logs"
                    );


                const breakages =
                    getMetricValue(
                        backendMetrics,
                        "Breakages"
                    );


                const pendingReturns =
                    getMetricValue(
                        backendMetrics,
                        "Items Issued / Pending Return"
                    );


                const breakageCost =
                    getMetricValue(
                        backendMetrics,
                        "Breakage Cost"
                    );


                const amcActive =
                    getMetricValue(
                        backendMetrics,
                        "AMC Active"
                    );


                /*
                 * =================================================
                 * METRIC CHANGES
                 * =================================================
                 */

                setMetricChanges({

                    totalItems:
                        getMetricChange(
                            backendMetrics,
                            "Total Items"
                        ),

                    consumableLogs:
                        getMetricChange(
                            backendMetrics,
                            "Consumable Logs"
                        ),

                    breakages:
                        getMetricChange(
                            backendMetrics,
                            "Breakages"
                        ),

                    pendingReturns:
                        getMetricChange(
                            backendMetrics,
                            "Items Issued / Pending Return"
                        ),

                    breakageCost:
                        getMetricChange(
                            backendMetrics,
                            "Breakage Cost"
                        ),

                    amcActive:
                        getMetricChange(
                            backendMetrics,
                            "AMC Active"
                        )
                });


                /*
                 * =================================================
                 * SUMMARY
                 * =================================================
                 */

                setSummary({

                    totalItems:

                        totalItems,

                    consumableLogs:

                        consumableLogs,

                    breakages:

                        breakages,

                    pendingReturns:

                        pendingReturns,

                    breakageCost:

                        breakageCost,

                    amcActive:

                        amcActive
                });


                /*
                 * =================================================
                 * CONSUMABLE USAGE CHART
                 * =================================================
                 */

                const consumableData =
                    Array.isArray(
                        data?.consumableUsage
                    )
                        ? data.consumableUsage
                        : [];


                /*
                 * =================================================
                 * BREAKAGE CHART
                 * =================================================
                 */

                const breakageData =
                    Array.isArray(
                        data?.breakages
                    )
                        ? data.breakages
                        : [];


                console.log(
                    "CONSUMABLE USAGE:",
                    consumableData
                );


                console.log(
                    "BREAKAGES:",
                    breakageData
                );


                setConsumableUsage(
                    normalizeChartData(
                        consumableData
                    )
                );


                setBreakageTrend(
                    normalizeChartData(
                        breakageData
                    )
                );

            } catch (
                requestError
            ) {

                console.error(
                    "REPORT LOAD ERROR:",
                    requestError
                );


                setError(
                    getErrorMessage(
                        requestError,
                        "Unable to load report data."
                    )
                );


                setSummary({

                    totalItems: 0,

                    consumableLogs: 0,

                    breakages: 0,

                    pendingReturns: 0,

                    breakageCost: 0,

                    amcActive: 0
                });


                setMetricChanges({});


                setReportRows([]);


                setConsumableUsage(
                    getLastSixMonths()
                );


                setBreakageTrend(
                    getLastSixMonths()
                );

            } finally {

                setLoading(
                    false
                );
            }
        };


    /*
     * ============================================================
     * INITIAL LOAD
     * ============================================================
     */

    useEffect(
        () => {

            loadDepartments();

        },
        []
    );


    /*
     * ============================================================
     * REPORT RELOAD
     * ============================================================
     *
     * Changing:
     *
     * Date
     * Department
     * Report Type
     *
     * automatically requests fresh backend data.
     */

    useEffect(
        () => {

            loadReportData();

        },
        [
            dateRange,
            department,
            reportType
        ]
    );


    /*
     * ============================================================
     * PDF EXPORT
     * ============================================================
     */

    const handlePdfExport =
        async () => {

            try {

                setExportingPdf(
                    true
                );

                setError(
                    ""
                );


                const {
                    fromDate,
                    toDate
                } =
                    getDateRangeValues(
                        dateRange
                    );


                await reportsService
                    .exportPdf(
                        {
                            fromDate,

                            toDate,

                            departmentId:
                                department ||
                                null,

                            reportType
                        }
                    );

            } catch (
                exportError
            ) {

                console.error(
                    "PDF EXPORT ERROR:",
                    exportError
                );


                setError(
                    getErrorMessage(
                        exportError,
                        "Unable to export PDF."
                    )
                );

            } finally {

                setExportingPdf(
                    false
                );
            }
        };


    /*
     * ============================================================
     * EXCEL EXPORT
     * ============================================================
     */

    const handleExcelExport =
        async () => {

            try {

                setExportingExcel(
                    true
                );

                setError(
                    ""
                );


                const {
                    fromDate,
                    toDate
                } =
                    getDateRangeValues(
                        dateRange
                    );


                await reportsService
                    .exportExcel(
                        {
                            fromDate,

                            toDate,

                            departmentId:
                                department ||
                                null,

                            reportType
                        }
                    );

            } catch (
                exportError
            ) {

                console.error(
                    "EXCEL EXPORT ERROR:",
                    exportError
                );


                setError(
                    getErrorMessage(
                        exportError,
                        "Unable to export Excel."
                    )
                );

            } finally {

                setExportingExcel(
                    false
                );
            }
        };


    /*
     * ============================================================
     * METRICS
     * ============================================================
     */

    const metrics = [

        {
            key:
                "items",

            label:
                "Total Items",

            value:
                summary.totalItems,

            change:
                metricChanges.totalItems ||
                "Live"
        },


        {
            key:
                "consumables",

            label:
                "Consumable Logs (Month)",

            value:
                summary.consumableLogs,

            change:
                metricChanges.consumableLogs ||
                "Live"
        },


        {
            key:
                "breakages",

            label:
                "Breakages (Month)",

            value:
                summary.breakages,

            change:
                metricChanges.breakages ||
                "Live"
        },


        {
            key:
                "pending",

            label:
                "Items Issued / Pending",

            value:
                summary.pendingReturns >
                0
                    ? `${summary.pendingReturns} pending`
                    : "0 pending",

            change:
                metricChanges.pendingReturns ||
                "Live"
        },


        {
            key:
                "cost",

            label:
                "Breakage Cost (Month)",

            value:
                formatCurrency(
                    summary.breakageCost
                ),

            change:
                metricChanges.breakageCost ||
                "Live"
        },


        {
            key:
                "amc",

            label:
                "AMC Active",

            value:
                summary.amcActive,

            change:
                metricChanges.amcActive ||
                "Live"
        }
    ];


    /*
     * ============================================================
     * SELECTED DEPARTMENT
     * ============================================================
     */

    const selectedDepartmentName =
        department
            ? (
                departments.find(
                    (item) =>
                        String(
                            item?.id
                        ) ===
                        String(
                            department
                        )
                )?.name ||

                departments.find(
                    (item) =>
                        String(
                            item?.id
                        ) ===
                        String(
                            department
                        )
                )?.departmentName ||

                "Selected"
            )
            : "All Departments";


    /*
     * ============================================================
     * PAGE
     * ============================================================
     */

    return (

        <div className="min-h-full bg-[#060a14] px-4 py-6 text-white sm:px-6 lg:px-8">

            <div className="mx-auto max-w-[1500px]">


                {/* =================================================
                    HEADER
                    ================================================= */}

                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">

                            <FileBarChart
                                size={24}
                            />

                        </div>


                        <div>

                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Reports
                            </h1>


                            <p className="mt-1 text-sm text-slate-400">
                                Laboratory inventory and operational reports
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={
                            loadReportData
                        }
                        disabled={
                            loading
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-slate-700 bg-[#0d1424] px-4 text-sm font-medium text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
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
                    GENERATE REPORT
                    ================================================= */}

                <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1424] shadow-xl shadow-black/20">

                    <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-4">

                        <CalendarDays
                            size={17}
                            className="text-cyan-400"
                        />

                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                            Generate Report
                        </span>

                    </div>


                    <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-3 xl:grid-cols-[1fr_1fr_1.25fr_auto_auto]">


                        {/* DATE RANGE */}

                        <div>

                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                Date Range
                            </label>


                            <select
                                value={
                                    dateRange
                                }
                                onChange={
                                    (event) =>
                                        setDateRange(
                                            event.target.value
                                        )
                                }
                                className="h-11 w-full rounded-lg border border-slate-700 bg-[#080e1b] px-4 text-sm text-white outline-none transition focus:border-cyan-400"
                            >

                                {DATE_RANGES.map(
                                    (
                                        item
                                    ) => (

                                        <option
                                            key={
                                                item.value
                                            }
                                            value={
                                                item.value
                                            }
                                        >
                                            {
                                                item.label
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* DEPARTMENT */}

                        <div>

                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                Department
                            </label>


                            <select
                                value={
                                    department
                                }
                                onChange={
                                    (event) =>
                                        setDepartment(
                                            event.target.value
                                        )
                                }
                                className="h-11 w-full rounded-lg border border-slate-700 bg-[#080e1b] px-4 text-sm text-white outline-none transition focus:border-cyan-400"
                            >

                                <option value="">
                                    All Departments
                                </option>


                                {departments.map(
                                    (
                                        item
                                    ) => (

                                        <option
                                            key={
                                                item.id
                                            }
                                            value={
                                                item.id
                                            }
                                        >
                                            {
                                                item.name ||
                                                item.departmentName ||
                                                "Department"
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* REPORT TYPE */}

                        <div>

                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                Report Type
                            </label>


                            <select
                                value={
                                    reportType
                                }
                                onChange={
                                    (event) =>
                                        setReportType(
                                            event.target.value
                                        )
                                }
                                className="h-11 w-full rounded-lg border border-slate-700 bg-[#080e1b] px-4 text-sm text-white outline-none transition focus:border-cyan-400"
                            >

                                {REPORT_TYPES.map(
                                    (
                                        item
                                    ) => (

                                        <option
                                            key={
                                                item.value
                                            }
                                            value={
                                                item.value
                                            }
                                        >
                                            {
                                                item.label
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* PDF */}

                        <button
                            type="button"
                            onClick={
                                handlePdfExport
                            }
                            disabled={
                                exportingPdf
                            }
                            className="h-11 self-end rounded-lg bg-cyan-400 px-5 text-sm font-bold text-[#041018] transition hover:bg-cyan-300 disabled:opacity-50"
                        >

                            <span className="inline-flex items-center gap-2">

                                <FileDown
                                    size={17}
                                />

                                {
                                    exportingPdf
                                        ? "Exporting..."
                                        : "Export PDF"
                                }

                            </span>

                        </button>


                        {/* EXCEL */}

                        <button
                            type="button"
                            onClick={
                                handleExcelExport
                            }
                            disabled={
                                exportingExcel
                            }
                            className="h-11 self-end rounded-lg border border-slate-700 bg-[#101827] px-5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-300 disabled:opacity-50"
                        >

                            <span className="inline-flex items-center gap-2">

                                <FileDown
                                    size={17}
                                />

                                {
                                    exportingExcel
                                        ? "Exporting..."
                                        : "Excel"
                                }

                            </span>

                        </button>

                    </div>


                    {error && (

                        <div className="mx-5 mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">

                            <div className="flex items-start gap-3">

                                <ShieldAlert
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />

                                <div>

                                    <p className="font-semibold">
                                        Report data unavailable
                                    </p>

                                    <p className="mt-1 text-amber-400/80">
                                        {error}
                                    </p>

                                </div>

                            </div>

                        </div>

                    )}

                </section>


                {/* =================================================
                    CHARTS
                    ================================================= */}

                <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">


                    {/* CONSUMABLE USAGE */}

                    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1424]">

                        <div className="border-b border-slate-800 px-5 py-4">

                            <div className="flex items-center gap-2">

                                <BarChart3
                                    size={18}
                                    className="text-cyan-400"
                                />

                                <h2 className="text-sm font-semibold text-white">
                                    Consumable Usage
                                </h2>

                            </div>


                            <p className="mt-1 text-xs text-slate-500">
                                Last 6 Months
                            </p>

                        </div>


                        <div className="h-[300px] px-4 pb-5">

                            <MiniBarChart
                                data={
                                    consumableUsage
                                }
                                type="consumable"
                            />

                        </div>

                    </section>


                    {/* BREAKAGES */}

                    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1424]">

                        <div className="border-b border-slate-800 px-5 py-4">

                            <div className="flex items-center gap-2">

                                <HeartPulse
                                    size={18}
                                    className="text-pink-400"
                                />

                                <h2 className="text-sm font-semibold text-white">
                                    Breakages
                                </h2>

                            </div>


                            <p className="mt-1 text-xs text-slate-500">
                                Last 6 Months
                            </p>

                        </div>


                        <div className="h-[300px] px-4 pb-5">

                            <MiniBarChart
                                data={
                                    breakageTrend
                                }
                                type="breakage"
                            />

                        </div>

                    </section>

                </div>


                {/* =================================================
                    SELECTED REPORT RESULTS
                    =================================================
                    
                    NEW SECTION
                    
                    This displays the rows returned by:
                    
                    GET /api/reports
                    
                    based on the selected Report Type.
                    ================================================= */}

                <section className="mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1424]">

                    <div className="flex flex-col gap-2 border-b border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <div className="flex items-center gap-2">

                                <FileBarChart
                                    size={18}
                                    className="text-cyan-400"
                                />

                                <h2 className="text-sm font-semibold text-white">
                                    {
                                        selectedReport?.label ||
                                        "Report Results"
                                    }
                                </h2>

                            </div>


                            <p className="mt-1 text-xs text-slate-500">

                                {
                                    loading
                                        ? "Loading report data..."
                                        : `${reportRows.length} record${reportRows.length === 1 ? "" : "s"} found`
                                }

                            </p>

                        </div>


                        <div className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-400">

                            {
                                reportType
                            }

                        </div>

                    </div>


                    {loading ? (

                        <div className="flex min-h-[180px] items-center justify-center">

                            <div className="flex items-center gap-3 text-sm text-slate-400">

                                <RefreshCw
                                    size={18}
                                    className="animate-spin text-cyan-400"
                                />

                                Loading report...

                            </div>

                        </div>

                    ) : reportRows.length === 0 ? (

                        <div className="flex min-h-[180px] items-center justify-center px-5">

                            <div className="text-center">

                                <FileBarChart
                                    size={30}
                                    className="mx-auto mb-3 text-slate-600"
                                />

                                <p className="text-sm font-medium text-slate-400">
                                    No records found
                                </p>

                                <p className="mt-1 text-xs text-slate-600">

                                    No data is available for{" "}

                                    <span className="text-slate-400">
                                        {
                                            selectedReport?.label ||
                                            reportType
                                        }
                                    </span>{" "}

                                    with the selected filters.

                                </p>

                            </div>

                        </div>

                    ) : reportColumns.length === 0 ? (

                        <div className="px-5 py-6 text-sm text-slate-400">

                            Report records were returned, but there are no displayable columns.

                        </div>

                    ) : (

                        <div className="max-h-[500px] overflow-auto">

                            <table className="min-w-full border-collapse">

                                <thead className="sticky top-0 z-10 bg-[#0b1220]">

                                    <tr>

                                        <th className="whitespace-nowrap border-b border-slate-800 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">

                                            #

                                        </th>


                                        {reportColumns.map(
                                            (
                                                column
                                            ) => (

                                                <th
                                                    key={
                                                        column
                                                    }
                                                    className="whitespace-nowrap border-b border-slate-800 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500"
                                                >

                                                    {
                                                        formatColumnName(
                                                            column
                                                        )
                                                    }

                                                </th>

                                            )
                                        )}

                                    </tr>

                                </thead>


                                <tbody>

                                    {reportRows.map(
                                        (
                                            row,
                                            rowIndex
                                        ) => {

                                            const values =
                                                getReportRowValues(
                                                    row
                                                );

                                            return (

                                                <tr
                                                    key={
                                                        row?.id ||
                                                        rowIndex
                                                    }
                                                    className="transition hover:bg-white/[0.025]"
                                                >

                                                    <td className="whitespace-nowrap border-b border-slate-800 px-5 py-3 text-xs font-semibold text-slate-500">

                                                        {
                                                            rowIndex +
                                                            1
                                                        }

                                                    </td>


                                                    {reportColumns.map(
                                                        (
                                                            column
                                                        ) => (

                                                            <td
                                                                key={
                                                                    `${rowIndex}-${column}`
                                                                }
                                                                className="whitespace-nowrap border-b border-slate-800 px-5 py-3 text-sm text-slate-300"
                                                            >

                                                                {
                                                                    formatReportCellValue(
                                                                        values?.[
                                                                            column
                                                                        ]
                                                                    )
                                                                }

                                                            </td>

                                                        )
                                                    )}

                                                </tr>

                                            );

                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>


                {/* =================================================
                    METRICS TABLE
                    ================================================= */}

                <section className="mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1424]">


                    <div className="grid grid-cols-[minmax(0,1fr)_180px_150px] border-b border-slate-800 bg-[#0b1220] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">

                        <span>
                            Metric
                        </span>

                        <span>
                            Value
                        </span>

                        <span>
                            Change
                        </span>

                    </div>


                    {metrics.map(
                        (
                            metric,
                            index
                        ) => (

                            <div
                                key={
                                    metric.key
                                }
                                className={`grid grid-cols-[minmax(0,1fr)_180px_150px] items-center px-5 py-4 transition hover:bg-white/[0.02] ${
                                    index !==
                                    metrics.length - 1
                                        ? "border-b border-slate-800"
                                        : ""
                                }`}
                            >

                                <div className="flex items-center gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">

                                        <MetricIcon
                                            type={
                                                metric.key
                                            }
                                        />

                                    </div>


                                    <span className="text-sm font-medium text-slate-200">
                                        {
                                            metric.label
                                        }
                                    </span>

                                </div>


                                <span className="text-sm font-bold text-white">
                                    {
                                        metric.value
                                    }
                                </span>


                                <span className="w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                                    {
                                        metric.change
                                    }
                                </span>

                            </div>

                        )
                    )}

                </section>


                {/* =================================================
                    CURRENT FILTER
                    ================================================= */}

                <div className="mt-4 flex flex-col gap-2 rounded-xl border border-slate-800 bg-[#0b1220] px-5 py-4 text-xs text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">

                    <span>

                        Date Range:{" "}

                        <strong className="text-slate-300">

                            {
                                selectedDateRange?.label ||
                                "Last 30 Days"
                            }

                        </strong>

                    </span>


                    <span>

                        Report:{" "}

                        <strong className="text-slate-300">

                            {
                                selectedReport?.label ||
                                "Full Report"
                            }

                        </strong>

                    </span>


                    <span>

                        Department:{" "}

                        <strong className="text-slate-300">

                            {
                                selectedDepartmentName
                            }

                        </strong>

                    </span>


                    <span className="inline-flex items-center gap-2 text-emerald-400">

                        <span className="h-2 w-2 rounded-full bg-emerald-400" />

                        Live Database Data

                    </span>

                </div>

            </div>

        </div>
    );
}


export default Reports;