import { useEffect, useState } from "react";

import {

    X,

    Save,

    Truck,

    User,

    Building2,

    MapPin,

    Landmark,

    FileText

} from "lucide-react";

const initialState = {

    supplierName: "",

    contactPerson: "",

    email: "",

    phoneNumber: "",

    alternatePhone: "",

    gstNumber: "",

    panNumber: "",

    licenseNumber: "",

    website: "",

    addressLine1: "",

    addressLine2: "",

    city: "",

    state: "",

    country: "",

    pincode: "",

    bankName: "",

    accountNumber: "",

    ifscCode: "",

    description: "",

    remarks: ""

};

function SupplierFormModal({

    open,

    onClose,

    onSubmit,

    editingSupplier

}) {

    const [formData, setFormData] =

        useState(initialState);

    useEffect(() => {

        if (editingSupplier) {

            setFormData({

                supplierName:

                    editingSupplier.supplierName || "",

                contactPerson:

                    editingSupplier.contactPerson || "",

                email:

                    editingSupplier.email || "",

                phoneNumber:

                    editingSupplier.phoneNumber || "",

                alternatePhone:

                    editingSupplier.alternatePhone || "",

                gstNumber:

                    editingSupplier.gstNumber || "",

                panNumber:

                    editingSupplier.panNumber || "",

                licenseNumber:

                    editingSupplier.licenseNumber || "",

                website:

                    editingSupplier.website || "",

                addressLine1:

                    editingSupplier.addressLine1 || "",

                addressLine2:

                    editingSupplier.addressLine2 || "",

                city:

                    editingSupplier.city || "",

                state:

                    editingSupplier.state || "",

                country:

                    editingSupplier.country || "",

                pincode:

                    editingSupplier.pincode || "",

                bankName:

                    editingSupplier.bankName || "",

                accountNumber:

                    editingSupplier.accountNumber || "",

                ifscCode:

                    editingSupplier.ifscCode || "",

                description:

                    editingSupplier.description || "",

                remarks:

                    editingSupplier.remarks || ""

            });

        }

        else {

            setFormData(initialState);

        }

    }, [

        editingSupplier,

        open

    ]);

    const handleChange = (event) => {

        const {

            name,

            value

        } = event.target;

        setFormData(previous => ({

            ...previous,

            [name]: value

        }));

    };

   const handleSubmit = (event) => {

    event.preventDefault();

    const addressParts = [
        formData.addressLine1,
        formData.addressLine2,
        formData.city,
        formData.state,
        formData.country,
        formData.pincode
    ].filter(Boolean);

    const supplierPayload = {

        supplierName: formData.supplierName,

        contactPerson: formData.contactPerson,

        email: formData.email,

        phoneNumber: formData.phoneNumber,

        address: addressParts.join(", "),

        gstNumber: formData.gstNumber

    };

    onSubmit(supplierPayload);

};

    if (!open) {

        return null;

    }

    return (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6">

            <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-6xl max-h-[95vh] overflow-y-auto">

                <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-8 py-6 flex justify-between items-center">

                    <div>

                        <h2 className="text-2xl font-bold text-white">

                            {

                                editingSupplier

                                    ? "Edit Supplier"

                                    : "Add Supplier"

                            }

                        </h2>

                        <p className="text-slate-400 mt-1">

                            Manage supplier information.

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="text-slate-400 hover:text-white"

                    >

                        <X size={24}/>

                    </button>

                </div>

                <form

                    onSubmit={handleSubmit}

                    className="p-8 space-y-10"
                >
                                    {/* ====================================== */}
                    {/* BASIC INFORMATION */}
                    {/* ====================================== */}

                    <div>

                        <div className="flex items-center gap-3 mb-6">

                            <Truck className="text-cyan-400" />

                            <h3 className="text-lg font-semibold text-white">

                                Basic Information

                            </h3>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <Input

                                label="Supplier Name *"

                                name="supplierName"

                                value={formData.supplierName}

                                onChange={handleChange}

                                placeholder="Supplier Name"

                                required

                            />

                            <Input

                                label="Contact Person *"

                                name="contactPerson"

                                value={formData.contactPerson}

                                onChange={handleChange}

                                placeholder="Contact Person"

                                required

                            />

                            <Input

                                label="Email *"

                                type="email"

                                name="email"

                                value={formData.email}

                                onChange={handleChange}

                                placeholder="supplier@email.com"

                                required

                            />

                            <Input

                                label="Phone Number *"

                                name="phoneNumber"

                                value={formData.phoneNumber}

                                onChange={handleChange}

                                placeholder="9876543210"

                                required

                            />

                            <Input

                                label="Alternate Phone"

                                name="alternatePhone"

                                value={formData.alternatePhone}

                                onChange={handleChange}

                                placeholder="9876543210"

                            />

                        </div>

                    </div>

                    {/* ====================================== */}
                    {/* BUSINESS INFORMATION */}
                    {/* ====================================== */}

                    <div>

                        <div className="flex items-center gap-3 mb-6">

                            <Building2 className="text-yellow-400" />

                            <h3 className="text-lg font-semibold text-white">

                                Business Information

                            </h3>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <Input

                                label="GST Number *"

                                name="gstNumber"

                                value={formData.gstNumber}

                                onChange={handleChange}

                                placeholder="GST Number"

                                required

                            />

                            <Input

                                label="PAN Number"

                                name="panNumber"

                                value={formData.panNumber}

                                onChange={handleChange}

                                placeholder="PAN Number"

                            />

                            <Input

                                label="License Number"

                                name="licenseNumber"

                                value={formData.licenseNumber}

                                onChange={handleChange}

                                placeholder="License Number"

                            />

                            <Input

                                label="Website"

                                name="website"

                                value={formData.website}

                                onChange={handleChange}

                                placeholder="https://example.com"

                            />

                        </div>

                    </div>
                                        {/* ====================================== */}
                    {/* ADDRESS INFORMATION */}
                    {/* ====================================== */}

                    <div>

                        <div className="flex items-center gap-3 mb-6">

                            <MapPin className="text-red-400" />

                            <h3 className="text-lg font-semibold text-white">

                                Address Information

                            </h3>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <Input

                                label="Address Line 1 *"

                                name="addressLine1"

                                value={formData.addressLine1}

                                onChange={handleChange}

                                placeholder="Address Line 1"

                                required

                            />

                            <Input

                                label="Address Line 2"

                                name="addressLine2"

                                value={formData.addressLine2}

                                onChange={handleChange}

                                placeholder="Address Line 2"

                            />

                            <Input

                                label="City"

                                name="city"

                                value={formData.city}

                                onChange={handleChange}

                                placeholder="City"

                            />

                            <Input

                                label="State"

                                name="state"

                                value={formData.state}

                                onChange={handleChange}

                                placeholder="State"

                            />

                            <Input

                                label="Country"

                                name="country"

                                value={formData.country}

                                onChange={handleChange}

                                placeholder="Country"

                            />

                            <Input

                                label="Pincode"

                                name="pincode"

                                value={formData.pincode}

                                onChange={handleChange}

                                placeholder="Pincode"

                            />

                        </div>

                    </div>

                    {/* ====================================== */}
                    {/* BANK INFORMATION */}
                    {/* ====================================== */}

                    <div>

                        <div className="flex items-center gap-3 mb-6">

                            <Landmark className="text-emerald-400" />

                            <h3 className="text-lg font-semibold text-white">

                                Bank Information

                            </h3>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <Input

                                label="Bank Name"

                                name="bankName"

                                value={formData.bankName}

                                onChange={handleChange}

                                placeholder="Bank Name"

                            />

                            <Input

                                label="Account Number"

                                name="accountNumber"

                                value={formData.accountNumber}

                                onChange={handleChange}

                                placeholder="Account Number"

                            />

                            <Input

                                label="IFSC Code"

                                name="ifscCode"

                                value={formData.ifscCode}

                                onChange={handleChange}

                                placeholder="IFSC Code"

                            />

                        </div>

                    </div>
                                        {/* ====================================== */}
                    {/* ADDITIONAL INFORMATION */}
                    {/* ====================================== */}

                    <div>

                        <div className="flex items-center gap-3 mb-6">

                            <FileText className="text-purple-400" />

                            <h3 className="text-lg font-semibold text-white">

                                Additional Information

                            </h3>

                        </div>

                        <div className="grid grid-cols-1 gap-6">

                            <div>

                                <label className="block text-sm font-medium text-slate-300 mb-2">

                                    Description

                                </label>

                                <textarea

                                    name="description"

                                    value={formData.description}

                                    onChange={handleChange}

                                    rows={4}

                                    placeholder="Enter supplier description"

                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"

                                />

                            </div>

                            <div>

                                <label className="block text-sm font-medium text-slate-300 mb-2">

                                    Remarks

                                </label>

                                <textarea

                                    name="remarks"

                                    value={formData.remarks}

                                    onChange={handleChange}

                                    rows={4}

                                    placeholder="Additional remarks"

                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"

                                />

                            </div>

                        </div>

                    </div>

                    {/* ====================================== */}
                    {/* ACTION BUTTONS */}
                    {/* ====================================== */}

                    <div className="border-t border-slate-700 pt-6 flex justify-end gap-4">

                        <button

                            type="button"

                            onClick={onClose}

                            className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition"

                        >

                            Cancel

                        </button>

                        <button

                            type="submit"

                            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition"

                        >

                            <Save size={18} />

                            {

                                editingSupplier

                                    ? "Update Supplier"

                                    : "Save Supplier"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

function Input({

    label,

    name,

    value,

    onChange,

    placeholder,

    type = "text",

    required = false

}) {

    return (

        <div className="flex flex-col gap-2">

            <label className="text-sm font-medium text-slate-300">

                {label}

            </label>

            <input

                type={type}

                name={name}

                value={value}

                onChange={onChange}

                placeholder={placeholder}

                required={required}

                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"

            />

        </div>

    );

}

export default SupplierFormModal;