"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./Chatbot.module.css";
import EnquiryModal from "@/components/EnquiryModal";
import { submitLead } from "@/lib/leads/submitLead";

const WHATSAPP_NUMBER = "917498256708";
const PHONE_NUMBER = "+917498256708";

interface Option {
  label: string;
  action: () => void;
  isWhatsApp?: boolean;
  isEnquiry?: boolean;
}

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  options?: Option[];
  /** Renders the in-chat name/mobile/consent form under this message. */
  leadForm?: boolean;
}

/** Answers collected by the qualification flow. */
interface Qualification {
  propertyType?: string;
  project?: string;
  timeline?: string;
  contactMode?: "Callback" | "Site visit";
  preferredTime?: string;
}

function ChatLeadInlineForm({
  qual,
  onSaved,
}: {
  qual: Qualification;
  onSaved: (name: string, refId: string) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    const digits = phone.replace(/\D/g, "");
    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (digits.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!consent) {
      setError("Please agree to be contacted.");
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    const preference = [
      qual.propertyType,
      qual.timeline ? `Timeline: ${qual.timeline}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const message = [
      qual.contactMode ? `Mode: ${qual.contactMode}` : null,
      qual.preferredTime ? `Preferred Time: ${qual.preferredTime}` : null,
      qual.timeline ? `Buying Timeline: ${qual.timeline}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    try {
      const res = await submitLead({
        name: name.trim(),
        phone: digits,
        project: qual.project || "Aura by Lifestyle",
        preference: preference || undefined,
        message: message || undefined,
        source: "Website Chatbot",
        consent: true,
      });

      if (!res.ok) {
        setError(res.error);
        return;
      }

      onSaved(name.trim(), res.referenceId);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.inChatForm} noValidate>
      <input
        type="text"
        required
        placeholder="Your Full Name *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.inChatInput}
      />
      <input
        type="tel"
        required
        placeholder="10-digit Mobile Number *"
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s-]/g, ""))}
        className={styles.inChatInput}
      />
      <label className={styles.inChatConsent}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>I agree to be contacted by Lifestyle Home Spaces on WhatsApp/Call.</span>
      </label>
      {error && <p className={styles.inChatError}>{error}</p>}
      <button type="submit" disabled={isSubmitting} className={styles.inChatSubmit}>
        {isSubmitting
          ? "Connecting..."
          : qual.contactMode === "Site visit"
          ? "Confirm Site Visit Request"
          : "Request Callback"}
      </button>
    </form>
  );
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryProject, setEnquiryProject] = useState("Aura by Lifestyle");
  const [enquiryPreference, setEnquiryPreference] = useState("2 & 3 BHK Luxury Residences");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCounterRef = useRef(0);
  const qualRef = useRef<Qualification>({});

  const openEnquiry = (project = "Aura by Lifestyle", preference = "2 & 3 BHK Luxury Residences") => {
    // Only open the chatbot's own modal. (Previously this also dispatched
    // "lifestyle_open_enquiry", which made SiteNav open a SECOND enquiry modal
    // on top — risking duplicate submissions and duplicate Meta Lead events.)
    setEnquiryProject(project);
    setEnquiryPreference(preference);
    setIsEnquiryOpen(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: "1",
            sender: "bot",
            text: "Namaste! Welcome to Lifestyle Home Spaces.\n\nI am your digital portfolio concierge. Which landmark development in Amravati would you like to explore today?",
            options: [
              {
                label: "🤝 Request Callback / Site Visit",
                action: () => startQualification(),
                isEnquiry: true,
              },
              {
                label: "📝 Submit Online Enquiry Form",
                action: () => openEnquiry("Aura by Lifestyle", "General Concierge Enquiry"),
                isEnquiry: true,
              },
              { label: "✨ Aura by Lifestyle (Skyline Highrise)", action: () => handleOptionClick("Aura Details") },
              { label: "🏛️ Lifestyle Homes (Delivered Landmark)", action: () => handleOptionClick("Lifestyle Homes Details") },
              { label: "⚖️ Compare Both Projects", action: () => handleOptionClick("Compare Projects") },
              { label: "📐 Floor Plans & Layouts", action: () => handleOptionClick("Aura Floor Plans") },
              { label: "🛍️ Commercial Retail & Offices", action: () => handleOptionClick("Commercial Retail") },
              { label: "📍 Locations & Connectivity", action: () => handleOptionClick("Locations") },
              {
                label: "💬 Talk to Sales on WhatsApp",
                action: () => handleOptionClick("Contact Sales"),
                isWhatsApp: true,
              },
            ],
          },
        ]);
      }, 250);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (msg: Omit<Message, "id">) => {
    messageCounterRef.current += 1;
    const id = `${Date.now()}-${messageCounterRef.current}`;
    setMessages((prev) => [...prev, { ...msg, id }]);
  };

  /** Shows the visitor's choice, then the bot's next question after a short pause. */
  const reply = (userText: string, bot: Omit<Message, "id" | "sender">) => {
    addMessage({ sender: "user", text: userText });
    setTimeout(() => addMessage({ sender: "bot", ...bot }), 350);
  };

  // ---------- Lead qualification flow ----------

  const startQualification = () => {
    qualRef.current = {};
    reply("I'd like a callback / site visit", {
      text: "Hello! Are you looking for a home or a shop in Amravati?",
      options: [
        { label: "2 BHK flat", action: () => selectPropertyType("2 BHK flat") },
        { label: "3 BHK flat", action: () => selectPropertyType("3 BHK flat") },
        { label: "Shop / Showroom", action: () => selectPropertyType("Shop / Showroom") },
        { label: "Office space", action: () => selectPropertyType("Office space") },
      ],
    });
  };

  const selectPropertyType = (propertyType: string) => {
    qualRef.current.propertyType = propertyType;
    reply(propertyType, {
      text: "Which project would you like to explore?",
      options: [
        {
          label: "Aura by Lifestyle (Congress Nagar Rd)",
          action: () => selectProject("Aura by Lifestyle"),
        },
        {
          label: "Lifestyle Home Spaces (DPS Rd, ready to move)",
          action: () => selectProject("Lifestyle Home Spaces"),
        },
        { label: "Not sure yet", action: () => selectProject("Not sure yet") },
      ],
    });
  };

  const selectProject = (project: string) => {
    qualRef.current.project = project;
    reply(project, {
      text: "When are you planning to buy?",
      options: ["Immediately", "Within 3 months", "3–6 months", "Just exploring"].map((t) => ({
        label: t,
        action: () => selectTimeline(t),
      })),
    });
  };

  const selectTimeline = (timeline: string) => {
    qualRef.current.timeline = timeline;
    reply(timeline, {
      text: "How would you like us to help?",
      options: [
        { label: "📞 Request a callback", action: () => selectContactMode("Callback") },
        { label: "🏢 Book a site visit", action: () => selectContactMode("Site visit") },
      ],
    });
  };

  const selectContactMode = (mode: "Callback" | "Site visit") => {
    qualRef.current.contactMode = mode;
    reply(mode === "Callback" ? "Request a callback" : "Book a site visit", {
      text: "What time suits you best?",
      options: ["Morning (10am–1pm)", "Afternoon (1–5pm)", "Evening (5–8pm)"].map((t) => ({
        label: t,
        action: () => selectPreferredTime(t),
      })),
    });
  };

  const selectPreferredTime = (preferredTime: string) => {
    qualRef.current.preferredTime = preferredTime;
    const mode = qualRef.current.contactMode === "Site visit" ? "site visit" : "callback";
    reply(preferredTime, {
      text: `I can arrange a ${mode}. Please share your name and mobile number to continue.`,
      leadForm: true,
    });
  };

  /** Called by the in-chat form after the server accepted the lead. */
  const handleChatLeadSaved = (formMessageId: string, name: string, referenceId: string) => {
    // Hide the form so it can't be submitted twice.
    setMessages((prev) =>
      prev.map((m) => (m.id === formMessageId ? { ...m, leadForm: false } : m))
    );
    const q = qualRef.current;
    addMessage({
      sender: "bot",
      text: `Thank you, ${name}! ✅\n\nYour ${
        q.contactMode === "Site visit" ? "site visit request" : "callback request"
      } has been registered${referenceId ? ` under Reference ID ${referenceId}` : ""}. Our property advisor will contact you ${
        q.preferredTime ? `in the ${q.preferredTime.split(" ")[0].toLowerCase()}` : "shortly"
      }.`,
      options: [{ label: "↩ Main Menu", action: () => handleOptionClick("Main Menu") }],
    });
  };

  const handleOptionClick = (optionLabel: string) => {
    addMessage({ sender: "user", text: optionLabel });

    setTimeout(() => {
      let botResponse: Omit<Message, "id"> = { sender: "bot", text: "" };

      switch (optionLabel) {
        case "Submit Online Enquiry Form":
        case "Submit Enquiry Form":
        case "Enquire Now":
          openEnquiry("Aura by Lifestyle", "Concierge Chat Enquiry");
          botResponse = {
            sender: "bot",
            text: "Opening our official VIP Enquiry Form for you.\n\nPlease enter your name and phone number in the form to register your enquiry directly in our Real Estate CRM.",
            options: [
              {
                label: "📝 Reopen Enquiry Form",
                action: () => openEnquiry("Aura by Lifestyle", "Concierge Chat Enquiry"),
                isEnquiry: true,
              },
              {
                label: "💬 Talk to Sales on WhatsApp",
                action: () => handleOptionClick("Contact Sales"),
                isWhatsApp: true,
              },
              { label: "↩ Main Menu", action: () => handleOptionClick("Main Menu") },
            ],
          };
          break;

        case "Aura Details":
          botResponse = {
            sender: "bot",
            text: "🌟 Aura by Lifestyle — 'Life Beyond Imagination'\n\n• Concept: Skyline Highrise luxury with rooftop sky deck amenities.\n• Configuration: 2 & 3 BHK luxury residences + 3 levels of high-street commercial retail & offices.\n• Rooftop Sky Deck: Rooftop swimming pool & kids pool, multi-sports turf with box cricket, viewing deck & party terrace.\n• Location: Congress Nagar Road, Next to Dreamz Signature, Amravati.\n• MahaRERA: P5030002502915.\n• Elevators: 4 elevators (2 regular, 1 stretcher, 1 service) with 100% generator backup.",
            options: [
              {
                label: "📝 Submit Aura Enquiry Form",
                action: () => openEnquiry("Aura by Lifestyle", "2 & 3 BHK Luxury Residences"),
                isEnquiry: true,
              },
              { label: "📐 Aura Floor Plans", action: () => handleOptionClick("Aura Floor Plans") },
              { label: "🛍️ Aura Retail & Offices", action: () => handleOptionClick("Commercial Retail") },
              { label: "📍 Aura Location Map", action: () => handleOptionClick("Locations") },
              {
                label: "💬 Book Aura Site Visit (WhatsApp)",
                action: () => handleOptionClick("Contact Sales"),
                isWhatsApp: true,
              },
              { label: "↩ Main Menu", action: () => handleOptionClick("Main Menu") },
            ],
          };
          break;

        case "Lifestyle Homes Details":
          botResponse = {
            sender: "bot",
            text: "🏛️ Lifestyle Homes — 'Where Space Meets The Way You Live'\n\n• Status: 100% Delivered & Ready for Immediate Possession!\n• Configuration: 12 Units of 3 BHK suites, 18 Units of 2 BHK residences, and 24 integrated ground/1st floor retail shops.\n• Highlights: 100% Vastu compliance, cross-ventilation, covered parking, and 24/7 security.\n• Location: DPS Road, Parvati Nagar, Near Avinashe Avenue, Amravati.\n• MahaRERA: P50300054447.",
            options: [
              {
                label: "📝 Submit Lifestyle Homes Enquiry",
                action: () => openEnquiry("Lifestyle Homes", "Ready Possession 2 & 3 BHK"),
                isEnquiry: true,
              },
              { label: "📐 Lifestyle Plans", action: () => handleOptionClick("Lifestyle Plans") },
              { label: "📍 View on Google Maps", action: () => handleOptionClick("Locations") },
              {
                label: "💬 Schedule Ready Home Visit",
                action: () => handleOptionClick("Contact Sales"),
                isWhatsApp: true,
              },
              { label: "↩ Main Menu", action: () => handleOptionClick("Main Menu") },
            ],
          };
          break;

        case "Compare Projects":
          botResponse = {
            sender: "bot",
            text: "📊 Project Comparison Summary:\n\n1. AURA BY LIFESTYLE\n• Skyline 15-storey architectural highrise\n• Rooftop sky deck, rooftop swimming pool, box cricket turf & gym\n• Congress Nagar prime commercial corridor\n• Ideal for skyline luxury living & prime retail investment\n\n2. LIFESTYLE HOMES\n• 100% Ready for immediate possession\n• Exclusive community of 30 residences on DPS Road\n• Ground & first floor retail arcade\n• Ideal for immediate move-in & peaceful family living",
            options: [
              {
                label: "📝 Submit Project Enquiry Form",
                action: () => openEnquiry("Aura & Lifestyle Homes", "Comparison & Booking Enquiry"),
                isEnquiry: true,
              },
              { label: "Explore Aura Details", action: () => handleOptionClick("Aura Details") },
              { label: "Explore Lifestyle Homes", action: () => handleOptionClick("Lifestyle Homes Details") },
              {
                label: "💬 Connect with Property Advisor",
                action: () => handleOptionClick("Contact Sales"),
                isWhatsApp: true,
              },
              { label: "↩ Main Menu", action: () => handleOptionClick("Main Menu") },
            ],
          };
          break;

        case "Aura Floor Plans":
          botResponse = {
            sender: "bot",
            text: "📐 Aura Floor Plans & Dimensions:\n\n• 2 BHK Luxury:\n  - Master Bed: 11’0” × 12’0”\n  - Kids Bedroom: 11’0” × 12’0”\n  - Living & Dining: 11’0” × 17’0”\n  - Private Balcony: 10’6” × 6’0”\n\n• 3 BHK Grand Suite:\n  - Master Suite: 11’0” × 15’0” with dressing area\n  - Guest Bedroom: 11’0” × 12’0”\n  - Children's Suite: 11’0” × 12’0”\n  - 3 Panoramic Viewing Balconies\n\n• Levels: Typical floors 3rd through 13th.",
            options: [
              {
                label: "📝 Request Floor Plans (Enquiry Form)",
                action: () => openEnquiry("Aura by Lifestyle", "Floor Plans & Cut-Sections"),
                isEnquiry: true,
              },
              {
                label: "💬 Request PDF Floor Plans via WhatsApp",
                action: () => handleOptionClick("Contact Sales"),
                isWhatsApp: true,
              },
              { label: "Explore Retail Showrooms", action: () => handleOptionClick("Commercial Retail") },
              { label: "↩ Main Menu", action: () => handleOptionClick("Main Menu") },
            ],
          };
          break;

        case "Lifestyle Plans":
          botResponse = {
            sender: "bot",
            text: "📐 Lifestyle Homes Ready Layouts (DPS Road):\n\n• 2 BHK (Type A & B): 675 – 745 sq.ft carpet area, Vastu-compliant north/east entrances, dual attached balconies.\n• 3 BHK Royal Suites: 940 – 1025 sq.ft carpet area, three wide balconies, large modular kitchen layout, separate dry terrace.\n• All units ready for key handover.",
            options: [
              {
                label: "📝 Enquire for Ready Flat Walkthrough",
                action: () => openEnquiry("Lifestyle Homes", "Ready Possession Walkthrough"),
                isEnquiry: true,
              },
              {
                label: "💬 Book Finished Flat Walkthrough",
                action: () => handleOptionClick("Contact Sales"),
                isWhatsApp: true,
              },
              { label: "↩ Main Menu", action: () => handleOptionClick("Main Menu") },
            ],
          };
          break;

        case "Commercial Retail":
          botResponse = {
            sender: "bot",
            text: "🛍️ Commercial & Corporate Retail at Lifestyle:\n\n1. Aura by Lifestyle (Congress Nagar Road):\n• Lower Ground: 24 Shops (G-01 to G-24) with dedicated customer parking.\n• Upper Ground: Retail Showrooms (U-01 to U-22) & Offices (OU-01 to OU-19) with 3.3m wide corridors.\n• First Floor: Showrooms (F-01 to F-21) and executive corporate suites.\n\n2. Lifestyle Homes (DPS Road):\n• 24 Road-facing retail shops with active footfall (Dee Bakers and commercial brands).",
            options: [
              {
                label: "📝 Submit Commercial Enquiry Form",
                action: () => openEnquiry("Aura Commercial & Retail", "Retail Showroom / Office"),
                isEnquiry: true,
              },
              {
                label: "💬 Enquire for Retail Showroom (WhatsApp)",
                action: () => handleOptionClick("Contact Sales"),
                isWhatsApp: true,
              },
              { label: "↩ Main Menu", action: () => handleOptionClick("Main Menu") },
            ],
          };
          break;

        case "Locations":
          botResponse = {
            sender: "bot",
            text: "📍 Prime Amravati Addresses:\n\n1. Aura by Lifestyle: Congress Nagar Road, Next to Dreamz Signature, Amravati.\n(5 min to Super Speciality Hospital, D-Mart, ST Bus Stand)\n\n2. Lifestyle Homes: DPS Road, Parvati Nagar, Near Avinashe Avenue, Amravati.\n(2 min to Delhi Public School, instant Ring Road access)\n\n3. Corporate Headquarters: Shop No. 104, 1st Floor, Next Level Mall, Camp, Amravati.",
            options: [
              {
                label: "📝 Submit Site Visit Booking Form",
                action: () => openEnquiry("Aura by Lifestyle", "Site Visit Booking"),
                isEnquiry: true,
              },
              {
                label: "🗺️ Aura on Google Maps",
                action: () =>
                  window.open(
                    "https://maps.google.com/?q=Congress+Nagar+Road+Next+To+Dreamz+Signature+Amravati",
                    "_blank"
                  ),
              },
              {
                label: "🗺️ Lifestyle Homes on Google Maps",
                action: () =>
                  window.open(
                    "https://maps.google.com/?q=DPS+Road+Parvati+Nagar+Amravati",
                    "_blank"
                  ),
              },
              {
                label: "🗺️ Head Office on Google Maps",
                action: () =>
                  window.open("https://maps.app.goo.gl/24P5tAitT1zZAdNc8", "_blank"),
              },
              {
                label: "💬 Talk to Sales on WhatsApp",
                action: () => handleOptionClick("Contact Sales"),
                isWhatsApp: true,
              },
              { label: "↩ Main Menu", action: () => handleOptionClick("Main Menu") },
            ],
          };
          break;

        case "Contact Sales":
          botResponse = {
            sender: "bot",
            text: `Our official sales desk is available via Online Enquiry, WhatsApp & Direct Phone at +91 ${WHATSAPP_NUMBER}.\n\nChoose an option below to connect with our senior property advisory team:`,
            options: [
              {
                label: "📝 Submit Online Enquiry Form",
                action: () => openEnquiry("Aura by Lifestyle", "Sales Desk Enquiry"),
                isEnquiry: true,
              },
              {
                label: "💬 Open WhatsApp Concierge",
                action: () => {
                  const message = encodeURIComponent(
                    "Hello Lifestyle Team, I am interested in Lifestyle Home Spaces developments (Aura by Lifestyle & Lifestyle Homes in Amravati). Please share brochures and schedule a visit."
                  );
                  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
                },
                isWhatsApp: true,
              },
              {
                label: "📞 Call +91 7498256708 Directly",
                action: () => {
                  window.location.href = `tel:${PHONE_NUMBER}`;
                },
              },
              { label: "↩ Main Menu", action: () => handleOptionClick("Main Menu") },
            ],
          };
          break;

        case "Main Menu":
        default:
          botResponse = {
            sender: "bot",
            text: "How can I assist you further with Lifestyle Home Spaces portfolio?",
            options: [
              {
                label: "🤝 Request Callback / Site Visit",
                action: () => startQualification(),
                isEnquiry: true,
              },
              {
                label: "📝 Submit Online Enquiry Form",
                action: () => openEnquiry("Aura by Lifestyle", "General Concierge Enquiry"),
                isEnquiry: true,
              },
              { label: "✨ Aura by Lifestyle", action: () => handleOptionClick("Aura Details") },
              { label: "🏛️ Lifestyle Homes", action: () => handleOptionClick("Lifestyle Homes Details") },
              { label: "⚖️ Compare Both Projects", action: () => handleOptionClick("Compare Projects") },
              { label: "📐 Floor Plans", action: () => handleOptionClick("Aura Floor Plans") },
              { label: "🛍️ Commercial Retail", action: () => handleOptionClick("Commercial Retail") },
              { label: "📍 Locations & Maps", action: () => handleOptionClick("Locations") },
              {
                label: "💬 Talk to Sales on WhatsApp",
                action: () => handleOptionClick("Contact Sales"),
                isWhatsApp: true,
              },
            ],
          };
          break;
      }

      addMessage(botResponse);
    }, 350);
  };

  return (
    <>
      {/* Floating Concierge Bubble */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={styles.floatingButton}
          aria-label="Open Project Concierge"
        >
          <div className={styles.pulseRing} />
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className={styles.tooltip}>
            ✨ Explore Aura &amp; Lifestyle Homes
          </span>
        </button>
      )}

      {/* Concierge Window */}
      {isOpen && (
        <div className={styles.chatWindow} role="dialog" aria-modal="true">
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <div className={styles.avatar}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                  <rect x="4" y="8" width="16" height="12" rx="2" />
                  <circle cx="9" cy="13" r="1" fill="currentColor" />
                  <circle cx="15" cy="13" r="1" fill="currentColor" />
                  <path d="M9 17h6" />
                </svg>
              </div>
              <div className={styles.titleArea}>
                <span className={styles.chatTitle}>Lifestyle Concierge</span>
                <span className={styles.chatStatus}>
                  <span className={styles.statusDot} />
                  Portfolio Assistant Online
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
              aria-label="Close Concierge"
            >
              ✕
            </button>
          </div>

          {/* Message Feed */}
          <div className={styles.messageFeed}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${
                  msg.sender === "user" ? styles.rowUser : styles.rowBot
                }`}
              >
                <div
                  className={`${styles.messageBubble} ${
                    msg.sender === "user" ? styles.userBubble : styles.botBubble
                  }`}
                >
                  {msg.text}
                </div>

                {/* In-Chat Lead Capture Form */}
                {msg.leadForm && (
                  <ChatLeadInlineForm
                    qual={qualRef.current}
                    onSaved={(savedName, refId) =>
                      handleChatLeadSaved(msg.id, savedName, refId)
                    }
                  />
                )}

                {/* Interactive Option Pills */}
                {msg.options && (
                  <div className={styles.optionsContainer}>
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={opt.action}
                        className={`${styles.optionPill} ${
                          opt.isWhatsApp
                            ? styles.optionPillWhatsApp
                            : opt.isEnquiry
                            ? styles.optionPillEnquiry
                            : ""
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Call Desk */}
          <div className={styles.chatFooter}>
            <span>Official Sales Desk:</span>
            <a href={`tel:${PHONE_NUMBER}`} className={styles.deskLink}>
              📞 +91 7498256708
            </a>
          </div>
        </div>
      )}

      {/* Instant VIP CRM Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        projectTitle={enquiryProject}
        defaultPreference={enquiryPreference}
      />
    </>
  );
}
