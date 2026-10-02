function validateCategory(formData) {

    const errors = {};

    if (!formData.departmentId) {

        errors.departmentId = "Department is required.";

    }

    if (!formData.categoryName.trim()) {

        errors.categoryName = "Category Name is required.";

    }

    if (!formData.description.trim()) {

        errors.description = "Description is required.";

    }

    return errors;

}

export default validateCategory;