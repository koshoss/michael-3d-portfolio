import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // عدّل المسار لو الملف بمكان مختلف

const HandleOAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error.message);
        navigate("/not-found");
      } else if (data?.session) {
        // تم تسجيل الدخول بنجاح
        navigate("/reviews");
      } else {
        console.warn("No session found.");
        navigate("/not-found");
      }
    };

    handleRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-600 text-xl">Redirecting...</p>
    </div>
  );
};

export default HandleOAuthRedirect;
