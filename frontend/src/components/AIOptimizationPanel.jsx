import { useState } from "react";
import { Sparkles, Loader2, CheckCircle, AlertCircle, TrendingUp, Clock, DollarSign } from "lucide-react";
import aiService from "../services/aiService";

const AIOptimizationPanel = ({ tripId, onOptimized }) => {
  const [loading, setLoading] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [error, setError] = useState(null);

  const handleOptimize = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.optimizeItinerary(tripId);
      setOptimizationResult(result);
      if (onOptimized) {
        onOptimized(result);
      }
    } catch (err) {
      setError(err.message || "Failed to optimize itinerary");
    } finally {
      setLoading(false);
    }
  };

  if (optimizationResult) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-600 rounded-lg">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI Optimization Complete
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Optimization Score:</span>
                  <span className="text-green-600 font-bold">
                    {optimizationResult.insights?.optimization_score || 0}%
                  </span>
                </div>
                {optimizationResult.insights?.budget_savings > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Budget Saved:</span>
                    <span className="text-green-600 font-bold">
                      ₹{optimizationResult.insights.budget_savings.toFixed(0)}
                    </span>
                  </div>
                )}
              </div>

              {optimizationResult.insights?.recommendations && 
               optimizationResult.insights.recommendations.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-2">AI Recommendations:</h4>
                  <ul className="space-y-2">
                    {optimizationResult.insights.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <p>
                  ✅ Optimized {optimizationResult.optimized_activity_count} activities across your trip
                </p>
                <p>
                  ✅ Balanced activity types to avoid travel fatigue
                </p>
                <p>
                  ✅ Added rest periods for better experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Itinerary Optimization Engine
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Our AI intelligently optimizes your itinerary based on duration, location proximity, and preferences
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-700">
          <strong>What AI optimizes:</strong>
        </p>
        <ul className="text-sm text-gray-600 mt-2 space-y-1">
          <li>✅ Day-wise schedule optimization</li>
          <li>✅ Travel fatigue prevention</li>
          <li>✅ Activity and rest balance</li>
          <li>✅ Budget limit respect</li>
        </ul>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        onClick={handleOptimize}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Optimizing with AI...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Optimize My Itinerary with AI
          </>
        )}
      </button>
    </div>
  );
};

export default AIOptimizationPanel;


