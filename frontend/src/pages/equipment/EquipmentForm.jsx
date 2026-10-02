import { useEffect, useState } from "react";

const categories = [
  "CENTRIFUGE",
  "AUTOCLAVE",
  "MICROSCOPE",
  "SPECTROPHOTOMETER",
  "PCR_MACHINE",
  "REFRIGERATOR",
  "INCUBATOR",
  "BALANCE",
  "OTHER",
];


const amcTypes = [
  "COMPREHENSIVE",
  "NON_COMPREHENSIVE",
  "PARTS_ONLY",
  "LABOUR_ONLY",
];


const EMPTY_FORM = {
  equipmentName: "",
  equipmentCode: "",
  category: "OTHER",
  manufacturer: "",
  model: "",
  serialNumber: "",
  purchaseDate: "",
  purchaseCost: "",
  warrantyUntil: "",
  location: "",
  amcProvider: "",
  amcContact: "",
  amcStart: "",
  amcEnd: "",
  amcCostPerYear: "",
  amcType: "COMPREHENSIVE",
  amcCoverageNotes: "",
  lastMaintenanceDate: "",
  nextMaintenanceDate: "",
};


function EquipmentForm({
  equipment,
  initialForm,
  saving,
  onClose,
  onSave,
}) {


  /*
   * ============================================================
   * FORM STATE
   * ============================================================
   */

  const [form, setForm] =
    useState(
      initialForm ||
      EMPTY_FORM
    );


  const [error, setError] =
    useState("");


  /*
   * ============================================================
   * EQUIPMENT CATEGORIES
   * ============================================================
   *
   * Equipment category is a backend enum.
   * Category Master values must not be mixed into this list.
   */

  const categoryOptions = categories;


  /*
   * ============================================================
   * LOAD FORM DATA
   * ============================================================
   */

  useEffect(() => {

    if (equipment) {

      setForm({

        equipmentName:
          equipment.equipmentName ||
          "",

        equipmentCode:
          equipment.equipmentCode ||
          "",

        category:
          equipment.category ||
          "OTHER",

        manufacturer:
          equipment.manufacturer ||
          "",

        model:
          equipment.model ||
          "",

        serialNumber:
          equipment.serialNumber ||
          "",

        purchaseDate:
          equipment.purchaseDate ||
          "",

        purchaseCost:
          equipment.purchaseCost ??
          "",

        warrantyUntil:
          equipment.warrantyUntil ||
          "",

        location:
          equipment.location ||
          "",

        amcProvider:
          equipment.amcProvider ||
          "",

        amcContact:
          equipment.amcContact ||
          "",

        amcStart:
          equipment.amcStart ||
          "",

        amcEnd:
          equipment.amcEnd ||
          "",

        amcCostPerYear:
          equipment.amcCostPerYear ??
          "",

        amcType:
          equipment.amcType ||
          "COMPREHENSIVE",

        amcCoverageNotes:
          equipment.amcCoverageNotes ||
          "",

        lastMaintenanceDate:
          equipment.lastMaintenanceDate ||
          "",

        nextMaintenanceDate:
          equipment.nextMaintenanceDate ||
          "",

      });

    } else {

      setForm(
        initialForm ||
        EMPTY_FORM
      );

    }

    setError("");

  }, [
    equipment,
    initialForm
  ]);


  /*
   * ============================================================
   * UPDATE FIELD
   * ============================================================
   */

  const update =
    (
      field,
      value
    ) => {

      setForm(
        (previous) => ({

          ...previous,

          [field]:
            value,

        })
      );

    };


  /*
   * ============================================================
   * SUBMIT
   * ============================================================
   */

  const submit =
    async (
      event
    ) => {

      event.preventDefault();

      setError("");


      /*
       * SAFETY CHECK
       */

      if (!form) {

        setError(
          "Unable to initialize equipment form."
        );

        return;

      }


      /*
       * EQUIPMENT NAME
       */

      if (
        !String(
          form.equipmentName ||
          ""
        ).trim()
      ) {

        setError(
          "Equipment name is required."
        );

        return;

      }


      /*
       * EQUIPMENT CODE
       */

      if (
        !String(
          form.equipmentCode ||
          ""
        ).trim()
      ) {

        setError(
          "Equipment code is required."
        );

        return;

      }


      /*
       * AMC DATE VALIDATION
       */

      if (
        form.amcStart &&
        form.amcEnd
      ) {

        if (
          new Date(
            form.amcEnd
          ) <
          new Date(
            form.amcStart
          )
        ) {

          setError(
            "AMC end date cannot be before AMC start date."
          );

          return;

        }

      }


      /*
       * WARRANTY DATE VALIDATION
       */

      if (
        form.purchaseDate &&
        form.warrantyUntil
      ) {

        if (
          new Date(
            form.warrantyUntil
          ) <
          new Date(
            form.purchaseDate
          )
        ) {

          setError(
            "Warranty expiry cannot be before purchase date."
          );

          return;

        }

      }


      /*
       * API PAYLOAD
       */

      const payload = {

        ...form,

        purchaseCost:
          form.purchaseCost === ""
            ? null
            : Number(
                form.purchaseCost
              ),

        amcCostPerYear:
          form.amcCostPerYear === ""
            ? null
            : Number(
                form.amcCostPerYear
              ),

        purchaseDate:
          form.purchaseDate ||
          null,

        warrantyUntil:
          form.warrantyUntil ||
          null,

        amcStart:
          form.amcStart ||
          null,

        amcEnd:
          form.amcEnd ||
          null,

        lastMaintenanceDate:
          form.lastMaintenanceDate ||
          null,

        nextMaintenanceDate:
          form.nextMaintenanceDate ||
          null,

      };


      await onSave(
        payload
      );

    };


  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

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
      "
    >

      <div
        className="
          max-h-[92vh]
          w-full
          max-w-5xl
          overflow-y-auto
          rounded-2xl
          border
          border-slate-700
          bg-[#101729]
          shadow-2xl
        "
      >

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div
          className="
            sticky
            top-0
            z-10
            flex
            items-center
            justify-between
            border-b
            border-slate-800
            bg-[#101729]
            px-6
            py-5
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-bold
              "
            >
              {equipment
                ? "Edit Equipment"
                : "Add Equipment"}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Equipment, AMC and maintenance information
            </p>

          </div>


          <button
            type="button"
            onClick={
              onClose
            }
            className="
              text-2xl
              text-slate-500
              hover:text-white
            "
            aria-label="Close"
          >
            ×
          </button>

        </div>


        {/* =====================================================
            FORM
        ====================================================== */}

        <form
          onSubmit={
            submit
          }
          className="
            p-6
          "
        >

          {/* ERROR */}

          {error && (

            <div
              className="
                mb-5
                rounded-lg
                border
                border-red-500/30
                bg-red-500/10
                px-4
                py-3
                text-sm
                text-red-300
              "
            >
              {error}
            </div>

          )}


          {/* =================================================
              EQUIPMENT DETAILS
          ================================================== */}

          <Section
            title="Equipment Details"
          >

            <Field
              label="Equipment Name"
              required
              value={
                form?.equipmentName ||
                ""
              }
              onChange={(value) =>
                update(
                  "equipmentName",
                  value
                )
              }
            />


            <Field
              label="Equipment Code"
              required
              value={
                form?.equipmentCode ||
                ""
              }
              onChange={(value) =>
                update(
                  "equipmentCode",
                  value
                )
              }
              placeholder="EQ-001"
            />


            <SelectField
              label="Category"
              value={
                form?.category ||
                "OTHER"
              }
              onChange={(value) =>
                update(
                  "category",
                  value
                )
              }
              options={
                categoryOptions
              }
            />


            <Field
              label="Manufacturer"
              value={
                form?.manufacturer ||
                ""
              }
              onChange={(value) =>
                update(
                  "manufacturer",
                  value
                )
              }
            />


            <Field
              label="Model"
              value={
                form?.model ||
                ""
              }
              onChange={(value) =>
                update(
                  "model",
                  value
                )
              }
            />


            <Field
              label="Serial Number"
              value={
                form?.serialNumber ||
                ""
              }
              onChange={(value) =>
                update(
                  "serialNumber",
                  value
                )
              }
            />


            <Field
              label="Purchase Date"
              type="date"
              value={
                form?.purchaseDate ||
                ""
              }
              onChange={(value) =>
                update(
                  "purchaseDate",
                  value
                )
              }
            />


            <Field
              label="Purchase Cost"
              type="number"
              value={
                form?.purchaseCost ??
                ""
              }
              onChange={(value) =>
                update(
                  "purchaseCost",
                  value
                )
              }
            />


            <Field
              label="Warranty Until"
              type="date"
              value={
                form?.warrantyUntil ||
                ""
              }
              onChange={(value) =>
                update(
                  "warrantyUntil",
                  value
                )
              }
            />


            <Field
              label="Location"
              value={
                form?.location ||
                ""
              }
              onChange={(value) =>
                update(
                  "location",
                  value
                )
              }
            />

          </Section>


          {/* =================================================
              AMC DETAILS
          ================================================== */}

          <Section
            title="AMC Details"
          >

            <Field
              label="AMC Provider"
              value={
                form?.amcProvider ||
                ""
              }
              onChange={(value) =>
                update(
                  "amcProvider",
                  value
                )
              }
            />


            <Field
              label="AMC Contact"
              value={
                form?.amcContact ||
                ""
              }
              onChange={(value) =>
                update(
                  "amcContact",
                  value
                )
              }
            />


            <Field
              label="AMC Start"
              type="date"
              value={
                form?.amcStart ||
                ""
              }
              onChange={(value) =>
                update(
                  "amcStart",
                  value
                )
              }
            />


            <Field
              label="AMC End"
              type="date"
              value={
                form?.amcEnd ||
                ""
              }
              onChange={(value) =>
                update(
                  "amcEnd",
                  value
                )
              }
            />


            <Field
              label="AMC Cost / Year"
              type="number"
              value={
                form?.amcCostPerYear ??
                ""
              }
              onChange={(value) =>
                update(
                  "amcCostPerYear",
                  value
                )
              }
            />


            <SelectField
              label="AMC Type"
              value={
                form?.amcType ||
                "COMPREHENSIVE"
              }
              onChange={(value) =>
                update(
                  "amcType",
                  value
                )
              }
              options={
                amcTypes
              }
            />


            <div
              className="
                md:col-span-2
              "
            >

              <TextAreaField
                label="AMC Coverage Notes"
                value={
                  form?.amcCoverageNotes ||
                  ""
                }
                onChange={(value) =>
                  update(
                    "amcCoverageNotes",
                    value
                  )
                }
              />

            </div>

          </Section>


          {/* =================================================
              MAINTENANCE
          ================================================== */}

          <Section
            title="Maintenance"
          >

            <Field
              label="Last Maintenance Date"
              type="date"
              value={
                form?.lastMaintenanceDate ||
                ""
              }
              onChange={(value) =>
                update(
                  "lastMaintenanceDate",
                  value
                )
              }
            />


            <Field
              label="Next Maintenance Date"
              type="date"
              value={
                form?.nextMaintenanceDate ||
                ""
              }
              onChange={(value) =>
                update(
                  "nextMaintenanceDate",
                  value
                )
              }
            />

          </Section>


          {/* =================================================
              ACTIONS
          ================================================== */}

          <div
            className="
              mt-7
              flex
              justify-end
              gap-3
              border-t
              border-slate-800
              pt-5
            "
          >

            <button
              type="button"
              onClick={
                onClose
              }
              className="
                rounded-lg
                border
                border-slate-700
                px-5
                py-2.5
                text-sm
                font-medium
                text-slate-300
                hover:bg-slate-800
              "
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={
                saving
              }
              className="
                rounded-lg
                bg-blue-600
                px-6
                py-2.5
                text-sm
                font-semibold
                text-white
                hover:bg-blue-500
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {saving
                ? "Saving..."
                : equipment
                  ? "Update Equipment"
                  : "Add Equipment"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}


/*
 * =============================================================
 * SECTION
 * =============================================================
 */

function Section({
  title,
  children,
}) {

  return (

    <section
      className="
        mb-7
      "
    >

      <h3
        className="
          mb-4
          border-b
          border-slate-800
          pb-3
          text-sm
          font-bold
          uppercase
          tracking-wider
          text-blue-400
        "
      >
        {title}
      </h3>


      <div
        className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-2
        "
      >
        {children}
      </div>

    </section>

  );

}


/*
 * =============================================================
 * FIELD
 * =============================================================
 */

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}) {

  return (

    <label
      className="
        block
      "
    >

      <span
        className="
          mb-2
          block
          text-xs
          font-semibold
          text-slate-400
        "
      >

        {label}

        {required && (

          <span
            className="
              ml-1
              text-red-400
            "
          >
            *
          </span>

        )}

      </span>


      <input
        type={
          type
        }
        required={
          required
        }
        value={
          value ?? ""
        }
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        placeholder={
          placeholder
        }
        className="
          w-full
          rounded-lg
          border
          border-slate-700
          bg-[#080d1b]
          px-3.5
          py-2.5
          text-sm
          text-white
          outline-none
          placeholder:text-slate-600
          focus:border-blue-500
        "
      />

    </label>

  );

}


/*
 * =============================================================
 * SELECT FIELD
 * =============================================================
 */

function SelectField({
  label,
  value,
  onChange,
  options,
}) {

  return (

    <label
      className="
        block
      "
    >

      <span
        className="
          mb-2
          block
          text-xs
          font-semibold
          text-slate-400
        "
      >
        {label}
      </span>


      <select
        value={
          value ?? ""
        }
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="
          w-full
          rounded-lg
          border
          border-slate-700
          bg-[#080d1b]
          px-3.5
          py-2.5
          text-sm
          text-white
          outline-none
          focus:border-blue-500
        "
      >

        {options.map(
          (
            option
          ) => (

            <option
              key={option}
              value={option}
            >
              {option.replaceAll(
                "_",
                " "
              )}
            </option>

          )
        )}

      </select>

    </label>

  );

}


/*
 * =============================================================
 * TEXT AREA
 * =============================================================
 */

function TextAreaField({
  label,
  value,
  onChange,
}) {

  return (

    <label
      className="
        block
      "
    >

      <span
        className="
          mb-2
          block
          text-xs
          font-semibold
          text-slate-400
        "
      >
        {label}
      </span>


      <textarea
        value={
          value ?? ""
        }
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        rows={3}
        className="
          w-full
          resize-none
          rounded-lg
          border
          border-slate-700
          bg-[#080d1b]
          px-3.5
          py-2.5
          text-sm
          text-white
          outline-none
          placeholder:text-slate-600
          focus:border-blue-500
        "
      />

    </label>

  );

}


export default EquipmentForm;