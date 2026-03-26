import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom'
import { Home, Ticket, Calendar, MapPin, Play, LogIn, Settings, User } from 'lucide-react'
import ShowList from './pages/ShowList.jsx'
import ShowDetail from './pages/ShowDetail.jsx'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
        {/* Header */}
        <header className="bg-white/20 backdrop-blur-md sticky top-0 z-50">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl lg:text-3xl font-black text-white drop-shadow-lg hover:scale-105 transition">
              🎭 ComedyHub
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="flex items-center space-x-2 text-white hover:text-yellow-300 transition px-3 py-2 rounded-lg hover:bg-white/20">
                <Home size={20} /> <span>Home</span>
              </Link>
              <Link to="/shows" className="flex items-center space-x-2 text-white hover:text-yellow-300 transition px-3 py-2 rounded-lg hover:bg-white/20">
                <Ticket size={20} /> <span>Shows</span>
              </Link>
              <Link to="/login" className="flex items-center space-x-2 text-white hover:text-yellow-300 transition px-3 py-2 rounded-lg hover:bg-white/20">
                <LogIn size={20} /> <span>Login</span>
              </Link>
            </div>
            <button className="md:hidden text-white p-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </nav>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shows" element={<ShowList />} />
            <Route path="/show/:id" element={<ShowDetail />} />
            <Route path="/login" element={
              <div className="text-center py-24 text-white">
                <h1 className="text-5xl font-black mb-8">🔐 Login</h1>
                <p className="text-2xl mb-12 opacity-90">(Step 4 Coming Soon!)</p>
              </div>
            } />
            <Route path="/book/:showId" element={
              <div className="text-center py-24 text-white">
                <h1 className="text-5xl font-black mb-8">🎟️ Booking</h1>
                <p className="text-2xl mb-12 opacity-90">(Step 3 Coming Soon!)</p>
              </div>
            } />
            <Route path="*" element={
              <div className="text-center py-24 text-white">
                <h1 className="text-5xl font-black mb-8">404</h1>
                <Link to="/" className="text-2xl underline hover:text-yellow-300">Go Home</Link>
              </div>
            } />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="mt-24 bg-white/10 backdrop-blur-md py-12 border-t border-white/20">
          <div className="max-w-6xl mx-auto px-6 text-white text-center opacity-75 text-lg">
            © 2024 ComedyHub. Book laughs, not worries. | 
            <Link to="/shows" className="hover:text-yellow-300 mx-2">All Shows</Link>
          </div>
        </footer>
      </div>
    </Router>
  )
}

// HomePage Component
function HomePage() {
  return (
    <div className="text-center text-white drop-shadow-lg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl lg:text-7xl font-black mb-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent leading-tight">
          Live Laughter<br />
          Instant Booking
        </h1>
        <p className="text-2xl lg:text-3xl mb-12 opacity-90 leading-relaxed max-w-2xl mx-auto">
          India's best comedy shows. QR tickets. UPI payments. 
          Laugh guaranteed or your money back! 😄
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link 
            to="/shows" 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-12 lg:px-16 py-6 lg:py-8 rounded-2xl text-2xl lg:text-3xl font-black hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl"
          >
            🎟️ Find Shows Now
          </Link>
          <Link 
            to="/shows" 
            className="border-4 border-white/40 text-white px-12 lg:px-16 py-6 lg:py-8 rounded-2xl text-2xl lg:text-3xl font-bold hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-105"
          >
            Watch Previews
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl hover:bg-white/30 transition-all">
            <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-2xl">
              💳
            </div>
            <h3 className="text-2xl font-bold mb-4">UPI & Cards</h3>
            <p>Paytm, PhonePe, GPay, Cards - all accepted instantly</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl hover:bg-white/30 transition-all">
            <div className="w-20 h-20 bg-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-2xl">
              📱
            </div>
            <h3 className="text-2xl font-bold mb-4">QR Tickets</h3>
            <p>Scan at entry. No paper tickets needed</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl hover:bg-white/30 transition-all">
            <div className="w-20 h-20 bg-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-2xl">
              👑
            </div>
            <h3 className="text-2xl font-bold mb-4">Admin Panel</h3>
            <p>Complete control over shows and bookings</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App

