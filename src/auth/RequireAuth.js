import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentToken,
  setCredentials,
} from "../components/common/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from "../hooks/useAxios";

function RequireAuth() {
  const [token, setToken] = useState(useSelector(selectCurrentToken));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      tryRefreshToken();
    }
  }, []);

  const tryRefreshToken = async () => {
    try {
      const response = await axiosInstance.get("/auth/refresh");
      dispatch(setCredentials(response?.data));
      setToken(response?.data?.token);
    } catch (e) {
      navigate("/login", { replace: true });
    }
  };
}

export default RequireAuth;
