import { AlertTriangle } from "lucide-react";

function DeleteSupplierDialog({

    open,

    supplier,

    onClose,

    onConfirm

}) {

    if (!open || !supplier) {

        return null;

    }

    return (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-8">

                <div className="flex flex-col items-center text-center">

                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">

                        <AlertTriangle

                            size={32}

                            className="text-red-500"

                        />

                    </div>

                    <h2 className="text-2xl font-bold text-white">

                        Delete Supplier

                    </h2>

                    <p className="text-slate-400 mt-4">

                        Are you sure you want to delete

                    </p>

                    <p className="font-semibold text-white mt-1">

                        {supplier.supplierName} ?

                    </p>

                    <p className="text-sm text-slate-500 mt-4">

                        This action performs a soft delete.

                        You can restore the supplier later.

                    </p>

                </div>

                <div className="flex justify-end gap-4 mt-8">

                    <button

                        onClick={onClose}

                        className="px-6 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition"

                    >

                        Cancel

                    </button>

                    <button

                        onClick={() =>

                            onConfirm(

                                supplier.id

                            )

                        }

                        className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition"

                    >

                        Delete

                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteSupplierDialog;