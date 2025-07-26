import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Reviews = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // أولاً: نحاول نشوف لو في توكنات في الرابط
    const hash = window.location.hash;

    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.replace("#", "?"));

      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      // تسجيل الجلسة في supabase
      supabase.auth.setSession({
        access_token,
        refresh_token,
      }).then(({ data, error }) => {
        if (error) {
          console.error("Failed to set session:", error.message);
        } else {
          setSession(data.session);
        }
        // نظف الرابط من التوكنات
        navigate("/reviews", { replace: true });
      });
    } else {
      // لو مفيش توكنات، نشيك هل في جلسة حالياً؟
      supabase.auth.getSession().then(({ data }) => {
        setSession(data.session);
        setLoading(false);
      });
    }
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold mb-4">You must log in with Discord to leave a review.</h2>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: "discord",
              options: {
                redirectTo: `${window.location.origin}/reviews`,
              },
            })
          }
        >
          Login with Discord
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leave a Review</h1>
      {/* المحتوى الفعلي للتقييم */}
      <p>Welcome! You are logged in with Discord.</p>
    </div>
  );
};

export default Reviews;
