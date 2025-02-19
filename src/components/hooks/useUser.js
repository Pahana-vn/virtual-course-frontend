import { useSelector } from "react-redux";
import { jwtDecode } from 'jwt-decode';

const useUser = () => {
  const token = useSelector((state) => state.auth.token);
  return token ? jwtDecode(token) : null;
};

export default useUser;
