import { useState } from "react";
import CreateTripModal from "../components/CreateTripModal";

const Trips = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Your Trips</h1>
          <p className="text-gray-600">
            Create, manage, and explore your travel plans here.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          + Create Trip
        </button>
      </div>

      <div className="text-gray-500 italic">
        No trips created yet.
      </div>

      {open && <CreateTripModal onClose={() => setOpen(false)} />}
    </div>
  );
};

export default Trips;



