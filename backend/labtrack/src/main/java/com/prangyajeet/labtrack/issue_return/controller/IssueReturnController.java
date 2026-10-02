package com.prangyajeet.labtrack.issue_return.controller;

import com.prangyajeet.labtrack.issue_return.dto.IssueItemRequestDTO;
import com.prangyajeet.labtrack.issue_return.dto.IssueReturnResponseDTO;
import com.prangyajeet.labtrack.issue_return.dto.IssueReturnSummaryDTO;
import com.prangyajeet.labtrack.issue_return.dto.RecordReturnRequestDTO;
import com.prangyajeet.labtrack.issue_return.enums.IssueStatus;
import com.prangyajeet.labtrack.issue_return.enums.IssuedToType;
import com.prangyajeet.labtrack.issue_return.service.IssueReturnService;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issue-return")
public class IssueReturnController {


    private final IssueReturnService issueReturnService;


    public IssueReturnController(
            IssueReturnService issueReturnService) {

        this.issueReturnService =
                issueReturnService;
    }


    /*
     * =========================================================
     * ISSUE ITEM
     * =========================================================
     */

    @PostMapping("/issue")
    public ResponseEntity<IssueReturnResponseDTO>
    issueItem(
            @RequestBody
            IssueItemRequestDTO requestDTO) {


        return ResponseEntity.ok(
                issueReturnService.issueItem(
                        requestDTO
                )
        );
    }


    /*
     * =========================================================
     * RECORD RETURN
     * =========================================================
     */

    @PostMapping("/return")
    public ResponseEntity<IssueReturnResponseDTO>
    recordReturn(
            @RequestBody
            RecordReturnRequestDTO requestDTO) {


        return ResponseEntity.ok(
                issueReturnService.recordReturn(
                        requestDTO
                )
        );
    }


    /*
     * =========================================================
     * GET ALL
     * =========================================================
     */

    @GetMapping
    public ResponseEntity<List<IssueReturnResponseDTO>>
    getAll(

            @RequestParam(
                    required = false,
                    defaultValue = ""
            )
            String search,

            @RequestParam(
                    required = false
            )
            IssueStatus status,

            @RequestParam(
                    required = false
            )
            IssuedToType issuedToType,

            @RequestParam(
                    required = false
            )
            Long departmentId) {


        return ResponseEntity.ok(
                issueReturnService.getAll(
                        search,
                        status,
                        issuedToType,
                        departmentId
                )
        );
    }


    /*
     * =========================================================
     * GET BY ID
     * =========================================================
     */

    @GetMapping("/{id}")
    public ResponseEntity<IssueReturnResponseDTO>
    getById(
            @PathVariable
            Long id) {


        return ResponseEntity.ok(
                issueReturnService.getById(
                        id
                )
        );
    }


    /*
     * =========================================================
     * SUMMARY
     * =========================================================
     */

    @GetMapping("/summary")
    public ResponseEntity<IssueReturnSummaryDTO>
    getSummary() {


        return ResponseEntity.ok(
                issueReturnService.getSummary()
        );
    }


    /*
     * =========================================================
     * DELETE
     * =========================================================
     */

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    delete(
            @PathVariable
            Long id) {


        issueReturnService.delete(
                id
        );


        return ResponseEntity.noContent()
                .build();
    }
}