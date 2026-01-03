import { useState, useEffect } from "react";
import { DollarSign, AlertTriangle, Lightbulb, Brain, CheckCircle, TrendingDown } from "lucide-react";
import aiService from "../services/aiService";

const BudgetIntelligencePanel = ({ tripId }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tripId) {
      loadAnalysis();
    }
  }, [tripId]);

  const loadAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.analyzeBudget(tripId);
      setAnalysis(result);
    } catch (err) {
      setError(err.message || "Failed to analyze budget");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Analyzing budget with AI...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const isOverBudget = analysis.budget_status === 'over_budget';
  const efficiency = analysis.budget_efficiency || 0;

  return (
    <div className="space-y-4">
      {/* Budget Status Card */}
      <div className={`rounded-xl shadow-md p-6 border-2 ${
        isOverBudget ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${
            isOverBudget ? 'bg-red-600' : 'bg-green-600'
          }`}>
            {isOverBudget ? (
              <AlertTriangle className="w-6 h-6 text-white" />
            ) : (
              <CheckCircle className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              Smart Budget Intelligence
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Predicted Total</p>
                <p className="text-lg font-bold text-gray-900">
                  ₹{analysis.predicted_total?.toFixed(0) || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Budget Limit</p>
                <p className="text-lg font-bold text-gray-900">
                  ₹{analysis.budget_limit?.toFixed(0) || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Remaining</p>
                <p className={`text-lg font-bold ${
                  analysis.remaining_budget >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{analysis.remaining_budget?.toFixed(0) || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Efficiency</p>
                <p className={`text-lg font-bold ${
                  efficiency < 95 ? 'text-green-600' : efficiency < 110 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {efficiency.toFixed(1)}%
                </p>
              </div>
            </div>

            {isOverBudget && (
              <div className="mt-4 bg-red-100 border border-red-300 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 mb-1">
                      Over Budget Alert
                    </p>
                    <p className="text-sm text-red-800">
                      Your trip exceeds budget by <strong>₹{analysis.over_budget_by?.toFixed(0)}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            AI Budget Suggestions
          </h4>
          <div className="space-y-4">
            {analysis.suggestions.map((suggestion, idx) => (
              <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <TrendingDown className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">
                      {suggestion.message}
                    </p>
                    <div className="flex items-center gap-4 text-sm mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Current:</span>
                        <span className="font-semibold text-red-600">
                          ₹{suggestion.current_cost?.toFixed(0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Alternative:</span>
                        <span className="font-semibold text-green-600">
                          ₹{suggestion.alternative_cost?.toFixed(0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-gray-600">Save:</span>
                        <span className="font-bold text-green-600">
                          ₹{suggestion.potential_savings?.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {analysis.category_breakdown && analysis.category_breakdown.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Expense Breakdown</h4>
          <div className="space-y-2">
            {analysis.category_breakdown.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{cat.expense_category}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{cat.count} transactions</span>
                  <span className="font-bold text-gray-900">₹{cat.total?.toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetIntelligencePanel;


