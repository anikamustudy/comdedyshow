import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Plus, Trash2, DollarSign, Calendar, Users, Ticket, BarChart3 } from 'lucide-react';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({});
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newShow, setNewShow] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    videoUrl: '',
    price: '',
    comedian: ''
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/shows';
      return;
    }
    fetchDashboard();
    fetchShows();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get('/admin/dashboard');
      setStats(data.data);
    } catch (error) {
      console.error('Dashboard error:', error);
    }
  };

  const fetchShows = async () => {
    try {
      const { data } = await api.get('/shows');
      setShows(data.data);
    } catch (error) {
      console.error('Shows error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShow = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/shows', newShow);
      setNewShow({ title: '', description: '', date: '', venue: '', videoUrl: '', price: '', comedian: '' });
      fetchShows();
      alert('Show created successfully!');
    } catch (error) {
      alert('Error creating show');
    }
  };

  const handleDeleteShow = async (id) => {
    if (confirm('Delete this show?')) {
      try {
        await api.delete(`/admin/shows/${id}`);
        fetchShows();
      } catch (error) {
        alert('Error deleting show');
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Admin Dashboard</h1>
              <p className="text-purple-300">Welcome, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={logout}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
                <Ticket className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-black text-white">{stats.totalShows || 0}</p>
                <p className="text-purple-300">Total Shows</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-black text-white">{stats.upcomingShows || 0}</p>
                <p className="text-purple-300">Upcoming</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-black text-white">₹{stats.totalRevenue?._sum || 0}</p>
                <p className="text-purple-300">Revenue</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-black text-white">{stats.totalBookings || 0}</p>
                <p className="text-purple-300">Bookings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create New Show */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-12">
          <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
            <Plus className="w-10 h-10" />
            Add New Show
          </h2>
          <form onSubmit={handleCreateShow} className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Show Title *"
              value={newShow.title}
              onChange={(e) => setNewShow({...newShow, title: e.target.value})}
              className="p-5 rounded-2xl bg-white/20 border border-white/30 focus:ring-4 ring-purple-400/50 focus:outline-none text-white placeholder-white/70"
              required
            />
            <input
              type="date"
              value={newShow.date}
              onChange={(e) => setNewShow({...newShow, date: e.target.value})}
              className="p-5 rounded-2xl bg-white/20 border border-white/30 focus:ring-4 ring-purple-400/50 focus:outline-none text-white"
              required
            />
            <input
              type="text"
              placeholder="Venue *"
              value={newShow.venue}
              onChange={(e) => setNewShow({...newShow, venue: e.target.value})}
              className="p-5 rounded-2xl bg-white/20 border border-white/30 focus:ring-4 ring-purple-400/50 focus:outline-none text-white placeholder-white/70 md:col-span-2"
              required
            />
            <input
              type="url"
              placeholder="YouTube/Vimeo URL"
              value={newShow.videoUrl}
              onChange={(e) => setNewShow({...newShow, videoUrl: e.target.value})}
              className="p-5 rounded-2xl bg-white/20 border border-white/30 focus:ring-4 ring-purple-400/50 focus:outline-none text-white placeholder-white/70 md:col-span-2"
              required
            />
            <input
              type="number"
              placeholder="Ticket Price (₹)"
              value={newShow.price}
              onChange={(e) => setNewShow({...newShow, price: e.target.value})}
              className="p-5 rounded-2xl bg-white/20 border border-white/30 focus:ring-4 ring-purple-400/50 focus:outline-none text-white"
              required
            />
            <input
              type="text"
              placeholder="Comedian Name"
              value={newShow.comedian}
              onChange={(e) => setNewShow({...newShow, comedian: e.target.value})}
              className="p-5 rounded-2xl bg-white/20 border border-white/30 focus:ring-4 ring-purple-400/50 focus:outline-none text-white placeholder-white/70"
            />
            <textarea
              placeholder="Show Description"
              value={newShow.description}
              onChange={(e) => setNewShow({...newShow, description: e.target.value})}
              className="p-5 rounded-2xl bg-white/20 border border-white/30 focus:ring-4 ring-purple-400/50 focus:outline-none text-white placeholder-white/70 md:col-span-2 h-32 resize-none"
              required
            />
            <button
              type="submit"
              className="md:col-span-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black py-6 px-8 rounded-2xl text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all md:col-span-2"
            >
              <Plus className="w-8 h-8 inline mr-3" />
              Create Show
            </button>
          </form>
        </div>

        {/* Shows List */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
          <h2 className="text-3xl font-black mb-8">Current Shows ({shows.length})</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shows.map((show) => (
              <div key={show._id} className="bg-white/20 p-6 rounded-2xl group hover:bg-white/30 transition-all">
                <div className="aspect-video bg-black/30 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition">
                  <span className="text-2xl opacity-50">Video Preview</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{show.title}</h3>
                <p className="text-purple-300 mb-4">{show.venue} • {new Date(show.date).toLocaleDateString()}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-emerald-400">₹{show.price}</span>
                  <button
                    onClick={() => handleDeleteShow(show._id)}
                    className="p-2 hover:bg-red-500/50 rounded-xl transition group-hover:scale-110"
                  >
                    <Trash2 className="w-6 h-6 text-red-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

