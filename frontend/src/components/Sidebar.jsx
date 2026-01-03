export default function Sidebar() {
  return (
    <aside className="w-64 bg-indigo-600 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-8">GlobeTrotter</h2>
      <nav className="space-y-4">
        <a href="/dashboard" className="block hover:text-indigo-200">Dashboard</a>
        <a href="#" className="block hover:text-indigo-200">Trips</a>
        <a href="#" className="block hover:text-indigo-200">Profile</a>
      </nav>
    </aside>
  );
}
