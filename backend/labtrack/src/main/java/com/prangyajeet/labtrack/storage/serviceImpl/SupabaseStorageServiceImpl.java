package com.prangyajeet.labtrack.storage.serviceImpl;

import com.prangyajeet.labtrack.storage.service.SupabaseStorageService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
public class SupabaseStorageServiceImpl
        implements SupabaseStorageService {

    private final String supabaseUrl;
    private final String secretKey;

    private final HttpClient httpClient;

    public SupabaseStorageServiceImpl(
            @Value("${supabase.storage.url}")
            String supabaseUrl,

            @Value("${supabase.storage.secret-key}")
            String secretKey
    ) {

        this.supabaseUrl =
                supabaseUrl
                        .replaceAll("/+$", "");

        this.secretKey =
                secretKey;

        this.httpClient =
                HttpClient.newHttpClient();
    }

    /*
     * ============================================================
     * UPLOAD FILE
     * ============================================================
     */

    @Override
    public String uploadFile(
            String bucketName,
            String objectPath,
            byte[] fileData,
            String contentType
    ) {

        validateParameters(
                bucketName,
                objectPath
        );

        if (fileData == null) {

            throw new IllegalArgumentException(
                    "File data is required."
            );
        }

        String storageUrl =
                buildObjectUrl(
                        bucketName,
                        objectPath
                );

        String resolvedContentType =
                contentType == null
                        || contentType.isBlank()
                        ? "application/octet-stream"
                        : contentType;

        HttpRequest request =
                HttpRequest.newBuilder()
                        .uri(
                                URI.create(
                                        storageUrl
                                )
                        )
                        .header(
                                "apikey",
                                secretKey
                        )
                        .header(
                                "Content-Type",
                                resolvedContentType
                        )
                        .header(
                                "Cache-Control",
                                "3600"
                        )
                        .header(
                                "x-upsert",
                                "false"
                        )
                        .POST(
                                HttpRequest.BodyPublishers.ofByteArray(
                                        fileData
                                )
                        )
                        .build();

        try {

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            int statusCode =
                    response.statusCode();

            if (statusCode < 200
                    || statusCode >= 300) {

                throw new IllegalStateException(
                        "Supabase Storage upload failed. "
                                + "HTTP "
                                + statusCode
                                + ": "
                                + response.body()
                );
            }

            return objectPath;

        } catch (IOException exception) {

            throw new IllegalStateException(
                    "Unable to upload file to Supabase Storage.",
                    exception
            );

        } catch (InterruptedException exception) {

            Thread.currentThread()
                    .interrupt();

            throw new IllegalStateException(
                    "Supabase Storage upload was interrupted.",
                    exception
            );
        }
    }

    /*
     * ============================================================
     * DOWNLOAD FILE
     * ============================================================
     */

    @Override
    public byte[] downloadFile(
            String bucketName,
            String objectPath
    ) {

        validateParameters(
                bucketName,
                objectPath
        );

        String storageUrl =
                buildObjectUrl(
                        bucketName,
                        objectPath
                );

        HttpRequest request =
                HttpRequest.newBuilder()
                        .uri(
                                URI.create(
                                        storageUrl
                                )
                        )
                        .header(
                                "apikey",
                                secretKey
                        )
                        .header(
                                "Authorization",
                                "Bearer " + secretKey
                        )
                        .GET()
                        .build();

        try {

            HttpResponse<byte[]> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofByteArray()
                    );

            int statusCode =
                    response.statusCode();

            if (statusCode < 200
                    || statusCode >= 300) {

                String errorMessage =
                        new String(
                                response.body(),
                                StandardCharsets.UTF_8
                        );

                throw new IllegalStateException(
                        "Supabase Storage download failed. "
                                + "HTTP "
                                + statusCode
                                + ": "
                                + errorMessage
                );
            }

            return response.body();

        } catch (IOException exception) {

            throw new IllegalStateException(
                    "Unable to download file from Supabase Storage.",
                    exception
            );

        } catch (InterruptedException exception) {

            Thread.currentThread()
                    .interrupt();

            throw new IllegalStateException(
                    "Supabase Storage download was interrupted.",
                    exception
            );
        }
    }

    /*
     * ============================================================
     * DELETE FILE
     * ============================================================
     */

    @Override
    public void deleteFile(
            String bucketName,
            String objectPath
    ) {

        validateParameters(
                bucketName,
                objectPath
        );

        String storageUrl =
                buildObjectUrl(
                        bucketName,
                        objectPath
                );

        HttpRequest request =
                HttpRequest.newBuilder()
                        .uri(
                                URI.create(
                                        storageUrl
                                )
                        )
                        .header(
                                "apikey",
                                secretKey
                        )
                        .DELETE()
                        .build();

        try {

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            int statusCode =
                    response.statusCode();

            if (statusCode < 200
                    || statusCode >= 300) {

                throw new IllegalStateException(
                        "Supabase Storage delete failed. "
                                + "HTTP "
                                + statusCode
                                + ": "
                                + response.body()
                );
            }

        } catch (IOException exception) {

            throw new IllegalStateException(
                    "Unable to delete file from Supabase Storage.",
                    exception
            );

        } catch (InterruptedException exception) {

            Thread.currentThread()
                    .interrupt();

            throw new IllegalStateException(
                    "Supabase Storage delete was interrupted.",
                    exception
            );
        }
    }

    /*
     * ============================================================
     * BUILD STORAGE OBJECT URL
     * ============================================================
     */

    private String buildObjectUrl(
            String bucketName,
            String objectPath
    ) {

        String encodedBucket =
                encodePathSegment(
                        bucketName
                );

        String encodedObjectPath =
                encodeObjectPath(
                        objectPath
                );

        return supabaseUrl
                + "/storage/v1/object/"
                + encodedBucket
                + "/"
                + encodedObjectPath;
    }

    /*
     * ============================================================
     * ENCODE OBJECT PATH
     * ============================================================
     */

    private String encodeObjectPath(
            String objectPath
    ) {

        String[] pathSegments =
                objectPath.split("/");

        StringBuilder encodedPath =
                new StringBuilder();

        for (int i = 0;
             i < pathSegments.length;
             i++) {

            if (i > 0) {

                encodedPath.append("/");
            }

            encodedPath.append(
                    encodePathSegment(
                            pathSegments[i]
                    )
            );
        }

        return encodedPath.toString();
    }

    /*
     * ============================================================
     * ENCODE PATH SEGMENT
     * ============================================================
     */

    private String encodePathSegment(
            String value
    ) {

        return URLEncoder
                .encode(
                        value,
                        StandardCharsets.UTF_8
                )
                .replace(
                        "+",
                        "%20"
                );
    }

    /*
     * ============================================================
     * VALIDATION
     * ============================================================
     */

    private void validateParameters(
            String bucketName,
            String objectPath
    ) {

        if (bucketName == null
                || bucketName.isBlank()) {

            throw new IllegalArgumentException(
                    "Storage bucket name is required."
            );
        }

        if (objectPath == null
                || objectPath.isBlank()) {

            throw new IllegalArgumentException(
                    "Storage object path is required."
            );
        }

        if (secretKey == null
                || secretKey.isBlank()) {

            throw new IllegalStateException(
                    "Supabase Storage secret key is not configured."
            );
        }
    }
}
