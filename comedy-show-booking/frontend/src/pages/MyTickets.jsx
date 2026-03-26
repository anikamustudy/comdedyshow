import { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Mail, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

function MyTickets() {
  const [bookings, setBookings] = useState([]);
  const [email, setEmail] = useState(localStorage.getItem('bookingEmail') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (email) {
      fetchBookings();
    }
  }, [email]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/bookings/my-bookings', {
        params: { email }
      });
      setBookings(data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = (ticket) => {
    const canvas = document.getElementById(`qr-${ticket.ticketId}`);
    const link = document.createElement('a');
    link.download = `ticket-${ticket.ticketId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (loading) return <div className="text-center py-12 text-white text-2xl">Loading tickets...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-12 text-white text-center">
          <h1 className="text-5xl font-black mb-6 flex items-center justify-center gap-4 mx-auto">
            <Ticket className="w-12 h-12" />
            My Tickets
          </h1>
          <div className="max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your booking email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 text-xl rounded-2xl bg-white/50 focus:ring-4 ring-yellow-300/50 focus:outline-none text-center"
            />
            <button
              onClick={fetchBookings}
              className="mt-4 block w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-8 rounded-2xl text-xl hover:from-yellow-300 hover:to-orange-400 transition"
            >
              Load My Tickets
            </button>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-24 text-white/80">
            <Ticket className="w-24 h-24 mx-auto mb-8 opacity-50" />
            <h2 className="text-4xl font-bold mb-4">No tickets found</h2>
            <p className="text-xl">Enter your booking email above</p>
          </div>
        ) : (
          <div className="space-y-8">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white/20 backdrop-blur-md rounded-3xl p-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between mb-8 p-6 bg-white/10 rounded-2xl">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{booking.showId?.title}</h3>
                    <p className="text-xl opacity-90">
                      {new Date(booking.createdAt).toLocaleDateString()} • {booking.showId?.venue}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">
                    ✅ {booking.status.toUpperCase()}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {booking.tickets.map((ticket) => (
                    <div key={ticket.ticketId} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-gray-800 mb-2">Ticket {ticket.ticketId.slice(-4)}</div>
                        <div className="text-lg font-semibold text-gray-700">Seat: {ticket.seatNumber}</div>
                      </div>
                      
                      <div className="w-48 h-48 mx-auto mb-6 p-4 bg-gray-100 rounded-xl flex items-center justify-center">
                        <QRCodeCanvas
                          id={`qr-${ticket.ticketId}`}
                          value={ticket.qrCode}
                          size={200}
                          bgColor="#FFFFFF"
                          fgColor="#000000"
                          level="H"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <button
                          onClick={() => downloadTicket(ticket)}
                          className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-medium transition"
                        >
                          <Download size={20} />
                          Download QR
                        </button>
                        {!ticket.used ? (
                          <div className="text-center py-2 px-4 bg-emerald-100 text-emerald-800 rounded-xl font-medium">
                            Ready to scan
                          </div>
                        ) : (
                          <div className="text-center py-2 px-4 bg-gray-100 text-gray-600 rounded-xl font-medium">
                            Already used
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTickets;

