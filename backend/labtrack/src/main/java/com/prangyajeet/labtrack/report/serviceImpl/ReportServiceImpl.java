package com.prangyajeet.labtrack.report.serviceImpl;

import com.prangyajeet.labtrack.breakage.entity.BreakageRecord;
import com.prangyajeet.labtrack.breakage.entity.BreakageRecoveryStatus;
import com.prangyajeet.labtrack.breakage.repository.BreakageRecordRepository;
import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.common.enums.TransactionType;
import com.prangyajeet.labtrack.equipment.entity.Equipment;
import com.prangyajeet.labtrack.equipment.entity.MaintenanceLog;
import com.prangyajeet.labtrack.equipment.repository.EquipmentRepository;
import com.prangyajeet.labtrack.equipment.repository.MaintenanceLogRepository;
import com.prangyajeet.labtrack.inventorytransaction.entity.InventoryTransaction;
import com.prangyajeet.labtrack.inventorytransaction.repository.InventoryTransactionRepository;
import com.prangyajeet.labtrack.item.entity.Item;
import com.prangyajeet.labtrack.item.entity.ItemType;
import com.prangyajeet.labtrack.item.repository.ItemRepository;
import com.prangyajeet.labtrack.report.dto.ReportChartPointDTO;
import com.prangyajeet.labtrack.report.dto.ReportMetricDTO;
import com.prangyajeet.labtrack.report.dto.ReportResponseDTO;
import com.prangyajeet.labtrack.report.dto.ReportRowDTO;
import com.prangyajeet.labtrack.report.entity.ReportType;
import com.prangyajeet.labtrack.report.service.ReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private final ItemRepository itemRepository;

    private final InventoryTransactionRepository transactionRepository;

    private final EquipmentRepository equipmentRepository;

    private final MaintenanceLogRepository maintenanceLogRepository;

    private final BreakageRecordRepository breakageRecordRepository;


    public ReportServiceImpl(
            ItemRepository itemRepository,
            InventoryTransactionRepository transactionRepository,
            EquipmentRepository equipmentRepository,
            MaintenanceLogRepository maintenanceLogRepository,
            BreakageRecordRepository breakageRecordRepository) {

        this.itemRepository = itemRepository;

        this.transactionRepository = transactionRepository;

        this.equipmentRepository = equipmentRepository;

        this.maintenanceLogRepository = maintenanceLogRepository;

        this.breakageRecordRepository = breakageRecordRepository;
    }


    // ============================================================
    // GENERATE REPORT
    // ============================================================

    @Override
    public ReportResponseDTO generateReport(
            LocalDate fromDate,
            LocalDate toDate,
            Long departmentId,
            ReportType reportType) {

        validateDates(
                fromDate,
                toDate
        );

        if (reportType == null) {
            reportType = ReportType.FULL_REPORT;
        }


        ReportResponseDTO response =
                new ReportResponseDTO();

        response.setSuccess(true);

        response.setMessage(
                "Report generated successfully."
        );

        response.setFromDate(fromDate);

        response.setToDate(toDate);

        response.setDepartmentId(departmentId);

        response.setReportType(reportType);


        // ------------------------------------------------------------
        // LOAD ACTIVE DATA
        // ------------------------------------------------------------

        List<Item> items =
                activeItems();

        List<InventoryTransaction> transactions =
                activeTransactions();

        List<Equipment> equipment =
                activeEquipment();

        List<MaintenanceLog> maintenanceLogs =
                activeMaintenanceLogs();

        List<BreakageRecord> breakages =
                activeBreakages();


        // ------------------------------------------------------------
        // DEPARTMENT FILTERED MASTER DATA
        // ------------------------------------------------------------

        List<Item> filteredItems =
                items.stream()
                        .filter(
                                item ->
                                        departmentMatchesItem(
                                                item,
                                                departmentId
                                        )
                        )
                        .toList();

        List<Equipment> filteredEquipment =
                equipment.stream()
                        .filter(
                                equipmentItem ->
                                        departmentMatchesEquipment(
                                                equipmentItem,
                                                departmentId
                                        )
                        )
                        .toList();

        List<MaintenanceLog> filteredMaintenanceLogs =
                maintenanceLogs.stream()
                        .filter(
                                log ->
                                        departmentMatchesMaintenance(
                                                log,
                                                departmentId
                                        )
                        )
                        .toList();


        // ------------------------------------------------------------
        // ITEM LOOKUP
        // ------------------------------------------------------------

        Map<String, Item> itemsByCode =
                items.stream()
                        .filter(
                                item ->
                                        item.getItemCode() != null
                        )
                        .collect(
                                Collectors.toMap(
                                        Item::getItemCode,
                                        item -> item,
                                        (first, second) -> first
                                )
                        );


        // ------------------------------------------------------------
        // DATE RANGE TRANSACTIONS
        // ------------------------------------------------------------

        List<InventoryTransaction> rangeTransactions =
                transactions.stream()
                        .filter(
                                transaction ->
                                        inDateRange(
                                                transaction.getTransactionDate(),
                                                fromDate,
                                                toDate
                                        )
                        )
                        .filter(
                                transaction ->
                                        departmentMatchesTransaction(
                                                transaction,
                                                departmentId,
                                                itemsByCode
                                        )
                        )
                        .toList();


        // ------------------------------------------------------------
        // DATE RANGE BREAKAGES
        // ------------------------------------------------------------

        List<BreakageRecord> rangeBreakages =
                breakages.stream()
                        .filter(
                                breakage ->
                                        inDateRange(
                                                breakage.getBreakageDateTime(),
                                                fromDate,
                                                toDate
                                        )
                        )
                        .filter(
                                breakage ->
                                        departmentMatchesBreakage(
                                                breakage,
                                                departmentId
                                        )
                        )
                        .toList();


        // ------------------------------------------------------------
        // CHARTS
        // ------------------------------------------------------------

        buildCharts(
                response,
                rangeTransactions,
                rangeBreakages,
                itemsByCode
        );


        // ------------------------------------------------------------
        // SUMMARY METRICS
        // ------------------------------------------------------------

        addSummaryMetrics(
                response,
                filteredItems,
                rangeTransactions,
                rangeBreakages,
                filteredEquipment,
                filteredMaintenanceLogs
        );


        // ============================================================
        // REPORT TYPE
        // ============================================================

        switch (reportType) {

            case FULL_REPORT:

                buildFullReport(
                        response,
                        filteredItems,
                        rangeTransactions,
                        filteredEquipment,
                        filteredMaintenanceLogs,
                        rangeBreakages
                );

                break;


            case INVENTORY_STOCK:

                buildInventoryStock(
                        response,
                        filteredItems
                );

                break;


            case LOW_STOCK:

                buildLowStock(
                        response,
                        filteredItems
                );

                break;


            case OUT_OF_STOCK:

                buildOutOfStock(
                        response,
                        filteredItems
                );

                break;


            case STOCK_IN:

                buildTransactionReport(
                        response,
                        rangeTransactions,
                        TransactionType.STOCK_IN
                );

                break;


            case STOCK_OUT:

                buildTransactionReport(
                        response,
                        rangeTransactions,
                        TransactionType.STOCK_OUT
                );

                break;


            case DAILY_CONSUMABLES:

                buildDailyConsumables(
                        response,
                        rangeTransactions,
                        filteredItems.stream()
                                .filter(item -> item.getItemCode() != null)
                                .collect(
                                        Collectors.toMap(
                                                Item::getItemCode,
                                                item -> item,
                                                (first, second) -> first
                                        )
                                )
                );

                break;


            case EXPIRY:

                buildExpiry(
                        response,
                        filteredItems,
                        fromDate,
                        toDate
                );

                break;


            case SUPPLIER_PURCHASES:

                buildSupplierPurchases(
                        response,
                        filteredItems,
                        fromDate,
                        toDate
                );

                break;


            case SUPPLIER_ITEMS:

                buildSupplierItems(
                        response,
                        filteredItems
                );

                break;


            case EQUIPMENT_REGISTER:

                buildEquipmentRegister(
                        response,
                        filteredEquipment
                );

                break;


            case WARRANTY:

                buildWarranty(
                        response,
                        filteredEquipment,
                        fromDate,
                        toDate
                );

                break;


            case AMC:

                buildAmc(
                        response,
                        filteredEquipment
                );

                break;


            case AMC_EXPIRY:

                buildAmcExpiry(
                        response,
                        filteredEquipment,
                        fromDate,
                        toDate
                );

                break;


            case MAINTENANCE_HISTORY:

                buildMaintenanceHistory(
                        response,
                        filteredMaintenanceLogs,
                        fromDate,
                        toDate
                );

                break;


            case MAINTENANCE_COST:

                buildMaintenanceCost(
                        response,
                        filteredMaintenanceLogs,
                        fromDate,
                        toDate
                );

                break;


            case BREAKAGE_REGISTER:

                buildBreakageRegister(
                        response,
                        rangeBreakages
                );

                break;


            case DEPARTMENT_BREAKAGE:

                buildDepartmentBreakage(
                        response,
                        rangeBreakages
                );

                break;


            case PERSON_BREAKAGE:

                buildPersonBreakage(
                        response,
                        rangeBreakages
                );

                break;


            case PENDING_RECOVERY:

                buildRecovery(
                        response,
                        rangeBreakages,
                        BreakageRecoveryStatus.PENDING
                );

                break;


            case PAID_RECOVERY:

                buildRecovery(
                        response,
                        rangeBreakages,
                        BreakageRecoveryStatus.PAID
                );

                break;


            case WAIVED_RECOVERY:

                buildRecovery(
                        response,
                        rangeBreakages,
                        BreakageRecoveryStatus.WAIVED
                );

                break;


            case BREAKAGE_COST:

                buildBreakageCost(
                        response,
                        rangeBreakages
                );

                break;
        }


        return response;
    }


    // ============================================================
    // VALIDATION
    // ============================================================

    private void validateDates(
            LocalDate fromDate,
            LocalDate toDate) {

        if (fromDate == null || toDate == null) {

            throw new IllegalArgumentException(
                    "Report dates are required."
            );
        }


        if (fromDate.isAfter(toDate)) {

            throw new IllegalArgumentException(
                    "Report start date cannot be after end date."
            );
        }
    }


    // ============================================================
    // ACTIVE DATA
    // ============================================================

    private List<Item> activeItems() {

        return itemRepository.findAllByStatus(
                Status.ACTIVE
        );
    }


    private List<InventoryTransaction> activeTransactions() {

        return transactionRepository
                .findAll()
                .stream()
                .filter(
                        transaction ->
                                transaction.getStatus()
                                        == Status.ACTIVE
                )
                .toList();
    }


    private List<Equipment> activeEquipment() {

        return equipmentRepository
                .findAll()
                .stream()
                .filter(
                        equipment ->
                                equipment.getStatus()
                                        == Status.ACTIVE
                )
                .toList();
    }


    private List<MaintenanceLog> activeMaintenanceLogs() {

        return maintenanceLogRepository.findAll();
    }


    private List<BreakageRecord> activeBreakages() {

        return breakageRecordRepository
                .findAllByStatus(
                        Status.ACTIVE
                );
    }


    // ============================================================
    // DATE RANGE
    // ============================================================

    private boolean inDateRange(
            LocalDateTime value,
            LocalDate fromDate,
            LocalDate toDate) {

        if (value == null) {
            return false;
        }


        LocalDate date =
                value.toLocalDate();


        return !date.isBefore(fromDate)
                && !date.isAfter(toDate);
    }


    private boolean inDateRange(
            LocalDate value,
            LocalDate fromDate,
            LocalDate toDate) {

        if (value == null) {
            return false;
        }


        return !value.isBefore(fromDate)
                && !value.isAfter(toDate);
    }


    // ============================================================
    // DEPARTMENT FILTER
    // ============================================================

    private boolean departmentMatchesTransaction(
            InventoryTransaction transaction,
            Long departmentId,
            Map<String, Item> itemsByCode) {

        if (departmentId == null) {
            return true;
        }

        if (transaction == null) {
            return false;
        }

        // Prefer the transaction's explicit department when it exists.
        if (transaction.getDepartment() != null
                && transaction.getDepartment().getId() != null) {

            return departmentId.equals(
                    transaction.getDepartment().getId()
            );
        }

        // Older transactions may have a NULL department_id.
        // In that case, derive the department from the transaction's item.
        if (transaction.getInventoryItem() == null
                || transaction.getInventoryItem().getItemCode() == null
                || itemsByCode == null) {

            return false;
        }

        Item item =
                itemsByCode.get(
                        transaction
                                .getInventoryItem()
                                .getItemCode()
                );

        return departmentMatchesItem(
                item,
                departmentId
        );
    }


    private boolean departmentMatchesBreakage(
            BreakageRecord record,
            Long departmentId) {

        if (departmentId == null) {
            return true;
        }

        if (record == null
                || record.getInventoryItem() == null) {
            return false;
        }

        Item item = record.getInventoryItem();

        return departmentMatchesItem(
                item,
                departmentId
        );
    }


    private boolean departmentMatchesItem(
            Item item,
            Long departmentId) {

        if (departmentId == null) {
            return true;
        }

        if (item == null
                || item.getCategory() == null
                || item.getCategory().getDepartment() == null
                || item.getCategory().getDepartment().getId() == null) {
            return false;
        }

        return departmentId.equals(
                item.getCategory()
                        .getDepartment()
                        .getId()
        );
    }


    private boolean departmentMatchesEquipment(
            Equipment equipment,
            Long departmentId) {

        if (departmentId == null) {
            return true;
        }

        if (equipment == null
                || equipment.getDepartment() == null
                || equipment.getDepartment().getId() == null) {
            return false;
        }

        return departmentId.equals(
                equipment.getDepartment().getId()
        );
    }


    private boolean departmentMatchesMaintenance(
            MaintenanceLog log,
            Long departmentId) {

        if (departmentId == null) {
            return true;
        }

        if (log == null
                || log.getEquipment() == null) {
            return false;
        }

        return departmentMatchesEquipment(
                log.getEquipment(),
                departmentId
        );
    }


    // ============================================================
    // CHARTS
    // ============================================================

    private void buildCharts(
            ReportResponseDTO response,
            List<InventoryTransaction> transactions,
            List<BreakageRecord> breakages,
            Map<String, Item> itemsByCode) {

        LocalDate end =
                response.getToDate();


        YearMonth lastMonth =
                YearMonth.from(end);


        List<ReportChartPointDTO> usage =
                new ArrayList<>();

        List<ReportChartPointDTO> broken =
                new ArrayList<>();


        /*
         * Last 6 months
         */
        for (
                int offset = 5;
                offset >= 0;
                offset--
        ) {

            YearMonth month =
                    lastMonth.minusMonths(offset);


            String label =
                    month.format(
                            DateTimeFormatter.ofPattern(
                                    "MMM"
                            )
                    );


            // --------------------------------------------------------
            // CONSUMABLE USAGE
            // --------------------------------------------------------

            int usageValue =
                    transactions.stream()

                            .filter(
                                    transaction ->
                                            transaction.getTransactionType()
                                                    == TransactionType.STOCK_OUT
                            )

                            .filter(
                                    transaction ->
                                            transaction.getTransactionDate()
                                                    != null
                            )

                            .filter(
                                    transaction ->
                                            YearMonth.from(
                                                    transaction.getTransactionDate()
                                            ).equals(month)
                            )

                            .filter(
                                    transaction ->
                                            isConsumable(
                                                    transaction,
                                                    itemsByCode
                                            )
                            )

                            .map(
                                    InventoryTransaction::getQuantity
                            )

                            .filter(
                                    Objects::nonNull
                            )

                            .mapToInt(
                                    Integer::intValue
                            )

                            .sum();


            // --------------------------------------------------------
            // BREAKAGE
            // --------------------------------------------------------

            int breakageValue =
                    breakages.stream()

                            .filter(
                                    breakage ->
                                            breakage.getBreakageDateTime()
                                                    != null
                            )

                            .filter(
                                    breakage ->
                                            YearMonth.from(
                                                    breakage.getBreakageDateTime()
                                            ).equals(month)
                            )

                            .map(
                                    BreakageRecord::getQuantity
                            )

                            .filter(
                                    Objects::nonNull
                            )

                            .mapToInt(
                                    Integer::intValue
                            )

                            .sum();


            usage.add(
                    new ReportChartPointDTO(
                            label,
                            usageValue
                    )
            );


            broken.add(
                    new ReportChartPointDTO(
                            label,
                            breakageValue
                    )
            );
        }


        response.setConsumableUsage(
                usage
        );

        response.setBreakages(
                broken
        );
    }


    // ============================================================
    // CONSUMABLE CHECK
    // ============================================================

    private boolean isConsumable(
            InventoryTransaction transaction,
            Map<String, Item> itemsByCode) {

        if (
                transaction == null
                        || transaction.getInventoryItem() == null
        ) {

            return false;
        }


        String itemCode =
                transaction
                        .getInventoryItem()
                        .getItemCode();


        if (itemCode == null) {
            return false;
        }


        Item item =
                itemsByCode.get(itemCode);


        return item != null
                && item.getItemType()
                == ItemType.CONSUMABLE;
    }


    // ============================================================
    // SUMMARY METRICS
    // ============================================================

    private void addSummaryMetrics(
            ReportResponseDTO response,
            List<Item> items,
            List<InventoryTransaction> transactions,
            List<BreakageRecord> breakages,
            List<Equipment> equipment,
            List<MaintenanceLog> maintenanceLogs) {


        // --------------------------------------------------------
        // TOTAL ITEMS
        // --------------------------------------------------------

        long totalItems =
                items.size();


        // --------------------------------------------------------
        // CONSUMABLE LOGS
        // --------------------------------------------------------

        long consumableLogs =
                transactions.stream()

                        .filter(
                                transaction ->
                                        transaction.getTransactionType()
                                                == TransactionType.STOCK_OUT
                        )

                        .filter(
                                transaction ->
                                        transaction.getTransactionDate()
                                                != null
                        )

                        .filter(
                                transaction ->
                                        !transaction
                                                .getTransactionDate()
                                                .toLocalDate()
                                                .isBefore(
                                                        response.getFromDate()
                                                )
                        )

                        .filter(
                                transaction ->
                                        !transaction
                                                .getTransactionDate()
                                                .toLocalDate()
                                                .isAfter(
                                                        response.getToDate()
                                                )
                        )

                        .filter(
                                transaction -> {

                                    if (
                                            transaction.getInventoryItem()
                                                    == null
                                    ) {
                                        return false;
                                    }


                                    String itemCode =
                                            transaction
                                                    .getInventoryItem()
                                                    .getItemCode();


                                    Item item =
                                            items.stream()
                                                    .filter(
                                                            currentItem ->
                                                                    Objects.equals(
                                                                            currentItem
                                                                                    .getItemCode(),
                                                                            itemCode
                                                                    )
                                                    )
                                                    .findFirst()
                                                    .orElse(null);


                                    return item != null
                                            && item.getItemType()
                                            == ItemType.CONSUMABLE;
                                }
                        )

                        .count();


        // --------------------------------------------------------
        // BREAKAGE COST
        // --------------------------------------------------------

        BigDecimal breakageCost =
                breakages.stream()

                        .map(
                                BreakageRecord::getEstimatedCost
                        )

                        .filter(
                                Objects::nonNull
                        )

                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );


        // --------------------------------------------------------
        // ACTIVE AMC
        // --------------------------------------------------------

        long activeAmc =
                equipment.stream()

                        .filter(
                                equipmentItem ->
                                        equipmentItem.getAmcEnd()
                                                != null
                        )

                        .filter(
                                equipmentItem ->
                                        !equipmentItem
                                                .getAmcEnd()
                                                .isBefore(
                                                        LocalDate.now()
                                                )
                        )

                        .count();


        // --------------------------------------------------------
        // PENDING RECOVERY
        // --------------------------------------------------------

        long pendingRecovery =
                breakages.stream()

                        .filter(
                                breakage ->
                                        breakage.getRecoveryStatus()
                                                == BreakageRecoveryStatus.PENDING
                        )

                        .count();


        // --------------------------------------------------------
        // TOTAL ITEMS
        // --------------------------------------------------------

        response.getMetrics().add(
                new ReportMetricDTO(
                        "Total Items",
                        String.valueOf(
                                totalItems
                        ),
                        "—"
                )
        );


        // --------------------------------------------------------
        // CONSUMABLE LOGS
        // --------------------------------------------------------

        response.getMetrics().add(
                new ReportMetricDTO(
                        "Consumable Logs",
                        String.valueOf(
                                consumableLogs
                        ),
                        "—"
                )
        );


        // --------------------------------------------------------
        // BREAKAGES
        // --------------------------------------------------------

        response.getMetrics().add(
                new ReportMetricDTO(
                        "Breakages",
                        String.valueOf(
                                breakages.size()
                        ),
                        "—"
                )
        );


        // --------------------------------------------------------
        // ITEMS ISSUED / PENDING RETURN
        // --------------------------------------------------------

        long issuedTransactions =
                transactions.stream()

                        .filter(
                                transaction ->
                                        transaction.getTransactionType()
                                                == TransactionType.STOCK_OUT
                        )

                        .count();


        response.getMetrics().add(
                new ReportMetricDTO(
                        "Items Issued / Pending Return",
                        String.valueOf(
                                issuedTransactions
                        ),
                        "—"
                )
        );


        // --------------------------------------------------------
        // BREAKAGE COST
        // --------------------------------------------------------

        response.getMetrics().add(
                new ReportMetricDTO(
                        "Breakage Cost",
                        "₹" + breakageCost,
                        "—"
                )
        );


        // --------------------------------------------------------
        // AMC ACTIVE
        // --------------------------------------------------------

        response.getMetrics().add(
                new ReportMetricDTO(
                        "AMC Active",
                        String.valueOf(
                                activeAmc
                        ),
                        "—"
                )
        );


        // --------------------------------------------------------
        // PENDING BREAKAGE RECOVERY
        // --------------------------------------------------------

        response.getMetrics().add(
                new ReportMetricDTO(
                        "Pending Breakage Recovery",
                        String.valueOf(
                                pendingRecovery
                        ),
                        "—"
                )
        );
    }


    // ============================================================
    // FULL REPORT
    // ============================================================

    private void buildFullReport(
            ReportResponseDTO response,
            List<Item> items,
            List<InventoryTransaction> transactions,
            List<Equipment> equipment,
            List<MaintenanceLog> maintenanceLogs,
            List<BreakageRecord> breakages) {


        // --------------------------------------------------------
        // INVENTORY / ITEMS
        // --------------------------------------------------------

        buildInventoryStock(
                response,
                items
        );


        // --------------------------------------------------------
        // STOCK IN
        // --------------------------------------------------------

        buildTransactionReport(
                response,
                transactions,
                TransactionType.STOCK_IN
        );


        // --------------------------------------------------------
        // STOCK OUT
        // --------------------------------------------------------

        buildTransactionReport(
                response,
                transactions,
                TransactionType.STOCK_OUT
        );


        // --------------------------------------------------------
        // EXPIRY
        // --------------------------------------------------------

        buildExpiry(
                response,
                items,
                response.getFromDate(),
                response.getToDate()
        );


        // --------------------------------------------------------
        // SUPPLIER-WISE PURCHASES
        // --------------------------------------------------------

        buildSupplierPurchases(
                response,
                items,
                response.getFromDate(),
                response.getToDate()
        );


        // --------------------------------------------------------
        // SUPPLIER-WISE ITEMS
        // --------------------------------------------------------

        buildSupplierItems(
                response,
                items
        );


        // --------------------------------------------------------
        // EQUIPMENT REGISTER
        // --------------------------------------------------------

        buildEquipmentRegister(
                response,
                equipment
        );


        // --------------------------------------------------------
        // WARRANTY
        // --------------------------------------------------------

        buildWarranty(
                response,
                equipment,
                response.getFromDate(),
                response.getToDate()
        );


        // --------------------------------------------------------
        // AMC
        // --------------------------------------------------------

        buildAmc(
                response,
                equipment
        );


        // --------------------------------------------------------
        // AMC EXPIRY
        // --------------------------------------------------------

        buildAmcExpiry(
                response,
                equipment,
                response.getFromDate(),
                response.getToDate()
        );


        // --------------------------------------------------------
        // MAINTENANCE HISTORY
        // --------------------------------------------------------

        buildMaintenanceHistory(
                response,
                maintenanceLogs,
                response.getFromDate(),
                response.getToDate()
        );


        // --------------------------------------------------------
        // MAINTENANCE COST
        // --------------------------------------------------------

        buildMaintenanceCost(
                response,
                maintenanceLogs,
                response.getFromDate(),
                response.getToDate()
        );


        // --------------------------------------------------------
        // BREAKAGE REGISTER
        // --------------------------------------------------------

        buildBreakageRegister(
                response,
                breakages
        );


        // --------------------------------------------------------
        // DEPARTMENT-WISE BREAKAGE
        // --------------------------------------------------------

        buildDepartmentBreakage(
                response,
                breakages
        );


        // --------------------------------------------------------
        // PERSON-WISE BREAKAGE
        // --------------------------------------------------------

        buildPersonBreakage(
                response,
                breakages
        );


        // --------------------------------------------------------
        // RECOVERY
        // --------------------------------------------------------

        buildRecovery(
                response,
                breakages,
                BreakageRecoveryStatus.PENDING
        );

        buildRecovery(
                response,
                breakages,
                BreakageRecoveryStatus.PAID
        );

        buildRecovery(
                response,
                breakages,
                BreakageRecoveryStatus.WAIVED
        );


        // --------------------------------------------------------
        // BREAKAGE COST
        // --------------------------------------------------------

        buildBreakageCost(
                response,
                breakages
        );
    }

    // ============================================================
    // INVENTORY STOCK
    // ============================================================

    private void buildInventoryStock(
            ReportResponseDTO response,
            List<Item> items) {


        for (Item item : items) {

            Map<String, Object> row =
                    new LinkedHashMap<>();


            row.put(
                    "itemCode",
                    item.getItemCode()
            );

            row.put(
                    "itemName",
                    item.getItemName()
            );

            row.put(
                    "category",
                    item.getCategory()
            );

            row.put(
                    "type",
                    item.getItemType()
            );

            row.put(
                    "unit",
                    item.getUnit()
            );

            row.put(
                    "openingStock",
                    item.getOpeningStock()
            );

            row.put(
                    "currentStock",
                    item.getCurrentStock()
            );

            row.put(
                    "minimumStock",
                    item.getMinimumStock()
            );

            row.put(
                    "maximumStock",
                    item.getMaximumStock()
            );

            row.put(
                    "supplier",
                    item.getSupplierName()
            );

            row.put(
                    "storageLocation",
                    item.getStorageLocation()
            );

            row.put(
                    "expiryDate",
                    item.getExpiryDate()
            );


            addRow(
                    response,
                    row
            );
        }
    }


    // ============================================================
    // LOW STOCK
    // ============================================================

    private void buildLowStock(
            ReportResponseDTO response,
            List<Item> items) {


        items.stream()

                .filter(
                        item ->
                                item.getCurrentStock()
                                        != null
                )

                .filter(
                        item ->
                                item.getMinimumStock()
                                        != null
                )

                .filter(
                        item ->
                                item.getCurrentStock()
                                        > 0
                )

                .filter(
                        item ->
                                item.getCurrentStock()
                                        <= item.getMinimumStock()
                )

                .forEach(
                        item -> {

                            Map<String, Object> row =
                                    new LinkedHashMap<>();


                            row.put(
                                    "itemCode",
                                    item.getItemCode()
                            );

                            row.put(
                                    "itemName",
                                    item.getItemName()
                            );

                            row.put(
                                    "currentStock",
                                    item.getCurrentStock()
                            );

                            row.put(
                                    "minimumStock",
                                    item.getMinimumStock()
                            );

                            row.put(
                                    "reorderQuantity",
                                    item.getReorderQuantity()
                            );

                            row.put(
                                    "supplier",
                                    item.getSupplierName()
                            );


                            addRow(
                                    response,
                                    row
                            );
                        }
                );
    }


    // ============================================================
    // OUT OF STOCK
    // ============================================================

    private void buildOutOfStock(
            ReportResponseDTO response,
            List<Item> items) {


        items.stream()

                .filter(
                        item ->
                                Objects.equals(
                                        item.getCurrentStock(),
                                        0
                                )
                )

                .forEach(
                        item -> {

                            Map<String, Object> row =
                                    new LinkedHashMap<>();


                            row.put(
                                    "itemCode",
                                    item.getItemCode()
                            );

                            row.put(
                                    "itemName",
                                    item.getItemName()
                            );

                            row.put(
                                    "itemType",
                                    item.getItemType()
                            );

                            row.put(
                                    "minimumStock",
                                    item.getMinimumStock()
                            );

                            row.put(
                                    "supplier",
                                    item.getSupplierName()
                            );


                            addRow(
                                    response,
                                    row
                            );
                        }
                );
    }


    // ============================================================
    // TRANSACTION REPORT
    // ============================================================

    private void buildTransactionReport(
            ReportResponseDTO response,
            List<InventoryTransaction> transactions,
            TransactionType type) {


        transactions.stream()

                .filter(
                        transaction ->
                                transaction.getTransactionType()
                                        == type
                )

                .sorted(
                        Comparator.comparing(
                                InventoryTransaction::getTransactionDate,
                                Comparator.nullsLast(
                                        Comparator.reverseOrder()
                                )
                        )
                )

                .forEach(
                        transaction ->
                                addRow(
                                        response,
                                        transactionRow(
                                                transaction
                                        )
                                )
                );
    }


    // ============================================================
    // DAILY CONSUMABLES
    // ============================================================

    private void buildDailyConsumables(
            ReportResponseDTO response,
            List<InventoryTransaction> transactions,
            Map<String, Item> itemsByCode) {


        transactions.stream()

                .filter(
                        transaction ->
                                transaction.getTransactionType()
                                        == TransactionType.STOCK_OUT
                )

                .filter(
                        transaction ->
                                isConsumable(
                                        transaction,
                                        itemsByCode
                                )
                )

                .sorted(
                        Comparator.comparing(
                                InventoryTransaction::getTransactionDate,
                                Comparator.nullsLast(
                                        Comparator.reverseOrder()
                                )
                        )
                )

                .forEach(
                        transaction ->
                                addRow(
                                        response,
                                        transactionRow(
                                                transaction
                                        )
                                )
                );
    }


    // ============================================================
    // EXPIRY
    // ============================================================

    private void buildExpiry(
            ReportResponseDTO response,
            List<Item> items,
            LocalDate fromDate,
            LocalDate toDate) {


        items.stream()

                .filter(
                        item ->
                                item.getExpiryDate()
                                        != null
                )

                .filter(
                        item ->
                                inDateRange(
                                        item.getExpiryDate(),
                                        fromDate,
                                        toDate
                                )
                                ||
                                item.getExpiryDate()
                                        .isBefore(fromDate)
                )

                .sorted(
                        Comparator.comparing(
                                Item::getExpiryDate
                        )
                )

                .forEach(
                        item -> {

                            Map<String, Object> row =
                                    new LinkedHashMap<>();


                            row.put(
                                    "itemCode",
                                    item.getItemCode()
                            );

                            row.put(
                                    "itemName",
                                    item.getItemName()
                            );

                            row.put(
                                    "category",
                                    item.getCategory()
                            );

                            row.put(
                                    "expiryDate",
                                    item.getExpiryDate()
                            );

                            row.put(
                                    "currentStock",
                                    item.getCurrentStock()
                            );

                            row.put(
                                    "supplier",
                                    item.getSupplierName()
                            );

                            row.put(
                                    "status",
                                    item.getExpiryDate()
                                            .isBefore(
                                                    LocalDate.now()
                                            )
                                            ? "EXPIRED"
                                            : "EXPIRING"
                            );


                            addRow(
                                    response,
                                    row
                            );
                        }
                );
    }


    // ============================================================
    // SUPPLIER PURCHASES
    // ============================================================

    private void buildSupplierPurchases(
            ReportResponseDTO response,
            List<Item> items,
            LocalDate fromDate,
            LocalDate toDate) {


        items.stream()

                .filter(
                        item ->
                                inDateRange(
                                        item.getPurchaseDate(),
                                        fromDate,
                                        toDate
                                )
                )

                .forEach(
                        item -> {

                            Map<String, Object> row =
                                    new LinkedHashMap<>();


                            row.put(
                                    "supplier",
                                    item.getSupplierName()
                            );

                            row.put(
                                    "itemCode",
                                    item.getItemCode()
                            );

                            row.put(
                                    "itemName",
                                    item.getItemName()
                            );

                            row.put(
                                    "purchaseDate",
                                    item.getPurchaseDate()
                            );

                            row.put(
                                    "purchasePrice",
                                    item.getPurchasePrice()
                            );

                            row.put(
                                    "invoiceNumber",
                                    item.getInvoiceNumber()
                            );

                            row.put(
                                    "purchaseOrderNumber",
                                    item.getPurchaseOrderNumber()
                            );

                            row.put(
                                    "batchNumber",
                                    item.getBatchNumber()
                            );


                            addRow(
                                    response,
                                    row
                            );
                        }
                );
    }


    // ============================================================
    // SUPPLIER ITEMS
    // ============================================================

    private void buildSupplierItems(
            ReportResponseDTO response,
            List<Item> items) {


        Map<String, List<Item>> grouped =
                items.stream()
                        .collect(
                                Collectors.groupingBy(
                                        item ->
                                                safe(
                                                        item.getSupplierName(),
                                                        "Unknown Supplier"
                                                ),
                                        LinkedHashMap::new,
                                        Collectors.toList()
                                )
                        );


        grouped.forEach(
                (supplier, supplierItems) -> {

                    Map<String, Object> row =
                            new LinkedHashMap<>();


                    row.put(
                            "supplier",
                            supplier
                    );

                    row.put(
                            "itemCount",
                            supplierItems.size()
                    );


                    row.put(
                            "totalCurrentStock",
                            supplierItems.stream()

                                    .map(
                                            Item::getCurrentStock
                                    )

                                    .filter(
                                            Objects::nonNull
                                    )

                                    .mapToInt(
                                            Integer::intValue
                                    )

                                    .sum()
                    );


                    row.put(
                            "totalPurchaseValue",
                            supplierItems.stream()

                                    .map(
                                            Item::getPurchasePrice
                                    )

                                    .filter(
                                            Objects::nonNull
                                    )

                                    .reduce(
                                            BigDecimal.ZERO,
                                            BigDecimal::add
                                    )
                    );


                    addRow(
                            response,
                            row
                    );
                }
        );
    }


    // ============================================================
    // EQUIPMENT REGISTER
    // ============================================================

    private void buildEquipmentRegister(
            ReportResponseDTO response,
            List<Equipment> equipment) {


        equipment.forEach(
                equipmentItem -> {

                    Map<String, Object> row =
                            new LinkedHashMap<>();


                    row.put(
                            "equipmentCode",
                            equipmentItem.getEquipmentCode()
                    );

                    row.put(
                            "equipmentName",
                            equipmentItem.getEquipmentName()
                    );

                    row.put(
                            "category",
                            equipmentItem.getCategory()
                    );

                    row.put(
                            "manufacturer",
                            equipmentItem.getManufacturer()
                    );

                    row.put(
                            "model",
                            equipmentItem.getModel()
                    );

                    row.put(
                            "serialNumber",
                            equipmentItem.getSerialNumber()
                    );

                    row.put(
                            "purchaseDate",
                            equipmentItem.getPurchaseDate()
                    );

                    row.put(
                            "purchaseCost",
                            equipmentItem.getPurchaseCost()
                    );

                    row.put(
                            "warrantyUntil",
                            equipmentItem.getWarrantyUntil()
                    );

                    row.put(
                            "location",
                            equipmentItem.getLocation()
                    );

                    row.put(
                            "status",
                            equipmentItem.getStatus()
                    );


                    addRow(
                            response,
                            row
                    );
                }
        );
    }


    // ============================================================
    // WARRANTY
    // ============================================================

    private void buildWarranty(
            ReportResponseDTO response,
            List<Equipment> equipment,
            LocalDate fromDate,
            LocalDate toDate) {


        equipment.stream()

                .filter(
                        item ->
                                item.getWarrantyUntil()
                                        != null
                )

                .filter(
                        item ->
                                inDateRange(
                                        item.getWarrantyUntil(),
                                        fromDate,
                                        toDate
                                )
                                ||
                                item.getWarrantyUntil()
                                        .isBefore(fromDate)
                )

                .sorted(
                        Comparator.comparing(
                                Equipment::getWarrantyUntil
                        )
                )

                .forEach(
                        item -> {

                            Map<String, Object> row =
                                    new LinkedHashMap<>();


                            row.put(
                                    "equipmentCode",
                                    item.getEquipmentCode()
                            );

                            row.put(
                                    "equipmentName",
                                    item.getEquipmentName()
                            );

                            row.put(
                                    "manufacturer",
                                    item.getManufacturer()
                            );

                            row.put(
                                    "warrantyUntil",
                                    item.getWarrantyUntil()
                            );

                            row.put(
                                    "status",
                                    item.getWarrantyUntil()
                                            .isBefore(
                                                    LocalDate.now()
                                            )
                                            ? "EXPIRED"
                                            : "ACTIVE"
                            );


                            addRow(
                                    response,
                                    row
                            );
                        }
                );
    }


    // ============================================================
    // AMC
    // ============================================================

    private void buildAmc(
            ReportResponseDTO response,
            List<Equipment> equipment) {


        equipment.stream()

                .filter(
                        item ->
                                item.getAmcEnd()
                                        != null
                )

                .forEach(
                        item -> {

                            Map<String, Object> row =
                                    new LinkedHashMap<>();


                            row.put(
                                    "equipmentCode",
                                    item.getEquipmentCode()
                            );

                            row.put(
                                    "equipmentName",
                                    item.getEquipmentName()
                            );

                            row.put(
                                    "provider",
                                    item.getAmcProvider()
                            );

                            row.put(
                                    "contact",
                                    item.getAmcContact()
                            );

                            row.put(
                                    "amcStart",
                                    item.getAmcStart()
                            );

                            row.put(
                                    "amcEnd",
                                    item.getAmcEnd()
                            );

                            row.put(
                                    "costPerYear",
                                    item.getAmcCostPerYear()
                            );

                            row.put(
                                    "amcType",
                                    item.getAmcType()
                            );

                            row.put(
                                    "status",
                                    calculateAmcStatus(
                                            item
                                    )
                            );


                            addRow(
                                    response,
                                    row
                            );
                        }
                );
    }


    // ============================================================
    // AMC EXPIRY
    // ============================================================

    private void buildAmcExpiry(
            ReportResponseDTO response,
            List<Equipment> equipment,
            LocalDate fromDate,
            LocalDate toDate) {


        equipment.stream()

                .filter(
                        item ->
                                item.getAmcEnd()
                                        != null
                )

                .filter(
                        item ->
                                inDateRange(
                                        item.getAmcEnd(),
                                        fromDate,
                                        toDate
                                )
                                ||
                                item.getAmcEnd()
                                        .isBefore(fromDate)
                )

                .sorted(
                        Comparator.comparing(
                                Equipment::getAmcEnd
                        )
                )

                .forEach(
                        item -> {

                            Map<String, Object> row =
                                    new LinkedHashMap<>();


                            row.put(
                                    "equipmentCode",
                                    item.getEquipmentCode()
                            );

                            row.put(
                                    "equipmentName",
                                    item.getEquipmentName()
                            );

                            row.put(
                                    "provider",
                                    item.getAmcProvider()
                            );

                            row.put(
                                    "amcEnd",
                                    item.getAmcEnd()
                            );

                            row.put(
                                    "costPerYear",
                                    item.getAmcCostPerYear()
                            );

                            row.put(
                                    "status",
                                    calculateAmcStatus(
                                            item
                                    )
                            );


                            addRow(
                                    response,
                                    row
                            );
                        }
                );
    }


    // ============================================================
    // MAINTENANCE HISTORY
    // ============================================================

    private void buildMaintenanceHistory(
            ReportResponseDTO response,
            List<MaintenanceLog> logs,
            LocalDate fromDate,
            LocalDate toDate) {


        logs.stream()

                .filter(
                        log ->
                                inDateRange(
                                        log.getMaintenanceDate(),
                                        fromDate,
                                        toDate
                                )
                )

                .sorted(
                        Comparator.comparing(
                                MaintenanceLog::getMaintenanceDate,
                                Comparator.nullsLast(
                                        Comparator.reverseOrder()
                                )
                        )
                )

                .forEach(
                        log -> {

                            Map<String, Object> row =
                                    new LinkedHashMap<>();


                            row.put(
                                    "equipmentCode",
                                    log.getEquipment() == null
                                            ? null
                                            : log.getEquipment()
                                            .getEquipmentCode()
                            );

                            row.put(
                                    "equipmentName",
                                    log.getEquipment() == null
                                            ? null
                                            : log.getEquipment()
                                            .getEquipmentName()
                            );

                            row.put(
                                    "maintenanceDate",
                                    log.getMaintenanceDate()
                            );

                            row.put(
                                    "maintenanceType",
                                    log.getMaintenanceType()
                            );

                            row.put(
                                    "performedBy",
                                    log.getPerformedBy()
                            );

                            row.put(
                                    "cost",
                                    log.getCost()
                            );

                            row.put(
                                    "nextScheduledDate",
                                    log.getNextScheduledDate()
                            );

                            row.put(
                                    "notes",
                                    log.getNotes()
                            );


                            addRow(
                                    response,
                                    row
                            );
                        }
                );
    }


    // ============================================================
    // MAINTENANCE COST
    // ============================================================

    private void buildMaintenanceCost(
            ReportResponseDTO response,
            List<MaintenanceLog> logs,
            LocalDate fromDate,
            LocalDate toDate) {


        Map<String, List<MaintenanceLog>> grouped =
                logs.stream()

                        .filter(
                                log ->
                                        inDateRange(
                                                log.getMaintenanceDate(),
                                                fromDate,
                                                toDate
                                        )
                        )

                        .collect(
                                Collectors.groupingBy(
                                        log ->
                                                safe(
                                                        log.getEquipment() == null
                                                                ? null
                                                                : log.getEquipment()
                                                                .getEquipmentName(),
                                                        "Unknown Equipment"
                                                ),
                                        LinkedHashMap::new,
                                        Collectors.toList()
                                )
                        );


        grouped.forEach(
                (equipmentName, equipmentLogs) -> {

                    BigDecimal total =
                            equipmentLogs.stream()

                                    .map(
                                            MaintenanceLog::getCost
                                    )

                                    .filter(
                                            Objects::nonNull
                                    )

                                    .reduce(
                                            BigDecimal.ZERO,
                                            BigDecimal::add
                                    );


                    Map<String, Object> row =
                            new LinkedHashMap<>();


                    row.put(
                            "equipment",
                            equipmentName
                    );

                    row.put(
                            "maintenanceCount",
                            equipmentLogs.size()
                    );

                    row.put(
                            "totalCost",
                            total
                    );


                    addRow(
                            response,
                            row
                    );
                }
        );
    }


    // ============================================================
    // BREAKAGE REGISTER
    // ============================================================

    private void buildBreakageRegister(
            ReportResponseDTO response,
            List<BreakageRecord> records) {


        records.stream()

                .sorted(
                        Comparator.comparing(
                                BreakageRecord::getBreakageDateTime,
                                Comparator.nullsLast(
                                        Comparator.reverseOrder()
                                )
                        )
                )

                .forEach(
                        record ->
                                addBreakageRow(
                                        response,
                                        record
                                )
                );
    }


    // ============================================================
    // DEPARTMENT BREAKAGE
    // ============================================================

    private void buildDepartmentBreakage(
            ReportResponseDTO response,
            List<BreakageRecord> records) {


        Map<String, List<BreakageRecord>> grouped =
                records.stream()

                        .collect(
                                Collectors.groupingBy(
                                        record ->
                                                safe(
                                                        record.getDepartmentClassSection(),
                                                        "Not Specified"
                                                ),
                                        LinkedHashMap::new,
                                        Collectors.toList()
                                )
                        );


        grouped.forEach(
                (department, departmentRecords) -> {

                    Map<String, Object> row =
                            new LinkedHashMap<>();


                    row.put(
                            "department",
                            department
                    );

                    row.put(
                            "breakageCount",
                            departmentRecords.size()
                    );


                    row.put(
                            "quantity",
                            departmentRecords.stream()

                                    .map(
                                            BreakageRecord::getQuantity
                                    )

                                    .filter(
                                            Objects::nonNull
                                    )

                                    .mapToInt(
                                            Integer::intValue
                                    )

                                    .sum()
                    );


                    row.put(
                            "cost",
                            departmentRecords.stream()

                                    .map(
                                            BreakageRecord::getEstimatedCost
                                    )

                                    .filter(
                                            Objects::nonNull
                                    )

                                    .reduce(
                                            BigDecimal.ZERO,
                                            BigDecimal::add
                                    )
                    );


                    addRow(
                            response,
                            row
                    );
                }
        );
    }


    // ============================================================
    // PERSON BREAKAGE
    // ============================================================

    private void buildPersonBreakage(
            ReportResponseDTO response,
            List<BreakageRecord> records) {


        Map<String, List<BreakageRecord>> grouped =
                records.stream()

                        .collect(
                                Collectors.groupingBy(
                                        record ->
                                                safe(
                                                        record.getResponsibleName(),
                                                        "Not Specified"
                                                ),
                                        LinkedHashMap::new,
                                        Collectors.toList()
                                )
                        );


        grouped.forEach(
                (person, personRecords) -> {

                    Map<String, Object> row =
                            new LinkedHashMap<>();


                    row.put(
                            "person",
                            person
                    );


                    row.put(
                            "personType",
                            personRecords.isEmpty()
                                    ? null
                                    : personRecords
                                    .get(0)
                                    .getPersonType()
                    );


                    row.put(
                            "breakageCount",
                            personRecords.size()
                    );


                    row.put(
                            "quantity",
                            personRecords.stream()

                                    .map(
                                            BreakageRecord::getQuantity
                                    )

                                    .filter(
                                            Objects::nonNull
                                    )

                                    .mapToInt(
                                            Integer::intValue
                                    )

                                    .sum()
                    );


                    row.put(
                            "cost",
                            personRecords.stream()

                                    .map(
                                            BreakageRecord::getEstimatedCost
                                    )

                                    .filter(
                                            Objects::nonNull
                                    )

                                    .reduce(
                                            BigDecimal.ZERO,
                                            BigDecimal::add
                                    )
                    );


                    addRow(
                            response,
                            row
                    );
                }
        );
    }


    // ============================================================
    // RECOVERY
    // ============================================================

    private void buildRecovery(
            ReportResponseDTO response,
            List<BreakageRecord> records,
            BreakageRecoveryStatus status) {


        records.stream()

                .filter(
                        record ->
                                record.getRecoveryStatus()
                                        == status
                )

                .forEach(
                        record ->
                                addBreakageRow(
                                        response,
                                        record
                                )
                );
    }


    // ============================================================
    // BREAKAGE COST
    // ============================================================

    private void buildBreakageCost(
            ReportResponseDTO response,
            List<BreakageRecord> records) {


        Map<String, List<BreakageRecord>> grouped =
                records.stream()

                        .collect(
                                Collectors.groupingBy(
                                        record ->
                                                safe(
                                                        record.getInventoryItem()
                                                                == null
                                                                ? null
                                                                : record
                                                                .getInventoryItem()
                                                                .getItemName(),
                                                        "Unknown Item"
                                                ),
                                        LinkedHashMap::new,
                                        Collectors.toList()
                                )
                        );


        grouped.forEach(
                (item, itemRecords) -> {

                    BigDecimal total =
                            itemRecords.stream()

                                    .map(
                                            BreakageRecord::getEstimatedCost
                                    )

                                    .filter(
                                            Objects::nonNull
                                    )

                                    .reduce(
                                            BigDecimal.ZERO,
                                            BigDecimal::add
                                    );


                    Map<String, Object> row =
                            new LinkedHashMap<>();


                    row.put(
                            "item",
                            item
                    );

                    row.put(
                            "breakageCount",
                            itemRecords.size()
                    );


                    row.put(
                            "quantity",
                            itemRecords.stream()

                                    .map(
                                            BreakageRecord::getQuantity
                                    )

                                    .filter(
                                            Objects::nonNull
                                    )

                                    .mapToInt(
                                            Integer::intValue
                                    )

                                    .sum()
                    );


                    row.put(
                            "totalCost",
                            total
                    );


                    addRow(
                            response,
                            row
                    );
                }
        );
    }


    // ============================================================
    // BREAKAGE ROW
    // ============================================================

    private void addBreakageRow(
            ReportResponseDTO response,
            BreakageRecord record) {


        Map<String, Object> row =
                new LinkedHashMap<>();


        row.put(
                "dateTime",
                record.getBreakageDateTime()
        );


        row.put(
                "item",
                record.getInventoryItem() == null
                        ? null
                        : record.getInventoryItem()
                        .getItemName()
        );


        row.put(
                "itemCode",
                record.getInventoryItem() == null
                        ? null
                        : record.getInventoryItem()
                        .getItemCode()
        );


        row.put(
                "quantity",
                record.getQuantity()
        );


        row.put(
                "responsibleName",
                record.getResponsibleName()
        );


        row.put(
                "personType",
                record.getPersonType()
        );


        row.put(
                "responsibleId",
                record.getResponsibleId()
        );


        row.put(
                "department",
                record.getDepartmentClassSection()
        );


        row.put(
                "cause",
                record.getCause()
        );


        row.put(
                "estimatedCost",
                record.getEstimatedCost()
        );


        row.put(
                "recoveryStatus",
                record.getRecoveryStatus()
        );


        row.put(
                "remarks",
                record.getRemarks()
        );


        addRow(
                response,
                row
        );
    }


    // ============================================================
    // TRANSACTION ROW
    // ============================================================

    private Map<String, Object> transactionRow(
            InventoryTransaction transaction) {


        Map<String, Object> row =
                new LinkedHashMap<>();


        row.put(
                "transactionNumber",
                transaction.getTransactionNumber()
        );


        row.put(
                "itemCode",
                transaction.getInventoryItem() == null
                        ? null
                        : transaction
                        .getInventoryItem()
                        .getItemCode()
        );


        row.put(
                "itemName",
                transaction.getInventoryItem() == null
                        ? null
                        : transaction
                        .getInventoryItem()
                        .getItemName()
        );


        row.put(
                "transactionType",
                transaction.getTransactionType()
        );


        row.put(
                "quantity",
                transaction.getQuantity()
        );


        row.put(
                "transactionDate",
                transaction.getTransactionDate()
        );


        row.put(
                "performedBy",
                transaction.getPerformedBy() == null
                        ? null
                        : transaction
                        .getPerformedBy()
                        .getFullName()
        );


        row.put(
                "remarks",
                transaction.getRemarks()
        );


        return row;
    }


    // ============================================================
    // ADD ROW
    // ============================================================

    private void addRow(
            ReportResponseDTO response,
            Map<String, Object> values) {


        response.getRows().add(
                new ReportRowDTO(
                        values
                )
        );
    }


    // ============================================================
    // AMC STATUS
    // ============================================================

    private String calculateAmcStatus(
            Equipment equipment) {


        if (
                equipment.getAmcEnd()
                        == null
        ) {

            return "NO_AMC";
        }


        LocalDate today =
                LocalDate.now();


        if (
                equipment.getAmcEnd()
                        .isBefore(today)
        ) {

            return "EXPIRED";
        }


        if (
                equipment.getAmcStart() != null
                        &&
                        equipment.getAmcStart()
                                .isAfter(today)
        ) {

            return "NOT_STARTED";
        }


        if (
                !equipment.getAmcEnd()
                        .isAfter(
                                today.plusDays(30)
                        )
        ) {

            return "EXPIRING_SOON";
        }


        return "ACTIVE";
    }


    // ============================================================
    // MAINTENANCE DUE
    // ============================================================

    private boolean calculateMaintenanceDue(
            Equipment equipment) {


        if (
                equipment.getNextMaintenanceDate()
                        == null
        ) {

            return false;
        }


        return !equipment
                .getNextMaintenanceDate()
                .isAfter(
                        LocalDate.now()
                                .plusDays(14)
                );
    }


    // ============================================================
    // SAFE STRING
    // ============================================================

    private String safe(
            String value,
            String fallback) {


        return value == null
                || value.isBlank()
                ? fallback
                : value;
    }
}