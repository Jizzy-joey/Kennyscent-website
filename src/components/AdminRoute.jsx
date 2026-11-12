
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
          if (isMounted) setAuthorized(false);
          return;
        }

        const { data: admin, error: adminError } = await supabase
          .from("admins")
          .select("user_id")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (adminError) throw adminError;

        if (isMounted) {
          setAuthorized(Boolean(admin));
        }

        if (!admin) {
          await supabase.auth.signOut();
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to verify admin access.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", padding: "60px" }}>Checking access...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", padding: "60px", color: "red" }}>{error}</p>;
  }

  if (!authorized) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default AdminRoute;
