'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  username: string;
}

interface RSVPListComponentProps {
  user: User | null;
}

interface RSVPStats {
  totalResponses: number;
  totalPax: number;
}

interface RSVPResponse {
  id: string;
  name: string;
  phone: string;
  pax: number;
  created_at: string;
}

export default function RSVPListComponent({ user }: RSVPListComponentProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [rsvpStats, setRsvpStats] = useState<RSVPStats>({ totalResponses: 0, totalPax: 0 });
  const [rsvpResponses, setRsvpResponses] = useState<RSVPResponse[]>([]);
  const [isLoadingRSVPs, setIsLoadingRSVPs] = useState(true);
  const router = useRouter();

  // Fetch RSVP data on component mount
  useEffect(() => {
    fetchRSVPData();
  }, []);

  const fetchRSVPData = async () => {
    setIsLoadingRSVPs(true);
    try {
      const response = await fetch('/api/admin/rsvp');
      const data = await response.json();
      
      if (data.success) {
        setRsvpStats(data.data.stats);
        setRsvpResponses(data.data.responses);
      }
    } catch (error) {
      console.error('Error fetching RSVP data:', error);
    } finally {
      setIsLoadingRSVPs(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
              <Link
                href="/admin"
                className="text-green-600 hover:text-green-800 mr-1 md:mr-2 flex items-center text-sm md:text-base"
              >
                ← Back
              </Link>
              <div className="text-xl md:text-2xl">📋</div>
              <div className="min-w-0">
                <h1 className="text-base md:text-lg font-semibold text-green-800 truncate">RSVP Management</h1>
                <p className="text-xs md:text-sm text-green-600 hidden sm:block">View guest responses</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={fetchRSVPData}
                disabled={isLoadingRSVPs}
                className="bg-green-100 hover:bg-green-200 disabled:bg-green-50 text-green-700 px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm transition-colors flex items-center space-x-1 md:space-x-2"
              >
                <svg className={`w-3 h-3 md:w-4 md:h-4 ${isLoadingRSVPs ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <span className="text-xs md:text-sm text-green-700 hidden md:inline">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm transition-colors"
              >
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* RSVP Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Stats Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-green-100">
          <h2 className="text-lg md:text-xl font-bold text-green-800 mb-3 md:mb-4">RSVP Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-green-50 p-3 md:p-4 rounded-xl border border-green-200">
              <div className="text-xl md:text-2xl font-bold text-green-700">{rsvpStats.totalResponses}</div>
              <div className="text-xs md:text-sm text-green-600">Total Responses</div>
            </div>
            <div className="bg-blue-50 p-3 md:p-4 rounded-xl border border-blue-200">
              <div className="text-xl md:text-2xl font-bold text-blue-700">{rsvpStats.totalPax}</div>
              <div className="text-xs md:text-sm text-blue-600">Total Guests</div>
            </div>
            <div className="bg-purple-50 p-3 md:p-4 rounded-xl border border-purple-200">
              <div className="text-xl md:text-2xl font-bold text-purple-700">
                {rsvpStats.totalResponses > 0 ? (rsvpStats.totalPax / rsvpStats.totalResponses).toFixed(1) : '0'}
              </div>
              <div className="text-xs md:text-sm text-purple-600">Avg. Party Size</div>
            </div>
          </div>
        </div>

        {/* RSVP List */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100">
          <div className="p-4 md:p-6 border-b border-green-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="mb-2 sm:mb-0">
                <h3 className="text-base md:text-lg font-semibold text-green-800">Guest Responses</h3>
                <p className="text-green-600 text-xs md:text-sm mt-1">All confirmed attendees</p>
              </div>
              <div className="text-xs md:text-sm text-green-600">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {isLoadingRSVPs ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-3 text-green-600">Loading RSVP data...</span>
              </div>
            ) : rsvpResponses.length === 0 ? (
              <div className="text-center p-8 text-green-600">
                <div className="text-4xl mb-2">📝</div>
                <p className="font-medium">No RSVP responses yet.</p>
                <p className="text-sm mt-1">Responses will appear here when guests confirm their attendance.</p>
              </div>
            ) : (
              <>
                {/* Mobile Card Layout */}
                <div className="md:hidden">
                  <div className="p-4 space-y-4">
                    {rsvpResponses.map((response) => (
                      <div key={response.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-green-800 text-lg">{response.name}</h4>
                            <a href={`tel:${response.phone}`} className="text-green-600 hover:underline text-sm">
                              📞 {response.phone}
                            </a>
                          </div>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {response.pax} {response.pax === 1 ? 'guest' : 'guests'}
                          </span>
                        </div>
                        <div className="text-xs text-green-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatDate(response.created_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block">
                  <table className="w-full">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="text-left p-4 text-green-700 font-medium">Name</th>
                        <th className="text-left p-4 text-green-700 font-medium">Phone</th>
                        <th className="text-left p-4 text-green-700 font-medium">Guests</th>
                        <th className="text-left p-4 text-green-700 font-medium">Date Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rsvpResponses.map((response, index) => (
                        <tr key={response.id} className={index % 2 === 0 ? 'bg-white' : 'bg-green-25'}>
                          <td className="p-4 text-green-800 font-medium">{response.name}</td>
                          <td className="p-4 text-green-600">
                            <a href={`tel:${response.phone}`} className="hover:underline">
                              {response.phone}
                            </a>
                          </td>
                          <td className="p-4 text-green-600">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                              {response.pax} {response.pax === 1 ? 'person' : 'people'}
                            </span>
                          </td>
                          <td className="p-4 text-green-600 text-sm">{formatDate(response.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
          
          {/* Footer with totals */}
          {rsvpResponses.length > 0 && (
            <div className="p-3 md:p-4 bg-green-50 border-t border-green-100">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs md:text-sm space-y-1 sm:space-y-0">
                <span className="text-green-700">
                  Showing {rsvpResponses.length} response{rsvpResponses.length !== 1 ? 's' : ''}
                </span>
                <span className="text-green-700 font-medium">
                  Total: {rsvpStats.totalPax} guest{rsvpStats.totalPax !== 1 ? 's' : ''} confirmed
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 