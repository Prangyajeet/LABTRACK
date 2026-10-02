import {
    AlertTriangle,
    Trash2,
    X
} from "lucide-react";

function DeleteItemDialog({

    open,

    item,

    onClose,

    onConfirm,

    loading = false

}) {

    if (!open || !item) {

        return null;

    }

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-800 p-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">

                            <AlertTriangle

                                size={24}

                                className="text-red-500"

                            />

                        </div>

                        <div>

                            <h2 className="text-lg font-semibold text-white">

                                Delete Item

                            </h2>

                            <p className="text-sm text-slate-400">

                                This action cannot be undone.

                            </p>

                        </div>

                    </div>

                    <button

                        onClick={onClose}

                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"

                    >

                        <X size={20} />

                    </button>

                </div>

                {/* Body */}

                <div className="space-y-4 p-6">

                    <p className="text-slate-300">

                        Are you sure you want to delete the following item?

                    </p>

                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">

                        <p className="font-semibold text-white">

                            {item.itemName}

                        </p>

                        <p className="mt-1 text-sm text-slate-400">

                            Code : {item.itemCode}

                        </p>

                        <p className="text-sm text-slate-400">

                            Category : {item.categoryName}

                        </p>
                    </div>

                    <p className="text-sm text-yellow-400">

                        The item will be marked as inactive and can be restored later.

                    </p>

                </div>

                {/* Footer */}

                <div className="flex justify-end gap-3 border-t border-slate-800 p-6">

                    <button

                        onClick={onClose}

                        disabled={loading}

                        className="rounded-xl border border-slate-700 px-5 py-2.5 text-white transition hover:bg-slate-800 disabled:opacity-50"

                    >

                        Cancel

                    </button>

                    <button

                        onClick={() => onConfirm(item.id)}

                        disabled={loading}

                        className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"

                    >

                        <Trash2 size={18} />

                        {loading ? "Deleting..." : "Delete"}

                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteItemDialog;