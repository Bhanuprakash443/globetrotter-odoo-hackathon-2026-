import { useState } from "react";
import CreateTripModal from "../components/CreateTripModal";
import TripCard from "../components/TripCard";

const Trips = () => {
  const [open, setOpen] = useState(false);

  const sampleTrip = {
    name: "Goa Vacation",
    destination: "Goa, India",
    date: "2026-02-10",
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TripCard trip={sampleTrip} />
      </div>

      {open && <CreateTripModal onClose={() => setOpen(false)} />}
    </div>
  );
};

export default Trips;




