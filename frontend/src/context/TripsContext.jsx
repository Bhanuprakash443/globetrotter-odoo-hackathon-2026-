import { createContext, useContext, useState, useEffect } from "react";

const TripsContext = createContext();

export const TripsProvider = ({ children }) => {
  const [trips, setTrips] = useState(() => {
    // Load from localStorage if available
    const savedTrips = localStorage.getItem("globetrotter_trips");
    return savedTrips ? JSON.parse(savedTrips) : [];
  });

  // Save to localStorage whenever trips change
  useEffect(() => {
    localStorage.setItem("globetrotter_trips", JSON.stringify(trips));
  }, [trips]);

  const addTrip = (trip) => {
    setTrips((prev) => [...prev, { ...trip, id: trip.id || Date.now() }]);
  };

  const updateTrip = (id, updates) => {
    setTrips((prev) =>
      prev.map((trip) => (trip.id === id ? { ...trip, ...updates } : trip))
    );
  };

  const deleteTrip = (id) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
  };

  return (
    <TripsContext.Provider value={{ trips, addTrip, updateTrip, deleteTrip }}>
      {children}
    </TripsContext.Provider>
  );
};

export const useTrips = () => useContext(TripsContext);
