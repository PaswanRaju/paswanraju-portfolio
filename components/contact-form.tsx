"use client";

import { ArrowRight } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { personalInfo } from "../data/site";

type Field = "name" | "email" | "message";
type Status = "idle" | "sending" | "sent" | "failed" | "unconfigured";

const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
const emptyValues: Record<Field, string> = { name: "", email: "", message: "" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Record<Field, string>) {
  const errors: Partial<Record<Field, string>> = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!emailPattern.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (!values.message.trim()) errors.message = "Please enter a message.";
  return errors;
}

// Posts to Formspree as JSON. `_gotcha` is Formspree's honeypot: people never see it, bots that fill it get dropped.
export default function ContactForm() {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const update = (field: Field, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    const firstInvalid = (Object.keys(nextErrors) as Field[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    // Without a form ID there's nowhere to send to, so say so instead of posting to a broken URL.
    if (!formspreeId) {
      console.error("Contact form: NEXT_PUBLIC_FORMSPREE_ID is not set.");
      setStatus("unconfigured");
      return;
    }
    const gotcha = new FormData(event.currentTarget).get("_gotcha");
    setStatus("sending");
    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: values.name.trim(), email: values.email.trim(), message: values.message.trim(), _subject: "New message from paswanraju.com", _gotcha: gotcha ?? "" }),
      });
      if (!response.ok) throw new Error(`Formspree responded with ${response.status}`);
      setValues(emptyValues);
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  const fieldProps = (field: Field) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
  });
  const fieldError = (field: Field) => errors[field] && <p className="connect-field-error" id={`contact-${field}-error`}>{errors[field]}</p>;

  return <form ref={formRef} className="connect-form" onSubmit={submit} noValidate aria-label="Contact form">
    <div className="connect-field">
      <label htmlFor="contact-name">Name</label>
      <input {...fieldProps("name")} type="text" autoComplete="name" placeholder="Your name" onChange={(event) => update("name", event.target.value)} />
      {fieldError("name")}
    </div>
    <div className="connect-field">
      <label htmlFor="contact-email">Email</label>
      <input {...fieldProps("email")} type="email" autoComplete="email" placeholder="you@example.com" onChange={(event) => update("email", event.target.value)} />
      {fieldError("email")}
    </div>
    <div className="connect-field">
      <label htmlFor="contact-message">Message</label>
      <textarea {...fieldProps("message")} rows={6} placeholder="Tell me what you have in mind." onChange={(event) => update("message", event.target.value)} />
      {fieldError("message")}
    </div>
    <div className="connect-honeypot" aria-hidden="true">
      <label htmlFor="contact-gotcha">Leave this field empty</label>
      <input id="contact-gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
    </div>
    <button className="connect-submit" type="submit" disabled={status === "sending"}>
      {status === "sending" ? "Sending..." : <>Send message<ArrowRight size={18} aria-hidden="true" /></>}
    </button>
    <div role="status" aria-live="polite">
      {status === "sent" && <p className="connect-result is-success">Thanks! Your message was sent. I&apos;ll get back to you soon.</p>}
      {status === "unconfigured" && <p className="connect-result is-error">The contact form isn&apos;t set up yet. Please email me directly at <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>.</p>}
      {status === "failed" && <p className="connect-result is-error">Sorry, your message couldn&apos;t be sent. Please email me directly at <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>.</p>}
    </div>
  </form>;
}
