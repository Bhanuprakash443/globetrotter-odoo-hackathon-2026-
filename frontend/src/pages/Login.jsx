export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">
          GlobeTrotter Login
        </h1>

        <input
          className="w-full mb-3 px-4 py-2 border rounded"
          placeholder="Email"
        />

        <input
          className="w-full mb-4 px-4 py-2 border rounded"
          type="password"
          placeholder="Password"
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          Login
        </button>
      </div>
    </div>
  );
}
