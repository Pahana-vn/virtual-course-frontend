import { Link } from "react-router-dom";

const VerifyEmailNotice = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold text-green-600">
          Verification Email Sent
        </h2>
        <p className="mt-2">
          We have sent a verification email to your address. Please check your
          inbox and click the link to complete your registration.
        </p>
        <p className="mt-2">
          If you do not receive the email, please check your spam or
          <Link to="/resend-verification" className="text-blue-500">
            {" "}
            resend verification email
          </Link>
          .
        </p>
        <Link
          to="/login"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailNotice;
