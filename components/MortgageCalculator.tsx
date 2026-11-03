"use client";

import React, { useState, useMemo } from "react";
import styles from "./MortgageCalculator.module.css";
import EnquiryModal from "@/components/EnquiryModal";

interface MortgageCalculatorProps {
  projectTitle?: string;
  defaultAmount?: number;
}

export default function MortgageCalculator({
  projectTitle = "Aura by Lifestyle",
  defaultAmount = 7500000,
}: MortgageCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(defaultAmount);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Monthly EMI Calculation Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenureYears * 12;

    const emiCalc =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const roundedEmi = Math.round(emiCalc);
    const totalPay = roundedEmi * totalMonths;
    const totalInt = totalPay - loanAmount;

    return {
      emi: roundedEmi,
      totalInterest: totalInt,
      totalPayment: totalPay,
    };
  }, [loanAmount, interestRate, tenureYears]);

  const formatLakhs = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(1)} Lakhs`;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleOpenBreakup = () => {
    setIsModalOpen(true);
  };

  return (
    <section className={styles.section} id="calculator" aria-label="Home Loan & Investment Calculator">
      <div className={styles.inner}>
        <div className={styles.header} data-reveal>
          <span className={styles.badge}>FINANCIAL PLANNING &amp; ASSISTANCE</span>
          <h2 className={styles.title}>
            MONTHLY EMI &amp; <span>INVESTMENT PLANNER</span>
          </h2>
          <p className={styles.subtitle}>
            Estimate monthly outflows for {projectTitle}. All apartments and commercial retail units are approved by leading nationalized banks for instant sanction.
          </p>
        </div>

        <div className={styles.calcGrid}>
          {/* Controls Column */}
          <div className={styles.controlsCol}>
            {/* Loan Amount */}
            <div className={styles.controlGroup}>
              <div className={styles.labelRow}>
                <span className={styles.controlLabel}>Required Loan Amount</span>
                <span className={styles.controlValue}>{formatLakhs(loanAmount)}</span>
              </div>
              <input
                type="range"
                min={3000000}
                max={25000000}
                step={500000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className={styles.slider}
                aria-label="Loan Amount Slider"
              />
              <div className={styles.sliderBounds}>
                <span>₹30 Lakhs</span>
                <span>₹2.50 Crore</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className={styles.controlGroup}>
              <div className={styles.labelRow}>
                <span className={styles.controlLabel}>Interest Rate (p.a.)</span>
                <span className={styles.controlValue}>{interestRate}%</span>
              </div>
              <input
                type="range"
                min={7.5}
                max={12.0}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className={styles.slider}
                aria-label="Interest Rate Slider"
              />
              <div className={styles.sliderBounds}>
                <span>7.5% (Prime Bank)</span>
                <span>12.0%</span>
              </div>
            </div>

            {/* Tenure */}
            <div className={styles.controlGroup}>
              <div className={styles.labelRow}>
                <span className={styles.controlLabel}>Loan Tenure</span>
                <span className={styles.controlValue}>{tenureYears} Years</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className={styles.slider}
                aria-label="Loan Tenure Slider"
              />
              <div className={styles.sliderBounds}>
                <span>5 Years</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className={styles.resultsCol}>
            <div className={styles.emiHeader}>
              <span className={styles.emiLabel}>Estimated Monthly Outflow</span>
              <div className={styles.emiAmount}>{formatCurrency(emi)}<span style={{ fontSize: "16px", fontWeight: 400, color: "#c5a880" }}> / mo</span></div>
            </div>

            <div className={styles.breakdownGrid}>
              <div className={styles.breakdownItem}>
                <span className={styles.breakdownLabel}>Loan Principal</span>
                <span className={styles.breakdownVal}>{formatLakhs(loanAmount)}</span>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.breakdownLabel}>Estimated Interest</span>
                <span className={styles.breakdownVal}>{formatLakhs(totalInterest)}</span>
              </div>
            </div>

            <div className={styles.bankBadgeRow}>
              <span className={styles.bankDot} />
              <span>Pre-approved by SBI, HDFC, ICICI, Axis &amp; Bank of Baroda</span>
            </div>

            <button
              type="button"
              className={styles.calcCtaBtn}
              onClick={handleOpenBreakup}
            >
              Get Custom Bank Loan &amp; EMI Breakup on WhatsApp →
            </button>
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectTitle={projectTitle}
        defaultPreference={`Home Loan Calculation: ${formatLakhs(loanAmount)} @ ${interestRate}% for ${tenureYears} yrs (EMI: ${formatCurrency(emi)}/mo)`}
        source="Mortgage Calculator"
      />
    </section>
  );
}
