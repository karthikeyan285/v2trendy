import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Smartphone } from "lucide-react";
import {
  initKwikPass,
  isKwikPassConfigured,
  sendKwikPassOtp,
  verifyKwikPassOtp,
  KwikPassError,
} from "@/lib/kwikpass";
import { useCustomerStore } from "@/stores/customerStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — V2 Trendy" }] }),
  component: LoginPage,
});

type Step = "phone" | "otp";

function LoginPage() {
  const navigate = useNavigate();
  const setToken = useCustomerStore((s) => s.setToken);
  const isAuthed = useCustomerStore((s) => s.isAuthenticated());
  const hasHydrated = useCustomerStore((s) => s.hasHydrated);

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    if (hasHydrated && isAuthed) navigate({ to: "/account" });
  }, [hasHydrated, isAuthed, navigate]);

  useEffect(() => {
    if (!isKwikPassConfigured()) return;
    setInitializing(true);
    initKwikPass()
      .then((ok) => {
        setSdkReady(ok);
        if (!ok) {
          toast.error("Sign-in unavailable", {
            description: "KwikPass SDK could not be loaded.",
          });
        }
      })
      .finally(() => setInitializing(false));
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sdkReady) {
      toast.error("Please wait", {
        description: "KwikPass is still loading.",
      });
      return;
    }
    setLoading(true);
    try {
      await sendKwikPassOtp(phone);
      setStep("otp");
      setOtp("");
      toast.success("OTP sent", {
        description: "Check your phone for the one-time password.",
      });
    } catch (err) {
      toast.error("Could not send OTP", {
        description:
          err instanceof KwikPassError ? err.message : "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await verifyKwikPassOtp({ phone, otp });
      setToken(token);
      toast.success("Signed in");
      navigate({ to: "/account" });
    } catch (err) {
      toast.error("Verification failed", {
        description:
          err instanceof KwikPassError ? err.message : "Invalid or expired OTP.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await sendKwikPassOtp(phone);
      toast.success("OTP resent");
    } catch (err) {
      toast.error("Could not resend OTP", {
        description:
          err instanceof KwikPassError ? err.message : "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand">
          <Smartphone className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-center font-serif text-3xl">Sign in</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {step === "phone"
            ? "Enter your mobile number. We'll send you a one-time password."
            : `Enter the OTP sent to +91 ${phone.replace(/\D/g, "").slice(-10)}`}
        </p>

        {step === "phone" ? (
          <form className="mt-6 space-y-4" onSubmit={handleSendOtp}>
            <div className="space-y-2 text-left">
              <Label htmlFor="phone">Mobile number</Label>
              <div className="flex gap-2">
                <span className="flex h-9 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
                  +91
                </span>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  disabled={loading || initializing}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={
                loading || initializing || !sdkReady || phone.length < 10
              }
            >
              {loading || initializing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleVerifyOtp}>
            <div className="flex flex-col items-center gap-3">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                disabled={loading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || otp.length < 4}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Verify & sign in"
              )}
            </Button>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-foreground"
                onClick={() => setStep("phone")}
                disabled={loading}
              >
                <ArrowLeft className="h-3 w-3" />
                Change number
              </button>
              <button
                type="button"
                className="underline hover:text-foreground"
                onClick={handleResend}
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <Link to="/" className="underline hover:text-brand">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/" className="underline hover:text-brand">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
