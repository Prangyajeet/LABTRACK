function DailyConsumablesTable({
    consumables = [],
    loading = false
}) {


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString();

    };


    if (loading) {

        return (

            <div
                className="
                    rounded-xl
                    border
                    border-slate-800
                    bg-slate-950
                    p-8
                    text-center
                "
            >

                <p className="text-slate-400">

                    Loading today's consumable usage...

                </p>

            </div>

        );

    }


    return (

        <div
            className="
                rounded-xl
                border
                border-slate-800
                bg-slate-950
                overflow-hidden
            "
        >

            <div
                className="
                    px-6
                    py-5
                    border-b
                    border-slate-800
                "
            >

                <h2
                    className="
                        text-lg
                        font-semibold
                        text-white
                    "
                >

                    Today's Consumable Usage

                </h2>

                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >

                    Consumable items recorded through
                    today's Stock Out transactions.

                </p>

            </div>


            {consumables.length === 0 ? (

                <div className="p-10 text-center">

                    <p
                        className="
                            text-lg
                            font-medium
                            text-slate-300
                        "
                    >

                        No consumable usage recorded today.

                    </p>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-slate-500
                        "
                    >

                        Consumable Stock Out transactions
                        will appear here automatically.

                    </p>

                </div>

            ) : (

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr
                                className="
                                    border-b
                                    border-slate-800
                                    text-left
                                "
                            >

                                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Item
                                </th>

                                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Quantity Used
                                </th>

                                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Issued By
                                </th>

                                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Date
                                </th>

                                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Remarks
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {consumables.map(
                                (transaction) => (

                                    <tr
                                        key={
                                            transaction.id
                                        }
                                        className="
                                            border-b
                                            border-slate-800
                                            last:border-b-0
                                            hover:bg-slate-900/50
                                        "
                                    >

                                        <td className="px-6 py-4">

                                            <div
                                                className="
                                                    font-medium
                                                    text-white
                                                "
                                            >

                                                {
                                                    transaction.itemName ??
                                                    "-"
                                                }

                                            </div>


                                            <div
                                                className="
                                                    mt-1
                                                    text-xs
                                                    text-slate-500
                                                "
                                            >

                                                {
                                                    transaction.itemCode ??
                                                    "-"
                                                }

                                            </div>

                                        </td>


                                        <td className="px-6 py-4">

                                            <span
                                                className="
                                                    inline-flex
                                                    rounded-md
                                                    bg-red-500/10
                                                    border
                                                    border-red-500/20
                                                    px-3
                                                    py-1
                                                    text-sm
                                                    font-medium
                                                    text-red-400
                                                "
                                            >

                                                -
                                                {
                                                    transaction.quantity
                                                }

                                            </span>

                                        </td>


                                        <td
                                            className="
                                                px-6
                                                py-4
                                                text-sm
                                                text-slate-300
                                            "
                                        >

                                            {
                                                transaction.performedByName ??
                                                "-"
                                            }

                                        </td>


                                        <td
                                            className="
                                                px-6
                                                py-4
                                                text-sm
                                                text-slate-400
                                            "
                                        >

                                            {
                                                formatDate(
                                                    transaction.transactionDate
                                                )
                                            }

                                        </td>


                                        <td
                                            className="
                                                px-6
                                                py-4
                                                text-sm
                                                text-slate-400
                                            "
                                        >

                                            {
                                                transaction.remarks ||
                                                "-"
                                            }

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

}


export default DailyConsumablesTable;