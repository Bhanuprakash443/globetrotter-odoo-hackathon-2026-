import { useState, useEffect } from "react";
import { Search, Filter, ArrowUpDown, Heart, MessageCircle, Share2, Loader2 } from "lucide-react";
import { communityService } from "../services/communityService";

const Community = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch community posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await communityService.getPosts();
        setPosts(data);
      } catch (err) {
        setError(err.message || "Failed to load community posts");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading community posts...</span>
        </div>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  // Fallback to sample data if API returns empty
  const displayPosts = posts.length > 0 ? posts : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GlobeTrotter</h1>
          <p className="text-gray-600 mt-1">Community Tab</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search experiences..."
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

      {displayPosts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
          <p className="text-gray-600 mb-2">No community posts yet</p>
          <p className="text-sm text-gray-500">Be the first to share your travel experience!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Side - Navigation Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
              <div className="space-y-2">
                {displayPosts.slice(0, 4).map((post, index) => (
                  <button
                    key={post.id || index}
                    onClick={() => setSelectedTab(index)}
                    className={`w-full p-4 rounded-lg text-left transition-colors ${
                      selectedTab === index
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🌍</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{post.title}</p>
                        <p className="text-xs opacity-75">{post.username || post.user}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Post Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              {displayPosts[selectedTab] && (
                <div className="space-y-4">
                  {/* Post Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">
                        {displayPosts[selectedTab].username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{displayPosts[selectedTab].username || "User"}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(displayPosts[selectedTab].created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Post Image/Icon */}
                  <div className="h-64 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl flex items-center justify-center text-8xl">
                    🌍
                  </div>

                  {/* Post Title */}
                  <h2 className="text-2xl font-bold text-gray-900">{displayPosts[selectedTab].title}</h2>

                  {/* Post Content */}
                  <p className="text-gray-700 leading-relaxed">{displayPosts[selectedTab].content}</p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span>{displayPosts[selectedTab].likes || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-500 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span>Comments</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-500 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-sm text-indigo-900">
                  <strong>Community section:</strong> This is where all users can share their experience
                  about a certain trip or activity. Using the search, group by or Filter and sort by option,
                  the user can narrow down the results that they are looking for...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
