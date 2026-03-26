import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Ticket, Calendar, MapPin, Play, Clock } from 'lucide-react';
import axios from 'axios';

function ShowList() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const { data } = await axios.get(`http://localhost:5000/api/shows?${params}`);
      setShows(data.data || []);
    } catch (error) {
      console.error('Error fetching shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = { search };
    setSearchParams(params);
    fetchShows(params);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-4xl text-white animate-pulse">Loading shows...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 py-12">
      {/* Search Bar */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <form onSubmit={handleSearch} className="bg-white/20 backdrop-blur-md rounded-2xl p-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search comedian or show name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-white/50 rounded-xl px-6 py-4 text-xl placeholder-gray-500 focus:outline-none focus:ring-4 ring-yellow-300/50"
            />
            <button 
              type="submit"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-xl"
            >
              🔍 Search
            </button>
          </div>
        </form>
      </div>

      {/* Shows Grid */}
      <div className="max-w-6xl mx-auto px-6">
        {shows.length === 0 ? (
          <div className="text-center py-24 text-white/80">
            <Ticket className="w-24 h-24 mx-auto mb-6 opacity-50" />
            <h2 className="text-4xl font-bold mb-4">No shows found</h2>
            <p className="text-xl">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shows.map((show) => (
              <div key={show._id} className="group bg-white/20 backdrop-blur-md rounded-3xl p-8 hover:bg-white/30 transition-all hover:scale-105 hover:-translate-y-2 shadow-2xl">
                {/* Video Thumbnail */}
                <div className="relative mb-6 rounded-2xl overflow-hidden h-48">
                  <img 
                    src={show.thumbnail || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'}
                    alt={show.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all" />
                  <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2">{show.title}</h3>
                  {show.comedian && (
                    <p className="text-yellow-300 font-semibold mb-4">👤 {show.comedian}</p>
                  )}
                  
                  <div className="space-y-2 mb-6 text-white/90">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>{new Date(show.date).toLocaleDateString('en-IN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{show.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span>{show.duration} mins • ₹{show.price}</span>
                    </div>
                  </div>

                  <Link
                    to={`/show/${show._id}`}
                    className="block w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xl font-bold py-4 px-6 rounded-2xl text-center hover:from-yellow-300 hover:to-orange-400 transition-all group hover:shadow-2xl transform hover:scale-[1.02]"
                  >
                    🎟️ Book Now - ₹{show.price}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowList;

