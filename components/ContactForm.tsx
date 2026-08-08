"use client";

import { useEffect, useRef, useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    e.currentTarget.reset();
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <form id="booking-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input type="text" id="name" placeholder="Full Name" required />
      </div>
      <div className="form-row">
        <div className="form-group">
          <input type="tel" id="phone" placeholder="Phone Number" required />
        </div>
        <div className="form-group">
          <input type="email" id="email" placeholder="Email Address" required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <input type="text" id="city" placeholder="City / Plot Location" required />
        </div>
        <div className="form-group">
          <input type="number" id="plot-size" placeholder="Plot Size (sq yards)" required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <select id="type" required defaultValue="">
            <option value="" disabled>
              Construction Type
            </option>
            <option value="new">New House Construction</option>
            <option value="renovation">Renovation</option>
            <option value="commercial">Commercial</option>
            <option value="plot">Plot Development</option>
          </select>
        </div>
        <div className="form-group">
          <select id="package" required defaultValue="">
            <option value="" disabled>
              Preferred Package
            </option>
            <option value="essential">Essential</option>
            <option value="premium">Premium</option>
            <option value="luxury">Luxury</option>
            <option value="unsure">Not Sure Yet</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <input type="date" id="date" placeholder="Expected Start Date" />
      </div>
      <div className="form-group">
        <textarea id="message" rows={4} placeholder="Message / Additional Requirements" />
      </div>
      <button type="submit" className="cta-button solid full-width">
        Book Free Site Visit
      </button>
      {submitted && (
        <p
          id="form-success"
          style={{ color: "#c9a84c", marginTop: 15, textAlign: "center" }}
        >
          Thank you! Our team will contact you within 24 hours to schedule your
          free site visit.
        </p>
      )}
    </form>
  );
}
