function DeleteCategoryDialog({

    isOpen,

    category,

    onClose,

    onConfirm

}) {

    if (!isOpen || !category) {

        return null;

    }

    return (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

            <div className="bg-slate-900 rounded-3xl w-full max-w-md p-8">

                <h2 className="text-2xl font-bold text-white mb-4">

                    Delete Category

                </h2>

                <p className="text-slate-300 mb-8">

                    Are you sure you want to delete

                    <span className="font-semibold text-white">

                        {" "}

                        {category.categoryName}

                    </span>

                    ?

                    <br />

                    <br />

                    This action can be restored later.

                </p>

                <div className="flex justify-end gap-3">

                    <button

                        type="button"

                        onClick={onClose}

                        className="
                            px-5
                            py-3
                            rounded-xl
                            bg-slate-700
                            hover:bg-slate-600
                            text-white
                        "

                    >

                        Cancel

                    </button>

                    <button

                        type="button"

                        onClick={onConfirm}

                        className="
                            px-5
                            py-3
                            rounded-xl
                            bg-red-600
                            hover:bg-red-700
                            text-white
                        "

                    >

                        Delete

                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteCategoryDialog;