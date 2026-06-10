import { createFileRoute, Navigate } from "@tanstack/react-router";

// OTP login (KwikPass) replaces email/password registration — accounts are
// created automatically on first successful OTP. We keep this route to avoid
// breaking inbound links and just forward to /login.
export const Route = createFileRoute("/register")({
  component: () => <Navigate to="/login" replace />,
});
