package com.prangyajeet.labtrack.supplier.entity;

import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.common.entity.AuditableEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "suppliers")
public class Supplier extends AuditableEntity {

    @Column(
            name = "supplier_code",
            nullable = false,
            unique = true,
            length = 30
    )
    private String supplierCode;

    @Column(
            name = "supplier_name",
            nullable = false,
            length = 100
    )
    private String supplierName;

    @Column(
            name = "contact_person",
            nullable = false,
            length = 100
    )
    private String contactPerson;

    @Column(
            name = "email",
            nullable = false,
            length = 100
    )
    private String email;

    @Column(
            name = "phone_number",
            nullable = false,
            length = 20
    )
    private String phoneNumber;

    @Column(
            name = "address_line1",
            nullable = false,
            length = 255
    )
    private String address;

    @Column(
            name = "gst_number",
            nullable = false,
            length = 20
    )
    private String gstNumber;

    @Column(
            name = "status",
            nullable = false,
            length = 20
    )
    private Status status;

    public Supplier() {
    }

    public String getSupplierCode() {
        return supplierCode;
    }

    public void setSupplierCode(String supplierCode) {
        this.supplierCode = supplierCode;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGstNumber() {
        return gstNumber;
    }

    public void setGstNumber(String gstNumber) {
        this.gstNumber = gstNumber;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}