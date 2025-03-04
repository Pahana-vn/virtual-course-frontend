import { useState } from "react";
import { useResendVerificationEmailMutation } from "../../../redux/slices/auth/authApiSlice";

const ResendVerificationEmail = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resendVerificationEmail, { isLoading }] = useResendVerificationEmailMutation();

  const handleResendEmail = async (e) => {
    e.preventDefault();
    try {
      await resendVerificationEmail(email).unwrap();
      setMessage("Verification email has been resent. Please check your inbox.");
    } catch (error) {
      setMessage("The verification email could not be resent. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Resend Verification Email</h2>
        <form onSubmit={handleResendEmail}>
          <input
            type="email"
            className="border p-2 w-full my-2"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            disabled={isLoading}
          >
            {isLoading ? "Resending..." : "Resend email"}
          </button>
        </form>
        {message && <p className="mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default ResendVerificationEmail;
