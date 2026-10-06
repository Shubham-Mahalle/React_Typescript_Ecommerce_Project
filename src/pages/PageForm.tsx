import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function AuthLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/products" className="brand auth-brand">
          <span className="brand-mark">s.</span> shopeasy
        </Link>
        <h1>{title}</h1>
        <p className="muted">{intro}</p>
        {children}
      </section>
    </main>
  );
}
export function Field({
  label,
  name,
  type = "text",
  required = true,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="field-label">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
      />
    </label>
  );
}
