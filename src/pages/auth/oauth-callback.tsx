import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "@/store";
import { Loader2 } from "lucide-react";
import { PATH } from "@/constants/path";

function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setError } = useStore();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          throw new Error("No token received from authentication provider");
        }

        // Store the token
        localStorage.setItem("token", token);

        // Fetch user data or decode the token if it contains user info
        // This is a simplified example, you might need to fetch user data from your API
        const userData = {
          id: "oauth-user",
          name: "OAuth User",
          email: searchParams.get("email") || "oauth@example.com",
          role: "user"
        };

        // Update the app state with the authenticated user
        setUser(userData);

        // Redirect to home page after successful authentication
        setTimeout(() => {
          navigate(PATH.HOME);
        }, 1500);
      } catch (error) {
        console.error("OAuth callback error:", error);
        setError(
          error instanceof Error ? error.message : "Authentication failed"
        );

        // Redirect to login page if authentication fails
        setTimeout(() => {
          navigate(PATH.LOGIN);
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    processOAuthCallback();
  }, [searchParams, navigate, setUser, setError]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {isProcessing ? (
          <>
            <Loader2 className="text-primary h-12 w-12 animate-spin" />
            <h1 className="text-xl font-medium">
              Completing authentication...
            </h1>
            <p className="text-muted-foreground text-sm">
              Please wait while we verify your account
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-primary/10 rounded-full p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary h-6 w-6"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h1 className="text-xl font-medium">Authentication successful!</h1>
            <p className="text-muted-foreground text-sm">
              Redirecting you to the dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OAuthCallbackPage;
