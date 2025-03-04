import { useEffect, useState } from "react";
import { useVerifyEmailMutation } from "../../../redux/slices/auth/authApiSlice";
import { useParams, useNavigate } from "react-router-dom";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verifyEmail, { isLoading, isError, error }] = useVerifyEmailMutation();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      verifyEmail(token)
        .unwrap()
        .then(() => {
          setMessage("Email verification successful! Redirecting...");
          setTimeout(() => navigate("/login"), 3000);
        })
        .catch(() => {
          setMessage("Token is invalid or expired. Please resend verification email.");
        });
    }
  }, [token, verifyEmail, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Email Verification</h2>
        {isLoading && <p>Verifying...</p>}
        {message && <p>{message}</p>}
        {isError && <p className="text-red-500">{error?.data?.message || "Verification error"}</p>}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
