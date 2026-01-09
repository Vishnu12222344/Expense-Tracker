import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export default function OAuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const success = authApi.handleOAuthCallback();
        if (success) {
            toast.success("Social login successful!");
            // Force a page reload or update context state
            window.location.href = "/";
        } else {
            toast.error("Social login failed.");
            navigate("/auth");
        }
    }, [navigate]);

    return <div className="flex items-center justify-center min-h-screen">Completing login...</div>;
}