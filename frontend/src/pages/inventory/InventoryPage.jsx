import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Search,
    RefreshCw,
    Package,
    AlertTriangle,
    PackageCheck,
    Eye,
    Trash2,
    X,
    CalendarDays,
    Building2,
    Boxes,
    ArrowDownToLine,
    ArrowUpFromLine
} from "lucide-react";

import inventoryService from "../../services/inventoryService";
import useInventory from "../../hooks/useInventory";

const InventoryPage = () => {

    const {
        inventory,
        loading,
        error,
        searchInventory,
        refresh
    } = useInventory();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedItem, setSelectedItem] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {

        const timer = setTimeout(() => {

            if (search.trim()) {
                searchInventory(search);
            } else {
                refresh();
            }

        }, 400);

        return () => clearTimeout(timer);

    }, [
        search,
        searchInventory,
        refresh
    ]);

    const filteredInventory = useMemo(() => {

        if (statusFilter === "ALL") {
            return inventory;
        }

        if (statusFilter === "LOW_STOCK") {

            return inventory.filter(
                item =>
                    Number(item.quantity ?? 0) > 0 &&
                    Number(item.quantity ?? 0) <=
                    Number(item.minimumQuantity ?? 0)
            );
        }

        if (statusFilter === "OUT_OF_STOCK") {

            return inventory.filter(
                item =>
                    Number(item.quantity ?? 0) === 0
            );
        }

        if (statusFilter === "CONSUMABLE") {

            return inventory.filter(
                item =>
                    item.isConsumable === true
            );
        }

        return inventory;

    }, [
        inventory,
        statusFilter
    ]);

    const totalItems = inventory.length;

    const lowStockCount =
        inventory.filter(
            item =>
                Number(item.quantity ?? 0) > 0 &&
                Number(item.quantity ?? 0) <=
                Number(item.minimumQuantity ?? 0)
        ).length;

    const outOfStockCount =
        inventory.filter(
            item =>
                Number(item.quantity ?? 0) === 0
        ).length;

    const consumableCount =
        inventory.filter(
            item =>
                item.isConsumable === true
        ).length;

    const getStockStatus = (item) => {

        const quantity =
            Number(item.quantity ?? 0);

        const minimum =
            Number(item.minimumQuantity ?? 0);

        if (quantity === 0) {

            return {
                label: "OUT OF STOCK",
                className:
                    "border-red-500/30 bg-red-500/10 text-[#f85149]",
                quantityClass:
                    "text-[#f85149]"
            };
        }

        if (quantity <= minimum) {

            return {
                label: "LOW STOCK",
                className:
                    "border-[#d29922]/30 bg-[#d29922]/10 text-[#d29922]",
                quantityClass:
                    "text-[#d29922]"
            };
        }

        return {
            label: "NORMAL",
            className:
                "border-[#3fb950]/30 bg-[#3fb950]/10 text-[#3fb950]",
            quantityClass:
                "text-[#3fb950]"
        };
    };

    const handleView = async (id) => {

        setViewLoading(true);

        try {

            const item =
                await inventoryService
                    .getInventoryById(id);

            setSelectedItem(item);

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Unable to load inventory item."
            );

        } finally {

            setViewLoading(false);
        }
    };

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to deactivate this inventory item?"
            );

        if (!confirmed) {
            return;
        }

        setDeleteLoading(true);

        try {

            await inventoryService
                .deleteInventory(id);

            await refresh();

            if (selectedItem?.id === id) {
                setSelectedItem(null);
            }

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Unable to delete inventory item."
            );

        } finally {

            setDeleteLoading(false);
        }
    };

    return (

        <div className="min-h-full space-y-7 text-[#e6edf3]">

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div className="
                flex
                flex-col
                gap-5
                md:flex-row
                md:items-end
                md:justify-between
            ">

                <div>

                    <p className="
                        mb-2
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-[#58a6ff]
                    ">
                        Inventory Management
                    </p>

                    <h1 className="
                        text-[28px]
                        font-semibold
                        leading-tight
                        text-[#e6edf3]
                    ">
                        Inventory
                    </h1>

                    <p className="
                        mt-2
                        text-[13px]
                        text-[#8b949e]
                    ">
                        View and manage current laboratory inventory stock.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={refresh}
                    disabled={loading}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-[#21262d]
                        bg-[#161b22]
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-[#e6edf3]
                        transition-all
                        duration-200
                        hover:border-[#58a6ff]/50
                        hover:bg-[#1c2430]
                        hover:text-[#58a6ff]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    <RefreshCw
                        size={16}
                        className={
                            loading
                                ? "animate-spin"
                                : ""
                        }
                    />

                    {loading
                        ? "Refreshing..."
                        : "Refresh"}

                </button>

            </div>


            {/* =====================================================
                SUMMARY CARDS
            ===================================================== */}

            <div className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
            ">

                {/* TOTAL ITEMS */}

                <div className="
                    rounded-[10px]
                    border
                    border-[#21262d]
                    bg-[#161b22]
                    p-5
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-[#58a6ff]/40
                ">

                    <div className="
                        flex
                        items-start
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-widest
                                text-[#58a6ff]
                            ">
                                Total Items
                            </p>

                            <p className="
                                mt-3
                                text-[28px]
                                font-bold
                                leading-none
                                text-[#e6edf3]
                            ">
                                {totalItems}
                            </p>

                            <p className="
                                mt-2
                                text-xs
                                text-[#8b949e]
                            ">
                                Current inventory
                            </p>

                        </div>

                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-[#58a6ff]/20
                            bg-[#1a2332]
                        ">

                            <Package
                                size={22}
                                className="text-[#58a6ff]"
                            />

                        </div>

                    </div>

                </div>


                {/* LOW STOCK */}

                <div className="
                    rounded-[10px]
                    border
                    border-[#d29922]/25
                    bg-[#161b22]
                    p-5
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-[#d29922]/50
                ">

                    <div className="
                        flex
                        items-start
                        justify-between
                    ">

                        <div>

                            <p className="
                                flex
                                items-center
                                gap-2
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-widest
                                text-[#d29922]
                            ">
                                Low Stock

                                <span className="
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-[#f85149]
                                " />

                            </p>

                            <p className="
                                mt-3
                                text-[28px]
                                font-bold
                                leading-none
                                text-[#e6edf3]
                            ">
                                {lowStockCount}
                            </p>

                            <p className="
                                mt-2
                                text-xs
                                text-[#8b949e]
                            ">
                                Requires attention
                            </p>

                        </div>

                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-[#d29922]/25
                            bg-[#2a1e0d]
                        ">

                            <AlertTriangle
                                size={22}
                                className="text-[#d29922]"
                            />

                        </div>

                    </div>

                </div>


                {/* OUT OF STOCK */}

                <div className="
                    rounded-[10px]
                    border
                    border-[#f85149]/25
                    bg-[#161b22]
                    p-5
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-[#f85149]/50
                ">

                    <div className="
                        flex
                        items-start
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-widest
                                text-[#f85149]
                            ">
                                Out of Stock
                            </p>

                            <p className="
                                mt-3
                                text-[28px]
                                font-bold
                                leading-none
                                text-[#e6edf3]
                            ">
                                {outOfStockCount}
                            </p>

                            <p className="
                                mt-2
                                text-xs
                                text-[#8b949e]
                            ">
                                Items unavailable
                            </p>

                        </div>

                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-[#f85149]/25
                            bg-[#2a1518]
                        ">

                            <Package
                                size={22}
                                className="text-[#f85149]"
                            />

                        </div>

                    </div>

                </div>


                {/* CONSUMABLES */}

                <div className="
                    rounded-[10px]
                    border
                    border-[#3fb950]/25
                    bg-[#161b22]
                    p-5
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-[#3fb950]/50
                ">

                    <div className="
                        flex
                        items-start
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-widest
                                text-[#3fb950]
                            ">
                                Consumables
                            </p>

                            <p className="
                                mt-3
                                text-[28px]
                                font-bold
                                leading-none
                                text-[#e6edf3]
                            ">
                                {consumableCount}
                            </p>

                            <p className="
                                mt-2
                                text-xs
                                text-[#8b949e]
                            ">
                                Consumable inventory
                            </p>

                        </div>

                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-[#3fb950]/25
                            bg-[#0d2a1f]
                        ">

                            <PackageCheck
                                size={22}
                                className="text-[#3fb950]"
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
                FILTER BAR
            ===================================================== */}

            <div className="
                rounded-[10px]
                border
                border-[#21262d]
                bg-[#161b22]
                p-4
            ">

                <div className="
                    flex
                    flex-col
                    gap-3
                    lg:flex-row
                ">

                    <div className="relative flex-1">

                        <Search
                            size={18}
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-[#58a6ff]
                            "
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={
                                event =>
                                    setSearch(
                                        event.target.value
                                    )
                            }
                            placeholder="Search by item name, item code or batch number..."
                            className="
                                w-full
                                rounded-lg
                                border
                                border-[#21262d]
                                bg-[#0d1117]
                                py-3
                                pl-11
                                pr-4
                                text-sm
                                text-[#e6edf3]
                                placeholder:text-[#6e7681]
                                outline-none
                                transition
                                focus:border-[#58a6ff]
                                focus:ring-2
                                focus:ring-[#58a6ff]/10
                            "
                        />

                    </div>


                    <select
                        value={statusFilter}
                        onChange={
                            event =>
                                setStatusFilter(
                                    event.target.value
                                )
                        }
                        className="
                            rounded-lg
                            border
                            border-[#21262d]
                            bg-[#0d1117]
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-[#e6edf3]
                            outline-none
                            transition
                            focus:border-[#58a6ff]
                            focus:ring-2
                            focus:ring-[#58a6ff]/10
                            lg:min-w-[190px]
                        "
                    >

                        <option value="ALL">
                            All Items
                        </option>

                        <option value="LOW_STOCK">
                            Low Stock
                        </option>

                        <option value="OUT_OF_STOCK">
                            Out of Stock
                        </option>

                        <option value="CONSUMABLE">
                            Consumables
                        </option>

                    </select>

                </div>

            </div>


            {/* =====================================================
                ERROR
            ===================================================== */}

            {error && (

                <div className="
                    rounded-lg
                    border
                    border-[#f85149]/30
                    bg-[#2a1518]
                    px-4
                    py-3
                    text-sm
                    text-[#f85149]
                ">
                    {error}
                </div>

            )}


            {/* =====================================================
                INVENTORY TABLE
            ===================================================== */}

            <div className="
                overflow-hidden
                rounded-[10px]
                border
                border-[#21262d]
                bg-[#161b22]
            ">

                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead className="bg-[#1b2a49]">

                            <tr>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-[#58a6ff]
                                ">
                                    Item
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-[#a371f7]
                                ">
                                    Category
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-[#22d3ee]
                                ">
                                    Supplier
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-right
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-[#3fb950]
                                ">
                                    Quantity
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-right
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-[#d29922]
                                ">
                                    Min
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-right
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-[#f2cc60]
                                ">
                                    Reorder
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-[#58a6ff]
                                ">
                                    Expiry
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-[#f85149]
                                ">
                                    Status
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-right
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-[#c9d1d9]
                                ">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="
                                            px-5
                                            py-14
                                            text-center
                                            text-sm
                                            text-[#8b949e]
                                        "
                                    >
                                        <div className="
                                            flex
                                            items-center
                                            justify-center
                                            gap-3
                                        ">

                                            <RefreshCw
                                                size={18}
                                                className="animate-spin text-[#58a6ff]"
                                            />

                                            Loading inventory...

                                        </div>

                                    </td>

                                </tr>

                            ) : filteredInventory.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="
                                            px-5
                                            py-14
                                            text-center
                                        "
                                    >

                                        <Package
                                            size={40}
                                            className="
                                                mx-auto
                                                mb-3
                                                text-[#58a6ff]/50
                                            "
                                        />

                                        <p className="
                                            text-sm
                                            font-medium
                                            text-[#e6edf3]
                                        ">
                                            No inventory items found.
                                        </p>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-[#8b949e]
                                        ">
                                            Try changing your search or filter.
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                filteredInventory.map(item => {

                                    const stockStatus =
                                        getStockStatus(item);

                                    return (

                                        <tr
                                            key={item.id}
                                            className="
                                                border-t
                                                border-[#21262d]
                                                transition-colors
                                                duration-200
                                                hover:bg-[#1c2430]
                                            "
                                        >

                                            {/* ITEM */}

                                            <td className="px-5 py-5">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                ">

                                                    <div className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        border
                                                        border-[#58a6ff]/20
                                                        bg-[#1a2332]
                                                    ">

                                                        <Package
                                                            size={17}
                                                            className="text-[#58a6ff]"
                                                        />

                                                    </div>

                                                    <div>

                                                        <p className="
                                                            font-semibold
                                                            text-[#e6edf3]
                                                        ">
                                                            {item.itemName || "—"}
                                                        </p>

                                                        <p className="
                                                            mt-1
                                                            text-xs
                                                            font-medium
                                                            text-[#8b949e]
                                                        ">
                                                            {item.itemCode || "—"}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* CATEGORY */}

                                            <td className="
                                                px-5
                                                py-5
                                                text-sm
                                                font-medium
                                                text-[#a371f7]
                                            ">
                                                {item.categoryName || "—"}
                                            </td>


                                            {/* SUPPLIER */}

                                            <td className="px-5 py-5">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-sm
                                                    font-medium
                                                    text-[#22d3ee]
                                                ">

                                                    <Building2
                                                        size={16}
                                                        className="text-[#58a6ff]"
                                                    />

                                                    <span>
                                                        {item.supplierName || "—"}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* QUANTITY */}

                                            <td className="px-5 py-5 text-right">

                                                <div className="
                                                    flex
                                                    items-center
                                                    justify-end
                                                    gap-2
                                                ">

                                                    {Number(item.quantity ?? 0) <=
                                                        Number(item.minimumQuantity ?? 0)
                                                        ? (
                                                            <AlertTriangle
                                                                size={15}
                                                                className="text-[#d29922]"
                                                            />
                                                        )
                                                        : (
                                                            <Boxes
                                                                size={15}
                                                                className="text-[#3fb950]"
                                                            />
                                                        )}

                                                    <span className={`
                                                        text-sm
                                                        font-bold
                                                        ${stockStatus.quantityClass}
                                                    `}>
                                                        {item.quantity ?? 0}
                                                    </span>

                                                    {item.unit && (

                                                        <span className="
                                                            text-xs
                                                            text-[#8b949e]
                                                        ">
                                                            {item.unit}
                                                        </span>

                                                    )}

                                                </div>

                                            </td>


                                            {/* MIN */}

                                            <td className="
                                                px-5
                                                py-5
                                                text-right
                                                text-sm
                                                font-semibold
                                                text-[#d29922]
                                            ">
                                                {item.minimumQuantity ?? 0}
                                            </td>


                                            {/* REORDER */}

                                            <td className="
                                                px-5
                                                py-5
                                                text-right
                                                text-sm
                                                font-semibold
                                                text-[#f2cc60]
                                            ">
                                                {item.reorderQuantity ?? 0}
                                            </td>


                                            {/* EXPIRY */}

                                            <td className="px-5 py-5">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-sm
                                                    text-[#8b949e]
                                                ">

                                                    <CalendarDays
                                                        size={15}
                                                        className="text-[#58a6ff]"
                                                    />

                                                    <span>
                                                        {item.expiryDate || "—"}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* STATUS */}

                                            <td className="px-5 py-5">

                                                <span
                                                    className={`
                                                        inline-flex
                                                        items-center
                                                        rounded-full
                                                        border
                                                        px-2.5
                                                        py-1
                                                        text-[10px]
                                                        font-bold
                                                        tracking-wide
                                                        ${stockStatus.className}
                                                    `}
                                                >
                                                    {stockStatus.label}
                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td className="px-5 py-5">

                                                <div className="
                                                    flex
                                                    justify-end
                                                    gap-2
                                                ">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleView(item.id)
                                                        }
                                                        title="View Item"
                                                        className="
                                                            inline-flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            border
                                                            border-[#58a6ff]/30
                                                            bg-[#1a2332]
                                                            text-[#58a6ff]
                                                            transition
                                                            hover:border-[#58a6ff]
                                                            hover:bg-[#58a6ff]/10
                                                        "
                                                    >
                                                        <Eye size={16} />
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(item.id)
                                                        }
                                                        disabled={deleteLoading}
                                                        title="Deactivate Item"
                                                        className="
                                                            inline-flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            border
                                                            border-[#f85149]/30
                                                            bg-[#2a1518]
                                                            text-[#f85149]
                                                            transition
                                                            hover:border-[#f85149]
                                                            hover:bg-[#f85149]/10
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-50
                                                        "
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    );

                                })

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =====================================================
                VIEW MODAL
            ===================================================== */}

            {selectedItem && (

                <div className="
                    fixed
                    inset-0
                    z-50
                    flex
                    items-center
                    justify-center
                    bg-black/70
                    p-4
                ">

                    <div className="
                        max-h-[90vh]
                        w-full
                        max-w-4xl
                        overflow-y-auto
                        rounded-2xl
                        border
                        border-[#21262d]
                        bg-[#161b22]
                        shadow-2xl
                    ">

                        {/* MODAL HEADER */}

                        <div className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-[#21262d]
                            px-6
                            py-5
                        ">

                            <div>

                                <p className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-[#58a6ff]
                                ">
                                    Inventory
                                </p>

                                <h2 className="
                                    mt-1
                                    text-lg
                                    font-semibold
                                    text-[#e6edf3]
                                ">
                                    Inventory Details
                                </h2>

                                <p className="
                                    mt-1
                                    text-xs
                                    text-[#8b949e]
                                ">
                                    {viewLoading
                                        ? "Loading..."
                                        : selectedItem.itemCode}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedItem(null)
                                }
                                className="
                                    inline-flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-[#21262d]
                                    bg-[#0d1117]
                                    text-[#8b949e]
                                    transition
                                    hover:border-[#f85149]/50
                                    hover:bg-[#f85149]/10
                                    hover:text-[#f85149]
                                "
                            >
                                <X size={18} />
                            </button>

                        </div>


                        {/* MODAL CONTENT */}

                        <div className="
                            grid
                            grid-cols-1
                            gap-4
                            p-6
                            md:grid-cols-2
                        ">

                            <Detail
                                label="Item Name"
                                value={selectedItem.itemName}
                            />

                            <Detail
                                label="Item Code"
                                value={selectedItem.itemCode}
                            />

                            <Detail
                                label="Category"
                                value={selectedItem.categoryName}
                            />

                            <Detail
                                label="Supplier"
                                value={selectedItem.supplierName}
                            />

                            <Detail
                                label="Storage Location"
                                value={selectedItem.storageLocationName}
                            />

                            <Detail
                                label="Unit"
                                value={selectedItem.unit}
                            />

                            <Detail
                                label="Current Quantity"
                                value={selectedItem.quantity}
                            />

                            <Detail
                                label="Minimum Quantity"
                                value={selectedItem.minimumQuantity}
                            />

                            <Detail
                                label="Maximum Quantity"
                                value={selectedItem.maximumQuantity}
                            />

                            <Detail
                                label="Reorder Quantity"
                                value={selectedItem.reorderQuantity}
                            />

                            <Detail
                                label="Unit Price"
                                value={selectedItem.unitPrice}
                            />

                            <Detail
                                label="Batch Number"
                                value={selectedItem.batchNumber}
                            />

                            <Detail
                                label="Manufacture Date"
                                value={selectedItem.manufactureDate}
                            />

                            <Detail
                                label="Expiry Date"
                                value={selectedItem.expiryDate}
                            />

                            <Detail
                                label="Consumable"
                                value={
                                    selectedItem.isConsumable
                                        ? "Yes"
                                        : "No"
                                }
                            />

                            <Detail
                                label="Status"
                                value={selectedItem.status}
                            />

                            <div className="md:col-span-2">

                                <Detail
                                    label="Description"
                                    value={selectedItem.description}
                                />

                            </div>

                            <div className="md:col-span-2">

                                <Detail
                                    label="Remarks"
                                    value={selectedItem.remarks}
                                />

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};


/* =========================================================
   DETAIL COMPONENT
========================================================= */

const Detail = ({
    label,
    value
}) => {

    return (

        <div className="
            rounded-lg
            border
            border-[#21262d]
            bg-[#0d1117]
            p-4
        ">

            <p className="
                text-[10px]
                font-semibold
                uppercase
                tracking-widest
                text-[#58a6ff]
            ">
                {label}
            </p>

            <p className="
                mt-2
                text-sm
                font-medium
                text-[#e6edf3]
            ">
                {
                    value === null ||
                    value === undefined ||
                    value === ""
                        ? "—"
                        : String(value)
                }
            </p>

        </div>

    );
};


export default InventoryPage;