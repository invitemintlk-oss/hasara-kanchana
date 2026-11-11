import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, Clock, ChevronDown } from "lucide-react";

const INVITATION = {
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
};

const backgroundMusic = "/handawaka_loud.mp3";
const googleScriptUrl =
  "https://script.google.com/macros/s/AKfycbx6tVTRxM0Fjc10fR0a35PjSjb9JJN-9F7zDpxyJvVMhdZ3A-_rOkAV8x8Cwpeqfp5NLw/exec";

const publicImagePath = (fileName: string) => `/images/${fileName.replaceAll(" ", "%20")}`;
const preImagePath = (fileName: string) => `/pre/${fileName.replaceAll(" ", "%20")}`;

const PRE_IMAGES = [
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.13.jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.34 (1).jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.34.jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.35.jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.20.09.jpeg"),
];

const HERO_BACKGROUND_IMAGE = PRE_IMAGES[4];

function FloatingPetals() {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [petals, setPetals] = useState<
    Array<{
      id: number;
      x: number;
      size: number;
      rotation: number;
      duration: number;
      delay: number;
      color: string;
      drift: number;
    }>
  >([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    setIsLowPowerMode(reduceMotion || isMobile);

    if (reduceMotion) {
      setPetals([]);
      return;
    }

    const colors = ["#61a85c", "#a2c5a0", "#2d5a27", "#3f7a39", "#dcebe1"];
    const petalCount = isMobile ? 10 : 18;

    const newPetals = Array.from({ length: petalCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 7 + 7,
      rotation: Math.random() * 360,
      duration: Math.random() * 11 + 16,
      delay: Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: Math.random() * 24 - 12,
    }));

    setPetals(newPetals);
  }, []);

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden z-40 ${isLowPowerMode ? "opacity-70" : ""}`}>
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute drop-shadow-[0_2px_10px_rgba(27,67,50,0.3)]"
          style={{ color: petal.color }}
          initial={{
            x: `${petal.x}vw`,
            y: "-10vh",
            rotate: petal.rotation,
            opacity: 0,
          }}
          animate={{
            y: "110vh",
            x: `${petal.x + petal.drift}vw`,
            rotate: petal.rotation + (isLowPowerMode ? 360 : 720),
            opacity: [0, 0.9, 0.8, 0],
          }}
          transition={{
            duration: isLowPowerMode ? petal.duration * 1.2 : petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
        >
          <svg width={petal.size} height={petal.size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C12,2 10,6 10,10C10,14 12,22 12,22C12,22 14,14 14,10C14,6 12,2 12,2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function CountdownTimer({ isDark = false }: { isDark?: boolean }) {
  const targetDate = new Date(INVITATION.date.countdownTarget).getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const stats = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-8 justify-center w-full max-w-4xl mx-auto mt-8 md:mt-16 z-20 px-2">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, type: "spring", stiffness: 80 }}
          className="relative group"
        >
          <div
            className={`relative w-[4.5rem] h-[6.5rem] sm:w-20 sm:h-28 md:w-32 md:h-44 rounded-t-full shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 group-hover:-translate-y-3 ${isDark ? "bg-gradient-to-b from-[#b8902e] to-[#8a6514] " : "bg-white "
              }`}
          >
            <div
              className={`absolute inset-1.5 sm:inset-2 md:inset-3 ] rounded-t-full pointer-events-none ${isDark ? "" : ""
                }`}
            />

            <span
              className={`font-numeric text-2xl sm:text-3xl md:text-5xl leading-none relative z-10 drop-shadow-sm mt-3 sm:mt-4 md:mt-6 transition-transform duration-500 group-hover:scale-110 ${isDark ? "text-white" : "text-[#2d5a27]"
                }`}
            >
              {Math.max(0, stat.value).toString().padStart(2, "0")}
            </span>

            <div className="w-full flex justify-center mt-2 sm:mt-3 md:mt-6 mb-1 sm:mb-2 relative z-10">
              <span
                className={`text-[5px] sm:text-[6px] md:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm whitespace-nowrap ${isDark
                  ? "bg-white/10 text-white "
                  : "bg-stone-50 text-stone-500 "
                  }`}
              >
                {stat.label}
              </span>
            </div>

            <div
              className={`absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 w-[3px] h-[3px] sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 rotate-45 ${isDark ? "bg-white/40" : "bg-[#61a85c]"
                }`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Gallery() {
  const marqueeImages = [...PRE_IMAGES, ...PRE_IMAGES, ...PRE_IMAGES];

  return (
    <section className="relative py-14 md:py-40 bg-transparent overflow-hidden">
      <div className="w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 mb-10 md:mb-16 px-6"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-[#1b4332] font-bold tracking-[0.8em] text-sm md:text-base opacity-40 uppercase">
              Captured Moments
            </span>
            <div className="h-px w-16 bg-[#52b788]/30" />
          </div>
          <h2 className="font-playball text-5xl md:text-8xl bg-gradient-to-r from-[#3f7a39] via-[#2d5a27] to-[#3f7a39] bg-clip-text text-transparent italic leading-none">
            Beautiful Memories
          </h2>
          <p className="text-[#2d5a27]/70 text-sm md:text-base tracking-[0.3em] font-medium max-w-2xl mx-auto pt-2 leading-loose">
            A few of the most beautiful moments of our love story, shared with you.
          </p>
        </motion.div>

        <div className="relative flex overflow-x-hidden w-full py-4 mask-gradient">
          <motion.div
            className="flex gap-6 md:gap-10 pr-6 md:pr-10 shrink-0"
            animate={{
              x: [0, "-33.33%"],
            }}
            transition={{
              ease: "linear",
              duration: 25,
              repeat: Infinity,
            }}
          >
            {marqueeImages.map((img, i) => (
              <div
                key={`${img}-${i}`}
                className="relative w-[280px] h-[380px] md:w-[350px] md:h-[480px] shrink-0 overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(45,90,39,0.15)] group"
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-4 rounded-[2rem] z-20 pointer-events-none group-hover:inset-6 transition-all duration-700" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function WeddingInvitation() {
  const [isOpened, setIsOpened] = useState(false);
  const [showDancers, setShowDancers] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAttemptedAutoplay, setHasAttemptedAutoplay] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const guestName = searchParams.get("to");

  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    guests: "1",
  });

  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const introVideoRef = React.useRef<HTMLVideoElement>(null);

  const submitToGoogleSheet = async (payload: Record<string, string>) => {
    if (!googleScriptUrl) {
      throw new Error("Google Script URL tl ilid ke;");
    }

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      body: new URLSearchParams(payload),
    });

    if (!response.ok) {
      throw new Error("b,a,Su id¾:l fkdùh");
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!rsvpForm.name.trim()) {
      setRsvpStatus("error");
      return;
    }

    setRsvpStatus("sending");

    try {
      await submitToGoogleSheet({
        action: "rsvp",
        name: rsvpForm.name.trim(),
        guests: rsvpForm.guests,
        dietaryNotes: "",
      });

      setRsvpStatus("success");
      setRsvpForm({ name: "", guests: "1" });
    } catch {
      setRsvpStatus("error");
    }
  };



  useEffect(() => {
    if (isOpened && !isPlaying && !hasAttemptedAutoplay && audioRef.current) {
      setHasAttemptedAutoplay(true);

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          const playOnInteraction = () => {
            if (audioRef.current && !isPlaying) {
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  window.removeEventListener("click", playOnInteraction);
                })
                .catch(() => { });
            }
          };

          window.addEventListener("click", playOnInteraction);
        });
    }
  }, [isOpened, isPlaying, hasAttemptedAutoplay]);

  const startDancersVideo = () => {
    setShowDancers(true);

    if (audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio play failed:", err));
    }
  };

  const playFirstIntro = () => {
    if (introStarted) return;
    setIntroStarted(true);

    // Start the background song first, directly inside the tap, so browsers allow it.
    if (audioRef.current && !isPlaying) {
      audioRef.current.volume = 1;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio play failed:", err));
    }

    if (introVideoRef.current) {
      introVideoRef.current.currentTime = 2;
      introVideoRef.current.play().catch(() => startDancersVideo());
    } else {
      startDancersVideo();
    }
  };

  const openInvitation = () => {
    setShowDancers(false);
    setIntroStarted(false);
    setIsOpened(true);

    if (audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio play failed:", err));
    }
  };

  return (
    <main
      className={`dl-manel-bold h-[100dvh] w-full bg-[#fae9cb] transition-all duration-1000 ${isOpened ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden flex items-center justify-center"
        } relative scroll-smooth`}
    >
      <FloatingPetals />

      <AnimatePresence mode="wait">
        {!isOpened && showDancers ? (
          <motion.div
            key="dancers-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
          >
            <video
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={openInvitation}
              onError={openInvitation}
              className="w-full h-full object-cover"
              src="/intro_video.mp4"
            />

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              onClick={openInvitation}
              className="intro-montserrat absolute bottom-8 right-6 z-[110] px-6 py-2.5 bg-white/30 backdrop-blur-md border border-white/40 text-white text-[10px] uppercase tracking-[0.35em] font-bold rounded-full hover:bg-white/50 transition-all"
            >
              Skip
            </motion.button>
          </motion.div>
        ) : !isOpened ? (
          <motion.div
            key="video-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 1, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-sky-50" />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15], x: [-20, 20, -20], y: [-20, 20, -20] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[10%] -left-[10%] w-[60%] aspect-square bg-gradient-to-br from-pink-300/30 to-purple-300/30 blur-[120px] rounded-full"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1], x: [20, -20, 20], y: [20, -20, 20] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-[15%] -right-[15%] w-[70%] aspect-square bg-gradient-to-tl from-amber-200/40 to-rose-200/40 blur-[140px] rounded-full"
            />

            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-[35vh] md:h-full">
                <video
                  ref={introVideoRef}
                  muted
                  playsInline
                  preload="auto"
                  onEnded={startDancersVideo}
                  className="w-full h-full object-cover shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)]"
                  src="/Use_the_uploaded_202604161807.mp4#t=2"
                />
                <div className="absolute inset-0 border-y-2 border-white/40 md:hidden" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/20 md:hidden" />
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-rose-50/10 via-transparent to-sky-50/20 pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={introStarted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
              transition={introStarted ? { duration: 0.6 } : { delay: 1, duration: 1 }}
              className={`relative z-[101] mt-auto mb-20 md:mb-24 ${introStarted ? "pointer-events-none" : ""}`}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-200 via-amber-100 to-sky-200 blur-2xl opacity-40 animate-pulse" />
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={playFirstIntro}
                className="group relative flex flex-col items-center gap-4 bg-white/95 backdrop-blur-md border border-white/60 px-14 py-6 rounded-full text-stone-800 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] transition-all duration-500 hover:shadow-pink-200/30"
              >
                <span className="intro-cinzel text-[15px] tracking-[0.6em] uppercase font-bold bg-gradient-to-r from-[#be185d] to-[#831843] bg-clip-text text-transparent">
                  Open Invitation
                </span>
                <div className="w-10 h-[1.5px] bg-gradient-to-r from-pink-200 via-pink-400 to-pink-200 group-hover:w-20 transition-all duration-500" />
                <span className="intro-montserrat text-[10px] uppercase tracking-[0.4em] font-bold text-stone-400 animate-pulse">
                  Tap to Reveal
                </span>
              </motion.button>
            </motion.div>

            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <p className="intro-cinzel text-[11px] tracking-[0.8em] font-bold uppercase flex flex-col items-center gap-3">
                <span className="bg-gradient-to-r from-pink-300 via-pink-500 to-pink-300 bg-clip-text text-transparent opacity-80 whitespace-nowrap">
                  {INVITATION.couple.groom.charAt(0)} &amp; {INVITATION.couple.bride.charAt(0)}
                </span>
                <span className="h-px w-8 bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
              </p>
            </div>

            <div className="absolute top-0 left-0 w-44 h-44 pointer-events-none overflow-hidden z-20">
              <img src="/images/silver_orchid_corner.png" className="w-full h-full object-contain -rotate-90" alt="" />
            </div>
            <div className="absolute top-0 right-0 w-44 h-44 pointer-events-none overflow-hidden z-20">
              <img src="/images/silver_orchid_corner.png" className="w-full h-full object-contain" alt="" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="website-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="website-shell relative z-20 w-full"
          >
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsOpened(false)}
              className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg text-[#2d5a27] hover:bg-emerald-50 transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className="text-[11px] tracking-widest font-bold">Close</div>
              </div>
            </motion.button>

            <section className="w-full relative flex items-start justify-center overflow-hidden bg-transparent min-h-[100dvh] md:min-h-[85vh] pt-20 md:pt-32">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url("/ChatGPT%20Image%20Jun%208,%202026,%2002_43_56%20AM.png")` }}
                aria-hidden="true"
              />

              <div className="relative z-10 w-full max-w-5xl px-6 text-center mt-12 md:mt-0">
                {guestName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg md:text-xl font-bold text-[#2d5a27] mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  >
                    {guestName}
                  </motion.p>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.8 }}
                  className="mt-10"
                >
                  <h1 className="font-playball text-6xl sm:text-7xl md:text-8xl text-[#2d5a27] leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
                    {INVITATION.couple.groom}
                  </h1>

                  <div className="mt-6 flex items-center justify-center gap-5">
                    <div className="h-px w-14 bg-[#2d5a27]/40" />
                    <span className="text-4xl md:text-5xl text-[#2d5a27] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] font-playball">&amp;</span>
                    <div className="h-px w-14 bg-[#2d5a27]/40" />
                  </div>

                  <h1 className="font-playball mt-6 text-6xl sm:text-7xl md:text-8xl text-[#2d5a27] leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
                    {INVITATION.couple.bride}
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.8 }}
                  className="mt-4 md:mt-12"
                >
                  <p className="mt-1 md:mt-5 text-[#2d5a27]/70 text-sm md:text-base tracking-[0.15em] font-medium leading-loose max-w-2xl mx-auto">
                    We would love to share the most unforgettable moment of our lives with you!
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 1.1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
              >
                <div className="w-px h-14 bg-gradient-to-b from-[#2d5a27]/30 to-transparent rounded-full overflow-hidden">
                  <motion.div
                    animate={{ y: [-56, 56] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-1/2 bg-[#3f7a39]/45"
                  />
                </div>
              </motion.div>
            </section>

            <section
              id="details"
              className="relative pt-8 md:pt-20 pb-12 md:pb-32 w-full flex flex-col items-center overflow-hidden"
              style={{
                backgroundImage: 'url("/vintage_paper.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-4 md:inset-8 ] pointer-events-none z-10" />
              <div className="absolute inset-5 md:inset-10 ] pointer-events-none z-10" />

              <div className="max-w-[1100px] w-full flex flex-col items-center text-center relative z-20 px-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center mb-16 space-y-6"
                >
                  <div className="flex items-center gap-4 opacity-40">
                    <div className="h-px w-8 bg-[#2d5a27]" />
                    <Sparkles className="w-4 h-4 text-[#3f7a39]" />
                    <div className="h-px w-8 bg-[#2d5a27]" />
                  </div>

                  <div className="text-[#2d5a27] space-y-6 max-w-3xl mx-auto leading-relaxed text-base md:text-lg">
                    <p className="text-slate-700">
                      {INVITATION.couple.groomParents}
                    </p>
                    <h3 className="font-playball text-4xl md:text-5xl text-[#3f7a39] my-2">
                      {INVITATION.couple.groomFull}
                    </h3>

                    <p className="text-slate-700">
                      {INVITATION.couple.brideParents}
                    </p>
                    <h3 className="font-playball text-4xl md:text-5xl text-[#3f7a39] my-2">
                      {INVITATION.couple.brideFull}
                    </h3>

                    <p className="text-slate-700 max-w-2xl mx-auto pt-2">
                      We joyfully invite you to share in our happiness and bless us with your presence as we join hands in marriage.
                    </p>




                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <h2 className="text-xl md:text-2xl text-[#3f7a39] tracking-[0.5em] font-bold">
                    Wedding Celebration
                  </h2>
                </motion.div>

                <div className="relative w-full flex flex-col items-center justify-center my-8 md:my-12 mb-12 md:mb-24">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative z-20 w-full max-w-[560px] bg-gradient-to-b from-white to-[#fcfcfc] p-8 md:p-14 rounded-3xl border border-[#3f7a39]/30 shadow-[0_0_50px_-12px_rgba(45,90,39,0.25)] flex flex-col items-center justify-center text-center overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#2d5a27] via-[#52b788] to-[#2d5a27]" />
                    <div className="absolute inset-2 border border-[#3f7a39]/10 rounded-[1.5rem] pointer-events-none" />

                    <div className="w-full text-left grid grid-cols-1 gap-8 relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#3f7a39]/10 flex items-center justify-center shrink-0 border border-[#3f7a39]/20 shadow-inner">
                          <Calendar className="w-5 h-5 text-[#3f7a39]" />
                        </div>
                        <div className="pt-1">
                          <div className="text-xs md:text-[11px] tracking-[0.5em] font-bold text-[#2d5a27]/50 mb-1">
                            Date
                          </div>
                          <div className="text-base md:text-lg text-[#2d5a27] tracking-wide font-bold">
                            {INVITATION.date.displayLong}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#2d5a27]/10 flex items-center justify-center shrink-0 border border-[#2d5a27]/20 shadow-inner">
                          <Clock className="w-5 h-5 text-[#2d5a27]" />
                        </div>
                        <div className="pt-1">
                          <div className="text-xs md:text-[11px] tracking-[0.5em] font-bold text-[#2d5a27]/50 mb-1">
                            Time
                          </div>
                          <div className="text-base md:text-lg text-[#2d5a27] tracking-wide font-bold">
                            Poruwa Ceremony at {INVITATION.time.ceremonyStart}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#2d5a27]/10 flex items-center justify-center shrink-0 border border-[#2d5a27]/20 shadow-inner">
                          <MapPin className="w-5 h-5 text-[#2d5a27]" />
                        </div>
                        <div className="pt-1">
                          <div className="text-xs md:text-[11px] tracking-[0.5em] font-bold text-[#2d5a27]/50 mb-1">
                            Venue
                          </div>
                          <div className="text-base md:text-lg text-[#2d5a27] tracking-wide font-bold">
                            {INVITATION.venue.name}, {INVITATION.venue.city}
                          </div>
                          <a
                            href={INVITATION.venue.googleMapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex text-[10px] md:text-xs text-[#3f7a39] hover:text-[#1b4332] font-bold tracking-widest uppercase border-b border-[#3f7a39]/30 hover:border-[#1b4332] transition-colors pb-0.5"
                          >
                            View on Google Maps
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            <section className="relative py-14 md:py-48 bg-gradient-to-br from-[#a8801f] via-[#d4af37] to-[#9a7420] flex flex-col items-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="absolute -top-24 -right-24 w-96 h-96 bg-white blur-[100px] rounded-full pointer-events-none"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                className="absolute -bottom-24 -left-24 w-96 h-96 bg-white blur-[100px] rounded-full pointer-events-none"
              />

              <div className="w-full max-w-[1200px] px-6 flex flex-col items-center text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="relative mb-12 md:mb-20"
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "80px" }}
                      viewport={{ once: true }}
                      className="h-px bg-white/40 mb-8"
                    />

                    <h2 className="text-3xl md:text-6xl text-white tracking-[0.25em] md:tracking-[0.4em] font-bold leading-tight">
                      Save <span className="mx-2 md:mx-4 text-[#fff4d6]">the Date</span>
                    </h2>

                    <div className="mt-10 flex items-center justify-center gap-6">
                      <div className="h-[0.5px] w-8 md:w-16 bg-[#fff4d6]/50" />
                      <span className="font-numeric text-3xl md:text-5xl text-[#fff4d6] drop-shadow-md">
                        {INVITATION.date.displayNumeric}
                      </span>
                      <div className="h-[0.5px] w-8 md:w-16 bg-[#fff4d6]/50" />
                    </div>
                  </div>
                </motion.div>

                <CountdownTimer isDark />

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.8 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="mt-12 md:mt-20 flex flex-col items-center gap-4"
                >
                  <p className="text-sm md:text-base tracking-[0.6em] text-white font-bold text-center">
                    Counting down to our special day
                  </p>

                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                        className="w-1 h-1 bg-[#fff4d6] rotate-45"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>


            <section className="relative py-16 md:py-48 bg-transparent flex flex-col items-center overflow-hidden">
              <div className="container mx-auto px-4 max-w-4xl flex flex-col items-center relative z-10 w-full">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl md:text-4xl text-slate-800 tracking-[0.3em] mb-8 md:mb-12 text-center"
                >
                  RSVP
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="relative w-full max-w-[650px] bg-white p-6 md:p-10 shadow-[0_40px_100px_-25px_rgba(0,0,0,0.12)] flex flex-col items-center"
                >
                  <div className="w-full rounded-[1.5rem] p-6 md:p-8 flex flex-col items-center">
                    <h3 className="text-2xl md:text-4xl text-slate-800 mb-8 text-center">
                      Will you join us?
                    </h3>

                    <form className="w-full space-y-6 text-left" onSubmit={handleRsvpSubmit}>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 ml-1">Your Name</label>
                        <input
                          type="text"
                          placeholder="Enter your name..."
                          value={rsvpForm.name}
                          onChange={(e) => {
                            setRsvpStatus("idle");
                            setRsvpForm((prev) => ({ ...prev, name: e.target.value }));
                          }}
                          className="w-full bg-white rounded-lg px-4 py-3 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all text-base font-numeric"
                          required
                        />
                      </div>

                      <div className="space-y-4 pt-2">
                        <label className="text-xs font-bold text-slate-500 ml-1">
                          Will you attend our special day?
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setRsvpStatus("idle");
                            setRsvpForm((prev) => ({ ...prev, guests: "1" }));
                          }}
                          aria-pressed={rsvpForm.guests !== "0"}
                          className={`w-full py-5 md:py-6 rounded-xl text-sm md:text-base tracking-wide transition-all shadow-sm flex items-center justify-center px-4 leading-relaxed active:scale-[0.98] ${rsvpForm.guests !== "0" ? "bg-[#2d5a27] text-white hover:bg-[#1a5c4a]" : "bg-[#f3f3f3] hover:bg-slate-200 text-slate-700"}`}
                        >
                          Joyfully accept
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRsvpStatus("idle");
                            setRsvpForm((prev) => ({ ...prev, guests: "0" }));
                          }}
                          aria-pressed={rsvpForm.guests === "0"}
                          className={`w-full py-5 md:py-6 rounded-xl text-sm md:text-base tracking-wide transition-all shadow-sm flex items-center justify-center px-4 leading-relaxed active:scale-[0.98] ${rsvpForm.guests === "0" ? "bg-[#2d5a27] text-white hover:bg-[#1a5c4a]" : "bg-[#f3f3f3] hover:bg-slate-200 text-slate-700"}`}
                        >
                          Regretfully decline, but sending my blessings
                        </button>
                      </div>

                      {(rsvpStatus === "success" || rsvpStatus === "error") && (
                        <p
                          className={`text-xs text-center font-semibold ${rsvpStatus === "success" ? "text-emerald-600" : "text-red-500"
                            }`}
                        >
                          {rsvpStatus === "success"
                            ? "Thank you! Your response has been sent."
                            : "Please enter your name and try again."}
                        </p>
                      )}

                      <div className="pt-6">
                        <button
                          type="submit"
                          disabled={rsvpStatus === "sending"}
                          className="w-full bg-[#2d5a27] text-white py-4 md:py-5 rounded-xl text-sm md:text-base tracking-[0.2em] font-bold hover:bg-[#1a5c4a] transition-all shadow-md disabled:opacity-70"
                        >
                          {rsvpStatus === "sending" ? "Sending..." : "Confirm"}
                        </button>

                        <p className="text-xs text-slate-400 mt-4 text-center leading-relaxed">
                          Your response will be kept private.
                        </p>
                      </div>
                    </form>
                  </div>
                </motion.div>


              </div>
            </section>






            <section className="w-full relative overflow-hidden bg-transparent py-14 md:py-32">
              <div className="container mx-auto px-6 max-w-5xl text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-center gap-3 opacity-70">
                    <div className="h-px w-10 bg-[#2d5a27]/20" />
                    <Sparkles className="w-4 h-4 text-[#3f7a39]" />
                    <div className="h-px w-10 bg-[#2d5a27]/20" />
                  </div>

                  <h2 className="font-playball text-5xl md:text-7xl bg-gradient-to-r from-[#3f7a39] via-[#2d5a27] to-[#3f7a39] bg-clip-text text-transparent italic">
                    Thank You
                  </h2>

                  <p className="text-[#2d5a27]/70 text-sm md:text-base tracking-[0.25em] font-medium leading-loose max-w-3xl mx-auto">
                    Your presence will make the most beautiful day of our love story even more meaningful.
                  </p>

                  {INVITATION.rsvpContacts.length > 0 && (
                    <div className="pt-6 flex flex-col items-center gap-4 text-center w-full max-w-xl mx-auto">
                      <div className="h-px w-24 bg-[#2d5a27]/20" />
                      <p className="text-slate-500 text-xs tracking-[0.4em] font-bold mt-2">
                        Contact
                      </p>

                      <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-[#2d5a27]/70 text-base tracking-widest font-normal">
                        {INVITATION.rsvpContacts.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-sm md:text-base tracking-[0.5em] text-[#2d5a27]/50 font-bold pt-12">
                    © 2026 {INVITATION.couple.groom} &amp; {INVITATION.couple.bride}
                  </p>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src={backgroundMusic} loop preload="auto" />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .dl-manel-bold,
            input,
            textarea,
            button {
              font-family: 'Montserrat', sans-serif;
            }

            .dl-manel-bold .intro-cinzel {
              font-family: 'Cinzel', serif !important;
            }

            .dl-manel-bold .intro-montserrat {
              font-family: 'Montserrat', sans-serif !important;
            }

            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }

            .animate-spin-slow {
              animation: spin-slow linear infinite;
            }

            ::-webkit-scrollbar {
              width: 8px;
            }

            ::-webkit-scrollbar-track {
              background: #ccbaa233;
            }

            ::-webkit-scrollbar-thumb {
              background: #87937a66;
              border-radius: 10px;
            }
          `,
        }}
      />
    </main>
  );
}