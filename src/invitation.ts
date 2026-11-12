export const INVITATION = {
  couple: {
    bride: "Hasara",
    groom: "Kanchana",
    brideFull: "Hasara",
    groomFull: "Kanchana",
    brideParents: "Beloved daughter of Mr. & Mrs. Abeysingha",
    groomParents: "Beloved son of Mr. & Mrs. Garumanna",
  },
  date: {
    displayNumeric: "14 . 12 . 2026",
    displayLong: "Monday, 14th December 2026",
    countdownTarget: "2026-12-14T11:24:00+05:30",
  },
  time: {
    ceremonyStart: "11:24 AM",
    ceremonyEnd: "3:30 PM",
    registration: "10:45 AM",
    welcome: "9:30 AM",
  },
  venue: {
    name: "Hotel Green Court",
    city: "Homagama",
    mapQuery: "Hotel Green Court, Homagama",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Hotel+Green+Court+Homagama",
  },
  // Add phone numbers here, e.g. "Hasara - +94 7X XXX XXXX"
  rsvpContacts: [] as string[],
  // Google Apps Script Web App URL (ends with /exec) – see code.gs for setup.
  // Saves RSVPs to: https://docs.google.com/spreadsheets/d/1rzdKCrOCl_Pb9EK0YXGUmnKOkHvwTG8bhZvCF8bUBQk
  rsvpScriptUrl:
    "https://script.google.com/macros/s/AKfycbx29XyaJL9oQqgge0auxw6T10IV4S0m3q0-j4t5F7xqX8DskZ-3CD3kNmFkVVzx7iSiBQ/exec",
};

export const GUEST_PREFIXES = ["Mr.", "Mrs.", "Miss", "Mr. & Mrs.", "Family", "Dear"] as const;
export type GuestPrefix = (typeof GUEST_PREFIXES)[number];

/**
 * Combine prefix + name into the name shown to the guest.
 * "Dear" is a message-style option: it adds nothing here, because the
 * greeting itself already starts with "Dear".
 */
export function formatGuestDisplayName(prefix: GuestPrefix, name: string): string {
  const cleanName = name.trim().replace(/\s+/g, " ");
  if (!cleanName) return "";

  switch (prefix) {
    case "Dear":
      return cleanName;
    case "Family":
      return `${cleanName} and Family`;
    default:
      return `${prefix} ${cleanName}`;
  }
}

/** {baseURL}/{displayName}, safely URL-encoded. */
export function buildInvitationLink(baseUrl: string, displayName: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/${encodeURIComponent(displayName)}`;
}

export function buildInvitationMessage(displayName: string, link: string): string {
  const { groom, bride } = INVITATION.couple;
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${groom} & ${bride}`;
}

/** Read the guest's display name from /{name} (or the older ?to= links). */
export function getGuestNameFromUrl(location: Location = window.location): string {
  const path = location.pathname.replace(/^\/+|\/+$/g, "");
  if (path && path.toLowerCase() !== "admin") {
    try {
      const decoded = decodeURIComponent(path).trim();
      if (decoded) return decoded;
    } catch {
      // malformed URL – ignore
    }
  }
  return new URLSearchParams(location.search).get("to")?.trim() ?? "";
}
