import { useRef, useState } from "react";

import {
    uploadTimetable
} from "../../services/timetableService";


const TimetableUpload = ({
    onSaved,
    onClose
}) => {

    const fileInputRef = useRef(null);

    const [file, setFile] =
        useState(null);

    const [uploading, setUploading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    /* =========================================================
       FILE SELECT
       ========================================================= */

    const handleFileChange = (
        event
    ) => {

        const selectedFile =
            event.target.files?.[0];

        setError("");
        setSuccess("");

        if (!selectedFile) {

            setFile(null);

            return;
        }


        const fileName =
            selectedFile.name.toLowerCase();


        const allowed =
            fileName.endsWith(".xlsx") ||
            fileName.endsWith(".xls") ||
            fileName.endsWith(".csv");


        if (!allowed) {

            setFile(null);

            setError(
                "Only XLS, XLSX and CSV files are supported."
            );

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            return;
        }


        setFile(selectedFile);
    };


    /* =========================================================
       UPLOAD
       ========================================================= */

    const handleUpload = async () => {

        if (!file) {

            setError(
                "Please select a timetable file first."
            );

            return;
        }


        try {

            setUploading(true);

            setError("");
            setSuccess("");


            const result =
                await uploadTimetable(
                    file
                );


            const count =
                Array.isArray(result)
                    ? result.length
                    : 0;


            setSuccess(
                `${count} timetable record(s) imported successfully.`
            );


            setFile(null);


            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }


            if (onSaved) {
                onSaved(result);
            }

        } catch (err) {

            console.error(
                "Timetable upload error:",
                err
            );


            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.response?.data ||
                "Unable to upload timetable.";


            setError(
                typeof message === "string"
                    ? message
                    : "Unable to upload timetable."
            );

        } finally {

            setUploading(false);
        }
    };


    /* =========================================================
       REMOVE SELECTED FILE
       ========================================================= */

    const handleRemoveFile = () => {

        setFile(null);

        setError("");
        setSuccess("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

            {/* HEADER */}

            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

                <div>

                    <h2 className="text-lg font-semibold text-slate-800">
                        Upload Timetable
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Upload the predefined laboratory timetable.
                    </p>

                </div>


                {onClose && (

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 text-2xl leading-none"
                    >
                        ×
                    </button>

                )}

            </div>


            {/* BODY */}

            <div className="p-6">

                {/* ERROR */}

                {error && (

                    <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

                        <span className="text-red-600">
                            ⚠
                        </span>

                        <p className="text-sm text-red-700">
                            {error}
                        </p>

                    </div>

                )}


                {/* SUCCESS */}

                {success && (

                    <div className="mb-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">

                        <span className="text-green-600">
                            ✓
                        </span>

                        <p className="text-sm text-green-700">
                            {success}
                        </p>

                    </div>

                )}


                {/* FILE INPUT */}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={
                        handleFileChange
                    }
                    className="hidden"
                />


                {!file ? (

                    <button
                        type="button"
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                        className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center hover:border-blue-400 hover:bg-blue-50/30 transition"
                    >

                        <div className="text-4xl mb-4">
                            📄
                        </div>


                        <p className="text-base font-semibold text-slate-700">
                            Choose timetable file
                        </p>


                        <p className="text-sm text-slate-500 mt-2">
                            Click here to select your timetable
                        </p>


                        <p className="text-xs text-slate-400 mt-3">
                            XLS · XLSX · CSV
                        </p>

                    </button>

                ) : (

                    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5">

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white border border-blue-200 text-2xl">
                                📄
                            </div>


                            <div className="min-w-0 flex-1">

                                <p className="font-semibold text-slate-800 truncate">
                                    {file.name}
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                    {(file.size / 1024).toFixed(1)}
                                    {" KB"}
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    handleRemoveFile
                                }
                                disabled={uploading}
                                className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                )}


                {/* FORMAT INFORMATION */}

                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">

                    <p className="text-sm font-semibold text-slate-700 mb-3">
                        Required timetable columns
                    </p>


                    <div className="flex flex-wrap gap-2">

                        {[
                            "Day",
                            "Time From",
                            "Time To",
                            "Faculty",
                            "Lab",
                            "Subject",
                            "Class"
                        ].map(
                            (column) => (

                                <span
                                    key={column}
                                    className="rounded-full bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600"
                                >
                                    {column}
                                </span>

                            )
                        )}

                    </div>


                    <p className="text-xs text-slate-400 mt-4 leading-5">
                        Date is optional. For a weekly timetable,
                        LabTrack automatically determines the day
                        from the date selected in Lab Occupancy.
                    </p>

                </div>


                {/* ACTIONS */}

                <div className="mt-6 flex justify-end gap-3">

                    {onClose && (

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={uploading}
                            className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                    )}


                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={
                            !file ||
                            uploading
                        }
                        className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >

                        {uploading
                            ? "Uploading..."
                            : "Upload Timetable"}

                    </button>

                </div>

            </div>

        </div>
    );
};


export default TimetableUpload;