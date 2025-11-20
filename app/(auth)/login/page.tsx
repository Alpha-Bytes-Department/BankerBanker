import Link from "next/link"

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <main role="main" className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Login</h1>
            <p className="text-gray-600 mb-6">
                Authentication — login page coming soon!
            </p>

            <div className="flex items-center gap-3">
                <Link
                    href="/sign_up"
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Go to sign up"
                >
                    Create account
                </Link>

                <Link
                    href="/forgot_password"
                    className="text-sm text-gray-500 hover:text-gray-700"
                    aria-label="Back to home"
                >
                    forgot password?
                </Link>
            </div>
        </main>
    </div>
  )
}

export default page