import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../components/common/redux/slices/authApiSlice";
import { Navigate } from "react-router-dom";
import { logOut } from "../components/common/redux/slices/authSlice";
import { resetApiState } from "../components/common/redux/slices/baseApiSlice";
function Logout() {
  const [logout,] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // logout from server
      await logout();
      // logout from client
      dispatch(logOut());
      dispatch(resetApiState());
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
