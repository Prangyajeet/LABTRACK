package com.prangyajeet.labtrack.sop.service;

import com.prangyajeet.labtrack.sop.dto.SopDocumentResponseDTO;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface SopService {


    List<SopDocumentResponseDTO> getAllSops();


    List<SopDocumentResponseDTO> getSopsByDepartment(

            Long departmentId

    );


    SopDocumentResponseDTO uploadSop(

            Long departmentId,

            MultipartFile file

    );


    byte[] getSopFile(

            Long id

    );


    String getOriginalFileName(

            Long id

    );


    String getContentType(

            Long id

    );


    void deleteSop(

            Long id

    );

}