import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const OAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.replace("#", "?"));
      const access_token = params.get("access_token") || "";
      const refresh_token = params.get("refresh_token") || "";

      supabase.auth.setSession({
        access_token,
        refresh_token,
      }).then(({ error }) => {
        if (error) {
          console.error("OAuth Redirect Error:", error.message);
        }
        // رجّع المستخدم على صفحة الريفيوز
        navigate("/reviews", { replace: true });
      });
    } else {
      navigate("/", { replace: true }); // لو مفيش توكنات نرجعه على الرئيسية
    }
  }, []);

  return <p>Redirecting...</p>;
};

export default OAuthRedirect;
