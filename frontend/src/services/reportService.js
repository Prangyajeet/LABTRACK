import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8080";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| Date Range Helper
|--------------------------------------------------------------------------
*/

function getDateRangeDates(dateRange) {
    const today = new Date();

    const formatDate = (date) => {
        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const toDate = new Date(today);

    let fromDate = new Date(today);

    switch (dateRange) {

        case "TODAY":
            fromDate = new Date(today);
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
            fromDate = new Date(
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
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate)
    };
}

/*
|--------------------------------------------------------------------------
| Report Parameters
|--------------------------------------------------------------------------
*/

function buildReportParams({
    dateRange,
    departmentId,
    reportType
}) {
    const {
        fromDate,
        toDate
    } = getDateRangeDates(dateRange);

    const params = {
        fromDate,
        toDate,
        reportType
    };

    if (
        departmentId !== null &&
        departmentId !== undefined &&
        departmentId !== ""
    ) {
        params.departmentId =
            departmentId;
    }

    return params;
}

/*
|--------------------------------------------------------------------------
| Reports Service
|--------------------------------------------------------------------------
*/

const reportsService = {

    /*
    |--------------------------------------------------------------------------
    | Departments
    |--------------------------------------------------------------------------
    */

    getDepartments: async () => {
        return api.get(
            "/api/departments"
        );
    },

    /*
    |--------------------------------------------------------------------------
    | Report Summary
    |--------------------------------------------------------------------------
    */

    getReportSummary: async ({
        dateRange,
        departmentId,
        reportType
    }) => {

        const params =
            buildReportParams({
                dateRange,
                departmentId,
                reportType
            });

        return api.get(
            "/api/reports/summary",
            {
                params
            }
        );
    },

    /*
    |--------------------------------------------------------------------------
    | Export PDF
    |--------------------------------------------------------------------------
    */

    exportPdf: async ({
        dateRange,
        departmentId,
        reportType
    }) => {

        const params =
            buildReportParams({
                dateRange,
                departmentId,
                reportType
            });

        const response =
            await api.get(
                "/api/reports/export/pdf",
                {
                    params,
                    responseType: "blob"
                }
            );

        const blob =
            new Blob(
                [response.data],
                {
                    type:
                        "application/pdf"
                }
            );

        const url =
            window.URL.createObjectURL(
                blob
            );

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            `labtrack-${String(
                reportType ||
                "report"
            ).toLowerCase()}.pdf`;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
            url
        );

        return response;
    },

    /*
    |--------------------------------------------------------------------------
    | Export Excel
    |--------------------------------------------------------------------------
    */

    exportExcel: async ({
        dateRange,
        departmentId,
        reportType
    }) => {

        const params =
            buildReportParams({
                dateRange,
                departmentId,
                reportType
            });

        const response =
            await api.get(
                "/api/reports/export/excel",
                {
                    params,
                    responseType: "blob"
                }
            );

        const blob =
            new Blob(
                [response.data],
                {
                    type:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                }
            );

        const url =
            window.URL.createObjectURL(
                blob
            );

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            `labtrack-${String(
                reportType ||
                "report"
            ).toLowerCase()}.xlsx`;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
            url
        );

        return response;
    }
};

export default reportsService;