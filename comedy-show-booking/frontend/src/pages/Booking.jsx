import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RazorpayButton from 'react-razorpay';
import { showsAPI } from '../services/api';
import { X, CheckCircle, Seat } from 'lucide-react';

function Booking() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    fetchShow();
  }, [showId]);

  const fetchShow = async () => {
    try {
      const { data } = await showsAPI.getById(showId);
      setShow(data.data);
    } catch (error) {
      console.error('Error fetching show:', error);
    }
  };

  const toggleSeat = (seat) => {
    setSelectedSeats(prev => 
      prev.find(s => s.seatNumber === seat.seatNumber)
        ? prev.filter(s => s.seatNumber !== seat.seatNumber)
        : [...prev, seat].slice(0, 6) // Max 6 seats
    );
  };

  const handleCreateOrder = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least 1 seat');
      return;
    }

    if (!formData.email || !formData.name) {
      alert('Please enter name and email');
      return;
    }

    try {
      setLoading(true);
      const totalAmount = selectedSeats.length * (show.price || 0);
      const { data } = await api.post('/bookings/order', {
        showId,
        seats: selectedSeats,
        totalAmount,
        userEmail: formData.email,
        userName: formData.name
      });

      setBookingData(data);
    } catch (error) {
      alert('Error creating order: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      const { data } = await api.post('/bookings/verify', {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        bookingId: bookingData.bookingId
      });

      setPaymentSuccess(true);
      alert('🎉 Payment successful! Check your email for tickets.');
    } catch (error) {
      alert('Payment verification failed');
    }
  };

  const totalAmount = selectedSeats.length * (show?.price || 0);

  if (!show) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-teal-500 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-8 text-white text-center">
          <h1 className="text-4xl font-black mb-4">{show.title}</h1>
          <p className="text-xl opacity-90">{show.venue} • {new Date(show.date).toLocaleDateString()}</p>
        </div>

        {!paymentSuccess ? (
          <>
            {/* User Details */}
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">👤 Your Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="p-4 text-xl rounded-2xl bg-white/50 focus:ring-4 ring-yellow-300/50 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="p-4 text-xl rounded-2xl bg-white/50 focus:ring-4 ring-yellow-300/50 focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="p-4 text-xl rounded-2xl bg-white/50 focus:ring-4 ring-yellow-300/50 focus:outline-none md:col-span-2"
                />
              </div>
            </div>

            {/* Seat Selection */}
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Seat className="w-8 h-8" />
                Select Seats (Max 6)
              </h2>
              
              <div className="grid grid-cols-10 md:grid-cols-15 gap-3 p-8 bg-black/30 rounded-2xl max-w-4xl mx-auto">
                {Array.from({length: 50}).map((_, idx) => {
                  const seatNumber = `A${Math.floor(idx/10)+1}-${(idx%10)+1}`;
                  const isSelected = selectedSeats.find(s => s.seatNumber === seatNumber);
                  return (
                    <button
                      key={seatNumber}
                      onClick={() => toggleSeat({seatNumber})}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-xl font-bold text-sm md:text-base transition-all shadow-lg ${
                        isSelected 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black scale-110 shadow-yellow-500/50'
                          : 'bg-emerald-500 hover:bg-emerald-400 active:scale-95'
                      }`}
                      disabled={selectedSeats.length >= 6}
                    >
                      {seatNumber}
                    </button>
                  );
                })}
              </div>

              <div className="text-center mt-8 p-4 bg-white/30 rounded-2xl">
                <div className="text-3xl font-black text-yellow-300">
                  {selectedSeats.length} seats • ₹{totalAmount}
                </div>
                <div className="text-lg opacity-90">
                  ₹{show.price}/ticket × {selectedSeats.length}
                </div>
              </div>
            </div>

            {bookingData && (
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-8 mb-8 shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-white">
                  <CheckCircle className="w-8 h-8" />
                  Ready to Pay
                </h3>
                <RazorpayButton 
                  options={{
                    key: 'rzp_test_4gQvC5vK8kE8pK', // Test key - replace with yours
                    amount: bookingData.amount,
                    currency: bookingData.currency,
                    order_id: bookingData.orderId,
                    name: 'ComedyHub',
                    description: `${selectedSeats.length} tickets for ${show.title}`,
                    image: 'https://logo.clearbit.com/comedyhub.in',
                    handler: handlePaymentSuccess,
                    prefill: {
                      name: formData.name,
                      email: formData.email,
                      contact: formData.phone
                    },
                    theme: {
                      color: '#f59e0b'
                    }
                  }}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold py-8 px-12 text-2xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all block mx-auto"
                >
                  Pay ₹{totalAmount} Securely
                </RazorpayButton>
              </div>
            )}

            {!bookingData && selectedSeats.length > 0 && (
              <button
                onClick={handleCreateOrder}
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-8 px-12 text-2xl rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all block mx-auto disabled:opacity-50"
              >
                {loading ? 'Creating Order...' : `Proceed to Pay ₹${totalAmount}`}
              </button>
            )}
          </>
        ) : (
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-12 text-center">
            <CheckCircle className="w-32 h-32 text-emerald-400 mx-auto mb-8" />
            <h1 className="text-4xl font-black mb-6 text-emerald-300">Payment Successful! 🎉</h1>
            <p className="text-xl mb-8 opacity-90">Tickets sent to {formData.email}</p>
            <button 
              onClick={() => navigate('/shows')}
              className="bg-emerald-500 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:bg-emerald-400 transition"
            >
              Book More Shows
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Booking;

