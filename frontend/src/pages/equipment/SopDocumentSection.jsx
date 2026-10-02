import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Download,
  Eye,
  FileText,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  deleteAmcDocument,
  downloadAmcDocument,
  getAmcDocuments,
  uploadAmcDocument,
} from "../../services/amcDocumentService";

import api from "../../services/api";

const MAX_FILE_SIZE =
  10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "application/pdf",

  "application/msword",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/*
 * ============================================================
 * COMPONENT
 * ============================================================
 */

function SopDocumentSection({
  equipment,
  onClose,
}) {
  const equipmentId =
    equipment?.id;

  const [
    documents,
    setDocuments,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    downloadingId,
    setDownloadingId,
  ] = useState(null);

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const fileInputRef =
    useRef(null);

  /*
   * ============================================================
   * LOAD SOP DOCUMENTS
   * ============================================================
   */

  const loadDocuments =
    async () => {
      if (!equipmentId) {
        setDocuments([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result =
          await getAmcDocuments(
            equipmentId
          );

        const data =
          result?.data ??
          result;

        const sopDocuments =
          Array.isArray(data)
            ? data.filter(
                (document) =>
                  String(
                    document?.documentType ||
                      ""
                  ).toUpperCase() ===
                  "SOP"
              )
            : [];

        setDocuments(
          sopDocuments
        );
      } catch (err) {
        console.error(
          "LOAD SOP DOCUMENTS ERROR:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Unable to load SOP documents."
        );
      } finally {
        setLoading(false);
      }
    };

  /*
   * ============================================================
   * INITIAL LOAD
   * ============================================================
   */

  useEffect(() => {
    loadDocuments();
  }, [equipmentId]);

  /*
   * ============================================================
   * FILE VALIDATION
   * ============================================================
   */

  const validateFile =
    (file) => {
      if (!file) {
        return "Please select an SOP file.";
      }

      if (
        file.size >
        MAX_FILE_SIZE
      ) {
        return (
          "File size must not exceed 10 MB."
        );
      }

      const extension =
        file.name
          ?.split(".")
          .pop()
          ?.toLowerCase();

      const allowedExtensions = [
        "pdf",
        "doc",
        "docx",
      ];

      const validMimeType =
        ALLOWED_FILE_TYPES.includes(
          file.type
        );

      const validExtension =
        allowedExtensions.includes(
          extension
        );

      /*
       * Some browsers may return an empty
       * MIME type. Extension is therefore
       * also checked.
       */

      if (
        !validMimeType &&
        !validExtension
      ) {
        return (
          "Unsupported file type. Allowed: PDF, DOC and DOCX."
        );
      }

      return "";
    };

  /*
   * ============================================================
   * FILE SELECT
   * ============================================================
   */

  const handleFileChange =
    (event) => {
      setError("");
      setSuccess("");

      const file =
        event.target.files?.[0];

      const validation =
        validateFile(file);

      if (validation) {
        setError(
          validation
        );

        event.target.value =
          "";

        setSelectedFile(
          null
        );

        return;
      }

      setSelectedFile(
        file
      );
    };

  /*
   * ============================================================
   * REMOVE SELECTED FILE
   * ============================================================
   */

  const removeSelectedFile =
    () => {
      setSelectedFile(
        null
      );

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }
    };

  /*
   * ============================================================
   * UPLOAD SOP
   * ============================================================
   */

  const handleUpload =
    async (event) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (!equipmentId) {
        setError(
          "Equipment ID is missing."
        );
        return;
      }

      if (!selectedFile) {
        setError(
          "Please select an SOP file."
        );
        return;
      }

      try {
        setUploading(true);

        /*
         * Existing AMC document storage
         * is reused with documentType = SOP.
         */

        await uploadAmcDocument(
          equipmentId,
          selectedFile,
          "SOP"
        );

        setSuccess(
          "SOP uploaded successfully."
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

        await loadDocuments();
      } catch (err) {
        console.error(
          "UPLOAD SOP ERROR:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Unable to upload SOP."
        );
      } finally {
        setUploading(false);
      }
    };

  /*
   * ============================================================
   * DOWNLOAD SOP
   * ============================================================
   */

  const handleDownload =
    async (document) => {
      const documentId =
        document?.id ??
        document?.documentId;

      if (!documentId) {
        setError(
          "Document ID is missing."
        );

        return;
      }

      try {
        setError("");
        setSuccess("");

        setDownloadingId(
          documentId
        );

        await downloadAmcDocument(
          equipmentId,
          document
        );

        setSuccess(
          "SOP download started."
        );
      } catch (err) {
        console.error(
          "DOWNLOAD SOP ERROR:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Unable to download SOP."
        );
      } finally {
        setDownloadingId(
          null
        );
      }
    };

  /*
   * ============================================================
   * VIEW SOP
   * ============================================================
   */

  const handleView =
    async (document) => {
      const documentId =
        document?.id ??
        document?.documentId;

      if (!documentId) {
        setError("Document ID is missing.");
        return;
      }

      let previewWindow = null;

      try {
        setError("");
        setSuccess("");

        /*
         * Open the tab immediately while the click is still
         * trusted by the browser. The actual file is loaded
         * through the authenticated Axios request below.
         */
        previewWindow = window.open(
          "about:blank",
          "_blank"
        );

        const response =
          await api.get(
            `/equipment/${equipmentId}/amc-documents/${documentId}`,
            {
              responseType: "blob",
            }
          );

        const contentType =
          response.headers?.["content-type"] ||
          document?.contentType ||
          "application/pdf";

        const blob =
          response.data instanceof Blob
            ? response.data.type
              ? response.data
              : new Blob([response.data], { type: contentType })
            : new Blob([response.data], { type: contentType });

        const url = URL.createObjectURL(blob);

        if (previewWindow) {
          previewWindow.location.href = url;
        } else {
          window.open(
            url,
            "_blank",
            "noopener,noreferrer"
          );
        }

        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 60000);
      } catch (err) {
        if (previewWindow && !previewWindow.closed) {
          previewWindow.close();
        }

        console.error("VIEW SOP ERROR:", err);

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Unable to view SOP."
        );
      }
    };

  /*
   * ============================================================
   * DELETE SOP
   * ============================================================
   */

  const handleDelete =
    async (document) => {
      const documentId =
        document?.id ??
        document?.documentId;

      if (!documentId) {
        setError("Document ID is missing.");
        return;
      }

      if (
        !window.confirm(
          "Delete this SOP document?"
        )
      ) {
        return;
      }

      try {
        setError("");
        setSuccess("");
        setDeletingId(documentId);

        await deleteAmcDocument(
          equipmentId,
          documentId
        );

        setSuccess("SOP deleted successfully.");
        await loadDocuments();
      } catch (err) {
        console.error("DELETE SOP ERROR:", err);

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Unable to delete SOP."
        );
      } finally {
        setDeletingId(null);
      }
    };

  /*
   * ============================================================
   * DOCUMENT NAME
   * ============================================================
   */

  const getDocumentName =
    (document) => {
      return (
        document?.documentName ||
        document?.originalFileName ||
        document?.fileName ||
        "SOP Document"
      );
    };

  /*
   * ============================================================
   * FILE SIZE
   * ============================================================
   */

  const formatFileSize =
    (bytes) => {
      if (
        bytes === null ||
        bytes === undefined ||
        bytes === ""
      ) {
        return "—";
      }

      const size =
        Number(bytes);

      if (
        Number.isNaN(size)
      ) {
        return "—";
      }

      if (
        size < 1024
      ) {
        return `${size} B`;
      }

      if (
        size <
        1024 * 1024
      ) {
        return `${(
          size / 1024
        ).toFixed(1)} KB`;
      }

      return `${(
        size /
        1024 /
        1024
      ).toFixed(1)} MB`;
    };

  /*
   * ============================================================
   * DATE
   * ============================================================
   */

  const formatDate =
    (value) => {
      if (!value) {
        return "—";
      }

      const date =
        new Date(value);

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
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    };

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <div
      className="
        fixed
        inset-0
        z-[80]
        flex
        items-center
        justify-center
        bg-black/75
        p-4
      "
    >

      <div
        className="
          flex
          max-h-[92vh]
          w-full
          max-w-4xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-slate-700
          bg-[#101729]
          shadow-2xl
        "
      >

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-800
            bg-[#101729]
            px-6
            py-5
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-cyan-500/10
                text-cyan-400
              "
            >
              <FileText
                size={22}
              />
            </div>

            <div>

              <h2
                className="
                  text-xl
                  font-bold
                  text-white
                "
              >
                SOP Documents
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                {equipment?.equipmentName ||
                  "Equipment"}
                {" · "}
                {equipment?.equipmentCode ||
                  "—"}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() => {
              if (!uploading) {
                onClose();
              }
            }}
            disabled={
              uploading
            }
            className="
              rounded-lg
              p-2
              text-slate-400
              transition
              hover:bg-slate-800
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X size={20} />
          </button>

        </div>

        {/* ======================================================
            BODY
        ====================================================== */}

        <div
          className="
            flex-1
            overflow-y-auto
            p-6
          "
        >

          {/* ====================================================
              DESCRIPTION
          ==================================================== */}

          <div
            className="
              mb-5
              rounded-xl
              border
              border-cyan-500/20
              bg-cyan-500/5
              p-4
            "
          >

            <div className="flex gap-3">

              <FileText
                size={20}
                className="
                  mt-0.5
                  shrink-0
                  text-cyan-400
                "
              />

              <div>

                <h3
                  className="
                    text-sm
                    font-semibold
                    text-cyan-300
                  "
                >
                  Standard Operating Procedure
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-slate-400
                  "
                >
                  Upload the SOP used for
                  safely and consistently
                  operating this laboratory
                  equipment.
                </p>

              </div>

            </div>

          </div>

          {/* ====================================================
              MESSAGES
          ==================================================== */}

          {error && (

            <div
              className="
                mb-4
                rounded-lg
                border
                border-red-500/30
                bg-red-500/10
                px-4
                py-3
                text-sm
                text-red-300
              "
            >
              {error}
            </div>

          )}

          {success && (

            <div
              className="
                mb-4
                rounded-lg
                border
                border-emerald-500/30
                bg-emerald-500/10
                px-4
                py-3
                text-sm
                text-emerald-300
              "
            >
              {success}
            </div>

          )}

          {/* ====================================================
              UPLOAD
          ==================================================== */}

          <form
            onSubmit={
              handleUpload
            }
            className="
              mb-6
              rounded-xl
              border
              border-slate-800
              bg-[#080d1b]
              p-5
            "
          >

            <div className="mb-4">

              <h3
                className="
                  text-sm
                  font-semibold
                  text-white
                "
              >
                Upload SOP
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                PDF, DOC or DOCX · Maximum
                10 MB
              </p>

            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="
                application/pdf,
                application/msword,
                application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                .pdf,
                .doc,
                .docx
              "
              onChange={
                handleFileChange
              }
              className="hidden"
              id="sop-file-input"
            />

            {!selectedFile ? (

              <label
                htmlFor="sop-file-input"
                className="
                  flex
                  cursor-pointer
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  border
                  border-dashed
                  border-slate-700
                  bg-[#101729]
                  px-5
                  py-8
                  text-sm
                  font-medium
                  text-slate-300
                  transition
                  hover:border-cyan-500/50
                  hover:bg-cyan-500/5
                  hover:text-cyan-300
                "
              >

                <Upload
                  size={20}
                />

                Choose SOP File

              </label>

            ) : (

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  rounded-xl
                  border
                  border-cyan-500/20
                  bg-cyan-500/5
                  px-4
                  py-4
                "
              >

                <div className="min-w-0">

                  <p
                    className="
                      truncate
                      text-sm
                      font-medium
                      text-white
                    "
                  >
                    {selectedFile.name}
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                    "
                  >
                    {formatFileSize(
                      selectedFile.size
                    )}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={
                    removeSelectedFile
                  }
                  disabled={
                    uploading
                  }
                  className="
                    shrink-0
                    rounded-lg
                    p-2
                    text-slate-400
                    hover:bg-slate-800
                    hover:text-white
                    disabled:opacity-50
                  "
                >
                  <X size={18} />
                </button>

              </div>

            )}

            <div className="mt-4 flex justify-end">

              <button
                type="submit"
                disabled={
                  uploading ||
                  !selectedFile
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-cyan-600
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-cyan-500
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                <Upload
                  size={17}
                />

                {uploading
                  ? "Uploading..."
                  : "Upload SOP"}

              </button>

            </div>

          </form>

          {/* ====================================================
              EXISTING SOP DOCUMENTS
          ==================================================== */}

          <div>

            <div
              className="
                mb-4
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h3
                  className="
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  Uploaded SOPs
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                  "
                >
                  {documents.length} SOP
                  {documents.length ===
                  1
                    ? ""
                    : "s"}
                </p>

              </div>

            </div>

            {loading ? (

              <div
                className="
                  rounded-xl
                  border
                  border-slate-800
                  bg-[#080d1b]
                  px-5
                  py-10
                  text-center
                  text-sm
                  text-slate-500
                "
              >
                Loading SOP documents...
              </div>

            ) : documents.length ===
              0 ? (

              <div
                className="
                  rounded-xl
                  border
                  border-dashed
                  border-slate-800
                  bg-[#080d1b]
                  px-5
                  py-12
                  text-center
                "
              >

                <FileText
                  size={30}
                  className="
                    mx-auto
                    mb-3
                    text-slate-700
                  "
                />

                <p
                  className="
                    text-sm
                    font-medium
                    text-slate-400
                  "
                >
                  No SOP uploaded
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-600
                  "
                >
                  Upload the equipment
                  operating SOP above.
                </p>

              </div>

            ) : (

              <div
                className="
                  space-y-3
                "
              >

                {documents.map(
                  (document) => {

                    const documentId =
                      document?.id ??
                      document?.documentId;

                    return (

                      <div
                        key={
                          documentId
                        }
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          rounded-xl
                          border
                          border-slate-800
                          bg-[#080d1b]
                          px-4
                          py-4
                          transition
                          hover:border-cyan-500/20
                        "
                      >

                        <div
                          className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                          "
                        >

                          <div
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-cyan-500/10
                              text-cyan-400
                            "
                          >
                            <FileText
                              size={19}
                            />
                          </div>

                          <div
                            className="
                              min-w-0
                            "
                          >

                            <p
                              className="
                                truncate
                                text-sm
                                font-medium
                                text-white
                              "
                              title={getDocumentName(
                                document
                              )}
                            >
                              {getDocumentName(
                                document
                              )}
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                text-slate-500
                              "
                            >
                              {formatFileSize(
                                document?.fileSize
                              )}

                              {" · "}

                              {formatDate(
                                document?.createdAt
                              )}
                            </p>

                          </div>

                        </div>

                        <div
                          className="
                            flex
                            shrink-0
                            items-center
                            gap-2
                          "
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleView(document)
                            }
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-lg
                              border
                              border-cyan-500/30
                              bg-cyan-500/10
                              px-3
                              py-2
                              text-xs
                              font-semibold
                              text-cyan-300
                              transition
                              hover:bg-cyan-500/20
                            "
                          >
                            <Eye size={16} />
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDownload(document)
                            }
                            disabled={
                              downloadingId === documentId ||
                              deletingId === documentId
                            }
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-lg
                              border
                              border-cyan-500/30
                              bg-cyan-500/10
                              px-3
                              py-2
                              text-xs
                              font-semibold
                              text-cyan-300
                              transition
                              hover:bg-cyan-500/20
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            <Download size={16} />
                            {downloadingId === documentId
                              ? "Downloading..."
                              : "Download"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(document)
                            }
                            disabled={
                              deletingId === documentId ||
                              downloadingId === documentId
                            }
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-lg
                              border
                              border-red-500/30
                              bg-red-500/10
                              px-3
                              py-2
                              text-xs
                              font-semibold
                              text-red-300
                              transition
                              hover:bg-red-500/20
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            <Trash2 size={16} />
                            {deletingId === documentId
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default SopDocumentSection;