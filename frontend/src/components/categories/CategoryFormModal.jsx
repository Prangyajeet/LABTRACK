import { useEffect, useState } from "react";
import {
    X,
    FolderTree,
    Building2
} from "lucide-react";

import { getDepartmentDropdown }
    from "../../services/departmentDropdownService";

import validateCategory
    from "../../validation/categoryValidation";

function CategoryFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData
}) {

    const [departments, setDepartments] =
        useState([]);

    const [formData, setFormData] = useState({
        departmentId: "",
        categoryName: "",
        description: ""
    });

    const [errors, setErrors] =
        useState({});

    useEffect(() => {

        if (!isOpen) {
            return;
        }

        loadDepartments();

        if (initialData) {

            setFormData({
                departmentId:
                    initialData.departmentId ?? "",
                categoryName:
                    initialData.categoryName ?? "",
                description:
                    initialData.description ?? ""
            });

        } else {

            setFormData({
                departmentId: "",
                categoryName: "",
                description: ""
            });

        }

        setErrors({});

    }, [initialData, isOpen]);

    const loadDepartments = async () => {

        try {

            const response =
                await getDepartmentDropdown();

            setDepartments(
                Array.isArray(response)
                    ? response
                    : []
            );

        } catch (error) {

            console.error(error);

        }

    };

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        if (errors[name]) {

            setErrors((previous) => ({
                ...previous,
                [name]: ""
            }));

        }

    };

    const handleSubmit = (event) => {

        event.preventDefault();

        const validationErrors =
            validateCategory(formData);

        if (
            Object.keys(validationErrors).length > 0
        ) {

            setErrors(validationErrors);

            return;

        }

        onSubmit({
            ...formData,
            departmentId:
                Number(formData.departmentId)
        });

    };

    if (!isOpen) {
        return null;
    }

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/70
                px-4
                py-6
                backdrop-blur-sm
            "
            onMouseDown={(event) => {

                if (
                    event.target === event.currentTarget
                ) {
                    onClose();
                }

            }}
        >

            <div
                className="
                    w-full
                    max-w-xl
                    overflow-hidden
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    shadow-2xl
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-zinc-800
                        px-6
                        py-5
                    "
                >

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-500/10
                                text-blue-400
                            "
                        >

                            <FolderTree size={20} />

                        </div>

                        <div>

                            <h2
                                className="
                                    text-base
                                    font-semibold
                                    text-zinc-100
                                "
                            >

                                {
                                    initialData
                                        ? "Edit Category"
                                        : "Add Category"
                                }

                            </h2>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-zinc-500
                                "
                            >

                                {initialData
                                    ? "Update category information"
                                    : "Create a new inventory category"
                                }

                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-2
                            text-zinc-500
                            transition
                            hover:bg-zinc-800
                            hover:text-zinc-200
                        "
                    >

                        <X size={18} />

                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-6"
                >

                    <div className="space-y-5">

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-xs
                                    font-medium
                                    tracking-wide
                                    text-zinc-400
                                "
                            >

                                Department

                            </label>

                            <div className="relative">

                                <Building2
                                    size={16}
                                    className="
                                        absolute
                                        left-3.5
                                        top-1/2
                                        -translate-y-1/2
                                        text-zinc-600
                                    "
                                />

                                <select
                                    name="departmentId"
                                    value={
                                        formData.departmentId
                                    }
                                    onChange={handleChange}
                                    className="
                                        h-11
                                        w-full
                                        appearance-none
                                        rounded-lg
                                        border
                                        border-zinc-800
                                        bg-zinc-950
                                        pl-10
                                        pr-4
                                        text-sm
                                        text-zinc-100
                                        outline-none
                                        transition
                                        focus:border-blue-500/60
                                        focus:ring-2
                                        focus:ring-blue-500/10
                                    "
                                >

                                    <option
                                        value=""
                                        className="bg-zinc-900"
                                    >
                                        Select Department
                                    </option>

                                    {departments.map(
                                        (department) => (

                                            <option
                                                key={
                                                    department.id
                                                }
                                                value={
                                                    department.id
                                                }
                                                className="bg-zinc-900"
                                            >

                                                {
                                                    department.departmentName
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {errors.departmentId && (

                                <p
                                    className="
                                        mt-1.5
                                        text-xs
                                        text-red-400
                                    "
                                >

                                    {errors.departmentId}

                                </p>

                            )}

                        </div>

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-xs
                                    font-medium
                                    tracking-wide
                                    text-zinc-400
                                "
                            >

                                Category Name

                            </label>

                            <input
                                name="categoryName"
                                value={
                                    formData.categoryName
                                }
                                onChange={handleChange}
                                placeholder="Enter category name"
                                className="
                                    h-11
                                    w-full
                                    rounded-lg
                                    border
                                    border-zinc-800
                                    bg-zinc-950
                                    px-4
                                    text-sm
                                    text-zinc-100
                                    outline-none
                                    placeholder:text-zinc-600
                                    transition
                                    focus:border-blue-500/60
                                    focus:ring-2
                                    focus:ring-blue-500/10
                                "
                            />

                            {errors.categoryName && (

                                <p
                                    className="
                                        mt-1.5
                                        text-xs
                                        text-red-400
                                    "
                                >

                                    {errors.categoryName}

                                </p>

                            )}

                        </div>

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-xs
                                    font-medium
                                    tracking-wide
                                    text-zinc-400
                                "
                            >

                                Description

                            </label>

                            <textarea
                                rows="4"
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={handleChange}
                                placeholder="Add a short description..."
                                className="
                                    w-full
                                    resize-none
                                    rounded-lg
                                    border
                                    border-zinc-800
                                    bg-zinc-950
                                    px-4
                                    py-3
                                    text-sm
                                    text-zinc-100
                                    outline-none
                                    placeholder:text-zinc-600
                                    transition
                                    focus:border-blue-500/60
                                    focus:ring-2
                                    focus:ring-blue-500/10
                                "
                            />

                            {errors.description && (

                                <p
                                    className="
                                        mt-1.5
                                        text-xs
                                        text-red-400
                                    "
                                >

                                    {errors.description}

                                </p>

                            )}

                        </div>

                    </div>

                    <div
                        className="
                            mt-7
                            flex
                            justify-end
                            gap-3
                            border-t
                            border-zinc-800
                            pt-5
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                rounded-lg
                                border
                                border-zinc-800
                                bg-zinc-900
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-zinc-300
                                transition
                                hover:bg-zinc-800
                                hover:text-white
                            "
                        >

                            Cancel

                        </button>

                        <button
                            type="submit"
                            className="
                                rounded-lg
                                bg-blue-600
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-white
                                shadow-lg
                                shadow-blue-600/10
                                transition
                                hover:bg-blue-500
                            "
                        >

                            {
                                initialData
                                    ? "Update Category"
                                    : "Create Category"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default CategoryFormModal;