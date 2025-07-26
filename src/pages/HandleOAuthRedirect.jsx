import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HandleOAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash && hash.includes("access_token")) {
      // بدل ما يفتح على NotFound، نعيد التوجيه للـ /reviews
      navigate(`/reviews${hash}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  return <p>Redirecting...</p>;
};

export default HandleOAuthRedirect;
