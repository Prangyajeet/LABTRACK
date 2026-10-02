import api from "./api";


// =============================================================
// BASE URL
// =============================================================

const BASE_URL = "/issue-return";


// =============================================================
// RESPONSE HELPER
// =============================================================

const unwrapResponse = (response) => {

    if (!response) {
        return null;
    }

    const data =
        response?.data ??
        response;

    if (
        data?.data !== undefined
    ) {
        return data.data;
    }

    return data;
};


// =============================================================
// NORMALIZE LIST
// =============================================================

const normalizeList = (result) => {

    if (Array.isArray(result)) {
        return result;
    }

    if (
        Array.isArray(
            result?.content
        )
    ) {
        return result.content;
    }

    if (
        Array.isArray(
            result?.data
        )
    ) {
        return result.data;
    }

    if (
        Array.isArray(
            result?.data?.content
        )
    ) {
        return result.data.content;
    }

    if (
        Array.isArray(
            result?.content?.content
        )
    ) {
        return result.content.content;
    }

    return [];
};


// =============================================================
// GET ALL ISSUE / RETURN RECORDS
// =============================================================

export const getIssueReturnRecords = async ({
    search = "",
    status = "",
    issuedToType = "",
    departmentId = ""
} = {}) => {

    const response =
        await api.get(
            BASE_URL,
            {
                params: {

                    search:
                        search?.trim() ||
                        undefined,

                    status:
                        status ||
                        undefined,

                    issuedToType:
                        issuedToType ||
                        undefined,

                    departmentId:
                        departmentId ||
                        undefined

                }
            }
        );

    return unwrapResponse(
        response
    );
};


// =============================================================
// GET SINGLE RECORD
// =============================================================

export const getIssueReturnById =
    async (id) => {

        if (!id) {

            throw new Error(
                "Issue / Return record ID is required."
            );

        }

        const response =
            await api.get(
                `${BASE_URL}/${id}`
            );

        return unwrapResponse(
            response
        );
    };


// =============================================================
// GET SUMMARY
// =============================================================

export const getIssueReturnSummary =
    async () => {

        const response =
            await api.get(
                `${BASE_URL}/summary`
            );

        return unwrapResponse(
            response
        );
    };


// =============================================================
// ISSUE ITEM
// =============================================================

export const issueItem =
    async (data) => {

        if (!data) {

            throw new Error(
                "Issue item request data is required."
            );

        }

        const response =
            await api.post(
                `${BASE_URL}/issue`,
                data
            );

        return unwrapResponse(
            response
        );
    };


// =============================================================
// RECORD RETURN
// =============================================================

export const recordReturn =
    async (data) => {

        if (!data) {

            throw new Error(
                "Return request data is required."
            );

        }

        const response =
            await api.post(
                `${BASE_URL}/return`,
                data
            );

        return unwrapResponse(
            response
        );
    };


// =============================================================
// DELETE ISSUE / RETURN RECORD
// =============================================================

export const deleteIssueReturn =
    async (id) => {

        if (!id) {

            throw new Error(
                "Issue / Return record ID is required."
            );

        }

        const response =
            await api.delete(
                `${BASE_URL}/${id}`
            );

        return unwrapResponse(
            response
        );
    };


// =============================================================
// MASTER ITEMS
// =============================================================
//
// IMPORTANT:
//
// This uses the existing Item Register API.
//
// GET /api/items
//
// The Issue / Return backend expects an actual
// InventoryItem ID, so this endpoint is kept available
// for the frontend when required.
// =============================================================

export const getIssueReturnItems =
    async () => {

        const response =
            await api.get(
                "/items",
                {
                    params: {

                        page: 0,

                        size: 1000,

                        sortBy:
                            "itemName",

                        sortDirection:
                            "asc",

                        search:
                            ""

                    }
                }
            );

        const result =
            unwrapResponse(
                response
            );

        return normalizeList(
            result
        );
    };


// =============================================================
// DEPARTMENTS
// =============================================================
//
// Existing Department Register API.
// =============================================================

export const getIssueReturnDepartments =
    async () => {

        const response =
            await api.get(
                "/departments",
                {
                    params: {

                        page: 0,

                        size: 1000,

                        sortBy:
                            "departmentName",

                        sortDirection:
                            "asc",

                        search:
                            ""

                    }
                }
            );

        const result =
            unwrapResponse(
                response
            );

        return normalizeList(
            result
        );
    };


// =============================================================
// OPEN ISSUE RECORDS
// =============================================================
//
// Used by the Record Return modal.
//
// We deliberately load both:
//
// ISSUED
// OVERDUE
//
// because both can be returned.
// =============================================================

export const getOpenIssueRecords =
    async () => {

        const [
            issuedResponse,
            overdueResponse
        ] =
            await Promise.all([

                api.get(
                    BASE_URL,
                    {
                        params: {
                            status:
                                "ISSUED"
                        }
                    }
                ),

                api.get(
                    BASE_URL,
                    {
                        params: {
                            status:
                                "OVERDUE"
                        }
                    }
                )

            ]);


        const issued =
            normalizeList(
                unwrapResponse(
                    issuedResponse
                )
            );


        const overdue =
            normalizeList(
                unwrapResponse(
                    overdueResponse
                )
            );


        const combined = [
            ...issued,
            ...overdue
        ];


        // -----------------------------------------------------
        // REMOVE DUPLICATES
        // -----------------------------------------------------

        const unique =
            Array.from(
                new Map(

                    combined
                        .filter(
                            record =>
                                record?.id != null
                        )
                        .map(
                            record => [
                                record.id,
                                record
                            ]
                        )

                ).values()
            );


        return unique;
    };


// =============================================================
// NORMALIZER EXPORT
// =============================================================

export {
    normalizeList
};