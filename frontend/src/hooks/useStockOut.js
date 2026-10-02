import { useState } from "react";

import inventoryService from "../services/inventoryService";


function useStockOut() {

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState(null);

    const [success, setSuccess] =
        useState(null);


    const submitStockOut = async ({

        inventoryItemId,

        quantity,

        remarks

    }) => {

        try {

            setLoading(true);

            setError(null);

            setSuccess(null);


            const response =
                await inventoryService.createStockOut({

                    inventoryItemId,

                    quantity,

                    remarks

                });


            setSuccess(
                "Stock Out recorded successfully."
            );


            return response;

        }
        catch (error) {

            console.error(
                "Stock Out failed:",
                error
            );


            const message =
                error?.response?.data?.message ||
                "Failed to record Stock Out.";


            setError(message);

            throw error;

        }
        finally {

            setLoading(false);

        }

    };


    const clearMessages = () => {

        setError(null);

        setSuccess(null);

    };


    return {

        loading,

        error,

        success,

        submitStockOut,

        clearMessages

    };

}


export default useStockOut;