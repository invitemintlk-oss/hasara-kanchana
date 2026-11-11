import React, { useEffect, useState } from "react";
import {
  INVITATION,
  GUEST_PREFIXES,
  type GuestPrefix,
  formatGuestDisplayName,
  buildInvitationLink,
  buildInvitationMessage,
} from "./invitation";

type Generated = { displayName: string; link: string; message: string };

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback for browsers/contexts without the async clipboard API
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
}

export default function Admin() {
  const [prefix, setPrefix] = useState<GuestPrefix>("Mr.");
  const [guestName, setGuestName] = useState("");
  const [generated, setGenerated] = useState<Generated | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = formatGuestDisplayName(prefix, guestName);
    if (!displayName) return;

    const link = buildInvitationLink(window.location.origin, displayName);
    setGenerated({ displayName, link, message: buildInvitationMessage(displayName, link) });
  };

  const handleCopy = async (text: string, label: string) => {
    await copyText(text);
    setToast(label);
  };

  const { groom, bride } = INVITATION.couple;

  return (
    <main className="min-h-[100dvh] h-[100dvh] overflow-y-auto bg-gradient-to-br from-rose-50 via-white to-amber-50 px-4 py-10 font-montserrat text-stone-800">
      <div className="mx-auto w-full max-w-xl">
        <header className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold">Admin</p>
          <h1 className="font-playball text-4xl md:text-5xl text-[#9d174d] mt-2">Invitation Link Generator</h1>
          <p className="text-sm text-stone-500 mt-2">
            {groom} &amp; {bride}
          </p>
        </header>

        <form onSubmit={handleGenerate} className="bg-white rounded-3xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] border border-pink-100 p-6 md:p-8 space-y-5">
          <div className="space-y-2">
            <label htmlFor="prefix" className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
              Select Prefix
            </label>
            <select
              id="prefix"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value as GuestPrefix)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              {GUEST_PREFIXES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="guestName" className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
              Guest Name
            </label>
            <input
              id="guestName"
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Sanjaya"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!guestName.trim()}
            className="w-full rounded-full bg-[#9d174d] py-4 text-sm font-bold uppercase tracking-[0.25em] text-white hover:bg-[#831843] disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Generate Link
          </button>
        </form>

        <section className="mt-6 bg-white rounded-3xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] border border-pink-100 p-6 md:p-8 space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Generated Link</p>
            {generated ? (
              <a
                href={generated.link}
                target="_blank"
                rel="noreferrer"
                className="block break-all rounded-xl bg-pink-50 px-4 py-3 text-sm text-[#9d174d] underline underline-offset-2"
              >
                {generated.link}
              </a>
            ) : (
              <p className="rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-400">Generate a link to see it here.</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Message Preview</p>
            {generated ? (
              <pre className="whitespace-pre-wrap break-words rounded-xl bg-stone-50 px-4 py-3 text-sm leading-relaxed font-montserrat text-stone-700 max-h-80 overflow-y-auto">
                {generated.message}
              </pre>
            ) : (
              <p className="rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-400">The personalised greeting will appear here.</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && handleCopy(generated.link, "Link copied!")}
              className="rounded-full border border-[#9d174d] py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#9d174d] hover:bg-pink-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Copy Link Only
            </button>
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && handleCopy(generated.message, "Message copied!")}
              className="rounded-full bg-[#9d174d] py-3 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-[#831843] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Copy Full Message
            </button>
          </div>
        </section>
      </div>

      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-stone-900 px-5 py-2.5 text-sm text-white shadow-lg transition-all duration-300 ${
          toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        {toast}
      </div>
    </main>
  );
}
