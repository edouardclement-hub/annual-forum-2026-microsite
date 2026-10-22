/**
 * Backend for review.html / review-fr.html — stores each request in this Google Sheet
 * and emails a notification. Not served by GitHub Pages; it lives in Apps Script.
 *
 * Setup (once):
 *  1. Create a Google Sheet in the EMH Drive, e.g. "Jurisdiction review requests".
 *  2. Extensions > Apps Script, paste this file, save.
 *  3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 *  4. Copy the /exec URL into ENDPOINT in review.html and review-fr.html.
 * The Sheet itself is the private submissions table: only people it is shared with can open it.
 */
var NOTIFY = 'edouard@cme-emh.ca';
var HEADERS = ['Received', 'Language', 'Name', 'Email', 'Jurisdiction / organization', 'What to review'];

function doPost(e) {
  var p = e.parameter || {};
  // Honeypot: bots fill the hidden field; pretend success and drop it.
  if (p.website) return json({ ok: true });

  var name = clean(p.name, 200);
  var email = clean(p.email, 200);
  var jurisdiction = clean(p.jurisdiction, 200);
  var details = clean(p.details, 4000);
  if (!name || !jurisdiction || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([new Date(), p.lang === 'fr-CA' ? 'FR' : 'EN', name, email, jurisdiction, details]);
  } finally {
    lock.releaseLock();
  }

  MailApp.sendEmail({
    to: NOTIFY,
    replyTo: email,
    subject: 'Data review request: ' + jurisdiction,
    body: 'Name: ' + name + '\nEmail: ' + email + '\nJurisdiction / organization: ' + jurisdiction +
      '\n\nWhat to review:\n' + (details || '(not specified)') +
      '\n\nAll requests: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
  });

  return json({ ok: true });
}

// Trim, cap length, and stop a leading = + - @ from being read as a spreadsheet formula.
function clean(v, max) {
  var s = String(v || '').trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
