import {

    X,

    Package,

    Boxes,

    Building2,

    Warehouse,

    FileText

} from "lucide-react";

function ViewItemModal({

    open,

    item,

    onClose

}) {

    if (!open || !item) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">

            <div className="w-full max-w-7xl max-h-[95vh] overflow-y-auto rounded-3xl bg-[#171B24] border border-slate-700 shadow-2xl">

                {/* Header */}

                <div className="sticky top-0 bg-[#171B24] border-b border-slate-700 px-10 py-6 flex items-center justify-between">

                    <div>

                        <h2 className="text-3xl font-bold text-white">

                            Item Details

                        </h2>

                        <p className="text-slate-400 mt-1">

                            Complete Laboratory Inventory Information

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="text-slate-400 hover:text-white"

                    >

                        <X size={30} />

                    </button>

                </div>

                <div className="p-10 space-y-10">

                    {/* ====================================== */}

                    {/* BASIC INFORMATION */}

                    {/* ====================================== */}

                    <div>

                        <div className="flex items-center gap-3 mb-6">

                            <Package className="text-emerald-400"/>

                            <h3 className="text-lg font-semibold text-white">

                                Basic Information

                            </h3>

                        </div>

                        <div className="grid grid-cols-2 gap-6">

                            <Info

                                label="Item Name"

                                value={item.itemName}

                            />

                            <Info

                                label="Item Code"

                                value={item.itemCode}

                            />

                            <Info

                                label="Category"

                                value={item.categoryName}

                            />

                            <Info

                                label="Item Type"

                                value={item.itemType}

                            />

                            <Info

                                label="Unit"

                                value={item.unit}

                            />

                            <Info

                                label="Status"

                                value={item.status}

                            />

                        </div>

                    </div>

                    {/* ====================================== */}

                    {/* INVENTORY INFORMATION */}

                    {/* ====================================== */}

                    <div>

                        <div className="flex items-center gap-3 mb-6">

                            <Boxes className="text-cyan-400"/>

                            <h3 className="text-lg font-semibold text-white">

                                Inventory Information

                            </h3>

                        </div>

                        <div className="grid grid-cols-2 gap-6">

                            <Info

                                label="Opening Stock"

                                value={item.openingStock}

                            />

                            <Info

                                label="Current Stock"

                                value={item.currentStock}

                            />

                            <Info

                                label="Minimum Stock"

                                value={item.minimumStock}

                            />

                            <Info

                                label="Maximum Stock"

                                value={item.maximumStock}

                            />

                            <Info

                                label="Reorder Quantity"

                                value={item.reorderQuantity}

                            />

                        </div>

                    </div>
                                        {/* ====================================== */}
                    {/* PURCHASE INFORMATION */}
                    {/* ====================================== */}

                    <div>

                        <div className="flex items-center gap-3 mb-6">

                            <Building2 className="text-yellow-400"/>

                            <h3 className="text-lg font-semibold text-white">

                                Purchase Information

                            </h3>

                        </div>

                        <div className="grid grid-cols-2 gap-6">

                            <Info label="Supplier" value={item.supplierName} />

                            <Info label="Manufacturer" value={item.manufacturerName} />

                            <Info label="Brand" value={item.brandName} />

                            <Info label="Purchase Date" value={item.purchaseDate} />

                            <Info label="Purchase Price" value={item.purchasePrice} />

                            <Info label="Invoice Number" value={item.invoiceNumber} />

                            <Info label="Purchase Order Number" value={item.purchaseOrderNumber} />

                            <Info label="Batch Number" value={item.batchNumber} />

                            <Info label="Serial Number" value={item.serialNumber} />

                            <Info label="Manufacturing Date" value={item.manufacturingDate} />

                            <Info label="Receiving Date" value={item.receivingDate} />

                            <Info label="Warranty Expiry" value={item.warrantyExpiry} />

                        </div>

                    </div>

                    {/* ====================================== */}
                    {/* STORAGE INFORMATION */}
                    {/* ====================================== */}

                    <div>

                        <div className="flex items-center gap-3 mb-6">

                            <Warehouse className="text-blue-400"/>

                            <h3 className="text-lg font-semibold text-white">

                                Storage Information

                            </h3>

                        </div>

                        <div className="grid grid-cols-2 gap-6">

                            <Info label="Storage Location" value={item.storageLocation} />

                            <Info label="Rack Number" value={item.rackNumber} />

                            <Info label="Shelf Number" value={item.shelfNumber} />

                            <Info label="Cabinet Number" value={item.cabinetNumber} />

                            <Info label="Expiry Date" value={item.expiryDate} />

                        </div>

                    </div>
                                        {/* ====================================== */}
                    {/* ADDITIONAL INFORMATION */}
                    {/* ====================================== */}

                    <div>

                        <div className="flex items-center gap-3 mb-6">

                            <FileText className="text-purple-400"/>

                            <h3 className="text-lg font-semibold text-white">

                                Additional Information

                            </h3>

                        </div>

                        <div className="grid grid-cols-2 gap-6">

                            <Info

                                label="Hazard Level"

                                value={item.hazardLevel}

                            />

                            <Info

                                label="Storage Condition"

                                value={item.storageCondition}

                            />

                            <Info

                                label="Description"

                                value={item.description}

                            />

                            <Info

                                label="Remarks"

                                value={item.remarks}

                            />

                        </div>

                    </div>

                    {/* ====================================== */}
                    {/* AUDIT INFORMATION */}
                    {/* ====================================== */}

                    <div>

                        <div className="flex items-center gap-3 mb-6">

                            <FileText className="text-green-400"/>

                            <h3 className="text-lg font-semibold text-white">

                                Audit Information

                            </h3>

                        </div>

                        <div className="grid grid-cols-2 gap-6">

                            <Info

                                label="Created At"

                                value={item.createdAt}

                            />

                            <Info

                                label="Updated At"

                                value={item.updatedAt}

                            />

                        </div>

                    </div>

                </div>

                <div className="border-t border-slate-700 p-6 flex justify-end">

                    <button

                        onClick={onClose}

                        className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold transition"

                    >

                        Close

                    </button>

                </div>

            </div>

        </div>

    );

}

function Info({

    label,

    value

}) {

    return (

        <div className="rounded-xl bg-[#0F131B] border border-slate-700 p-4">

            <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">

                {label}

            </p>

            <p className="text-white break-words">

                {

                    value !== null &&

                    value !== undefined &&

                    value !== ""

                        ? value

                        : "-"

                }

            </p>

        </div>

    );

}

export default ViewItemModal;