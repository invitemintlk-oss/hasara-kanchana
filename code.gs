/**
 * Kanchana & Hasara – Wedding RSVP (Google Apps Script Web App)
 *
 * Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1rzdKCrOCl_Pb9EK0YXGUmnKOkHvwTG8bhZvCF8bUBQk/edit
 *
 * SETUP (one time):
 * 1. Open the spreadsheet → Extensions → Apps Script.
 * 2. Delete everything in Code.gs, paste this whole file, click Save.
 * 3. Deploy → New deployment → Select type: Web app
 *      Description:     Wedding RSVP
 *      Execute as:      Me
 *      Who has access:  Anyone
 *    Click Deploy and allow the permissions (Advanced → Go to project → Allow).
 * 4. Copy the "Web app URL" (ends with /exec) and put it in
 *    src/invitation.ts → rsvpScriptUrl.
 *
 * If you edit this script later: Deploy → Manage deployments → ✏️ Edit →
 * Version: New version → Deploy. (The URL stays the same.)
 */

const SPREADSHEET_ID = "1rzdKCrOCl_Pb9EK0YXGUmnKOkHvwTG8bhZvCF8bUBQk";
const RSVP_SHEET_NAME = "RSVP";
const RSVP_HEADERS = ["Timestamp", "Name", "WhatsApp", "Attendance", "Guests"];

function doPost(e) {
  return handleRequest_(e);
}

function doGet(e) {
  // Opening the /exec URL in a browser shows this – handy to check it works.
  if (!e || !e.parameter || !e.parameter.action) {
    return jsonResponse_({ ok: true, message: "RSVP endpoint is running" });
  }
  return handleRequest_(e);
}

function handleRequest_(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);

    const params = parseParams_(e);
    const action = String(params.action || "").trim().toLowerCase();

    if (action === "rsvp") {
      return jsonResponse_(saveRsvp_(params));
    }

    return jsonResponse_({ ok: false, message: "Invalid action" });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      message: error && error.message ? error.message : "Unexpected error",
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignore) {}
  }
}

function saveRsvp_(params) {
  const sheet = getSheet_(RSVP_SHEET_NAME);
  ensureHeader_(sheet, RSVP_HEADERS);

  const name = clean_(params.name, 120);
  const whatsapp = clean_(params.whatsapp, 30);
  const attendanceRaw = clean_(params.attendance, 20).toLowerCase();
  const attendance = attendanceRaw === "declined" || attendanceRaw === "no" ? "Declined" : "Accepted";

  let guests = parseInt(params.guests, 10);
  if (isNaN(guests) || guests < 0) guests = 0;
  if (guests > 20) guests = 20;
  if (attendance === "Declined") guests = 0;

  if (!name) {
    return { ok: false, message: "Name is required" };
  }

  sheet.appendRow([
    new Date(),
    name,
    // Leading apostrophe keeps "+94 77…" as text (otherwise Sheets treats it as a formula)
    whatsapp ? "'" + whatsapp : "",
    attendance,
    guests,
  ]);

  return { ok: true, message: "RSVP saved" };
}

/** Trim, cap length and stop values being run as spreadsheet formulas. */
function clean_(value, maxLength) {
  let text = String(value == null ? "" : value).trim().slice(0, maxLength);
  if (/^[=@]/.test(text)) text = "'" + text;
  return text;
}

function getSheet_(sheetName) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
}

function ensureHeader_(sheet, headers) {
  if (sheet.getLastRow() > 0) return;

  sheet.appendRow(headers);
  const header = sheet.getRange(1, 1, 1, headers.length);
  header.setFontWeight("bold").setBackground("#7a1f1a").setFontColor("#fbf5e6");
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 170);
  sheet.setColumnWidth(2, 220);
  sheet.setColumnWidth(3, 160);
  sheet.setColumnWidth(4, 110);
  sheet.setColumnWidth(5, 80);
}

function parseParams_(e) {
  const params = Object.assign({}, (e && e.parameter) || {});
  const contents = e && e.postData && e.postData.contents ? String(e.postData.contents).trim() : "";
  if (!contents) return params;

  if (contents.charAt(0) === "{") {
    return Object.assign(params, JSON.parse(contents));
  }

  const pairs = contents.split("&");
  for (let i = 0; i < pairs.length; i++) {
    if (!pairs[i]) continue;
    const parts = pairs[i].split("=");
    const key = decodeURIComponent((parts[0] || "").replace(/\+/g, " "));
    const value = decodeURIComponent((parts.slice(1).join("=") || "").replace(/\+/g, " "));
    if (key) params[key] = value;
  }
  return params;
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
