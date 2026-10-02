import { useEffect, useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  // Basic Information
  itemName: "",
  itemCode: "",
  categoryId: "",
  itemType: "CONSUMABLE",

  // Inventory
  unit: "",
  openingStock: "",
  currentStock: "",
  minimumStock: "",
  maximumStock: "",
  reorderQuantity: "",

  // Purchase
  supplierName: "",
  manufacturerName: "",
  brandName: "",
  purchaseDate: "",
  purchasePrice: "",
  invoiceNumber: "",
  purchaseOrderNumber: "",
  batchNumber: "",
  serialNumber: "",
  manufacturingDate: "",
  receivingDate: "",
  warrantyExpiry: "",

  // Storage
  storageLocation: "",
  rackNumber: "",
  shelfNumber: "",
  cabinetNumber: "",
  expiryDate: "",

  // Additional
  hazardLevel: "",
  storageCondition: "",
  description: "",
  remarks: "",
};

function ItemFormModal({
  open,
  onClose,
  onSubmit,
  editingItem,
  categories = [],
}) {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (editingItem) {
      setFormData({
        ...initialForm,
        ...editingItem,

        categoryId:
          editingItem.categoryId !== null &&
          editingItem.categoryId !== undefined
            ? String(editingItem.categoryId)
            : "",

        itemType:
          editingItem.itemType ||
          editingItem.item_type ||
          "CONSUMABLE",

        openingStock:
          editingItem.openingStock !== null &&
          editingItem.openingStock !== undefined
            ? String(editingItem.openingStock)
            : "",

        currentStock:
          editingItem.currentStock !== null &&
          editingItem.currentStock !== undefined
            ? String(editingItem.currentStock)
            : "",

        minimumStock:
          editingItem.minimumStock !== null &&
          editingItem.minimumStock !== undefined
            ? String(editingItem.minimumStock)
            : "",

        maximumStock:
          editingItem.maximumStock !== null &&
          editingItem.maximumStock !== undefined
            ? String(editingItem.maximumStock)
            : "",

        reorderQuantity:
          editingItem.reorderQuantity !== null &&
          editingItem.reorderQuantity !== undefined
            ? String(editingItem.reorderQuantity)
            : "",
      });
    } else {
      setFormData({ ...initialForm });
    }

    setErrorMessage("");
    setSubmitting(false);
  }, [editingItem, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  /**
   * Converts empty strings into null for optional fields.
   */
  const nullableString = (value) => {
    if (value === undefined || value === null) {
      return null;
    }

    const trimmed = String(value).trim();

    return trimmed === "" ? null : trimmed;
  };

  /**
   * Converts numeric form values to actual numbers.
   */
  const nullableNumber = (value) => {
    if (value === undefined || value === null || value === "") {
      return null;
    }

    const number = Number(value);

    return Number.isNaN(number) ? null : number;
  };

  /**
   * Build the exact payload expected by ItemRequestDTO.
   */
  const buildPayload = () => {
    return {
      // ==========================================
      // REQUIRED BASIC INFORMATION
      // ==========================================

      itemName: formData.itemName.trim(),

      categoryId:
        formData.categoryId === "" ||
        formData.categoryId === null ||
        formData.categoryId === undefined
          ? null
          : Number(formData.categoryId),

      itemType: formData.itemType || "CONSUMABLE",

      // ==========================================
      // REQUIRED INVENTORY INFORMATION
      // ==========================================

      unit: formData.unit.trim(),

      openingStock: nullableNumber(formData.openingStock),

      currentStock: nullableNumber(formData.currentStock),

      minimumStock: nullableNumber(formData.minimumStock),

      // ==========================================
      // OPTIONAL INVENTORY INFORMATION
      // ==========================================

      maximumStock: nullableNumber(formData.maximumStock),

      reorderQuantity: nullableNumber(formData.reorderQuantity),

      // ==========================================
      // OPTIONAL BASIC INFORMATION
      // ==========================================

      itemCode: nullableString(formData.itemCode),

      // ==========================================
      // PURCHASE INFORMATION
      // ==========================================

      supplierName: nullableString(formData.supplierName),

      manufacturerName: nullableString(
        formData.manufacturerName
      ),

      brandName: nullableString(formData.brandName),

      purchaseDate: nullableString(
        formData.purchaseDate
      ),

      purchasePrice: nullableNumber(
        formData.purchasePrice
      ),

      invoiceNumber: nullableString(
        formData.invoiceNumber
      ),

      purchaseOrderNumber: nullableString(
        formData.purchaseOrderNumber
      ),

      batchNumber: nullableString(
        formData.batchNumber
      ),

      serialNumber: nullableString(
        formData.serialNumber
      ),

      manufacturingDate: nullableString(
        formData.manufacturingDate
      ),

      receivingDate: nullableString(
        formData.receivingDate
      ),

      warrantyExpiry: nullableString(
        formData.warrantyExpiry
      ),

      // ==========================================
      // STORAGE INFORMATION
      // ==========================================

      storageLocation: nullableString(
        formData.storageLocation
      ),

      rackNumber: nullableString(
        formData.rackNumber
      ),

      shelfNumber: nullableString(
        formData.shelfNumber
      ),

      cabinetNumber: nullableString(
        formData.cabinetNumber
      ),

      expiryDate: nullableString(
        formData.expiryDate
      ),

      // ==========================================
      // ADDITIONAL INFORMATION
      // ==========================================

      hazardLevel: nullableString(
        formData.hazardLevel
      ),

      storageCondition: nullableString(
        formData.storageCondition
      ),

      description: nullableString(
        formData.description
      ),

      remarks: nullableString(
        formData.remarks
      ),
    };
  };

  const validateForm = (payload) => {
    if (!payload.itemName) {
      return "Item name is required.";
    }

    if (
      payload.categoryId === null ||
      Number.isNaN(payload.categoryId)
    ) {
      return "Please select a category.";
    }

    if (!payload.unit) {
      return "Unit is required.";
    }

    if (
      payload.openingStock === null ||
      payload.openingStock === undefined
    ) {
      return "Opening stock is required.";
    }

    if (
      payload.currentStock === null ||
      payload.currentStock === undefined
    ) {
      return "Current stock is required.";
    }

    if (
      payload.minimumStock === null ||
      payload.minimumStock === undefined
    ) {
      return "Minimum stock is required.";
    }

    if (payload.openingStock < 0) {
      return "Opening stock cannot be negative.";
    }

    if (payload.currentStock < 0) {
      return "Current stock cannot be negative.";
    }

    if (payload.minimumStock < 0) {
      return "Minimum stock cannot be negative.";
    }

    if (
      payload.maximumStock !== null &&
      payload.maximumStock < 0
    ) {
      return "Maximum stock cannot be negative.";
    }

    if (
      payload.reorderQuantity !== null &&
      payload.reorderQuantity < 0
    ) {
      return "Reorder quantity cannot be negative.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    setErrorMessage("");

    const payload = buildPayload();

    console.log(
      "========== ITEM CREATE/UPDATE PAYLOAD =========="
    );

    console.log(
      JSON.stringify(payload, null, 2)
    );

    console.log(
      "==============================================="
    );

    const validationError = validateForm(payload);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit(payload);

      setFormData({ ...initialForm });
      setErrorMessage("");

      onClose();
    } catch (error) {
      console.error(
        "Item create/update failed:",
        error
      );

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to save item. Please check the entered information.";

      setErrorMessage(backendMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
      <div className="w-full max-w-7xl max-h-[95vh] overflow-y-auto rounded-3xl bg-[#171B24] border border-slate-700 shadow-2xl">

        <form onSubmit={handleSubmit}>

          {/* ====================================== */}
          {/* HEADER */}
          {/* ====================================== */}

          <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-[#171B24] border-b border-slate-700">

            <div>
              <h2 className="text-3xl font-bold text-white">
                {editingItem ? "Edit Item" : "Add Item"}
              </h2>

              <p className="text-slate-400 mt-1">
                Manage laboratory inventory item information
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl p-2 hover:bg-slate-700 transition disabled:opacity-50"
            >
              <X
                className="text-white"
                size={24}
              />
            </button>

          </div>

          {/* ====================================== */}
          {/* ERROR MESSAGE */}
          {/* ====================================== */}

          {errorMessage && (
            <div className="mx-8 mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-red-300">
              <p className="font-semibold">
                Unable to save item
              </p>

              <p className="text-sm mt-1">
                {errorMessage}
              </p>
            </div>
          )}

          <div className="p-8 space-y-10">

            {/* ====================================== */}
            {/* BASIC INFORMATION */}
            {/* ====================================== */}

            <section>

              <div className="flex items-center gap-4 mb-6">
                <h3 className="uppercase tracking-[0.2em] text-xs font-semibold text-emerald-400">
                  Basic Information
                </h3>

                <div className="flex-1 border-t border-slate-700" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Item Name *
                  </label>

                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    placeholder="Enter Item Name"
                    className="w-full rounded-xl border border-slate-700 bg-[#0F131B] px-4 py-3 text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Item Code
                  </label>

                  <input
                    type="text"
                    name="itemCode"
                    value={formData.itemCode}
                    disabled
                    className="w-full rounded-xl border border-slate-700 bg-[#10151F] px-4 py-3 text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Category *
                  </label>

                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-[#0F131B] px-4 py-3 text-white"
                  >
                    <option value="">
                      Select Category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Item Type *
                  </label>

                  <select
                    name="itemType"
                    value={formData.itemType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-[#0F131B] px-4 py-3 text-white"
                  >
                    <option value="CONSUMABLE">
                      Consumable
                    </option>

                    <option value="NON_CONSUMABLE">
                      Non Consumable
                    </option>
                  </select>
                </div>

              </div>

            </section>

            {/* ====================================== */}
            {/* INVENTORY DETAILS */}
            {/* ====================================== */}

            <section>

              <div className="flex items-center gap-4 mb-6">
                <h3 className="uppercase tracking-[0.2em] text-xs font-semibold text-emerald-400">
                  Inventory Details
                </h3>

                <div className="flex-1 border-t border-slate-700" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Unit *
                  </label>

                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="Bottle"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Opening Stock *
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="openingStock"
                    value={formData.openingStock}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Current Stock *
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="currentStock"
                    value={formData.currentStock}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Minimum Stock *
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="minimumStock"
                    value={formData.minimumStock}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Maximum Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="maximumStock"
                    value={formData.maximumStock}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Reorder Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="reorderQuantity"
                    value={formData.reorderQuantity}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

              </div>

            </section>

            {/* ====================================== */}
            {/* PURCHASE DETAILS */}
            {/* ====================================== */}

            <section>

              <div className="flex items-center gap-4 mb-6">

                <h3 className="uppercase tracking-[0.2em] text-xs font-semibold text-emerald-400">
                  Purchase Details
                </h3>

                <div className="flex-1 border-t border-slate-700" />

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Supplier Name
                  </label>

                  <input
                    type="text"
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleChange}
                    placeholder="Supplier Name"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Manufacturer Name
                  </label>

                  <input
                    type="text"
                    name="manufacturerName"
                    value={formData.manufacturerName}
                    onChange={handleChange}
                    placeholder="Manufacturer Name"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Brand Name
                  </label>

                  <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    placeholder="Brand Name"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Purchase Date
                  </label>

                  <input
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Purchase Price
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Invoice Number
                  </label>

                  <input
                    type="text"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleChange}
                    placeholder="INV-001"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Purchase Order No.
                  </label>

                  <input
                    type="text"
                    name="purchaseOrderNumber"
                    value={formData.purchaseOrderNumber}
                    onChange={handleChange}
                    placeholder="PO-001"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Batch Number
                  </label>

                  <input
                    type="text"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleChange}
                    placeholder="Batch Number"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Serial Number
                  </label>

                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    placeholder="Serial Number"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Manufacturing Date
                  </label>

                  <input
                    type="date"
                    name="manufacturingDate"
                    value={formData.manufacturingDate}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Receiving Date
                  </label>

                  <input
                    type="date"
                    name="receivingDate"
                    value={formData.receivingDate}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Warranty Expiry
                  </label>

                  <input
                    type="date"
                    name="warrantyExpiry"
                    value={formData.warrantyExpiry}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

              </div>

            </section>

            {/* ====================================== */}
            {/* STORAGE DETAILS */}
            {/* ====================================== */}

            <section>

              <div className="flex items-center gap-4 mb-6">

                <h3 className="uppercase tracking-[0.2em] text-xs font-semibold text-emerald-400">
                  Storage Details
                </h3>

                <div className="flex-1 border-t border-slate-700" />

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Storage Location
                  </label>

                  <input
                    type="text"
                    name="storageLocation"
                    value={formData.storageLocation}
                    onChange={handleChange}
                    placeholder="Main Laboratory Store"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Rack Number
                  </label>

                  <input
                    type="text"
                    name="rackNumber"
                    value={formData.rackNumber}
                    onChange={handleChange}
                    placeholder="Rack A-01"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Shelf Number
                  </label>

                  <input
                    type="text"
                    name="shelfNumber"
                    value={formData.shelfNumber}
                    onChange={handleChange}
                    placeholder="Shelf 02"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Cabinet Number
                  </label>

                  <input
                    type="text"
                    name="cabinetNumber"
                    value={formData.cabinetNumber}
                    onChange={handleChange}
                    placeholder="Cabinet C-03"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

              </div>

            </section>

            {/* ====================================== */}
            {/* ADDITIONAL DETAILS */}
            {/* ====================================== */}

            <section>

              <div className="flex items-center gap-4 mb-6">

                <h3 className="uppercase tracking-[0.2em] text-xs font-semibold text-emerald-400">
                  Additional Details
                </h3>

                <div className="flex-1 border-t border-slate-700" />

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Hazard Level
                  </label>

                  <input
                    type="text"
                    name="hazardLevel"
                    value={formData.hazardLevel}
                    onChange={handleChange}
                    placeholder="Low / Medium / High"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Storage Condition
                  </label>

                  <input
                    type="text"
                    name="storageCondition"
                    value={formData.storageCondition}
                    onChange={handleChange}
                    placeholder="Store below 25°C"
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Description
                  </label>

                  <textarea
                    rows={5}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white resize-none outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Remarks
                  </label>

                  <textarea
                    rows={5}
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-[#0F131B] border border-slate-700 px-4 py-3 text-white resize-none outline-none focus:border-emerald-500"
                  />
                </div>

              </div>

            </section>

            {/* ====================================== */}
            {/* FOOTER */}
            {/* ====================================== */}

            <div className="flex justify-end gap-4 pt-8 border-t border-slate-700">

              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-6 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "Saving..."
                  : editingItem
                    ? "Update Item"
                    : "Save Item"}
              </button>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
}

export default ItemFormModal;