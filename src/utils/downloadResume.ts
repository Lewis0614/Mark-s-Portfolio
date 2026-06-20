/**
 * Standard telemetry logger to verify and report on the resume PDF download request.
 * Since the associated button/anchor has a direct href="/Jhay_Mark_Ortiz_Luis_Resume.pdf",
 * the browser handles the download natively, guaranteeing a byte-for-byte identical file.
 * This helper asynchronously logs verification logs in the background for debugging.
 */
export const downloadResume = async () => {
  const downloadUrl = "/Jhay_Mark_Ortiz_Luis_Resume.pdf";
  console.log(`[Resume Download] Direct link clicked. Browser is executing native file download for: ${downloadUrl}`);

  try {
    const response = await fetch(downloadUrl);
    console.log("[Resume Download Status Verification]:", {
      status: response.status,
      contentType: response.headers.get("content-type"),
      fileSize: response.headers.get("content-length") 
        ? parseInt(response.headers.get("content-length")!, 10) 
        : "unknown",
      downloadUrl: window.location.origin + downloadUrl,
    });
  } catch (error) {
    console.warn("[Resume Download Telemetry Query failed (the native download is unaffected)]:", error);
  }
};

