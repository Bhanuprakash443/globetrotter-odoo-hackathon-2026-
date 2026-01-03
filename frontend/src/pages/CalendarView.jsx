import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, Filter, ArrowUpDown, Loader2 } from "lucide-react";
import { useTrips } from "../context/TripsContext";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from "date-fns";
import { tripService } from "../services/tripService";

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { trips } = useTrips();
  const [calendarTrips, setCalendarTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all trips for calendar
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const allTrips = await tripService.getAllTrips();
        setCalendarTrips(
          allTrips.map((trip) => ({
            id: trip.id,
            title: trip.title || trip.name || "Untitled Trip",
            startDate: new Date(trip.start_date || trip.startDate),
            endDate: new Date(trip.end_date || trip.endDate),
            color: getColorForTrip(trip.id),
          }))
        );
      } catch (error) {
        console.error("Failed to load trips:", error);
        // Fallback to context trips
        setCalendarTrips(
          trips.map((trip, idx) => ({
            id: trip.id,
            title: trip.title || "Untitled Trip",
            startDate: new Date(trip.startDate || trip.date || new Date()),
            endDate: new Date(trip.endDate || trip.date || new Date()),
            color: getColorForTrip(idx),
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [trips]);

  const getColorForTrip = (id) => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-red-500", "bg-yellow-500", "bg-indigo-500"];
    return colors[id % colors.length];
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfWeek = monthStart.getDay();
  const daysBeforeMonth = Array.from({ length: firstDayOfWeek }, (_, i) => null);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getTripsForDate = (date) => {
    return calendarTrips.filter((trip) => {
      const tripStart = new Date(trip.startDate);
      const tripEnd = new Date(trip.endDate);
      tripStart.setHours(0, 0, 0, 0);
      tripEnd.setHours(0, 0, 0, 0);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate >= tripStart && checkDate <= tripEnd;
    });
  };

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading calendar...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GlobeTrotter</h1>
          <p className="text-gray-600 mt-1">Calendar View</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search trips..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            <ArrowUpDown className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Group by</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            <ArrowUpDown className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Sort by</span>
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-700 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells before month starts */}
          {daysBeforeMonth.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square"></div>
          ))}

          {/* Days of the month */}
          {daysInMonth.map((day) => {
            const dayTrips = getTripsForDate(day);
            const isCurrentDay = isToday(day);
            return (
              <div
                key={day.toISOString()}
                className={`aspect-square border-2 rounded-lg p-2 transition-colors ${
                  isCurrentDay
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className={`text-sm font-semibold mb-1 ${isCurrentDay ? "text-indigo-600" : "text-gray-700"}`}>
                  {format(day, "d")}
                </div>
                <div className="space-y-1 overflow-y-auto max-h-full scrollbar-hide">
                  {dayTrips.slice(0, 3).map((trip) => (
                    <div
                      key={trip.id}
                      className={`${trip.color} text-white text-xs p-1 rounded truncate`}
                      title={trip.title}
                    >
                      {trip.title}
                    </div>
                  ))}
                  {dayTrips.length > 3 && (
                    <div className="text-xs text-gray-500">+{dayTrips.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Trip Legend</h3>
        <div className="flex flex-wrap gap-4">
          {calendarTrips.slice(0, 6).map((trip) => (
            <div key={trip.id} className="flex items-center gap-2">
              <div className={`w-4 h-4 ${trip.color} rounded`}></div>
              <span className="text-sm text-gray-700">{trip.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
