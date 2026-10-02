export const validateDepartment = (values) => {

    const errors = {};

    if (!values.departmentName?.trim()) {

        errors.departmentName = "Department name is required.";

    } else if (values.departmentName.trim().length > 100) {

        errors.departmentName =
            "Department name cannot exceed 100 characters.";

    }

    if (!values.description?.trim()) {

        errors.description = "Description is required.";

    } else if (values.description.trim().length > 255) {

        errors.description =
            "Description cannot exceed 255 characters.";

    }

    return errors;

};

export default validateDepartment;