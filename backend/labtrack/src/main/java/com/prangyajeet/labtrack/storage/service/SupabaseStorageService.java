package com.prangyajeet.labtrack.storage.service;

public interface SupabaseStorageService {

    String uploadFile(
            String bucketName,
            String objectPath,
            byte[] fileData,
            String contentType
    );

    byte[] downloadFile(
            String bucketName,
            String objectPath
    );

    void deleteFile(
            String bucketName,
            String objectPath
    );
}