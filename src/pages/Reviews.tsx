import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Reviews = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // التحقق من وجود جلسة حالية
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
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
                redirectTo: `${window.location.origin}/oauth-redirect`, // ✅ إعادة التوجيه هنا
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
