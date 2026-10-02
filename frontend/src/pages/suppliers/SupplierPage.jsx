import { useState } from "react";

import SupplierStats from "../../components/suppliers/SupplierStats";
import SupplierFilters from "../../components/suppliers/SupplierFilters";
import SupplierTable from "../../components/suppliers/SupplierTable";
import SupplierFormModal from "../../components/suppliers/SupplierFormModal";
import DeleteSupplierDialog from "../../components/suppliers/DeleteSupplierDialog";

import useSuppliers from "../../hooks/useSuppliers";

import {
    exportSuppliers
} from "../../services/supplierService";


function SupplierPage() {

    const {
        suppliers,
        loading,
        search,
        setSearch,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
        refreshSuppliers,
        addSupplier,
        editSupplier,
        removeSupplier,
        recoverSupplier
    } = useSuppliers();


    const [formOpen, setFormOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [selectedSupplier, setSelectedSupplier] =
        useState(null);

    const [viewOpen, setViewOpen] =
        useState(false);

    const [contactOpen, setContactOpen] =
        useState(false);


    const handleAdd = () => {

        setSelectedSupplier(null);

        setFormOpen(true);

    };


    const handleEdit = (supplier) => {

        setSelectedSupplier(supplier);

        setFormOpen(true);

    };


    const handleDelete = (supplier) => {

        setSelectedSupplier(supplier);

        setDeleteOpen(true);

    };


    const handleRestore = async (supplier) => {

        await recoverSupplier(
            supplier.id
        );

    };


    const handleView = (supplier) => {

        setSelectedSupplier(supplier);

        setViewOpen(true);

    };


    const handleContact = (supplier) => {

        setSelectedSupplier(supplier);

        setContactOpen(true);

    };


    const handleSubmit = async (formData) => {

        if (selectedSupplier) {

            await editSupplier(
                selectedSupplier.id,
                formData
            );

        } else {

            await addSupplier(
                formData
            );

        }

        setFormOpen(false);

        setSelectedSupplier(null);

    };


    const confirmDelete = async (id) => {

        await removeSupplier(id);

        setDeleteOpen(false);

        setSelectedSupplier(null);

    };


    const handleExport = async () => {

        const blob =
            await exportSuppliers();

        const url =
            window.URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "Suppliers.xlsx";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

    };


    const closeViewModal = () => {

        setViewOpen(false);

        setSelectedSupplier(null);

    };


    const closeContactModal = () => {

        setContactOpen(false);

        setSelectedSupplier(null);

    };


    return (

        <div className="
            space-y-8
            text-[#e6edf3]
        ">

            {/* PAGE HEADER */}

            <div className="
                flex
                items-start
                justify-between
                gap-4
            ">

                <div>

                    <h1 className="
                        text-3xl
                        font-bold
                        tracking-tight
                        text-white
                    ">
                        Supplier Management
                    </h1>

                    <p className="
                        mt-2
                        text-sm
                        text-blue-300
                    ">
                        Manage all laboratory suppliers.
                    </p>

                </div>

            </div>


            {/* STATISTICS */}

            <SupplierStats
                suppliers={suppliers}
            />


            {/* FILTERS */}

            <SupplierFilters

                search={search}

                setSearch={setSearch}

                sortBy={sortBy}

                setSortBy={setSortBy}

                sortDirection={sortDirection}

                setSortDirection={setSortDirection}

                refreshSuppliers={refreshSuppliers}

                onAdd={handleAdd}

                onExport={handleExport}

            />


            {/* TABLE */}

            <SupplierTable

                suppliers={suppliers}

                loading={loading}

                onView={handleView}

                onContact={handleContact}

                onEdit={handleEdit}

                onDelete={handleDelete}

                onRestore={handleRestore}

            />


            {/* ADD / EDIT */}

            <SupplierFormModal

                open={formOpen}

                editingSupplier={selectedSupplier}

                onClose={() => {

                    setFormOpen(false);

                    setSelectedSupplier(null);

                }}

                onSubmit={handleSubmit}

            />


            {/* DELETE */}

            <DeleteSupplierDialog

                open={deleteOpen}

                supplier={selectedSupplier}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedSupplier(null);

                }}

                onConfirm={confirmDelete}

            />


            {/* VIEW */}

            {viewOpen &&
                selectedSupplier && (

                    <SupplierDetailsModal

                        supplier={selectedSupplier}

                        onClose={closeViewModal}

                    />

                )
            }


            {/* CONTACT */}

            {contactOpen &&
                selectedSupplier && (

                    <ContactSupplierModal

                        supplier={selectedSupplier}

                        onClose={closeContactModal}

                    />

                )
            }

        </div>

    );
}


/* =====================================================
   SUPPLIER DETAILS MODAL
===================================================== */

function SupplierDetailsModal({
    supplier,
    onClose
}) {

    const details = [

        {
            label: "Supplier Code",
            value: supplier.supplierCode
        },

        {
            label: "Supplier Name",
            value: supplier.supplierName
        },

        {
            label: "Contact Person",
            value: supplier.contactPerson
        },

        {
            label: "Phone Number",
            value: supplier.phoneNumber
        },

        {
            label: "Alternate Phone",
            value: supplier.alternatePhone
        },

        {
            label: "Email",
            value: supplier.email
        },

        {
            label: "GST Number",
            value: supplier.gstNumber
        },

        {
            label: "PAN Number",
            value: supplier.panNumber
        },

        {
            label: "License Number",
            value: supplier.licenseNumber
        },

        {
            label: "Website",
            value: supplier.website
        },

        {
            label: "Address Line 1",
            value: supplier.addressLine1
        },

        {
            label: "Address Line 2",
            value: supplier.addressLine2
        },

        {
            label: "City",
            value: supplier.city
        },

        {
            label: "State",
            value: supplier.state
        },

        {
            label: "Country",
            value: supplier.country
        },

        {
            label: "Pincode",
            value: supplier.pincode
        },

        {
            label: "Bank Name",
            value: supplier.bankName
        },

        {
            label: "Account Number",
            value: supplier.accountNumber
        },

        {
            label: "IFSC Code",
            value: supplier.ifscCode
        },

        {
            label: "Status",
            value: supplier.status
        }

    ].filter(
        item =>
            item.value !== null &&
            item.value !== undefined &&
            String(item.value).trim() !== ""
    );


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
                p-4
                backdrop-blur-sm
            "
            onClick={onClose}
        >

            <div
                className="
                    w-full
                    max-w-4xl
                    max-h-[90vh]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#263653]
                    bg-[#111827]
                    shadow-2xl
                "
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-[#263653]
                    px-6
                    py-5
                ">

                    <div>

                        <h2 className="
                            text-xl
                            font-bold
                            text-white
                        ">
                            Supplier Details
                        </h2>

                        <p className="
                            mt-1
                            text-sm
                            text-blue-300
                        ">
                            Complete supplier information
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-2
                            text-slate-400
                            transition
                            hover:bg-slate-800
                            hover:text-white
                        "
                    >

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >

                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />

                        </svg>

                    </button>

                </div>


                <div className="
                    max-h-[calc(90vh-145px)]
                    overflow-y-auto
                    px-6
                    py-6
                ">

                    <div className="
                        grid
                        grid-cols-1
                        gap-4
                        md:grid-cols-2
                    ">

                        {details.map((item, index) => {

                            const labelColors = [
                                "text-cyan-400",
                                "text-blue-400",
                                "text-violet-400",
                                "text-emerald-400",
                                "text-amber-400"
                            ];

                            return (

                                <div
                                    key={item.label}
                                    className="
                                        rounded-xl
                                        border
                                        border-[#263653]
                                        bg-[#17243b]
                                        p-4
                                    "
                                >

                                    <p className={`
                                        text-xs
                                        font-medium
                                        uppercase
                                        tracking-wide
                                        ${labelColors[index % labelColors.length]}
                                    `}>
                                        {item.label}
                                    </p>

                                    <p className="
                                        mt-2
                                        break-words
                                        text-sm
                                        font-medium
                                        text-white
                                    ">
                                        {item.value}
                                    </p>

                                </div>

                            );

                        })}

                    </div>


                    {supplier.description && (

                        <div className="mt-4">

                            <p className="
                                mb-2
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-cyan-400
                            ">
                                Description
                            </p>

                            <div className="
                                rounded-xl
                                border
                                border-[#263653]
                                bg-[#17243b]
                                p-4
                                text-sm
                                leading-6
                                text-slate-200
                            ">
                                {supplier.description}
                            </div>

                        </div>

                    )}


                    {supplier.remarks && (

                        <div className="mt-4">

                            <p className="
                                mb-2
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-amber-400
                            ">
                                Remarks
                            </p>

                            <div className="
                                rounded-xl
                                border
                                border-[#263653]
                                bg-[#17243b]
                                p-4
                                text-sm
                                leading-6
                                text-slate-200
                            ">
                                {supplier.remarks}
                            </div>

                        </div>

                    )}

                </div>


                <div className="
                    flex
                    justify-end
                    border-t
                    border-[#263653]
                    px-6
                    py-4
                ">

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            bg-[#243552]
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-blue-200
                            transition
                            hover:bg-[#2d4264]
                            hover:text-white
                        "
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    );
}


/* =====================================================
   CONTACT SUPPLIER MODAL
===================================================== */

function ContactSupplierModal({
    supplier,
    onClose
}) {

    const phoneNumber =
        supplier.phoneNumber || "";


    const handleCall = () => {

        window.location.href =
            `tel:${phoneNumber}`;

    };


    return (

        <div
            className="
                fixed
                inset-0
                z-[60]
                flex
                items-center
                justify-center
                bg-black/70
                p-4
                backdrop-blur-sm
            "
            onClick={onClose}
        >

            <div
                className="
                    w-full
                    max-w-md
                    rounded-2xl
                    border
                    border-[#263653]
                    bg-[#111827]
                    p-6
                    shadow-2xl
                "
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                <div className="
                    flex
                    items-start
                    justify-between
                ">

                    <div>

                        <h2 className="
                            text-xl
                            font-bold
                            text-white
                        ">
                            Contact Supplier
                        </h2>

                        <p className="
                            mt-1
                            text-sm
                            text-cyan-300
                        ">
                            Contact information for this supplier
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-2
                            text-slate-400
                            hover:bg-slate-800
                            hover:text-white
                        "
                    >

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >

                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />

                        </svg>

                    </button>

                </div>


                <div className="
                    mt-6
                    rounded-xl
                    border
                    border-cyan-500/20
                    bg-[#17243b]
                    p-5
                ">

                    <p className="
                        text-sm
                        font-semibold
                        text-white
                    ">
                        {supplier.supplierName || "Supplier"}
                    </p>

                    {supplier.contactPerson && (

                        <p className="
                            mt-1
                            text-xs
                            text-violet-300
                        ">
                            Contact Person:{" "}
                            {supplier.contactPerson}
                        </p>

                    )}

                    <div className="
                        mt-5
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-cyan-500/10
                            text-cyan-400
                        ">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 011.948.684l1.11 3.33a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.457 5.457l1.13-2.257a1 1 0 011.21-.502l3.33 1.11A1 1 0 0121 14.72V18a2 2 0 01-2 2h-1C9.716 20 4 14.284 4 7V6a2 2 0 01-1-1z"
                                />

                            </svg>

                        </div>


                        <div>

                            <p className="
                                text-xs
                                text-cyan-400
                            ">
                                Contact Number
                            </p>

                            <p className="
                                mt-1
                                text-lg
                                font-semibold
                                tracking-wide
                                text-white
                            ">
                                {phoneNumber || "Not available"}
                            </p>

                        </div>

                    </div>

                </div>


                <div className="
                    mt-6
                    flex
                    justify-end
                    gap-3
                ">

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            bg-[#243552]
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-blue-200
                            transition
                            hover:bg-[#2d4264]
                            hover:text-white
                        "
                    >
                        Close
                    </button>


                    {phoneNumber && (

                        <button
                            type="button"
                            onClick={handleCall}
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-lg
                                bg-cyan-600
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-cyan-500
                            "
                        >

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 011.948.684l1.11 3.33a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.457 5.457l3.33 1.11A1 1 0 0121 14.72V18a2 2 0 01-2 2h-1C9.716 20 4 14.284 4 7V6a2 2 0 01-1-1z"
                                />

                            </svg>

                            Call Supplier

                        </button>

                    )}

                </div>

            </div>

        </div>

    );
}


export default SupplierPage;