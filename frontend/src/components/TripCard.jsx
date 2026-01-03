const TripCard = ({ trip }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold">{trip.name}</h3>
      <p className="text-gray-600">{trip.destination}</p>
      <p className="text-sm text-gray-400 mb-3">
        Start Date: {trip.date}
      </p>

      <button className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
        Generate AI Itinerary
      </button>
    </div>
  );
};

export default TripCard;
