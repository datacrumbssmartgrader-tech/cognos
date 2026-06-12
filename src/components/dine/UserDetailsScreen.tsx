"use client";

import React, { useState } from "react";
import styles from "./UserDetailsScreen.module.css";

interface UserDetailsScreenProps {
  onSubmit: (details: { name: string; email: string; phone: string }) => void;
}

const NAME_RE = /^[a-zA-Z\s'\-]{2,50}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s\-()+]{7,20}$/;

export default function UserDetailsScreen({ onSubmit }: UserDetailsScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  const handleSubmit = () => {
    const errs: { name?: string; email?: string; phone?: string } = {};

    if (!name.trim()) {
      errs.name = "Name is required.";
    } else if (!NAME_RE.test(name.trim())) {
      errs.name = "Enter a valid name (letters only, 2–50 characters).";
    }

    if (email.trim() && !EMAIL_RE.test(email.trim())) {
      errs.email = "Enter a valid email address.";
    }

    if (!phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!PHONE_RE.test(phone.trim())) {
      errs.phone = "Enter a valid phone number (digits, spaces, +, -, parentheses).";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() });
  };

  return (
    <div className={styles.screen}>
      <div className={styles.foreground}>
        <h2 className={styles.title}>Welcome!</h2>
        <p className={styles.subtitle}>Please enter your details to proceed.</p>

        <div className={styles.formGroup}>
          <div className={styles.inputGroup}>
            <label htmlFor="ud-name" className={styles.label}>Full Name</label>
            <input
              type="text"
              id="ud-name"
              placeholder="John Doe"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <div className={styles.error}>{errors.name}</div>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="ud-email" className={styles.label}>Email</label>
            <input
              type="email"
              id="ud-email"
              placeholder="john@example.com"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className={styles.error}>{errors.email}</div>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="ud-phone" className={styles.label}>Phone Number</label>
            <input
              type="tel"
              id="ud-phone"
              placeholder="+92 300 1234567"
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && <div className={styles.error}>{errors.phone}</div>}
          </div>

          <button onClick={handleSubmit} className={styles.button}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
