import api from "./api";


const reportsService = {


    /*
     * ==========================================================
     * GET DEPARTMENTS
     * ==========================================================
     */

    getDepartments: async () => {

        const response =
            await api.get(
                "/departments",
                {
                    params: {

                        page: 0,

                        size: 100,

                        sortBy:
                            "departmentName",

                        sortDirection:
                            "asc",

                        search:
                            ""

                    }
                }
            );


        return response.data;

    },


    /*
     * ==========================================================
     * GET REPORT SUMMARY
     * ==========================================================
     */

    getReportSummary: async ({
        fromDate,
        toDate,
        departmentId,
        reportType
    } = {}) => {


        const params = {

            reportType:
                reportType ||
                "FULL_REPORT"

        };


        /*
         * ------------------------------------------------------
         * FROM DATE
         * ------------------------------------------------------
         */

        if (
            fromDate !== null &&
            fromDate !== undefined &&
            fromDate !== ""
        ) {

            params.fromDate =
                fromDate;

        }


        /*
         * ------------------------------------------------------
         * TO DATE
         * ------------------------------------------------------
         */

        if (
            toDate !== null &&
            toDate !== undefined &&
            toDate !== ""
        ) {

            params.toDate =
                toDate;

        }


        /*
         * ------------------------------------------------------
         * DEPARTMENT
         * ------------------------------------------------------
         */

        if (
            departmentId !== null &&
            departmentId !== undefined &&
            departmentId !== ""
        ) {

            params.departmentId =
                departmentId;

        }


        console.log(
            "REPORT REQUEST PARAMS:",
            params
        );


        const response =
            await api.get(
                "/reports",
                {
                    params
                }
            );


        console.log(
            "REPORT API RESPONSE:",
            response.data
        );


        return response.data;

    },


    /*
     * ==========================================================
     * EXPORT PDF
     * ==========================================================
     */

    exportPdf: async ({
        fromDate,
        toDate,
        departmentId,
        reportType
    } = {}) => {


        const params = {

            reportType:
                reportType ||
                "FULL_REPORT"

        };


        /*
         * ------------------------------------------------------
         * FROM DATE
         * ------------------------------------------------------
         */

        if (
            fromDate !== null &&
            fromDate !== undefined &&
            fromDate !== ""
        ) {

            params.fromDate =
                fromDate;

        }


        /*
         * ------------------------------------------------------
         * TO DATE
         * ------------------------------------------------------
         */

        if (
            toDate !== null &&
            toDate !== undefined &&
            toDate !== ""
        ) {

            params.toDate =
                toDate;

        }


        /*
         * ------------------------------------------------------
         * DEPARTMENT
         * ------------------------------------------------------
         */

        if (
            departmentId !== null &&
            departmentId !== undefined &&
            departmentId !== ""
        ) {

            params.departmentId =
                departmentId;

        }


        console.log(
            "PDF EXPORT PARAMS:",
            params
        );


        const response =
            await api.get(
                "/reports/export/pdf",
                {
                    params,

                    responseType:
                        "blob"
                }
            );


        const blob =
            new Blob(
                [
                    response.data
                ],
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
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            `labtrack-${String(
                reportType ||
                "full-report"
            ).toLowerCase()}.pdf`;


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        window.URL.revokeObjectURL(
            url
        );


        return response;

    },


    /*
     * ==========================================================
     * EXPORT EXCEL
     * ==========================================================
     */

    exportExcel: async ({
        fromDate,
        toDate,
        departmentId,
        reportType
    } = {}) => {


        const params = {

            reportType:
                reportType ||
                "FULL_REPORT"

        };


        /*
         * ------------------------------------------------------
         * FROM DATE
         * ------------------------------------------------------
         */

        if (
            fromDate !== null &&
            fromDate !== undefined &&
            fromDate !== ""
        ) {

            params.fromDate =
                fromDate;

        }


        /*
         * ------------------------------------------------------
         * TO DATE
         * ------------------------------------------------------
         */

        if (
            toDate !== null &&
            toDate !== undefined &&
            toDate !== ""
        ) {

            params.toDate =
                toDate;

        }


        /*
         * ------------------------------------------------------
         * DEPARTMENT
         * ------------------------------------------------------
         */

        if (
            departmentId !== null &&
            departmentId !== undefined &&
            departmentId !== ""
        ) {

            params.departmentId =
                departmentId;

        }


        console.log(
            "EXCEL EXPORT PARAMS:",
            params
        );


        const response =
            await api.get(
                "/reports/export/excel",
                {
                    params,

                    responseType:
                        "blob"
                }
            );


        const blob =
            new Blob(
                [
                    response.data
                ],
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
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            `labtrack-${String(
                reportType ||
                "full-report"
            ).toLowerCase()}.xlsx`;


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        window.URL.revokeObjectURL(
            url
        );


        return response;

    }

};


export default reportsService;