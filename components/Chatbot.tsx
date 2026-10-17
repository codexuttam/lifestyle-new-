"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./Chatbot.module.css";

const WHATSAPP_NUMBER = "918530763405";
const PHONE_NUMBER = "+918530763405";

interface Option {
  label: string;
  action: () => void;
  isWhatsApp?: boolean;
}

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  options?: Option[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    setMessages((prev) => [...prev, { ...msg, id: Date.now().toString() }]);
  };

  const handleOptionClick = (optionLabel: string) => {
    addMessage({ sender: "user", text: optionLabel });

    setTimeout(() => {
      let botResponse: Omit<Message, "id"> = { sender: "bot", text: "" };

      switch (optionLabel) {
        case "Aura Details":
          botResponse = {
            sender: "bot",
            text: "🌟 Aura by Lifestyle — 'Life Beyond Imagination'\n\n• Concept: Skyline Highrise luxury with rooftop sky deck amenities.\n• Configuration: 2 & 3 BHK luxury residences + 3 levels of high-street commercial retail & offices.\n• Rooftop Sky Deck: Rooftop swimming pool & kids pool, multi-sports turf with box cricket, viewing deck & party terrace.\n• Location: Congress Nagar Road, Next to Dreamz Signature, Amravati.\n• MahaRERA: P5030002502915.\n• Elevators: 4 elevators (2 regular, 1 stretcher, 1 service) with 100% generator backup.",
            options: [
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
                label: "💬 Enquire for Retail Showroom",
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
            text: `Our official sales desk is available on WhatsApp & Phone at +91 ${WHATSAPP_NUMBER}.\n\nClick below to open WhatsApp with your chosen inquiry.`,
            options: [
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
                label: "📞 Call +91 8530763405 Directly",
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

                {/* Interactive Option Pills */}
                {msg.options && (
                  <div className={styles.optionsContainer}>
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={opt.action}
                        className={`${styles.optionPill} ${
                          opt.isWhatsApp ? styles.optionPillWhatsApp : ""
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
              📞 +91 8530763405
            </a>
          </div>
        </div>
      )}
    </>
  );
}
