import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import { logOut } from "../redux/slices/auth/authSlice";

const RequireAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      dispatch(logOut());
      navigate("/login", { replace: true });
    }
  }, [token, dispatch, navigate]);

  if (!token) {
    return <div>Redirecting to login...</div>;
  }

  return <Outlet />;
};

export default RequireAuth;
