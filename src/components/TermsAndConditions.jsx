"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const TermsAndConditions = () => {
  const navigate = useNavigate()

  // Checker: redirect if already agreed to terms
  useEffect(() => {
    const agreed = localStorage.getItem("agreedToTerms")
    if (agreed === "true") {
      navigate("/home")
    }
  }, [navigate])

  const handleAccept = () => {
    localStorage.setItem("agreedToTerms", "true")
    navigate("/home")
  }

  const handleDecline = () => {
    // Optionally redirect to a different page or show a message
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-100 rounded-full filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-40"></div>
        <div className="absolute top-2/3 left-1/3 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-40"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-between items-center px-4 py-8">
        <div className="flex-1 flex flex-col justify-center items-center w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Terms & Conditions
            </h1>
            <p className="text-gray-600 text-lg">Please review our terms before continuing</p>
          </div>

          {/* Terms Content Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-8 mb-8 w-full max-w-3xl">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Welcome to Huni - Sidlak</h2>
              </div>
              <p className="text-gray-700 leading-relaxed  text-justify">
                Before you begin your musical journey with our app, please take a moment to read and understand the
                following terms and conditions. Your use of this application constitutes acceptance of these terms.
              </p>
            </div>

            {/* Terms List */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200 max-h-[50vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Educational Purpose */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Educational & Entertainment Purpose</h3>
                    <p className="text-gray-600 text-sm  text-justify">
                      This application is designed for educational and entertainment purposes to help you learn and
                      improve your guitar playing skills.
                    </p>
                  </div>
                </div>

                {/* Privacy */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Privacy Protection</h3>
                    <p className="text-gray-600 text-sm  text-justify">
                      We respect your privacy and do not collect or store any personal data without your explicit
                      consent. All processing happens locally on your device.
                    </p>
                  </div>
                </div>

                {/* Permissions */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Required Permissions</h3>
                    <p className="text-gray-600 text-sm  text-justify">
                      Camera and microphone access are required for our tuner and chord detection features to function
                      properly. These permissions are used solely for app functionality.
                    </p>
                  </div>
                </div>

                {/* Safety */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Safe Usage</h3>
                    <p className="text-gray-600 text-sm  text-justify">
                      Please do not use this application while driving, operating machinery, or in any situation
                      requiring your full attention for safety reasons.
                    </p>
                  </div>
                </div>

                {/* Agreement */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Terms Agreement</h3>
                    <p className="text-gray-600 text-sm  text-justify">
                      By using this application, you agree to our privacy policy and terms of service. These terms may
                      be updated periodically to reflect changes in our services.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
              <p className="text-gray-700 text-sm text-center">
                If you do not agree to these terms, please close the app. For questions or concerns, contact us at{" "}
                <a
                  href="mailto:support@hunisidlak.com"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors underline decoration-indigo-300 hover:decoration-indigo-500"
                >
                  support@hunisidlak.com
                </a>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button
              onClick={handleDecline}
              className="flex-1 px-6 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 group relative px-6 py-3 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
            >
              {/* Button background with animated gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 bg-size-200 animate-gradient-x"></div>

              {/* Button glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white blur-md transition-opacity duration-300"></div>

              {/* Button text */}
              <span className="relative flex items-center justify-center text-white font-bold">
                I Accept & Continue
                <svg
                  className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full py-6 px-4 backdrop-blur-md bg-white/30 border-t border-gray-200 rounded-t-3xl">
          <div className="text-center text-gray-600 text-sm">&copy; 2025 Huni - Sidlak. All rights reserved.</div>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions
