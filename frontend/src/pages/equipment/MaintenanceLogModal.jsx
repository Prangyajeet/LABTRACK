import { useEffect, useState } from "react";
import {
  createMaintenanceLog,
  getMaintenanceLogs,
} from "../../services/equipmentService";

const TYPES = [
  "PREVENTIVE",
  "CORRECTIVE",
  "CALIBRATION",
  "CLEANING",
  "PART_REPLACEMENT",
];

function MaintenanceLogModal({
  equipment,
  onClose,
  onSaved,
}) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    equipmentId: equipment.id,
    maintenanceDate: "",
    maintenanceType: "PREVENTIVE",
    performedBy: "",
    cost: "",
    notes: "",
    nextScheduledDate: "",
  });

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await getMaintenanceLogs(equipment.id);
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load maintenance logs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [equipment.id]);

  const update = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!form.maintenanceDate) {
      setError("Maintenance date is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createMaintenanceLog({
        equipmentId: equipment.id,
        maintenanceDate: form.maintenanceDate,
        maintenanceType: form.maintenanceType,
        performedBy: form.performedBy,
        cost:
          form.cost === "" ? null : Number(form.cost),
        notes: form.notes,
        nextScheduledDate:
          form.nextScheduledDate || null,
      });

      await onSaved();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to create maintenance log."
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#101729] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-[#101729] px-6 py-5">
          <div>
            <h2 className="text-xl font-bold">
              Maintenance & AMC
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {equipment.equipmentName} ·{" "}
              {equipment.equipmentCode}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-500 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Info
              label="AMC Provider"
              value={equipment.amcProvider || "No AMC"}
            />

            <Info
              label="AMC Status"
              value={equipment.amcStatus || "—"}
            />

            <Info
              label="AMC End"
              value={formatDate(equipment.amcEnd)}
            />

            <Info
              label="Last Maintenance"
              value={formatDate(
                equipment.lastMaintenanceDate
              )}
            />

            <Info
              label="Next Maintenance"
              value={formatDate(
                equipment.nextMaintenanceDate
              )}
            />

            <Info
              label="Maintenance Status"
              value={
                equipment.maintenanceDue
                  ? "DUE"
                  : "OK"
              }
            />
          </div>

          <form
            onSubmit={submit}
            className="mb-8 rounded-xl border border-slate-800 bg-[#0b1120] p-5"
          >
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-blue-400">
              Log Maintenance
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Maintenance Date"
                type="date"
                value={form.maintenanceDate}
                onChange={(v) =>
                  update("maintenanceDate", v)
                }
                required
              />

              <label>
                <span className="mb-2 block text-xs font-semibold text-slate-400">
                  Maintenance Type
                </span>

                <select
                  value={form.maintenanceType}
                  onChange={(e) =>
                    update(
                      "maintenanceType",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#080d1b] px-3.5 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                >
                  {TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>

              <Field
                label="Performed By"
                value={form.performedBy}
                onChange={(v) =>
                  update("performedBy", v)
                }
                required
              />

              <Field
                label="Cost"
                type="number"
                value={form.cost}
                onChange={(v) =>
                  update("cost", v)
                }
              />

              <Field
                label="Next Scheduled Date"
                type="date"
                value={form.nextScheduledDate}
                onChange={(v) =>
                  update(
                    "nextScheduledDate",
                    v
                  )
                }
              />

              <div className="md:col-span-2">
                <label>
                  <span className="mb-2 block text-xs font-semibold text-slate-400">
                    Notes
                  </span>

                  <textarea
                    value={form.notes}
                    onChange={(e) =>
                      update(
                        "notes",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full resize-none rounded-lg border border-slate-700 bg-[#080d1b] px-3.5 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                  />
                </label>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Log Maintenance"}
              </button>
            </div>
          </form>

          <div>
            <h3 className="mb-4 text-lg font-bold">
              Maintenance History
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="min-w-[750px] w-full">
                <thead className="bg-[#0b1120]">
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3">
                      Date
                    </th>
                    <th className="px-4 py-3">
                      Type
                    </th>
                    <th className="px-4 py-3">
                      Performed By
                    </th>
                    <th className="px-4 py-3">
                      Cost
                    </th>
                    <th className="px-4 py-3">
                      Next Date
                    </th>
                    <th className="px-4 py-3">
                      Notes
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-8 text-center text-slate-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-8 text-center text-slate-500"
                      >
                        No maintenance records.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr
                        key={log.id}
                        className="text-sm"
                      >
                        <td className="px-4 py-3 text-slate-300">
                          {formatDate(
                            log.maintenanceDate
                          )}
                        </td>

                        <td className="px-4 py-3 text-slate-300">
                          {log.maintenanceType?.replaceAll(
                            "_",
                            " "
                          )}
                        </td>

                        <td className="px-4 py-3 text-slate-300">
                          {log.performedBy || "—"}
                        </td>

                        <td className="px-4 py-3 text-slate-300">
                          {log.cost != null
                            ? `₹${Number(
                                log.cost
                              ).toLocaleString(
                                "en-IN"
                              )}`
                            : "—"}
                        </td>

                        <td className="px-4 py-3 text-slate-300">
                          {formatDate(
                            log.nextScheduledDate
                          )}
                        </td>

                        <td className="max-w-xs px-4 py-3 text-slate-400">
                          {log.notes || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-semibold text-slate-400">
        {label}
        {required && (
          <span className="ml-1 text-red-400">*</span>
        )}
      </span>

      <input
        type={type}
        required={required}
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-lg border border-slate-700 bg-[#080d1b] px-3.5 py-2.5 text-sm text-white outline-none focus:border-blue-500"
      />
    </label>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-[#0b1120] p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

export default MaintenanceLogModal;