import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useLogoutMutation } from "../redux/slices/auth/authApiSlice";
import { logOut } from "../redux/slices/auth/authSlice";
function Logout() {
  const [logout,] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // logout from server
      await logout();
      // logout from client
      dispatch(logOut());
      // dispatch(resetApiState());
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  useEffect(() => {
    handleLogout();
  }, [logout, dispatch]);

  return (
    <Navigate to={"/login"} replace={true} />
  );
}

export default Logout;
