export default function CreateTripModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">Create New Trip</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Trip Name"
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Destination"
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            type="date"
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            type="date"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
