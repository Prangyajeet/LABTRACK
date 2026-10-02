import { useEffect, useState } from "react";
import { X } from "lucide-react";

import validateDepartment
    from "../../validation/departmentValidation";

function DepartmentFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData
}) {

    const [formData, setFormData] = useState({
        departmentName: "",
        description: ""
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {

        if (initialData) {

            setFormData({
                departmentName:
                    initialData.departmentName || "",
                description:
                    initialData.description || ""
            });

        } else {

            setFormData({
                departmentName: "",
                description: ""
            });

        }

        setErrors({});

    }, [initialData, isOpen]);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };

    const handleSubmit = (event) => {

        event.preventDefault();

        const validationErrors =
            validateDepartment(formData);

        if (
            Object.keys(validationErrors).length > 0
        ) {

            setErrors(validationErrors);
            return;

        }

        onSubmit(formData);

    };

    if (!isOpen) {
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
                max-w-lg
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

                    <div>

                        <p className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.2em]
                            text-blue-400
                        ">
                            Laboratory Masters
                        </p>

                        <h2 className="
                            mt-1
                            text-xl
                            font-semibold
                            text-white
                        ">
                            {initialData
                                ? "Edit Department"
                                : "Add Department"
                            }
                        </h2>

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
                        <X size={19} />
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="space-y-5 px-6 py-6">

                        <div>

                            <label className="
                                text-sm
                                font-medium
                                text-slate-300
                            ">
                                Department Name
                            </label>

                            <input
                                name="departmentName"
                                value={formData.departmentName}
                                onChange={handleChange}
                                placeholder="Enter department name"
                                className="
                                    mt-2
                                    w-full
                                    rounded-xl
                                    border
                                    border-blue-900/40
                                    bg-[#070d1d]
                                    px-4
                                    py-3
                                    text-sm
                                    text-white
                                    placeholder:text-slate-600
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-500/10
                                "
                            />

                            {errors.departmentName && (

                                <p className="
                                    mt-2
                                    text-xs
                                    text-red-400
                                ">
                                    {errors.departmentName}
                                </p>

                            )}

                        </div>

                        <div>

                            <label className="
                                text-sm
                                font-medium
                                text-slate-300
                            ">
                                Description
                            </label>

                            <textarea
                                rows="4"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter department description"
                                className="
                                    mt-2
                                    w-full
                                    resize-none
                                    rounded-xl
                                    border
                                    border-blue-900/40
                                    bg-[#070d1d]
                                    px-4
                                    py-3
                                    text-sm
                                    text-white
                                    placeholder:text-slate-600
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-500/10
                                "
                            />

                            {errors.description && (

                                <p className="
                                    mt-2
                                    text-xs
                                    text-red-400
                                ">
                                    {errors.description}
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
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="
                                rounded-xl
                                border
                                border-blue-400/20
                                bg-gradient-to-r
                                from-blue-600
                                to-cyan-500
                                px-6
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                shadow-lg
                                shadow-blue-500/10
                                transition
                                hover:from-blue-500
                                hover:to-cyan-400
                            "
                        >
                            {initialData
                                ? "Update Department"
                                : "Add Department"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default DepartmentFormModal;