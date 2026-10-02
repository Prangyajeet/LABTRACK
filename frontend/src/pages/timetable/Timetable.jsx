import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import {
    Activity,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileCheck2,
    FileSpreadsheet,
    FlaskConical,
    Pencil,
    RefreshCw,
    Upload,
    Users,
    X,
    AlertCircle
} from "lucide-react";

import {
    getLabOccupancy,
    getTimetable,
    updateOccupancyStatus,
    uploadTimetable,
    normalizeList
} from "../../services/timetableService";


const MAX_FILE_SIZE =
    10 * 1024 * 1024;


const ALLOWED_EXTENSIONS = [
    ".xlsx",
    ".xls",
    ".csv"
];


const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];


const REAL_TIME_REFRESH =
    10 * 1000;


// =========================================================
// LOCAL DATE
// =========================================================

const getToday =
    () => {

        const date =
            new Date();


        const year =
            date.getFullYear();


        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );


        return (
            `${year}-${month}-${day}`
        );
    };


// =========================================================
// MAIN COMPONENT
// =========================================================

function Timetable() {

    const [
        selectedDate,
        setSelectedDate
    ] = useState(
        getToday()
    );


    const [
        selectedLab,
        setSelectedLab
    ] = useState("");


    const [
        activeView,
        setActiveView
    ] = useState(
        "occupancy"
    );


    const [
        occupancy,
        setOccupancy
    ] = useState([]);


    const [
        timetable,
        setTimetable
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        refreshing,
        setRefreshing
    ] = useState(false);


    const [
        uploading,
        setUploading
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        success,
        setSuccess
    ] = useState("");


    const [
        currentTime,
        setCurrentTime
    ] = useState(
        new Date()
    );


    const [
        showUploadModal,
        setShowUploadModal
    ] = useState(false);


    const [
        selectedFile,
        setSelectedFile
    ] = useState(null);


    const [
        fileError,
        setFileError
    ] = useState("");


    const [
        editingStatus,
        setEditingStatus
    ] = useState(false);


    const [
        editingRow,
        setEditingRow
    ] = useState(null);


    const fileInputRef =
        useRef(null);


    // =========================================================
    // SELECTED DAY
    // =========================================================

    const selectedDay =
        useMemo(() => {

            if (!selectedDate) {
                return "";
            }


            const date =
                new Date(
                    `${selectedDate}T00:00:00`
                );


            return date.toLocaleDateString(
                "en-US",
                {
                    weekday: "long"
                }
            );

        }, [
            selectedDate
        ]);


    const isSunday =
        selectedDay ===
        "Sunday";


    const isToday =
        selectedDate ===
        getToday();


    // =========================================================
    // CLOCK
    // =========================================================

    useEffect(() => {

        const timer =
            setInterval(
                () => {

                    setCurrentTime(
                        new Date()
                    );

                },
                1000
            );


        return () =>
            clearInterval(
                timer
            );

    }, []);


    // =========================================================
    // LOAD DATA
    // =========================================================

    const loadData =
        useCallback(
            async (
                silent = false
            ) => {

                if (!selectedDate) {
                    return;
                }


                try {

                    if (silent) {

                        setRefreshing(
                            true
                        );

                    } else {

                        setLoading(
                            true
                        );
                    }


                    setError("");


                    if (
                        selectedDay ===
                        "Sunday"
                    ) {

                        setOccupancy([]);

                        setTimetable([]);

                        return;
                    }


                    const [
                        occupancyResult,
                        timetableResult
                    ] =
                        await Promise.all([

                            getLabOccupancy({
                                date:
                                    selectedDate,

                                lab:
                                    selectedLab
                            }),

                            getTimetable({
                                date:
                                    selectedDate,

                                lab:
                                    selectedLab,

                                day:
                                    selectedDay
                            })

                        ]);


                    setOccupancy(
                        normalizeList(
                            occupancyResult
                        )
                    );


                    setTimetable(
                        normalizeList(
                            timetableResult
                        )
                    );

                } catch (err) {

                    console.error(
                        "TIMETABLE LOAD ERROR:",
                        err
                    );


                    setError(
                        err?.response?.data
                            ?.message ||

                        err?.response?.data
                            ?.error ||

                        err?.message ||

                        "Unable to load timetable and lab occupancy."
                    );

                } finally {

                    setLoading(
                        false
                    );

                    setRefreshing(
                        false
                    );
                }

            },
            [
                selectedDate,
                selectedDay,
                selectedLab
            ]
        );


    // =========================================================
    // INITIAL / FILTER LOAD
    // =========================================================

    useEffect(() => {

        loadData();

    }, [
        loadData
    ]);


    // =========================================================
    // REAL-TIME REFRESH
    // =========================================================

    useEffect(() => {

        if (
            activeView !==
            "occupancy"
            ||
            !isToday
            ||
            isSunday
        ) {

            return;
        }


        const timer =
            setInterval(
                () => {

                    loadData(
                        true
                    );

                },
                REAL_TIME_REFRESH
            );


        return () =>
            clearInterval(
                timer
            );

    }, [
        activeView,
        isToday,
        isSunday,
        loadData
    ]);


    // =========================================================
    // LAB LIST
    // =========================================================

    const labs =
        useMemo(() => {

            const names =
                timetable
                    .map(
                        item =>
                            item?.lab ??
                            item?.labName ??
                            item?.laboratory ??
                            ""
                    )
                    .map(
                        value =>
                            String(
                                value
                            ).trim()
                    )
                    .filter(
                        Boolean
                    );


            return [
                ...new Set(
                    names
                )
            ].sort();

        }, [
            timetable
        ]);


    // =========================================================
    // NORMALIZE ROWS
    // =========================================================

    const rows =
        useMemo(() => {

            const source =
                activeView ===
                "occupancy"
                    ? occupancy
                    : timetable;


            return source.map(
                (
                    item,
                    index
                ) => {

                    const rawStatus =
                        String(
                            item?.status ??
                            (
                                activeView ===
                                "occupancy"
                                    ? "VACANT"
                                    : "SCHEDULED"
                            )
                        ).toUpperCase();


                    return {

                        id:
                            item?.id ??
                            item?.timetableId ??
                            index,

                        timetableId:
                            item?.timetableId ??
                            item?.id ??
                            null,

                        day:
                            item?.day ??
                            selectedDay,

                        timeFrom:
                            item?.timeFrom ??
                            item?.time_from ??
                            item?.from ??
                            "",

                        timeTo:
                            item?.timeTo ??
                            item?.time_to ??
                            item?.to ??
                            "",

                        faculty:
                            item?.faculty ??
                            item?.facultyName ??
                            "—",

                        lab:
                            item?.lab ??
                            item?.labName ??
                            item?.laboratory ??
                            "—",

                        subject:
                            item?.subject ??
                            item?.subjectName ??
                            "—",

                        className:
                            item?.className ??
                            item?.class_name ??
                            item?.class ??
                            "—",

                        status:
                            rawStatus,

                        updatedAt:
                            item?.updatedAt ??
                            null

                    };
                }
            );

        }, [
            activeView,
            occupancy,
            timetable,
            selectedDay
        ]);


    // =========================================================
    // FACULTY SCHEDULE STATUS
    // =========================================================
    //
    // Faculty Schedule is a COMPLETE timetable.
    //
    // Therefore status is calculated as:
    //
    // VACANT   -> today's manual override
    // OCCUPIED -> class running right now
    // SCHEDULED -> everything else
    //
    // =========================================================

    const scheduleRows =
        useMemo(() => {

            if (
                activeView !==
                "schedule"
            ) {

                return rows;
            }


            const now =
                new Date();


            const currentMinutes =
                (
                    now.getHours() *
                    60
                )
                +
                now.getMinutes();


            const todayString =
                getToday();


            return rows.map(
                row => {

                    /*
                     * Manual VACANT override.
                     *
                     * Only honour it when the override was
                     * updated today.
                     */

                    const manualVacant =
                        row.status ===
                        "VACANT"
                        &&
                        row.updatedAt
                        &&
                        String(
                            row.updatedAt
                        ).slice(
                            0,
                            10
                        ) ===
                        todayString;


                    if (
                        manualVacant
                    ) {

                        return {
                            ...row,
                            status:
                                "VACANT"
                        };
                    }


                    if (
                        !isToday
                    ) {

                        return {
                            ...row,
                            status:
                                "SCHEDULED"
                        };
                    }


                    const from =
                        parseTimeToMinutes(
                            row.timeFrom
                        );


                    const to =
                        parseTimeToMinutes(
                            row.timeTo
                        );


                    if (
                        from !== null &&
                        to !== null
                    ) {

                        if (
                            currentMinutes >= from &&
                            currentMinutes < to
                        ) {
                            return {
                                ...row,
                                status:
                                    "OCCUPIED"
                            };
                        }

                        if (
                            currentMinutes >= to
                        ) {
                            return {
                                ...row,
                                status:
                                    "COMPLETED"
                            };
                        }
                    }


                    return {
                        ...row,
                        status:
                            "SCHEDULED"
                    };
                }
            );

        }, [
            activeView,
            rows,
            isToday,
            currentTime
        ]);


    // =========================================================
    // LIVE OCCUPANCY DISPLAY
    // =========================================================
    //
    // Lab Occupancy is a LIVE view.
    //
    // Therefore it must show ONLY a class whose time range
    // contains the current time.
    //
    // Naturally vacant labs / future classes / past classes are
    // not displayed here.
    //
    // A manually marked VACANT class is still displayed because
    // it is the CURRENT class and therefore can be restored.
    // =========================================================

    const liveOccupancyRows =
        useMemo(() => {

            if (
                activeView !==
                "occupancy"
            ) {
                return [];
            }

            if (
                !isToday ||
                isSunday
            ) {
                return [];
            }

            const nowMinutes =
                currentTime.getHours() * 60 +
                currentTime.getMinutes();

            return rows.filter(
                row => {

                    const from =
                        parseTimeToMinutes(
                            row.timeFrom
                        );

                    const to =
                        parseTimeToMinutes(
                            row.timeTo
                        );

                    if (
                        from === null ||
                        to === null
                    ) {
                        return false;
                    }

                    return (
                        nowMinutes >= from &&
                        nowMinutes < to
                    );
                }
            );

        }, [
            activeView,
            rows,
            currentTime,
            isToday,
            isSunday
        ]);


    const displayRows =
        activeView ===
        "schedule"
            ? scheduleRows
            : liveOccupancyRows;


    // =========================================================
    // SUMMARY
    // =========================================================

    const summary =
        useMemo(() => {

            if (
                activeView ===
                "occupancy"
            ) {

                const totalLabs =
                    occupancy.length;


                const occupied =
                    occupancy.filter(
                        row =>
                            String(
                                row.status || ""
                            ).toUpperCase() ===
                            "OCCUPIED"
                    ).length;


                const available =
                    Math.max(
                        totalLabs -
                        occupied,
                        0
                    );


                const utilization =
                    totalLabs > 0
                        ? Math.round(
                            (
                                occupied /
                                totalLabs
                            ) * 100
                        )
                        : 0;


                return {

                    totalLabs,

                    occupied,

                    available,

                    utilization

                };
            }


            /*
             * Faculty Schedule summary.
             */

            const uniqueLabs =
                new Set(
                    displayRows
                        .map(
                            row =>
                                row.lab
                        )
                        .filter(
                            lab =>
                                lab !==
                                "—"
                        )
                ).size;


            const occupied =
                displayRows.filter(
                    row =>
                        row.status ===
                        "OCCUPIED"
                ).length;


            const vacant =
                displayRows.filter(
                    row =>
                        row.status ===
                        "VACANT"
                ).length;


            return {

                totalLabs:
                    uniqueLabs,

                occupied,

                available:
                    vacant,

                utilization:
                    displayRows.length > 0
                        ? Math.round(
                            (
                                occupied /
                                displayRows.length
                            ) * 100
                        )
                        : 0

            };

        }, [
            activeView,
            displayRows
        ]);


    // =========================================================
    // FORMAT TIME
    // =========================================================

    const formatTime =
        (
            value
        ) => {

            if (!value) {
                return "—";
            }


            return String(
                value
            )
                .trim()
                .slice(
                    0,
                    5
                );
        };


    // =========================================================
    // FILE VALIDATION
    // =========================================================

    const validateFile =
        (
            file
        ) => {

            if (!file) {

                return (
                    "Please select a timetable file."
                );
            }


            const fileName =
                file.name.toLowerCase();


            const validExtension =
                ALLOWED_EXTENSIONS.some(
                    extension =>
                        fileName.endsWith(
                            extension
                        )
                );


            if (!validExtension) {

                return (
                    "Only XLS, XLSX or CSV timetable files are allowed."
                );
            }


            if (
                file.size >
                MAX_FILE_SIZE
            ) {

                return (
                    "Timetable file must not exceed 10 MB."
                );
            }


            return "";
        };


    // =========================================================
    // FILE SELECT
    // =========================================================

    const handleFileSelect =
        (
            file
        ) => {

            setFileError("");

            setSuccess("");


            const validation =
                validateFile(
                    file
                );


            if (validation) {

                setFileError(
                    validation
                );

                setSelectedFile(
                    null
                );

                return;
            }


            setSelectedFile(
                file
            );
        };


    // =========================================================
    // FILE INPUT
    // =========================================================

    const handleFileInput =
        (
            event
        ) => {

            const file =
                event.target.files?.[0];


            handleFileSelect(
                file
            );
        };


    // =========================================================
    // DROP
    // =========================================================

    const handleDrop =
        (
            event
        ) => {

            event.preventDefault();


            const file =
                event
                    .dataTransfer
                    ?.files?.[0];


            handleFileSelect(
                file
            );
        };


    // =========================================================
    // UPLOAD
    // =========================================================

    const handleUpload =
        async () => {

            if (!selectedFile) {

                setFileError(
                    "Please select a timetable file."
                );

                return;
            }


            try {

                setUploading(
                    true
                );


                setFileError("");

                setError("");

                setSuccess("");


                await uploadTimetable(
                    selectedFile
                );


                setSuccess(
                    "Timetable uploaded successfully."
                );


                setSelectedFile(
                    null
                );


                if (
                    fileInputRef.current
                ) {

                    fileInputRef.current.value =
                        "";
                }


                setShowUploadModal(
                    false
                );


                await loadData();

            } catch (err) {

                console.error(
                    "UPLOAD TIMETABLE ERROR:",
                    err
                );


                setFileError(
                    err?.response?.data
                        ?.message ||

                    err?.response?.data
                        ?.error ||

                    err?.message ||

                    "Unable to upload timetable."
                );

            } finally {

                setUploading(
                    false
                );
            }
        };


    // =========================================================
    // CLOSE UPLOAD
    // =========================================================

    const closeUploadModal =
        () => {

            if (uploading) {
                return;
            }


            setShowUploadModal(
                false
            );


            setSelectedFile(
                null
            );


            setFileError("");


            if (
                fileInputRef.current
            ) {

                fileInputRef.current.value =
                    "";
            }
        };


    // =========================================================
    // MANUAL STATUS CHANGE
    // =========================================================

    const handleManualStatus =
        async (
            row
        ) => {

            /*
             * The occupancy endpoint returns one row per laboratory.
             *
             * For a currently active class the row contains the
             * actual timetable values, so use its timetable ID when
             * available. For older responses without an ID, fall
             * back to matching the row against the complete timetable.
             */

            let id =
                row?.timetableId ??
                null;


            /*
             * Lab Occupancy rows represent the CURRENT class only.
             *
             * The occupancy DTO may not contain timetableId, so when
             * necessary we resolve the ID from the already-loaded
             * timetable using the exact laboratory + time slot.
             *
             * We intentionally DO NOT fall back to an upcoming class.
             * That could restore/change the wrong timetable record.
             */

            if (!id) {

                const rowLab =
                    String(
                        row?.lab ??
                        ""
                    ).trim();

                const rowFrom =
                    String(
                        row?.timeFrom ??
                        ""
                    ).slice(
                        0,
                        5
                    );

                const rowTo =
                    String(
                        row?.timeTo ??
                        ""
                    ).slice(
                        0,
                        5
                    );

                const rowSubject =
                    String(
                        row?.subject ??
                        ""
                    ).trim();

                const candidate =
                    timetable.find(
                        item => {

                            const itemLab =
                                String(
                                    item?.lab ??
                                    item?.labName ??
                                    item?.laboratory ??
                                    ""
                                ).trim();

                            const itemFrom =
                                String(
                                    item?.timeFrom ??
                                    item?.time_from ??
                                    item?.from ??
                                    ""
                                ).slice(
                                    0,
                                    5
                                );

                            const itemTo =
                                String(
                                    item?.timeTo ??
                                    item?.time_to ??
                                    item?.to ??
                                    ""
                                ).slice(
                                    0,
                                    5
                                );

                            const itemSubject =
                                String(
                                    item?.subject ??
                                    item?.subjectName ??
                                    ""
                                ).trim();

                            const sameSubject =
                                !rowSubject ||
                                rowSubject === "—" ||
                                itemSubject ===
                                    rowSubject;

                            return (
                                itemLab ===
                                    rowLab
                                &&
                                itemFrom ===
                                    rowFrom
                                &&
                                itemTo ===
                                    rowTo
                                &&
                                sameSubject
                            );
                        }
                    );

                id =
                    candidate?.id ??
                    candidate?.timetableId ??
                    null;
            }


            if (!id) {

                setError(
                    `Unable to identify the current timetable record for ${row.lab}.`
                );

                return;
            }


            const newStatus =
                row.status ===
                "VACANT"
                    ? "SCHEDULED"
                    : "VACANT";


            const confirmed =
                window.confirm(
                    newStatus ===
                    "VACANT"
                        ? (
                            `Mark ${row.lab} as VACANT now?\n\n`
                            +
                            "This will override the live timetable "
                            +
                            "for today's current class."
                        )
                        : (
                            `Restore automatic occupancy for ${row.lab}?`
                        )
                );


            if (!confirmed) {
                return;
            }


            try {

                setEditingStatus(
                    true
                );

                setEditingRow(
                    id
                );

                setError("");


                await updateOccupancyStatus(
                    id,
                    newStatus
                );


                setSuccess(
                    newStatus ===
                    "VACANT"
                        ? `${row.lab} marked as vacant.`
                        : `${row.lab} restored to automatic occupancy.`
                );


                /*
                 * Immediately reload both timetable and occupancy
                 * so Restore/Mark Vacant reflects the database state.
                 */
                await loadData(
                    true
                );

            } catch (err) {

                console.error(
                    "MANUAL OCCUPANCY ERROR:",
                    err
                );


                setError(
                    err?.response?.data
                        ?.message ||
                    err?.response?.data
                        ?.error ||
                    err?.message ||
                    "Unable to update laboratory occupancy."
                );

            } finally {

                setEditingStatus(
                    false
                );

                setEditingRow(
                    null
                );
            }
        };

    // =========================================================
    // CURRENT CLOCK
    // =========================================================

    const formattedCurrentTime =
        currentTime.toLocaleTimeString(
            "en-IN",
            {
                hour:
                    "2-digit",

                minute:
                    "2-digit",

                hour12:
                    false
            }
        );


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="
                min-h-full
                bg-[#070b18]
                px-6
                py-6
                text-white
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    mb-6
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-4
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-4
                    "
                >

                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-blue-500/20
                            bg-blue-500/10
                            text-blue-400
                        "
                    >

                        <CalendarDays
                            size={21}
                        />

                    </div>


                    <div>

                        <h1
                            className="
                                text-2xl
                                font-bold
                                tracking-tight
                                text-white
                                sm:text-3xl
                            "
                        >
                            Timetable & Lab Occupancy
                        </h1>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-400
                            "
                        >
                            Manage laboratory schedules
                            and monitor availability
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        setShowUploadModal(
                            true
                        )
                    }
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-pink-600
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-pink-500
                    "
                >

                    <Upload
                        size={16}
                    />

                    Upload Timetable

                </button>

            </div>


            {/* =================================================
                MESSAGES
            ================================================= */}

            {error && (

                <div
                    className="
                        mb-5
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-red-500/30
                        bg-red-500/10
                        px-4
                        py-3
                        text-sm
                        text-red-300
                    "
                >

                    <AlertCircle
                        size={18}
                    />

                    {error}

                </div>

            )}


            {success && (

                <div
                    className="
                        mb-5
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-emerald-500/30
                        bg-emerald-500/10
                        px-4
                        py-3
                        text-sm
                        text-emerald-300
                    "
                >

                    <CheckCircle2
                        size={18}
                    />

                    {success}

                </div>

            )}


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div
                className="
                    mb-6
                    grid
                    grid-cols-1
                    gap-4
                    md:grid-cols-2
                    xl:grid-cols-4
                "
            >

                <SummaryCard
                    label={
                        activeView ===
                        "occupancy"
                            ? "Total Labs"
                            : "Scheduled Labs"
                    }
                    value={
                        summary.totalLabs
                    }
                    subtitle={
                        activeView ===
                        "occupancy"
                            ? "Currently monitored"
                            : "Labs in schedule"
                    }
                    icon={
                        <FlaskConical
                            size={22}
                        />
                    }
                />


                <SummaryCard
                    label="Occupied"
                    value={
                        summary.occupied
                    }
                    subtitle={
                        activeView ===
                        "occupancy"
                            ? "Running right now"
                            : "Currently active"
                    }
                    icon={
                        <Activity
                            size={22}
                        />
                    }
                    danger
                />


                <SummaryCard
                    label="Available"
                    value={
                        summary.available
                    }
                    subtitle={
                        activeView ===
                        "occupancy"
                            ? "Labs free now"
                            : "Manual vacant"
                    }
                    icon={
                        <CheckCircle2
                            size={22}
                        />
                    }
                    success
                />


                <SummaryCard
                    label="Utilization"
                    value={
                        `${summary.utilization}%`
                    }
                    subtitle={
                        activeView ===
                        "occupancy"
                            ? "Current usage"
                            : "Schedule activity"
                    }
                    icon={
                        <Clock3
                            size={22}
                        />
                    }
                />

            </div>


            {/* =================================================
                FILTER PANEL
            ================================================= */}

            <div
                className="
                    mb-6
                    rounded-2xl
                    border
                    border-slate-800
                    bg-[#101729]
                    p-4
                "
            >

                <div
                    className="
                        mb-5
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-3
                    "
                >

                    <div
                        className="
                            inline-flex
                            rounded-xl
                            border
                            border-slate-700
                            bg-[#080d1b]
                            p-1
                        "
                    >

                        <button
                            type="button"
                            onClick={() =>
                                setActiveView(
                                    "occupancy"
                                )
                            }
                            className={`
                                inline-flex
                                items-center
                                gap-2
                                rounded-lg
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                transition
                                ${
                                    activeView ===
                                    "occupancy"
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:text-white"
                                }
                            `}
                        >

                            <FlaskConical
                                size={16}
                            />

                            Lab Occupancy

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                setActiveView(
                                    "schedule"
                                )
                            }
                            className={`
                                inline-flex
                                items-center
                                gap-2
                                rounded-lg
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                transition
                                ${
                                    activeView ===
                                    "schedule"
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:text-white"
                                }
                            `}
                        >

                            <Users
                                size={16}
                            />

                            Faculty Schedule

                        </button>

                    </div>


                    <div
                        className="
                            rounded-lg
                            border
                            border-emerald-500/20
                            bg-emerald-500/5
                            px-3
                            py-2
                            text-xs
                            text-emerald-300
                        "
                    >

                        <span
                            className="
                                mr-2
                                inline-block
                                h-2
                                w-2
                                rounded-full
                                bg-emerald-400
                            "
                        />

                        Live:{" "}
                        {formattedCurrentTime}

                    </div>

                </div>


                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4
                        lg:grid-cols-3
                    "
                >

                    {/* DATE */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            "
                        >
                            Select Date
                        </label>


                        <div
                            className="
                                relative
                            "
                        >

                            <CalendarDays
                                size={17}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-500
                                "
                            />


                            <input
                                type="date"
                                value={
                                    selectedDate
                                }
                                onChange={
                                    event =>
                                        setSelectedDate(
                                            event.target.value
                                        )
                                }
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-700
                                    bg-[#080d1b]
                                    px-10
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    outline-none
                                    focus:border-blue-500
                                "
                            />

                        </div>

                    </div>


                    {/* DAY */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            "
                        >
                            Day
                        </label>


                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-lg
                                border
                                border-slate-700
                                bg-[#080d1b]
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                text-white
                            "
                        >

                            <CalendarDays
                                size={17}
                                className="text-blue-400"
                            />

                            {selectedDay}

                        </div>

                    </div>


                    {/* LAB */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            "
                        >
                            Laboratory
                        </label>


                        <div
                            className="
                                relative
                            "
                        >

                            <FlaskConical
                                size={17}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-500
                                "
                            />


                            <select
                                value={
                                    selectedLab
                                }
                                onChange={
                                    event =>
                                        setSelectedLab(
                                            event.target.value
                                        )
                                }
                                className="
                                    w-full
                                    appearance-none
                                    rounded-lg
                                    border
                                    border-slate-700
                                    bg-[#080d1b]
                                    px-10
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    outline-none
                                    focus:border-blue-500
                                "
                            >

                                <option value="">
                                    All Laboratories
                                </option>


                                {labs.map(
                                    lab => (

                                        <option
                                            key={
                                                lab
                                            }
                                            value={
                                                lab
                                            }
                                        >
                                            {lab}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>

                </div>


                <div
                    className="
                        mt-4
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            gap-2
                        "
                    >

                        <button
                            type="button"
                            onClick={() =>
                                setSelectedDate(
                                    getToday()
                                )
                            }
                            className="
                                rounded-lg
                                border
                                border-slate-700
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-slate-300
                                transition
                                hover:bg-slate-800
                            "
                        >
                            Today
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                loadData()
                            }
                            disabled={
                                loading ||
                                refreshing
                            }
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-lg
                                border
                                border-slate-700
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-slate-300
                                transition
                                hover:bg-slate-800
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            <RefreshCw
                                size={15}
                                className={
                                    refreshing
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Refresh

                        </button>

                    </div>


                    {activeView ===
                        "occupancy" &&
                        isToday &&
                        !isSunday && (

                        <p
                            className="
                                text-xs
                                text-slate-500
                            "
                        >
                            Live occupancy refreshes
                            automatically every 10 seconds.
                        </p>

                    )}

                </div>

            </div>


            {/* =================================================
                SUNDAY
            ================================================= */}

            {isSunday ? (

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-800
                        bg-[#101729]
                    "
                >

                    <div
                        className="
                            flex
                            min-h-[360px]
                            flex-col
                            items-center
                            justify-center
                            px-6
                            text-center
                        "
                    >

                        <div
                            className="
                                mb-5
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-2xl
                                bg-slate-800
                                text-slate-500
                            "
                        >

                            <CalendarDays
                                size={28}
                            />

                        </div>


                        <h2
                            className="
                                text-lg
                                font-bold
                                text-white
                            "
                        >
                            No laboratory classes on Sunday
                        </h2>


                        <p
                            className="
                                mt-2
                                max-w-md
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            LabTrack does not display laboratory
                            timetable or occupancy information
                            for Sunday.
                        </p>

                    </div>

                </div>

            ) : (

                /* =================================================
                   MAIN TABLE
                ================================================= */

                <div
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-800
                        bg-[#101729]
                    "
                >

                    {/* HEADER */}

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            justify-between
                            gap-3
                            border-b
                            border-slate-800
                            px-5
                            py-5
                        "
                    >

                        <div>

                            <h2
                                className="
                                    text-lg
                                    font-bold
                                    text-white
                                "
                            >
                                {activeView ===
                                "occupancy"
                                    ? "Lab Occupancy"
                                    : "Faculty Schedule"}
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                "
                            >
                                {activeView ===
                                "occupancy"
                                    ? (
                                        isToday
                                            ? "Current laboratory availability"
                                            : "Live occupancy is only available for today"
                                    )
                                    : (
                                        `Complete timetable for ${selectedDay}`
                                    )}
                            </p>

                        </div>


                        <div
                            className="
                                text-right
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                "
                            >
                                {formatDisplayDate(
                                    selectedDate
                                )}
                            </p>


                            {activeView ===
                                "occupancy" && (

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        font-semibold
                                        text-emerald-400
                                    "
                                >
                                    • Live
                                </p>

                            )}

                        </div>

                    </div>


                    {/* TABLE */}

                    {loading ? (

                        <div
                            className="
                                flex
                                min-h-[360px]
                                flex-col
                                items-center
                                justify-center
                            "
                        >

                            <RefreshCw
                                size={28}
                                className="
                                    animate-spin
                                    text-blue-400
                                "
                            />


                            <p
                                className="
                                    mt-4
                                    text-sm
                                    font-semibold
                                    text-slate-300
                                "
                            >
                                Loading timetable...
                            </p>

                        </div>

                    ) : displayRows.length === 0 ? (

                        <div
                            className="
                                flex
                                min-h-[360px]
                                flex-col
                                items-center
                                justify-center
                                px-6
                                text-center
                            "
                        >

                            <div
                                className="
                                    mb-5
                                    flex
                                    h-16
                                    w-16
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    border-slate-800
                                    bg-[#080d1b]
                                    text-slate-600
                                "
                            >

                                <Activity
                                    size={28}
                                />

                            </div>


                            <h3
                                className="
                                    text-base
                                    font-bold
                                    text-white
                                "
                            >
                                {activeView ===
                                "occupancy"
                                    ? "No laboratory status available"
                                    : "No scheduled classes"}
                            </h3>


                            <p
                                className="
                                    mt-2
                                    max-w-md
                                    text-sm
                                    text-slate-500
                                "
                            >
                                {activeView ===
                                "occupancy"
                                    ? (
                                        isToday
                                            ? "There are no laboratories configured for this day."
                                            : "Select Today to see live laboratory occupancy."
                                    )
                                    : (
                                        `There are no timetable records for ${selectedDay}.`
                                    )}
                            </p>

                        </div>

                    ) : (

                        <div
                            className="
                                overflow-x-auto
                            "
                        >

                            <table
                                className="
                                    w-full
                                    min-w-[1000px]
                                "
                            >

                                <thead>

                                    <tr
                                        className="
                                            border-b
                                            border-slate-800
                                            bg-[#080d1b]
                                            text-left
                                        "
                                    >

                                        <th className="px-5 py-4 text-xs uppercase tracking-wide text-slate-500">
                                            Time
                                        </th>


                                        <th className="px-5 py-4 text-xs uppercase tracking-wide text-slate-500">
                                            Laboratory
                                        </th>


                                        <th className="px-5 py-4 text-xs uppercase tracking-wide text-slate-500">
                                            Faculty
                                        </th>


                                        <th className="px-5 py-4 text-xs uppercase tracking-wide text-slate-500">
                                            Subject
                                        </th>


                                        <th className="px-5 py-4 text-xs uppercase tracking-wide text-slate-500">
                                            Class
                                        </th>


                                        <th className="px-5 py-4 text-xs uppercase tracking-wide text-slate-500">
                                            Status
                                        </th>


                                        {activeView ===
                                            "occupancy" && (

                                            <th className="px-5 py-4 text-xs uppercase tracking-wide text-slate-500">
                                                Actions
                                            </th>

                                        )}

                                    </tr>

                                </thead>


                                <tbody>

                                    {displayRows.map(
                                        row => (

                                            <tr
                                                key={
                                                    row.id
                                                }
                                                className="
                                                    border-b
                                                    border-slate-800
                                                    last:border-b-0
                                                    transition
                                                    hover:bg-slate-900/40
                                                "
                                            >

                                                {/* TIME */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-5
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                h-9
                                                                w-9
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                bg-slate-800
                                                                text-slate-400
                                                            "
                                                        >

                                                            <Clock3
                                                                size={16}
                                                            />

                                                        </div>


                                                        <div>

                                                            <p
                                                                className="
                                                                    font-semibold
                                                                    text-white
                                                                "
                                                            >
                                                                {row.timeFrom &&
                                                                row.timeTo
                                                                    ? `${formatTime(
                                                                        row.timeFrom
                                                                    )} – ${formatTime(
                                                                        row.timeTo
                                                                    )}`
                                                                    : "No active class"}
                                                            </p>


                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-xs
                                                                    text-slate-600
                                                                "
                                                            >
                                                                {row.day}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* LAB */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-5
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                h-9
                                                                w-9
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                bg-blue-500/10
                                                                text-blue-400
                                                            "
                                                        >

                                                            <FlaskConical
                                                                size={17}
                                                            />

                                                        </div>


                                                        <span
                                                            className="
                                                                font-semibold
                                                                text-white
                                                            "
                                                        >
                                                            {row.lab}
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* FACULTY */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-5
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                h-9
                                                                w-9
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                bg-purple-500/10
                                                                text-purple-400
                                                            "
                                                        >

                                                            <Users
                                                                size={17}
                                                            />

                                                        </div>


                                                        <span
                                                            className="
                                                                font-semibold
                                                                text-slate-200
                                                            "
                                                        >
                                                            {row.faculty}
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* SUBJECT */}

                                                <td
                                                    className="
                                                        max-w-[320px]
                                                        px-5
                                                        py-5
                                                        text-sm
                                                        text-slate-300
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            line-clamp-2
                                                        "
                                                    >
                                                        {row.subject}
                                                    </div>

                                                </td>


                                                {/* CLASS */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-5
                                                    "
                                                >

                                                    {row.className !==
                                                        "—" &&
                                                        row.className && (

                                                        <span
                                                            className="
                                                                rounded-md
                                                                bg-slate-800
                                                                px-3
                                                                py-1.5
                                                                text-xs
                                                                font-medium
                                                                text-slate-300
                                                            "
                                                        >
                                                            {row.className}
                                                        </span>

                                                    )}

                                                    {(
                                                        row.className ===
                                                        "—"
                                                        ||
                                                        !row.className
                                                    ) && (
                                                        <span className="text-slate-600">
                                                            —
                                                        </span>
                                                    )}

                                                </td>


                                                {/* STATUS */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-5
                                                    "
                                                >

                                                    <StatusBadge
                                                        status={
                                                            row.status
                                                        }
                                                    />

                                                </td>


                                                {/* ACTION */}

                                                {activeView ===
                                                    "occupancy" && (

                                                    <td
                                                        className="
                                                            px-5
                                                            py-5
                                                        "
                                                    >

                                                        {isToday &&
                                                        row.status !==
                                                            "SCHEDULED" ? (

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleManualStatus(
                                                                        row
                                                                    )
                                                                }
                                                                disabled={
                                                                    editingStatus &&
                                                                    editingRow ===
                                                                        row.id
                                                                }
                                                                className={`
                                                                    inline-flex
                                                                    items-center
                                                                    gap-2
                                                                    rounded-lg
                                                                    border
                                                                    px-3
                                                                    py-2
                                                                    text-xs
                                                                    font-semibold
                                                                    transition
                                                                    disabled:cursor-not-allowed
                                                                    disabled:opacity-50
                                                                    ${
                                                                        row.status ===
                                                                        "OCCUPIED"
                                                                            ? "border-orange-500/30 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20"
                                                                            : "border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                                                                    }
                                                                `}
                                                            >

                                                                {editingStatus &&
                                                                editingRow ===
                                                                    row.id ? (

                                                                    <RefreshCw
                                                                        size={14}
                                                                        className="animate-spin"
                                                                    />

                                                                ) : (

                                                                    <Pencil
                                                                        size={14}
                                                                    />

                                                                )}


                                                                {row.status ===
                                                                "OCCUPIED"
                                                                    ? "Mark Vacant"
                                                                    : "Restore"}

                                                            </button>

                                                        ) : (

                                                            <span
                                                                className="
                                                                    text-xs
                                                                    text-slate-700
                                                                "
                                                            >
                                                                —

                                                            </span>

                                                        )}

                                                    </td>

                                                )}

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}


                    {/* FOOTER */}

                    {displayRows.length > 0 && (

                        <div
                            className="
                                flex
                                flex-col
                                gap-2
                                border-t
                                border-slate-800
                                px-5
                                py-4
                                text-xs
                                text-slate-600
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            <span>

                                {activeView ===
                                "occupancy"
                                    ? `Showing ${displayRows.length} active laboratory`
                                    : `Showing ${displayRows.length} timetable slot${displayRows.length !== 1 ? "s" : ""}`}

                            </span>


                            <span>

                                {activeView ===
                                "occupancy"
                                    ? (
                                        isToday
                                            ? "Only the class running at the current time is shown • auto-refresh every 10 seconds"
                                            : "Select today for live occupancy"
                                    )
                                    : (
                                        "Complete selected-day timetable"
                                    )}

                            </span>

                        </div>

                    )}

                </div>

            )}


            {/* =================================================
                UPLOAD MODAL
            ================================================= */}

            {showUploadModal && (

                <UploadModal
                    file={
                        selectedFile
                    }
                    fileError={
                        fileError
                    }
                    uploading={
                        uploading
                    }
                    fileInputRef={
                        fileInputRef
                    }
                    onFileInput={
                        handleFileInput
                    }
                    onDrop={
                        handleDrop
                    }
                    onClose={
                        closeUploadModal
                    }
                    onUpload={
                        handleUpload
                    }
                    onRemove={() => {

                        setSelectedFile(
                            null
                        );

                        setFileError("");

                        if (
                            fileInputRef.current
                        ) {

                            fileInputRef
                                .current
                                .value =
                                "";
                        }
                    }}
                />

            )}

        </div>
    );
}


// =========================================================
// TIME PARSER
// =========================================================

function parseTimeToMinutes(
    value
) {

    if (!value) {
        return null;
    }


    const text =
        String(
            value
        )
        .trim()
        .toUpperCase();


    /*
     * 24-hour format.
     *
     * Spring Boot LocalTime is normally serialized as:
     *
     *     HH:mm:ss
     *
     * Some responses may contain HH:mm.
     * Accept both formats.
     */

    if (
        /^\d{1,2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(
            text
        )
    ) {

        const parts =
            text.split(":");

        const hours =
            Number(
                parts[0]
            );

        const minutes =
            Number(
                parts[1]
            );


        if (
            hours >= 0 &&
            hours <= 23 &&
            minutes >= 0 &&
            minutes <= 59
        ) {

            return (
                hours * 60 +
                minutes
            );
        }
    }


    /*
     * 12-hour format.
     */

    const match =
        text.match(
            /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
        );


    if (!match) {
        return null;
    }


    let hours =
        Number(
            match[1]
        );


    const minutes =
        Number(
            match[2]
        );


    const period =
        match[3];


    if (
        hours < 1 ||
        hours > 12 ||
        minutes < 0 ||
        minutes > 59
    ) {

        return null;
    }


    if (
        period ===
        "AM"
    ) {

        if (
            hours ===
            12
        ) {

            hours = 0;
        }

    } else {

        if (
            hours !==
            12
        ) {

            hours += 12;
        }
    }


    return (
        hours * 60 +
        minutes
    );
}


// =========================================================
// DISPLAY DATE
// =========================================================

function formatDisplayDate(
    value
) {

    if (!value) {
        return "—";
    }


    const date =
        new Date(
            `${value}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"
        }
    );
}


// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({
    label,
    value,
    subtitle,
    icon,
    danger,
    success
}) {

    return (

        <div
            className="
                rounded-xl
                border
                border-slate-800
                bg-[#101729]
                p-5
            "
        >

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <div>

                    <p
                        className="
                            text-sm
                            text-slate-400
                        "
                    >
                        {label}
                    </p>


                    <p
                        className={`
                            mt-2
                            text-3xl
                            font-bold
                            ${
                                danger
                                    ? "text-red-400"
                                    : success
                                        ? "text-emerald-400"
                                        : "text-white"
                            }
                        `}
                    >
                        {value}
                    </p>


                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-600
                        "
                    >
                        {subtitle}
                    </p>

                </div>


                <div
                    className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-slate-800
                        text-blue-400
                    "
                >
                    {icon}
                </div>

            </div>

        </div>

    );
}


// =========================================================
// STATUS BADGE
// =========================================================

function StatusBadge({
    status
}) {

    const normalized =
        String(
            status ||
            "SCHEDULED"
        ).toUpperCase();


    const config = {

        OCCUPIED: {
            text:
                "OCCUPIED",

            className:
                "border-red-500/30 bg-red-500/10 text-red-400",

            dot:
                "bg-red-400"
        },


        VACANT: {
            text:
                "VACANT",

            className:
                "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",

            dot:
                "bg-emerald-400"
        },


        SCHEDULED: {
            text:
                "SCHEDULED",

            className:
                "border-blue-500/30 bg-blue-500/10 text-blue-400",

            dot:
                "bg-blue-400"
        },

        COMPLETED: {
            text:
                "COMPLETED",

            className:
                "border-slate-500/30 bg-slate-500/10 text-slate-400",

            dot:
                "bg-slate-400"
        }

    };


    const current =
        config[
            normalized
        ] ||
        config.SCHEDULED;


    return (

        <span
            className={`
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                px-3
                py-1.5
                text-xs
                font-semibold
                ${current.className}
            `}
        >

            <span
                className={`
                    h-2
                    w-2
                    rounded-full
                    ${current.dot}
                `}
            />


            {current.text}

        </span>
    );
}


// =========================================================
// UPLOAD MODAL
// =========================================================

function UploadModal({
    file,
    fileError,
    uploading,
    fileInputRef,
    onFileInput,
    onDrop,
    onClose,
    onUpload,
    onRemove
}) {

    return (

        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-black/75
                p-4
                backdrop-blur-sm
            "
        >

            <div
                className="
                    w-full
                    max-w-2xl
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-700
                    bg-[#101729]
                    shadow-2xl
                "
            >

                {/* HEADER */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-800
                        px-6
                        py-5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-lg
                                bg-pink-500/10
                                text-pink-400
                            "
                        >

                            <FileSpreadsheet
                                size={20}
                            />

                        </div>


                        <div>

                            <h2
                                className="
                                    font-bold
                                    text-white
                                "
                            >
                                Upload Timetable
                            </h2>


                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Import your predefined
                                laboratory schedule
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        disabled={
                            uploading
                        }
                        className="
                            rounded-lg
                            p-2
                            text-slate-500
                            transition
                            hover:bg-slate-800
                            hover:text-white
                            disabled:opacity-40
                        "
                    >

                        <X
                            size={20}
                        />

                    </button>

                </div>


                {/* BODY */}

                <div
                    className="
                        p-6
                    "
                >

                    <input
                        ref={
                            fileInputRef
                        }
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={
                            onFileInput
                        }
                        className="hidden"
                    />


                    {!file ? (

                        <div
                            onDragOver={
                                event =>
                                    event.preventDefault()
                            }
                            onDrop={
                                onDrop
                            }
                            className="
                                rounded-xl
                                border
                                border-dashed
                                border-slate-700
                                bg-[#080d1b]
                                p-10
                                text-center
                            "
                        >

                            <div
                                className="
                                    mx-auto
                                    flex
                                    h-16
                                    w-16
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-blue-500/10
                                    text-blue-400
                                "
                            >

                                <Upload
                                    size={28}
                                />

                            </div>


                            <h3
                                className="
                                    mt-5
                                    font-semibold
                                    text-white
                                "
                            >
                                Choose Timetable File
                            </h3>


                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Drag & drop your timetable
                                here or select a file.
                            </p>


                            <button
                                type="button"
                                onClick={() =>
                                    fileInputRef
                                        .current
                                        ?.click()
                                }
                                className="
                                    mt-5
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-slate-700
                                    bg-[#111a2e]
                                    px-5
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-slate-200
                                    transition
                                    hover:border-blue-500
                                    hover:bg-slate-800
                                "
                            >

                                <FileSpreadsheet
                                    size={16}
                                />

                                Browse File

                            </button>


                            <p
                                className="
                                    mt-4
                                    text-[10px]
                                    text-slate-600
                                "
                            >
                                XLS • XLSX • CSV ·
                                Maximum 10 MB
                            </p>

                        </div>

                    ) : (

                        <div
                            className="
                                rounded-xl
                                border
                                border-blue-500/20
                                bg-blue-500/5
                                p-6
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-500/10
                                        text-blue-400
                                    "
                                >

                                    <FileCheck2
                                        size={27}
                                    />

                                </div>


                                <div
                                    className="
                                        min-w-0
                                        flex-1
                                    "
                                >

                                    <p
                                        className="
                                            truncate
                                            text-sm
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        {file.name}
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        {(
                                            file.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)}
                                        {" "}MB
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        onRemove
                                    }
                                    disabled={
                                        uploading
                                    }
                                    className="
                                        rounded-lg
                                        p-2
                                        text-slate-500
                                        hover:bg-slate-800
                                        hover:text-white
                                        disabled:opacity-40
                                    "
                                >

                                    <X
                                        size={18}
                                    />

                                </button>

                            </div>

                        </div>

                    )}


                    {fileError && (

                        <div
                            className="
                                mt-4
                                flex
                                items-center
                                gap-2
                                rounded-lg
                                border
                                border-red-500/30
                                bg-red-500/10
                                px-4
                                py-3
                                text-xs
                                text-red-300
                            "
                        >

                            <AlertCircle
                                size={15}
                            />

                            {fileError}

                        </div>

                    )}

                </div>


                {/* FOOTER */}

                <div
                    className="
                        flex
                        justify-end
                        gap-3
                        border-t
                        border-slate-800
                        px-6
                        py-4
                    "
                >

                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        disabled={
                            uploading
                        }
                        className="
                            rounded-xl
                            border
                            border-slate-700
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-slate-300
                            transition
                            hover:bg-slate-800
                            disabled:opacity-40
                        "
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        onClick={
                            onUpload
                        }
                        disabled={
                            !file ||
                            uploading
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-pink-600
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-pink-500
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >

                        {uploading ? (

                            <>

                                <RefreshCw
                                    size={16}
                                    className="animate-spin"
                                />

                                Importing...

                            </>

                        ) : (

                            <>

                                <Upload
                                    size={16}
                                />

                                Import Timetable

                            </>

                        )}

                    </button>

                </div>

            </div>

        </div>
    );
}


export default Timetable;