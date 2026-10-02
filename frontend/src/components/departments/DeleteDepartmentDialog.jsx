import { AlertTriangle, X, Trash2 } from "lucide-react";

function DeleteDepartmentDialog({
    isOpen,
    department,
    onClose,
    onConfirm
}) {

    if (!isOpen || !department) {
        return null;
    }

    return (

        <div className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            p-4
            backdrop-blur-sm
        ">

            <div className="
                w-full
                max-w-md
                overflow-hidden
                rounded-2xl
                border
                border-blue-900/50
                bg-gradient-to-br
                from-[#0d1b3b]
                via-[#0a142d]
                to-[#070e20]
                shadow-[0_25px_80px_rgba(0,0,0,0.55)]
            ">

                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-blue-900/30
                    px-6
                    py-5
                ">

                    <div className="flex items-center gap-3">

                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-red-500/20
                            bg-red-500/10
                            text-red-400
                        ">

                            <AlertTriangle size={21} />

                        </div>

                        <div>

                            <h2 className="
                                text-lg
                                font-semibold
                                text-white
                            ">
                                Delete Department
                            </h2>

                            <p className="
                                text-xs
                                text-slate-500
                            ">
                                This action uses a soft delete.
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-2
                            text-slate-500
                            transition
                            hover:bg-white/5
                            hover:text-white
                        "
                    >
                        <X size={18} />
                    </button>

                </div>

                <div className="space-y-4 px-6 py-6">

                    <p className="
                        text-sm
                        leading-6
                        text-slate-400
                    ">
                        Are you sure you want to delete this
                        department?
                    </p>

                    <div className="
                        rounded-xl
                        border
                        border-red-500/15
                        bg-red-500/5
                        p-4
                    ">

                        <p className="
                            font-semibold
                            text-white
                        ">
                            {department.departmentName}
                        </p>

                        {department.description && (

                            <p className="
                                mt-1
                                text-xs
                                text-slate-500
                            ">
                                {department.description}
                            </p>

                        )}

                    </div>

                </div>

                <div className="
                    flex
                    justify-end
                    gap-3
                    border-t
                    border-blue-900/30
                    px-6
                    py-4
                ">

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-900/60
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-slate-300
                            transition
                            hover:bg-slate-800
                            hover:text-white
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-red-500/20
                            bg-red-500/15
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-red-400
                            transition
                            hover:bg-red-500/25
                        "
                    >

                        <Trash2 size={16} />

                        Delete

                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteDepartmentDialog;