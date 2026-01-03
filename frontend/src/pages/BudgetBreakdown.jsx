import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, AlertTriangle, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTrips } from "../context/TripsContext";
import BudgetIntelligencePanel from "../components/BudgetIntelligencePanel";
import { tripService } from "../services/tripService";

const BudgetBreakdown = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips } = useTrips();
  const [trip, setTrip] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch budget data from API
  useEffect(() => {
    const fetchBudgetData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        const budget = await tripService.getBudget(parseInt(id));
        setBudgetData(budget);
        
        // Also get trip details
        const tripData = await tripService.getTrip(parseInt(id));
        setTrip(tripData);
      } catch (err) {
        setError(err.message || "Failed to load budget data");
        // Fallback to context
        const fallbackTrip = trips.find((t) => t.id === parseInt(id));
        setTrip(fallbackTrip);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, [id, trips]);

  // Process budget data for charts
  const processedData = budgetData ? {
    totalBudget: budgetData.budgeted || 0,
    totalSpent: budgetData.spent || 0,
    remaining: budgetData.remaining || 0,
    expensesByCategory: budgetData.expenses_by_category || [],
    sections: budgetData.sections || [],
    dailyExpenses: budgetData.daily_expenses || []
  } : null;

  const pieData = processedData?.expensesByCategory.map((cat, idx) => ({
    name: cat.expense_category,
    value: cat.total || 0,
    color: ["#818CF8", "#6366F1", "#4F46E5", "#4338CA", "#3730A3", "#312E81"][idx % 6]
  })) || [];

  const barData = processedData?.expensesByCategory.map((cat) => ({
    category: cat.expense_category,
    budgeted: 0, // Would come from section budgets
    spent: cat.total || 0
  })) || [];

  const percentage = processedData && processedData.totalBudget > 0 
    ? (processedData.totalSpent / processedData.totalBudget) * 100 
    : 0;
  
  const dailyCost = processedData && processedData.dailyExpenses.length > 0
    ? processedData.dailyExpenses.reduce((sum, day) => sum + (day.daily_total || 0), 0) / processedData.dailyExpenses.length
    : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading budget data...</span>
        </div>
      </div>
    );
  }

  if (error && !processedData) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => navigate(`/trips/${id}`)}
            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Back to Trip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
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
          <p className="text-gray-600 mt-1">Budget Breakdown: {trip?.title || "Trip"}</p>
        </div>
      </div>

      {/* AI Budget Intelligence Panel */}
      <BudgetIntelligencePanel tripId={parseInt(id)} />

      {/* Budget Summary Cards */}
      {processedData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-indigo-100 text-sm mb-1">Total Budget</p>
              <p className="text-3xl font-bold">₹{processedData.totalBudget.toFixed(0)}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm mb-1">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900">₹{processedData.totalSpent.toFixed(0)}</p>
            </div>
            <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${processedData.remaining >= 0 ? 'border-green-500' : 'border-red-500'}`}>
              <p className="text-gray-600 text-sm mb-1">Remaining</p>
              <p className={`text-3xl font-bold ${processedData.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{Math.abs(processedData.remaining).toFixed(0)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
              <p className="text-gray-600 text-sm mb-1">Avg. per Day</p>
              <p className="text-3xl font-bold text-gray-900">₹{dailyCost.toFixed(0)}</p>
            </div>
          </div>

          {/* Budget Alert */}
          {percentage > 90 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Budget Alert</p>
                <p className="text-sm text-yellow-700">
                  You've used {percentage.toFixed(1)}% of your budget. Consider reviewing expenses.
                </p>
              </div>
            </div>
          )}

          {/* Charts */}
          {pieData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Expense Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              {barData.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Expenses by Category</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="spent" fill="#6366F1" name="Spent" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* Detailed Breakdown */}
          {processedData.sections && processedData.sections.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Breakdown by Section</h2>
              <div className="space-y-4">
                {processedData.sections.map((section) => {
                  const sectionPercentage = section.budgeted > 0 
                    ? (section.spent / section.budgeted) * 100 
                    : 0;
                  return (
                    <div key={section.id} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{section.title}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">₹{section.spent?.toFixed(0) || 0}</span>
                          {section.budgeted > 0 && (
                            <span className={`text-sm font-medium ${sectionPercentage > 100 ? 'text-red-600' : 'text-green-600'}`}>
                              {sectionPercentage.toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                      {section.budgeted > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${sectionPercentage > 100 ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(sectionPercentage, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {!processedData && !loading && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No budget data available</p>
          <p className="text-sm text-gray-500">Start adding expenses to see budget breakdown</p>
        </div>
      )}
    </div>
  );
};

export default BudgetBreakdown;
