import { useNavigate } from "react-router-dom";
import googleLogo from "../assets/google-logo.svg";

export default function SignIn() {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    // TODO: Implement actual Google Sign In
    navigate("/home");
  };

  return (
    <main className="w-full pt-32 px-4">
      <div className="mx-auto max-w-[400px] w-full">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-medium text-gray-900 mb-8 text-center">
            Sign In to crumbgetit
          </h1>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 text-base font-medium text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
          >
            <img src={googleLogo} alt="Google logo" className="w-6 h-6" />
            Continue with Google
          </button>

          <p className="mt-6 text-sm text-gray-600 text-center">
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary-100 hover:text-primary-200">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary-100 hover:text-primary-200">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
