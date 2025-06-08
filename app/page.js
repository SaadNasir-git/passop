export default function Home() {
  return (
    <main className="h-[80.7vh] flex items-center">
      <div className="w-full bg-white p-10 text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-gray-800">
          🔐 SecurePass
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your passwords securely and access them anytime, anywhere.
        </p>

        <a
          href="/dashboard"
          className="inline-block mt-4 px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition"
        >
          Get Started
        </a>

        <p className="text-xs text-gray-400 pt-4">
          100% private. Your data stays yours.
        </p>
      </div>
    </main>
  );
}


