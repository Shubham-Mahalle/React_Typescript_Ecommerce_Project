import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { login } from "../redux/authSlice";
import type { User } from "../types";
import { getFromStorage } from "../utils/localStorage";
import { AuthLayout, Field } from "./PageForm";

export function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const state = window.history.state?.usr as { message?: string } | undefined;
    if (state?.message) setMessage(state.message);
  }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email")).trim().toLowerCase();
    const password = String(data.get("password"));
    const user = getFromStorage<User[]>("shopeasy_users", []).find(
      (entry) => entry.email === email && entry.password === password,
    );
    if (!user) return setError("Email or password is incorrect.");
    dispatch(login(user));
    navigate("/products", { replace: true });
  }
  return (
    <AuthLayout title="Welcome back" intro="Log in to your ShopEasy account.">
      <form onSubmit={submit} className="form-stack">
        <Field label="Email address" name="email" type="email" />
        <Field label="Password" name="password" type="password" />
        {message && <p className="form-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}
        <button className="button button-dark full-width">Log in</button>
        <p className="form-footer">
          New to ShopEasy? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
