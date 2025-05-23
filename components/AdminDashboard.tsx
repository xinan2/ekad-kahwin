'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  username: string;
}

interface AdminDashboardProps {
  user: User | null;
}

interface RSVPStats {
  totalResponses: number;
  totalPax: number;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [rsvpStats, setRsvpStats] = useState<RSVPStats>({ totalResponses: 0, totalPax: 0 });
  const router = useRouter();

  // Fetch RSVP data on component mount
  useEffect(() => {
    fetchRSVPData();
  }, []);

  const fetchRSVPData = async () => {
    try {
      const response = await fetch('/api/rsvp');
      const data = await response.json();
      
      if (data.success) {
        setRsvpStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching RSVP data:', error);
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

  const handleViewRSVPs = () => {
    router.push('/admin/rsvp/list');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 font-sans">
        {/* Header */}
        <header className="bg-white border-b border-green-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">☪</div>
                <div>
                  <h1 className="text-lg font-semibold text-green-800">Wedding Admin</h1>
                  <p className="text-sm text-green-600">Hafiz & Afini</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-green-700">Welcome, {user?.username}</span>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-green-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-green-800">Wedding Management Dashboard</h2>
                <p className="text-green-600">
                  Manage your wedding invitation, guest responses, and event details from this central dashboard.
                </p>
              </div>
              <button
                onClick={fetchRSVPData}
                className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <div className="text-3xl font-bold text-green-700">{rsvpStats.totalResponses}</div>
                <div className="text-sm text-green-600 mt-1">Total RSVP</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <div className="text-3xl font-bold text-blue-700">{rsvpStats.totalPax}</div>
                <div className="text-sm text-blue-600 mt-1">Total Guests</div>
              </div>
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                <div className="text-3xl font-bold text-orange-700">0</div>
                <div className="text-sm text-orange-600 mt-1">Declined</div>
              </div>
               <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <div className="text-3xl font-bold text-purple-700">
                  {rsvpStats.totalResponses > 0 ? (rsvpStats.totalPax / rsvpStats.totalResponses).toFixed(1) : '0'}
                </div>
                <div className="text-sm text-purple-600 mt-1">Avg. Party Size</div>
              </div>
            </div>
          </div>

          {/* Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* RSVP Management */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-800 ml-3">RSVP Management</h3>
              </div>
              <p className="text-green-600 text-sm mb-4">View and manage guest responses</p>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors" onClick={handleViewRSVPs}>
                View RSVPs
              </button>
            </div>

            {/* Wedding Details - CHANGED to Link */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-800 ml-3">Wedding Details</h3>
              </div>
              <p className="text-green-600 text-sm mb-4">Edit ceremony information</p>
              <Link 
                href="/admin/edit-wedding-details"
                className="w-full block text-center bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Edit Details
              </Link>
            </div>

            {/* Messages */}
            {/* <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center mb-4">
                <div className="bg-pink-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-800 ml-3">Messages</h3>
              </div>
              <p className="text-green-600 text-sm mb-4">Guest messages & wishes</p>
              <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transition-colors">
                View Messages
              </button>
            </div> */}

            {/* View Invitation */}
            {/* <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-800 ml-3">View Invitation</h3>
              </div>
              <p className="text-green-600 text-sm mb-4">Preview public invitation</p>
              <Link 
                href="/"
                target="_blank"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors inline-block text-center"
              >
                Open Invitation
              </Link>
            </div> */}
          </div>
        </main>
      </div>
    </>
  );
} 