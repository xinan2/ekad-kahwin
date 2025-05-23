'use client';

import { useState, useEffect } from 'react';
import { WeddingDetails } from '@/lib/auth';

interface WeddingDetailsEditorProps {
  onClose: () => void;
}

export default function WeddingDetailsEditor({ onClose }: WeddingDetailsEditorProps) {
  const [details, setDetails] = useState<WeddingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchWeddingDetails();
  }, []);

  const fetchWeddingDetails = async () => {
    try {
      const response = await fetch('/api/wedding-details');
      const data = await response.json();
      
      if (data.success) {
        setDetails(data.data);
      } else {
        setError('Failed to load wedding details');
      }
    } catch (error) {
      console.error('Error fetching details:', error);
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!details) return;

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/wedding-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Wedding details updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update details');
      }
    } catch (error) {
      console.error('Error saving details:', error);
      setError('Network error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof WeddingDetails, value: string) => {
    if (details) {
      setDetails({ ...details, [field]: value });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Failed to load wedding details</p>
        <button
          onClick={fetchWeddingDetails}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-green-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-green-100">
          <h2 className="text-2xl font-bold text-green-800">Edit Wedding Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Couple Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">Couple Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Groom Name
                </label>
                <input
                  type="text"
                  value={details.groom_name}
                  onChange={(e) => handleChange('groom_name', e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Bride Name
                </label>
                <input
                  type="text"
                  value={details.bride_name}
                  onChange={(e) => handleChange('bride_name', e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Wedding Date */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">Wedding Date</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Date (English)
                </label>
                <input
                  type="text"
                  value={details.wedding_date}
                  onChange={(e) => handleChange('wedding_date', e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Saturday, Dec 27th 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Date (Malay)
                </label>
                <input
                  type="text"
                  value={details.wedding_date_ms}
                  onChange={(e) => handleChange('wedding_date_ms', e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Sabtu, 27 Dis 2025"
                />
              </div>
            </div>
          </div>

          {/* Event Times */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">Event Times</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Ceremony Start
                </label>
                <input
                  type="text"
                  value={details.ceremony_time_start}
                  onChange={(e) => handleChange('ceremony_time_start', e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="10:00 AM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Ceremony End
                </label>
                <input
                  type="text"
                  value={details.ceremony_time_end}
                  onChange={(e) => handleChange('ceremony_time_end', e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="12:00 PM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Reception Start
                </label>
                <input
                  type="text"
                  value={details.reception_time_start}
                  onChange={(e) => handleChange('reception_time_start', e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="1:00 PM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Reception End
                </label>
                <input
                  type="text"
                  value={details.reception_time_end}
                  onChange={(e) => handleChange('reception_time_end', e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="4:00 PM"
                />
              </div>
            </div>
          </div>

          {/* Venue Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">Venue Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={details.venue_name}
                  onChange={(e) => handleChange('venue_name', e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Venue Address
                </label>
                <textarea
                  value={details.venue_address}
                  onChange={(e) => handleChange('venue_address', e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Google Maps URL (optional)
                </label>
                <input
                  type="url"
                  value={details.venue_google_maps_url || ''}
                  onChange={(e) => handleChange('venue_google_maps_url', e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact 1 */}
              <div className="space-y-4">
                <h4 className="font-medium text-green-700">Contact 1</h4>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Label (English)
                  </label>
                  <input
                    type="text"
                    value={details.contact1_label_en}
                    onChange={(e) => handleChange('contact1_label_en', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Groom's Family"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Label (Malay)
                  </label>
                  <input
                    type="text"
                    value={details.contact1_label_ms}
                    onChange={(e) => handleChange('contact1_label_ms', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Keluarga Pengantin Lelaki"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={details.contact1_name}
                    onChange={(e) => handleChange('contact1_name', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={details.contact1_phone}
                    onChange={(e) => handleChange('contact1_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Contact 2 */}
              <div className="space-y-4">
                <h4 className="font-medium text-green-700">Contact 2</h4>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Label (English)
                  </label>
                  <input
                    type="text"
                    value={details.contact2_label_en}
                    onChange={(e) => handleChange('contact2_label_en', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Bride's Family"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Label (Malay)
                  </label>
                  <input
                    type="text"
                    value={details.contact2_label_ms}
                    onChange={(e) => handleChange('contact2_label_ms', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Keluarga Pengantin Perempuan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={details.contact2_name}
                    onChange={(e) => handleChange('contact2_name', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={details.contact2_phone}
                    onChange={(e) => handleChange('contact2_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Contact 3 */}
              <div className="space-y-4">
                <h4 className="font-medium text-green-700">Contact 3</h4>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Label (English)
                  </label>
                  <input
                    type="text"
                    value={details.contact3_label_en}
                    onChange={(e) => handleChange('contact3_label_en', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Groom's Father"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Label (Malay)
                  </label>
                  <input
                    type="text"
                    value={details.contact3_label_ms}
                    onChange={(e) => handleChange('contact3_label_ms', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Bapa Pengantin Lelaki"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={details.contact3_name}
                    onChange={(e) => handleChange('contact3_name', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={details.contact3_phone}
                    onChange={(e) => handleChange('contact3_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Contact 4 */}
              <div className="space-y-4">
                <h4 className="font-medium text-green-700">Contact 4</h4>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Label (English)
                  </label>
                  <input
                    type="text"
                    value={details.contact4_label_en}
                    onChange={(e) => handleChange('contact4_label_en', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Bride's Mother"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Label (Malay)
                  </label>
                  <input
                    type="text"
                    value={details.contact4_label_ms}
                    onChange={(e) => handleChange('contact4_label_ms', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Ibu Pengantin Perempuan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={details.contact4_name}
                    onChange={(e) => handleChange('contact4_name', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={details.contact4_phone}
                    onChange={(e) => handleChange('contact4_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RSVP Deadline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">RSVP Deadline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Deadline (English)
                </label>
                <input
                  type="text"
                  value={details.rsvp_deadline}
                  onChange={(e) => handleChange('rsvp_deadline', e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="December 20, 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Deadline (Malay)
                </label>
                <input
                  type="text"
                  value={details.rsvp_deadline_ms}
                  onChange={(e) => handleChange('rsvp_deadline_ms', e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="20 Disember 2025"
                />
              </div>
            </div>
          </div>

          {/* Event Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">Event Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Event Type (English)
                </label>
                <input
                  type="text"
                  value={details.event_type_en}
                  onChange={(e) => handleChange('event_type_en', e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Event Type (Malay)
                </label>
                <input
                  type="text"
                  value={details.event_type_ms}
                  onChange={(e) => handleChange('event_type_ms', e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">Important Notes</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Dress Code (English)
                  </label>
                  <input
                    type="text"
                    value={details.dress_code_en}
                    onChange={(e) => handleChange('dress_code_en', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Dress Code (Malay)
                  </label>
                  <input
                    type="text"
                    value={details.dress_code_ms}
                    onChange={(e) => handleChange('dress_code_ms', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Parking Info (English)
                  </label>
                  <input
                    type="text"
                    value={details.parking_info_en}
                    onChange={(e) => handleChange('parking_info_en', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Parking Info (Malay)
                  </label>
                  <input
                    type="text"
                    value={details.parking_info_ms}
                    onChange={(e) => handleChange('parking_info_ms', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Food Info (English)
                  </label>
                  <input
                    type="text"
                    value={details.food_info_en}
                    onChange={(e) => handleChange('food_info_en', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Food Info (Malay)
                  </label>
                  <input
                    type="text"
                    value={details.food_info_ms}
                    onChange={(e) => handleChange('food_info_ms', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Invitation Note (English)
                  </label>
                  <input
                    type="text"
                    value={details.invitation_note_en}
                    onChange={(e) => handleChange('invitation_note_en', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Invitation Note (Malay)
                  </label>
                  <input
                    type="text"
                    value={details.invitation_note_ms}
                    onChange={(e) => handleChange('invitation_note_ms', e.target.value)}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-green-100">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 flex items-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 