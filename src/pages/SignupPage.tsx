import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../types";
import { getFromStorage, saveToStorage } from "../utils/localStorage";
import { AuthLayout, Field } from "./PageForm";

export function SignupPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name")).trim();
    const email = String(data.get("email")).trim().toLowerCase();
    const password = String(data.get("password"));
    const confirm = String(data.get("confirm"));
    if (!name || !email || !password || !confirm)
      return setError("Please complete every field.");
    if (!/^\S+@\S+\.\S+$/.test(email))
      return setError("Enter a valid email address.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    const users = getFromStorage<User[]>("shopeasy_users", []);
    if (users.some((user) => user.email === email))
      return setError("An account with this email already exists.");
    users.push({ name, email, password });
    saveToStorage("shopeasy_users", users);
    navigate("/login", {
      state: { message: "Account created. Please log in." },
    });
  }
  return (
    <AuthLayout title="Create account" intro="A better way to shop, made easy.">
      <form onSubmit={submit} className="form-stack">
        <Field label="Full name" name="name" />
        <Field label="Email address" name="email" type="email" />
        <Field label="Password" name="password" type="password" />
        <Field label="Confirm password" name="confirm" type="password" />
        {error && <p className="form-error">{error}</p>}
        <button className="button button-dark full-width">
          Create account
        </button>
        <p className="form-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
