import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useCustomerStore, i as isKwikPassConfigured, a as initKwikPass, B as Button, s as sendKwikPassOtp, K as KwikPassError, c as cn, v as verifyKwikPassOtp } from "./router-2OYwdekT.mjs";
import { I as Input } from "./input-CZ1EVczw.mjs";
import { R as Root } from "../_libs/radix-ui__react-label.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { L as Lt, j as jt } from "../_libs/input-otp.mjs";
import { f as Smartphone, e as LoaderCircle, A as ArrowLeft, c as Minus } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/zustand.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = Root.displayName;
const InputOTP = reactExports.forwardRef(({ className, containerClassName, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Lt,
  {
    ref,
    containerClassName: cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    ),
    className: cn("disabled:cursor-not-allowed", className),
    ...props
  }
));
InputOTP.displayName = "InputOTP";
const InputOTPGroup = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex items-center", className), ...props }));
InputOTPGroup.displayName = "InputOTPGroup";
const InputOTPSlot = reactExports.forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = reactExports.useContext(jt);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref,
      className: cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-ring",
        className
      ),
      ...props,
      children: [
        char,
        hasFakeCaret && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px animate-caret-blink bg-foreground duration-1000" }) })
      ]
    }
  );
});
InputOTPSlot.displayName = "InputOTPSlot";
const InputOTPSeparator = reactExports.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, role: "separator", ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, {}) }));
InputOTPSeparator.displayName = "InputOTPSeparator";
function LoginPage() {
  const navigate = useNavigate();
  const setToken = useCustomerStore((s) => s.setToken);
  const isAuthed = useCustomerStore((s) => s.isAuthenticated());
  const hasHydrated = useCustomerStore((s) => s.hasHydrated);
  const [step, setStep] = reactExports.useState("phone");
  const [phone, setPhone] = reactExports.useState("");
  const [otp, setOtp] = reactExports.useState("");
  const [sdkReady, setSdkReady] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [initializing, setInitializing] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (hasHydrated && isAuthed) navigate({
      to: "/account"
    });
  }, [hasHydrated, isAuthed, navigate]);
  reactExports.useEffect(() => {
    if (!isKwikPassConfigured()) return;
    setInitializing(true);
    initKwikPass().then((ok) => {
      setSdkReady(ok);
      if (!ok) {
        toast.error("Sign-in unavailable", {
          description: "KwikPass SDK could not be loaded."
        });
      }
    }).finally(() => setInitializing(false));
  }, []);
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!sdkReady) {
      toast.error("Please wait", {
        description: "KwikPass is still loading."
      });
      return;
    }
    setLoading(true);
    try {
      await sendKwikPassOtp(phone);
      setStep("otp");
      setOtp("");
      toast.success("OTP sent", {
        description: "Check your phone for the one-time password."
      });
    } catch (err) {
      toast.error("Could not send OTP", {
        description: err instanceof KwikPassError ? err.message : "Please try again."
      });
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await verifyKwikPassOtp({
        phone,
        otp
      });
      setToken(token);
      toast.success("Signed in");
      navigate({
        to: "/account"
      });
    } catch (err) {
      toast.error("Verification failed", {
        description: err instanceof KwikPassError ? err.message : "Invalid or expired OTP."
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
        description: err instanceof KwikPassError ? err.message : "Please try again."
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-md px-4 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-card p-8 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-6 w-6" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-5 text-center font-serif text-3xl", children: "Sign in" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-center text-sm text-muted-foreground", children: step === "phone" ? "Enter your mobile number. We'll send you a one-time password." : `Enter the OTP sent to +91 ${phone.replace(/\D/g, "").slice(-10)}` }),
    step === "phone" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "mt-6 space-y-4", onSubmit: handleSendOtp, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Mobile number" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-9 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground", children: "+91" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone", type: "tel", inputMode: "numeric", autoComplete: "tel", placeholder: "9876543210", maxLength: 10, value: phone, onChange: (e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)), disabled: loading || initializing, required: true })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", size: "lg", disabled: loading || initializing || !sdkReady || phone.length < 10, children: loading || initializing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Send OTP" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "mt-6 space-y-4", onSubmit: handleVerifyOtp, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTP, { maxLength: 6, value: otp, onChange: setOtp, disabled: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(InputOTPGroup, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 2 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 3 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 4 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 5 })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", size: "lg", disabled: loading || otp.length < 4, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Verify & sign in" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "inline-flex items-center gap-1 hover:text-foreground", onClick: () => setStep("phone"), disabled: loading, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3 w-3" }),
          "Change number"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "underline hover:text-foreground", onClick: handleResend, disabled: loading, children: "Resend OTP" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-xs text-muted-foreground", children: [
      "By continuing you agree to our",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "underline hover:text-brand", children: "Terms" }),
      " ",
      "and",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "underline hover:text-brand", children: "Privacy Policy" }),
      "."
    ] })
  ] }) });
}
export {
  LoginPage as component
};
