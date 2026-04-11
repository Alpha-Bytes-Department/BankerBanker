"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Define public routes here — no auth check needed
const PUBLIC_ROUTES = [
  "/register",
  "/signin",
  "/register/upload",
  "/verify_otp",
  "/reset_pass_one",
  "/reset_pass_one/reset_pass_two",
  "/reset_pass_one/reset_pass_two/reset_pass_three",
  "/reset_pass_one/reset_pass_two/reset_pass_three/reset_pass_four",
];

const SPONSOR_ONLY_ROUTES = [
  "/sponsor",
  "/analytics",
  "/memorandum",
  "/processing",
  "/loan",
  "/notifications",
  "/recent-activity",
  "/message",
];

const LENDER_ONLY_ROUTES = [
  "/lender",
  "/loan-requests",
  "/my-quotes",
  "/property-map",
  "/market-analytics",
];

const normalizeRole = (role?: string | null) => {
  const normalized = String(role || "").toLowerCase();
  if (normalized === "sponsor") return "Sponsor";
  if (normalized === "lender" || normalized === "lander") return "Lender";
  return null;
};

const isRouteMatch = (pathname: string, routes: string[]) =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [isMounted, setIsMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Skip auth check entirely for public routes
      const isPublicRoute = PUBLIC_ROUTES.some((route) =>
        pathname?.startsWith(route),
      );
      if (isPublicRoute) {
        setIsAuthorized(true);
        setIsMounted(true); // always called
        return;
      }

      try {
        const creds = localStorage.getItem("userCredentials");
        if (!creds) {
          setIsMounted(true); // always called before redirect
          router.replace("/signin");
          return;
        }

        const parsedCreds = JSON.parse(creds);
        const { access_token } = parsedCreds;
        if (!access_token) {
          setIsMounted(true); // always called before redirect
          router.replace("/signin");
          return;
        }

        // Decode token without jwt-decode package
        const payload = JSON.parse(atob(access_token.split(".")[1]));
        const isExpired = Date.now() >= payload.exp * 1000;
        if (isExpired) {
          localStorage.removeItem("userCredentials"); // clean up expired token
          setIsMounted(true); // always called before redirect
          router.replace("/signin");
          return;
        }

        const role = normalizeRole(
          parsedCreds?.user?.role ||
            parsedCreds?.user?.customer_type ||
            payload?.role ||
            payload?.customer_type,
        );

        if (
          pathname &&
          role === "Sponsor" &&
          isRouteMatch(pathname, LENDER_ONLY_ROUTES)
        ) {
          setIsMounted(true);
          router.replace("/sponsor");
          return;
        }

        if (
          pathname &&
          role === "Lender" &&
          isRouteMatch(pathname, SPONSOR_ONLY_ROUTES)
        ) {
          setIsMounted(true);
          router.replace("/lender");
          return;
        }

        setIsAuthorized(true);
      } catch {
        setIsMounted(true); // always called before redirect
        router.replace("/signin");
        return;
      }

      setIsMounted(true); // success path
    };

    checkAuth();
  }, [pathname]); // depend on pathname, not router

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
