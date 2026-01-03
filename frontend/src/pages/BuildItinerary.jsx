import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Calendar, DollarSign, X, ArrowLeft } from "lucide-react";
import { useTrips } from "../context/TripsContext";
import AIOptimizationPanel from "../components/AIOptimizationPanel";

const BuildItinerary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips } = useTrips();
  const trip = trips.find((t) => t.id === parseInt(id));

  const [sections, setSections] = useState([
    {
      id: 1,
      title: "Travel Section",
      description: "All the necessary information about this section. This can be anything like travel section, hotel or any other activity.",
      dateRange: { start: "", end: "" },
      budget: "",
    },
  ]);

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: sections.length + 1,
        title: `Section ${sections.length + 1}`,
        description: "All the necessary information about this section. This can be anything like travel section, hotel or any other activity.",
        dateRange: { start: "", end: "" },
        budget: "",
      },
    ]);
  };

  const updateSection = (id, field, value) => {
    setSections(
      sections.map((section) => {
        if (section.id === id) {
          if (field.startsWith("dateRange.")) {
            const dateField = field.split(".")[1];
            return {
              ...section,
              dateRange: { ...section.dateRange, [dateField]: value },
            };
          }
          return { ...section, [field]: value };
        }
        return section;
      })
    );
  };

  const removeSection = (id) => {
    if (sections.length > 1) {
      setSections(sections.filter((s) => s.id !== id));
    }
  };

  const handleSave = () => {
    // Save itinerary sections (implementation would persist to backend)
    navigate(`/trips/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(`/trips/${id}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GlobeTrotter</h1>
          <p className="text-gray-600 mt-1">Build Itinerary: {trip?.title || "New Trip"}</p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, "title", e.target.value)}
                  className="text-xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none mb-2"
                  placeholder="Section Title"
                />
                <textarea
                  value={section.description}
                  onChange={(e) => updateSection(section.id, "description", e.target.value)}
                  rows="3"
                  className="w-full text-gray-600 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Description..."
                />
              </div>
              {sections.length > 1 && (
                <button
                  onClick={() => removeSection(section.id)}
                  className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Date Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={section.dateRange.start}
                    onChange={(e) =>
                      updateSection(section.id, "dateRange.start", e.target.value)
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <span className="self-center text-gray-500">to</span>
                  <input
                    type="date"
                    value={section.dateRange.end}
                    onChange={(e) =>
                      updateSection(section.id, "dateRange.end", e.target.value)
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-2" />
                  Budget of this section
                </label>
                <input
                  type="number"
                  value={section.budget}
                  onChange={(e) => updateSection(section.id, "budget", e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Optimization Panel */}
      <AIOptimizationPanel tripId={parseInt(id)} />

      {/* Add Section Button */}
      <button
        onClick={addSection}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-indigo-600"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add another Section</span>
      </button>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          onClick={() => navigate(`/trips/${id}`)}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md"
        >
          Save Itinerary
        </button>
      </div>
    </div>
  );
};

export default BuildItinerary;
