import { useEffect, useState } from "react";

import StockOutForm
    from "../../components/inventory/StockOutForm";

import inventoryService
    from "../../services/inventoryService";


function StockOut() {

    const [items, setItems] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [notification, setNotification] =
        useState(null);


    const loadItems = async () => {

        try {

            setLoading(true);

            const response =
                await inventoryService.getAllInventory();

            setItems(
                Array.isArray(response)
                    ? response
                    : []
            );

        }
        catch (error) {

            console.error(
                "Failed to load inventory items:",
                error
            );

            setItems([]);

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadItems();

    }, []);


    const handleSuccess = () => {

        setNotification(
            "Stock issued successfully."
        );

        loadItems();


        setTimeout(() => {

            setNotification(null);

        }, 5000);

    };


    if (loading) {

        return (

            <div className="p-6 text-slate-300">

                Loading inventory items...

            </div>

        );

    }


    return (

        <div className="p-6">

            {/* =====================================================
                PAGE HEADER
            ====================================================== */}

            <div className="flex items-start justify-between mb-6">

                <div>

                    <h1 className="text-2xl font-semibold text-white">

                        Stock Out

                    </h1>

                    <p className="mt-1 text-sm text-slate-400">

                        Issue inventory items from laboratory stock.

                    </p>

                </div>


                <button
                    type="button"
                    onClick={loadItems}
                    disabled={loading}
                    className="
                        px-4
                        py-2
                        rounded-lg
                        border
                        border-slate-700
                        bg-slate-900
                        text-slate-200
                        text-sm
                        font-medium
                        hover:bg-slate-800
                        transition
                        disabled:opacity-50
                    "
                >

                    ↻ Refresh

                </button>

            </div>


            {/* =====================================================
                SUCCESS NOTIFICATION
            ====================================================== */}

            {notification && (

                <div
                    className="
                        mb-6
                        rounded-lg
                        border
                        border-emerald-500/30
                        bg-emerald-500/10
                        px-4
                        py-3
                        text-sm
                        text-emerald-400
                    "
                >

                    <div className="flex items-center gap-2">

                        <span
                            className="
                                flex
                                h-5
                                w-5
                                items-center
                                justify-center
                                rounded-full
                                bg-emerald-500/20
                                text-emerald-400
                            "
                        >

                            ✓

                        </span>


                        <span>

                            {notification}

                        </span>

                    </div>

                </div>

            )}


            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <StockOutForm

                items={items}

                onSuccess={handleSuccess}

            />

        </div>

    );

}


export default StockOut;