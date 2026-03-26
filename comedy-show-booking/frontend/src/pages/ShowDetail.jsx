import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Play } from 'lucide-react';
import { showsAPI } from '../services/api';
import axios from 'axios';

function ShowDetail() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    fetchShow();
  }, [id]);

  const fetchShow = async () => {
    try {
      const { data } = await showsAPI.getById(id);
      setShow(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seat) => {
    setSelectedSeats(prev => 
      prev.find(s => s.seatNumber === seat.seatNumber)
        ? prev.filter(s => s.seatNumber !== seat.seatNumber)
        : [...prev, seat]
    );
  };

  const totalAmount = selectedSeats.length * (show?.price || 0);

  if (loading) return <div className="text-white text-2xl">Loading...</div>;

  if (!show) return <div className="text-white text-2xl">Show not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Show Header */}
        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-8 text-white">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Video Player */}
            <div className="flex-1">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  src={show.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Show Preview"
                />
              </div>
            </div>
            
            {/* Show Info */}
            <div className="flex-1 lg:max-w-md">
              <h1 className="text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {show.title}
              </h1>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-white/20 rounded-xl">
                  <Calendar className="w-6 h-6" />
                  <span className="text-xl">{new Date(show.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/20 rounded-xl">
                  <MapPin className="w-6 h-6" />
                  <span className="text-xl font-semibold">{show.venue}</span>
                </div>
                <div className="p-4 bg-white/20 rounded-xl">
                  <p className="text-lg leading-relaxed">{show.description}</p>
                </div>
              </div>

              <div className="text-3xl font-bold text-yellow-300 mb-6">
                ₹{show.price} <span className="text-white/70 text-lg">per ticket</span>
              </div>

              <Link
                to={`/book/${show._id}`}
                className="block w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-2xl font-black py-6 px-8 rounded-2xl text-center hover:from-yellow-300 hover:to-orange-400 transition-all shadow-2xl mb-4"
              >
                🎟️ Book Tickets
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Seat Preview */}
        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">Seat Selection</h2>
          <div className="grid grid-cols-10 gap-2 p-6 bg-black/20 rounded-2xl max-w-4xl mx-auto">
            {show.availableSeats?.slice(0, 20).map((seat, idx) => (
              <button
                key={seat.seatNumber || idx}
                onClick={() => toggleSeat(seat)}
                className={`w-12 h-12 rounded-lg font-bold transition-all ${
                  selectedSeats.find(s => s.seatNumber === seat.seatNumber)
                    ? 'bg-yellow-400 text-black shadow-lg scale-110'
                    : seat.status === 'available'
                    ? 'bg-green-500 hover:bg-green-400'
                    : 'bg-gray-500'
                }`}
              >
                {seat.seatNumber || `A${idx+1}`}
              </button>
            ))}
          </div>
          
          {selectedSeats.length > 0 && (
            <div className="mt-6 text-center text-xl">
              <span className="text-yellow-300 font-bold">
                {selectedSeats.length} seats selected • Total: ₹{totalAmount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowDetail;

