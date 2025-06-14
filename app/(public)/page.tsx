'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { WeddingDetails } from '@/lib/auth';
import RSVPForm from '@/components/RSVPForm';

// Language type
type Language = 'en' | 'ms';

// Translations
const translations = {
  en: {
    // Main content
    weddingInvitation: 'Wedding Invitation',
    walimatul: 'WALIMATUL URUS',
    date: 'Saturday, Dec 27th 2025',
    dateShort: 'Sat, 27 Dec 2025',
    
    // Navigation
    calendar: 'Calendar',
    contact: 'Contact', 
    location: 'Location',
    rsvp: 'RSVP',
    note: 'Notes',
    language: 'Language',
    gift: 'Gift',
    
    // New buttons
    viewInvitation: 'View Invitation',
    backToHome: 'Back',
    
    // Calendar Modal
    eventSchedule: 'Event Schedule',
    weddingCeremony: 'Wedding Ceremony',
    weddingReception: 'Wedding Reception',
    ceremonyTime: '10:00 AM - 12:00 PM',
    receptionTime: '1:00 PM - 4:00 PM',
    
    // Contact Modal
    contactUs: 'Contact Us',
    groomFamily: 'Groom\'s Family',
    brideFamily: 'Bride\'s Family',
    call: 'Call',
    whatsapp: 'WhatsApp',
    
    // Location Modal
    venueLocation: 'Venue Location',
    openMaps: 'Open in Google Maps',
    
    // RSVP Modal
    rsvpTitle: 'RSVP',
    rsvpMessage: 'Please confirm your attendance before December 20, 2025',
    willAttend: '✓ Yes, I Will Attend',
    cannotAttend: '✗ Sorry, Cannot Attend',
    declineMessage: 'Thank you for letting us know. We hope to see you at future celebrations!',
    
    // Notes Modal
    importantNotes: 'Important Notes',
    dressCode: '• Dress Code: Smart Casual',
    parking: '• Parking available',
    halal: '• Halal food provided',
    invitation: '• Please bring this invitation',
    
    // Gift Modal
    giftTitle: 'Wedding Gift',
    giftMessage: 'Your presence is our present, but if you wish to give a gift:',
    scanQR: 'Scan QR Code for Online Transfer',
    accountOwner: 'Account Owner',
    bankName: 'Bank',
    
    // Language Modal
    selectLanguage: 'Select Language',
    english: 'English',
    malay: 'Bahasa Melayu',
    addToCalendar: 'Add to Calendar',
    googleCalendar: 'Google Calendar',
    appleCalendar: 'Apple Calendar',
    
    // Invitation Card
    with: 'with',
    ceremony: 'Ceremony',
    reception: 'Reception',
    cordiallyInvite: 'Cordially invite you to join us at the Wedding Reception of our beloved children',
    
    // Desktop note
    bestViewedMobile: '💍 Best viewed on mobile • Scroll down for navigation',
    
    // Calendar Event Text
    wedding: 'Wedding',
    weddingInvitationText: 'Wedding Invitation',
    ceremonySummary: 'Ceremony',
    receptionSummary: 'Reception',
    venue: 'Venue',
    
    // Default names fallback
    defaultGroomName: 'Hafiz',
    defaultBrideName: 'Afini',
    
    // Image alt text
    weddingBackgroundAlt: 'Wedding Background'
  },
  ms: {
    // Main content
    weddingInvitation: 'Jemputan Kahwin',
    walimatul: 'WALIMATUL URUS',
    date: 'Sabtu, 27 Dis 2025',
    dateShort: 'Sabtu, 27 Dis 2025',
    
    // Navigation
    calendar: 'Kalendar',
    contact: 'Hubungi',
    location: 'Lokasi',
    rsvp: 'RSVP',
    note: 'Nota',
    language: 'Bahasa',
    gift: 'Hadiah',
    
    // New buttons
    viewInvitation: 'Lihat Jemputan',
    backToHome: 'Kembali',
    
    // Calendar Modal
    eventSchedule: 'Acara Majlis',
    weddingCeremony: 'Majlis Akad Nikah',
    weddingReception: 'Majlis Walimatul Urus',
    ceremonyTime: '10:00 AM - 12:00 PM',
    receptionTime: '1:00 PM - 4:00 PM',
    
    // Contact Modal
    contactUs: 'Hubungi Kami',
    groomFamily: 'Keluarga Pengantin Lelaki',
    brideFamily: 'Keluarga Pengantin Perempuan',
    call: 'Panggil',
    whatsapp: 'WhatsApp',
    
    // Location Modal
    venueLocation: 'Lokasi Majlis',
    openMaps: 'Buka di Google Maps',
    
    // RSVP Modal
    rsvpTitle: 'RSVP',
    rsvpMessage: 'Sila sahkan kehadiran anda sebelum 20 Disember 2025',
    willAttend: '✓ Ya, Saya Akan Hadir',
    cannotAttend: '✗ Maaf, Tidak Dapat Hadir',
    declineMessage: 'Terima kasih kerana memberitahu kami. Kami berharap dapat bertemu anda di majlis akan datang!',
    
    // Notes Modal
    importantNotes: 'Nota Penting',
    dressCode: '• Dress Code: Smart Casual',
    parking: '• Tempat letak kereta tersedia',
    halal: '• Hidangan halal disediakan',
    invitation: '• Sila bawa jemputan ini',
    
    // Gift Modal
    giftTitle: 'Hadiah Pernikahan',
    giftMessage: 'Kehadiran anda adalah hadiah untuk kami, tetapi jika anda ingin memberikan hadiah:',
    scanQR: 'Imbas Kod QR untuk Transfer Online',
    accountOwner: 'Pemilik Akaun',
    bankName: 'Bank',
    
    // Language Modal
    selectLanguage: 'Pilih Bahasa',
    english: 'English',
    malay: 'Bahasa Melayu',
    addToCalendar: 'Tambah ke Kalendar',
    googleCalendar: 'Google Calendar',
    appleCalendar: 'Apple Calendar',
    
    // Invitation Card
    with: 'dengan',
    ceremony: 'Akad Nikah',
    reception: 'Walimatul Urus',
    cordiallyInvite: 'Dengan hormatnya menjemput anda ke majlis perkahwinan anak kami',
    
    // Desktop note
    bestViewedMobile: '💍 Terbaik dilihat di telefon bimbit • Skrol ke bawah untuk navigasi',
    
    // Calendar Event Text
    wedding: 'Perkahwinan',
    weddingInvitationText: 'Jemputan Kahwin',
    ceremonySummary: 'Akad Nikah',
    receptionSummary: 'Walimatul Urus',
    venue: 'Tempat',
    
    // Default names fallback
    defaultGroomName: 'Hafiz',
    defaultBrideName: 'Afini',
    
    // Image alt text
    weddingBackgroundAlt: 'Latar Belakang Kahwin'
  }
};

// Icon components
const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ContactIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const RSVPIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const InvitationIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const BackIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const GiftIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="8" width="18" height="4" rx="1" strokeWidth={2}/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8V21M7 8V21h10V8M12 8V4m-3 4h6" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4c0-1.1.9-2 2-2s2 .9 2 2-2 2-2 2-2-.9-2-2zm6 0c0-1.1.9-2 2-2s2 .9 2 2-2 2-2 2-2-.9-2-2z" />
  </svg>
);

// Full Invitation Card Component
const InvitationCard = ({ weddingData, language, t }: { weddingData: WeddingDetails | null; language: Language; t: typeof translations.en }) => {
  if (!weddingData) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const bismillahText = language === 'en' ? weddingData.bismillah_text_en : weddingData.bismillah_text_ms;
  const withPleasureText = language === 'en' ? weddingData.with_pleasure_text_en : weddingData.with_pleasure_text_ms;
  const togetherWithText = language === 'en' ? weddingData.together_with_text_en : weddingData.together_with_text_ms;
  const invitationMessage = language === 'en' ? weddingData.invitation_message_en : weddingData.invitation_message_ms;
  const weddingDate = language === 'en' ? weddingData.wedding_date : weddingData.wedding_date_ms;

  return (
    <div className="p-6 max-w-lg mx-auto text-center space-y-6 text-gray-800">
      {/* Bismillah */}
      <div className="space-y-2">
        <div className="flex justify-center">
          <Image
            src={'/assets/images/bismillah.png'}
            alt="bismillah"
            width={200}
            height={200}
            priority
            className="w-1/2 h-auto"
          />
        </div>
        <p className="text-sm italic text-green-700">{bismillahText}</p>
        <div className="w-24 h-px bg-green-600 mx-auto" />
      </div>

      {/* Opening text */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">{withPleasureText}</p>
      </div>

      {/* Groom's parents */}
      <div className="space-y-1">
        {/* Show groom's father if name exists */}
        {weddingData.groom_father_name && weddingData.groom_father_name.trim() !== '' && (
          <>
            <h3 className="text-lg font-bold text-green-800">{weddingData.groom_father_name}</h3>
            <p className="text-sm text-gray-600">
              {language === 'en' ? weddingData.groom_father_title_en : weddingData.groom_father_title_ms}
            </p>
          </>
        )}
        
        {/* Show & only if both parents exist */}
        {weddingData.groom_father_name && weddingData.groom_father_name.trim() !== '' && 
         weddingData.groom_mother_name && weddingData.groom_mother_name.trim() !== '' && (
          <div className="text-lg font-semibold">&</div>
        )}
        
        {/* Show groom's mother if name exists */}
        {weddingData.groom_mother_name && weddingData.groom_mother_name.trim() !== '' && (
          <>
            <h3 className="text-lg font-bold text-green-800">{weddingData.groom_mother_name}</h3>
            <p className="text-sm text-gray-600">
              {language === 'en' ? weddingData.groom_mother_title_en : weddingData.groom_mother_title_ms}
            </p>
          </>
        )}
      </div>

      {/* Together with */}
      <div className="space-y-2">
        <p className="text-base text-gray-700 italic">{togetherWithText}</p>
      </div>

      {/* Bride's parents */}
      <div className="space-y-1">
        {/* Show bride's father if name exists */}
        {weddingData.bride_father_name && weddingData.bride_father_name.trim() !== '' && (
          <>
            <h3 className="text-lg font-bold text-green-800">{weddingData.bride_father_name}</h3>
            <p className="text-sm text-gray-600">
              {language === 'en' ? weddingData.bride_father_title_en : weddingData.bride_father_title_ms}
            </p>
          </>
        )}
        
        {/* Show & only if both parents exist */}
        {weddingData.bride_father_name && weddingData.bride_father_name.trim() !== '' && 
         weddingData.bride_mother_name && weddingData.bride_mother_name.trim() !== '' && (
          <div className="text-lg font-semibold">&</div>
        )}
        
        {/* Show bride's mother if name exists */}
        {weddingData.bride_mother_name && weddingData.bride_mother_name.trim() !== '' && (
          <>
            <h3 className="text-lg font-bold text-green-800">{weddingData.bride_mother_name}</h3>
            <p className="text-sm text-gray-600">
              {language === 'en' ? weddingData.bride_mother_title_en : weddingData.bride_mother_title_ms}
            </p>
          </>
        )}
      </div>

      {/* Invitation message */}
      <div className="space-y-4 py-4">
        <p className="text-sm text-gray-600 leading-relaxed">{invitationMessage}</p>
      </div>

      {/* Couple names */}
      <div className="space-y-2 py-4 border-t border-b border-green-200">
        <h1 className="text-2xl font-bold text-green-800">{weddingData.groom_name.toUpperCase()}</h1>
        <div className="text-lg">&</div>
        <h1 className="text-2xl font-bold text-green-800">{weddingData.bride_name.toUpperCase()}</h1>
      </div>

      {/* Date and venue */}
      <div className="space-y-3">
        <p className="text-lg font-semibold text-green-700">{weddingDate}</p>
        <div className="space-y-1">
          <p className="text-base font-medium text-gray-700">{weddingData.venue_name}</p>
          <p className="text-sm text-gray-600 whitespace-pre-line">{weddingData.venue_address}</p>
        </div>
      </div>

      {/* Time */}
      <div className="space-y-2 text-sm text-gray-600">
        <div>
          {weddingData.ceremony_time_start && weddingData.ceremony_time_end && (
            <p className="font-medium">{t.ceremony}: {weddingData.ceremony_time_start} - {weddingData.ceremony_time_end}</p>
          )}
          {weddingData.reception_time_start && weddingData.reception_time_end && (
            <p className="font-medium">{t.reception}: {weddingData.reception_time_start} - {weddingData.reception_time_end}</p>
          )}
        </div>
      </div>

      {/* Final message */}
      <div className="pt-6">
        <div className="w-32 h-px bg-green-600 mx-auto mb-4" />
        <p className="text-xs text-gray-500 italic">
          {t.cordiallyInvite}
        </p>
      </div>
    </div>
  );
};

// Modal content components
const CalendarModal = ({ t, weddingData, language }: { t: typeof translations.en; weddingData: WeddingDetails | null; language: Language }) => {
  if (!weddingData) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const ceremonyDateTime = language === 'en' ? weddingData.wedding_date : weddingData.wedding_date_ms;
  const receptionDateTime = language === 'en' ? weddingData.wedding_date : weddingData.wedding_date_ms;

  // Simple function to convert time to 24-hour format for calendar
  const convertTimeTo24Hour = (timeStr: string) => {
    if (!timeStr || timeStr.trim() === '') {
      return '10:00'; // Default to 10:00 AM
    }
    
    try {
      // Handle formats like "02:00 PM", "2:00 PM", "14:00"
      const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2];
        const ampm = timeMatch[3]?.toUpperCase();
        
        if (ampm === 'PM' && hours !== 12) {
          hours += 12;
        } else if (ampm === 'AM' && hours === 12) {
          hours = 0;
        }
        
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
      }
      
      return '10:00'; // Default fallback
    } catch (error) {
      console.error('Error converting time:', error);
      return '10:00'; // Default fallback
    }
  };

  // Function to open Google Calendar
  const openGoogleCalendar = () => {
    const eventTitle = `${t.wedding} ${weddingData.groom_name} & ${weddingData.bride_name}`;
    const eventTitleEncoded = encodeURIComponent(eventTitle);
    
    // Use actual reception start time or default
    const receptionStartTime = convertTimeTo24Hour(weddingData.reception_time_start || '11:30 AM');
    const startDate = `20250726T${receptionStartTime.replace(':', '')}00`; // July 26, 2025
    
    // Use actual reception end time or default
    const receptionEndTime = convertTimeTo24Hour(weddingData.reception_time_end || '4:00 PM');
    const endDate = `20250726T${receptionEndTime.replace(':', '')}00`; // July 26, 2025
    
    const location = encodeURIComponent(`${weddingData.venue_name}, ${weddingData.venue_address}`);
    
    // Build details with conditional ceremony and reception information
    let eventDetails = `${t.weddingInvitationText}\n\n${weddingData.groom_name} & ${weddingData.bride_name}`;
    
    if (weddingData.ceremony_time_start && weddingData.ceremony_time_end) {
      eventDetails += `\n\n${t.ceremonySummary}: ${weddingData.ceremony_time_start} - ${weddingData.ceremony_time_end}`;
    }
    
    if (weddingData.reception_time_start && weddingData.reception_time_end) {
      eventDetails += `\n${t.receptionSummary}: ${weddingData.reception_time_start} - ${weddingData.reception_time_end}`;
    }
    
    eventDetails += `\n\n${t.venue}: ${weddingData.venue_name}`;
    
    const details = encodeURIComponent(eventDetails);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${eventTitleEncoded}&dates=${startDate}/${endDate}&details=${details}&location=${location}&trp=true&sf=true&output=xml`;
    
    console.log('Google Calendar Data:', {
      eventTitle,
      groomName: weddingData.groom_name,
      brideName: weddingData.bride_name,
      venue: weddingData.venue_name,
      receptionStartTime,
      receptionEndTime,
      startDate,
      endDate,
      url: googleCalendarUrl
    });
    
    window.open(googleCalendarUrl, '_blank');
  };

  // Function to generate and download .ics file for Apple Calendar
  const downloadICSFile = () => {
    const eventTitle = `${t.wedding} ${weddingData.groom_name} & ${weddingData.bride_name}`;
    
    // Use actual reception start time or default
    const receptionStartTime = convertTimeTo24Hour(weddingData.reception_time_start || '11:30 AM');
    const startDate = `20250726T${receptionStartTime.replace(':', '')}00`; // July 26, 2025
    
    // Use actual reception end time or default
    const receptionEndTime = convertTimeTo24Hour(weddingData.reception_time_end || '4:00 PM');
    const endDate = `20250726T${receptionEndTime.replace(':', '')}00`; // July 26, 2025
    
    // Build description with conditional ceremony and reception information
    let eventDescription = `${t.weddingInvitationText}\\n\\n${weddingData.groom_name} & ${weddingData.bride_name}`;
    
    if (weddingData.ceremony_time_start && weddingData.ceremony_time_end) {
      eventDescription += `\\n\\n${t.ceremonySummary}: ${weddingData.ceremony_time_start} - ${weddingData.ceremony_time_end}`;
    }
    
    if (weddingData.reception_time_start && weddingData.reception_time_end) {
      eventDescription += `\\n${t.receptionSummary}: ${weddingData.reception_time_start} - ${weddingData.reception_time_end}`;
    }
    
    eventDescription += `\\n\\n${t.venue}: ${weddingData.venue_name}`;
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding//Ekad//EN
BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
LOCATION:${weddingData.venue_name}, ${weddingData.venue_address}
SUMMARY:${eventTitle}
DESCRIPTION:${eventDescription}
URL;VALUE=URI:${window.location.origin}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${weddingData.groom_name.toLowerCase()}-${weddingData.bride_name.toLowerCase()}-wedding.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center text-green-800 mb-4">{t.eventSchedule}</h3>
      
      {/* Event Details */}
      <div className="space-y-3 mb-6">
        {weddingData.ceremony_time_start && weddingData.ceremony_time_end && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-700 mb-2">{t.weddingCeremony}</h4>
            <p className="text-green-600">{ceremonyDateTime}</p>
            <p className="text-green-600">{weddingData.ceremony_time_start} - {weddingData.ceremony_time_end}</p>
          </div>
        )}
        {weddingData.reception_time_start && weddingData.reception_time_end && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-700 mb-2">{t.weddingReception}</h4>
            <p className="text-green-600">{receptionDateTime}</p>
            <p className="text-green-600">{weddingData.reception_time_start} - {weddingData.reception_time_end}</p>
          </div>
        )}
      </div>

      {/* Calendar Invitation Buttons */}
      <div className="space-y-3">
        <h4 className="font-medium text-green-800 text-center mb-3">{t.addToCalendar}</h4>
        
        {/* Google Calendar Button */}
        <button
          onClick={openGoogleCalendar}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.5 3.25h-3V1.5a.75.75 0 0 0-1.5 0v1.75h-7V1.5a.75.75 0 0 0-1.5 0v1.75h-3A2.25 2.25 0 0 0 1.25 5.5v13A2.25 2.25 0 0 0 3.5 20.75h16a2.25 2.25 0 0 0 2.25-2.25v-13A2.25 2.25 0 0 0 19.5 3.25ZM20.25 18.5a.75.75 0 0 1-.75.75h-16a.75.75 0 0 1-.75-.75V9h17.5v9.5Zm0-11H2.75V5.5a.75.75 0 0 1 .75-.75h3v1.75a.75.75 0 0 0 1.5 0V4.75h7v1.75a.75.75 0 0 0 1.5 0V4.75h3a.75.75 0 0 1 .75.75v1.25Z"/>
          </svg>
          <span>{t.googleCalendar}</span>
        </button>

        {/* Apple Calendar Button */}
        <button
          onClick={downloadICSFile}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.5 3.25h-3V1.5a.75.75 0 0 0-1.5 0v1.75h-7V1.5a.75.75 0 0 0-1.5 0v1.75h-3A2.25 2.25 0 0 0 1.25 5.5v13A2.25 2.25 0 0 0 3.5 20.75h16a2.25 2.25 0 0 0 2.25-2.25v-13A2.25 2.25 0 0 0 19.5 3.25ZM20.25 18.5a.75.75 0 0 1-.75.75h-16a.75.75 0 0 1-.75-.75V9h17.5v9.5Zm0-11H2.75V5.5a.75.75 0 0 1 .75-.75h3v1.75a.75.75 0 0 0 1.5 0V4.75h7v1.75a.75.75 0 0 0 1.5 0V4.75h3a.75.75 0 0 1 .75.75v1.25Z"/>
          </svg>
          <span>{t.appleCalendar}</span>
        </button>
      </div>
    </div>
  );
};

const ContactModal = ({ t, weddingData, language }: { t: typeof translations.en; weddingData: WeddingDetails | null; language: Language }) => {
  if (!weddingData) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Function to normalize phone number for different uses
  const normalizePhoneNumber = (phone: string) => {
    // Remove all non-numeric characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // Ensure it starts with +60 for Malaysian numbers
    if (cleaned.match(/^[0-9]/)) {
      // If it starts with 0, replace with +60
      if (cleaned.startsWith('0')) {
        cleaned = '+60' + cleaned.substring(1);
      } else {
        cleaned = '+60' + cleaned;
      }
    }
    
    // If it starts with 60, prepend +
    if (cleaned.startsWith('60') && !cleaned.startsWith('+60')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  };

  // Function to get WhatsApp URL (no + symbol)
  const getWhatsAppUrl = (phone: string) => {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/[^\d]/g, '');
    
    // Ensure it starts with 60 for Malaysian numbers
    if (cleaned.startsWith('0')) {
      // Replace leading 0 with 60
      cleaned = '60' + cleaned.substring(1);
    } else if (!cleaned.startsWith('60')) {
      // If it doesn't start with 60, prepend it
      cleaned = '60' + cleaned;
    }
    
    return `https://wa.me/${cleaned}`;
  };

  // Function to get phone call URL (with + symbol)
  const getPhoneUrl = (phone: string) => {
    const normalized = normalizePhoneNumber(phone);
    return `tel:${normalized}`;
  };

  const contacts = [
    {
      name: weddingData.contact1_name,
      phone: weddingData.contact1_phone,
      label: t === translations.en ? weddingData.contact1_label_en : weddingData.contact1_label_ms
    },
    {
      name: weddingData.contact2_name,
      phone: weddingData.contact2_phone,
      label: t === translations.en ? weddingData.contact2_label_en : weddingData.contact2_label_ms
    },
    {
      name: weddingData.contact3_name,
      phone: weddingData.contact3_phone,
      label: t === translations.en ? weddingData.contact3_label_en : weddingData.contact3_label_ms
    },
    {
      name: weddingData.contact4_name,
      phone: weddingData.contact4_phone,
      label: t === translations.en ? weddingData.contact4_label_en : weddingData.contact4_label_ms
    }
  ];

  // Filter contacts to only show those with valid data
  const validContacts = contacts.filter(contact => 
    contact.name && contact.phone && 
    contact.name.trim() !== '' && contact.phone.trim() !== ''
  );

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center text-green-800 mb-4">{t.contactUs}</h3>
      
      {validContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {validContacts.map((contact, index) => (
            <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 text-sm mb-1">{contact.label}</h4>
              <p className="text-green-600 font-medium mb-3">{contact.name}</p>
              
              {/* Contact Buttons */}
              <div className="flex space-x-2">
                {/* Phone Call Button */}
                <a 
                  href={getPhoneUrl(contact.phone)}
                  className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex-1 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{t.call}</span>
                </a>
                
                {/* WhatsApp Button */}
                <a 
                  href={getWhatsAppUrl(contact.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors flex-1 text-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.390"/>
                  </svg>
                  <span>{t.whatsapp}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-green-600">
            {language === 'en' ? 'Contact information will be available soon.' : 'Maklumat hubungan akan tersedia tidak lama lagi.'}
          </p>
        </div>
      )}
    </div>
  );
};

const LocationModal = ({ t, weddingData }: { t: typeof translations.en; weddingData: WeddingDetails | null }) => {
  if (!weddingData) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const openMaps = () => {
    const url = weddingData.venue_google_maps_url || 
                `https://maps.google.com/?q=${encodeURIComponent(weddingData.venue_name + ', ' + weddingData.venue_address)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center text-green-800 mb-4">{t.venueLocation}</h3>
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-semibold text-green-700 mb-2">{weddingData.venue_name}</h4>
        <p className="text-green-600 mb-2 whitespace-pre-line">
          {weddingData.venue_address}
        </p>
        <button 
          onClick={openMaps}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          {t.openMaps}
        </button>
      </div>
    </div>
  );
};

const RSVPModal = ({ t, weddingData, language }: { t: typeof translations.en; weddingData: WeddingDetails | null; language: Language }) => {
  const [showForm, setShowForm] = useState(false);

  if (!weddingData) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const deadline = language === 'en' ? weddingData.rsvp_deadline : weddingData.rsvp_deadline_ms;

  const handleAttendClick = () => {
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    // Form will show success state for 2 seconds, then this gets called
    setShowForm(false);
  };

  const handleDeclineClick = () => {
    // You could add decline tracking here if needed
    alert(t.declineMessage);
  };

  if (showForm) {
    return <RSVPForm onSuccess={handleFormSuccess} language={language} />;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center text-green-800 mb-4">{t.rsvpTitle}</h3>
      <p className="text-green-600 text-center mb-4">
        {language === 'en' 
          ? `Please confirm your attendance before ${deadline}` 
          : `Sila sahkan kehadiran anda sebelum ${deadline}`
        }
      </p>
      <div className="space-y-3">
        <button 
          onClick={handleAttendClick}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          {t.willAttend}
        </button>
        <button 
          onClick={handleDeclineClick}
          className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors"
        >
          {t.cannotAttend}
        </button>
      </div>
    </div>
  );
};

const NoteModal = ({ t, weddingData, language }: { t: typeof translations.en; weddingData: WeddingDetails | null; language: Language }) => {
  if (!weddingData) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const notes = [
    {
      text: language === 'en' 
        ? `• Dress Code: ${weddingData.dress_code_en}`
        : `• Dress Code: ${weddingData.dress_code_ms}`
    },
    {
      text: language === 'en' 
        ? `• ${weddingData.parking_info_en}`
        : `• ${weddingData.parking_info_ms}`
    },
    {
      text: language === 'en' 
        ? `• ${weddingData.food_info_en}`
        : `• ${weddingData.food_info_ms}`
    },
    {
      text: language === 'en' 
        ? `• ${weddingData.invitation_note_en}`
        : `• ${weddingData.invitation_note_ms}`
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center text-green-800 mb-4">{t.importantNotes}</h3>
      <div className="space-y-3 text-green-700 max-h-[60vh] overflow-y-auto">
        {notes.map((note, index) => (
          <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="font-medium">{note.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const GiftModal = ({ t, weddingData, language }: { t: typeof translations.en; weddingData: WeddingDetails | null; language: Language }) => {
  if (!weddingData) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Check if QR code data is available
  const hasQRData = weddingData.qr_code_url || weddingData.qr_owner_name || weddingData.qr_bank_name;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center text-green-800 mb-4">{t.giftTitle}</h3>
      
      {hasQRData ? (
        <div className="space-y-4 text-center">
          <p className="text-green-600 mb-4">{t.giftMessage}</p>
          
          {/* QR Code Image */}
          {weddingData.qr_code_url && (
            <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
              <img 
                src={weddingData.qr_code_url} 
                alt="QR Code for Payment"
                className="mx-auto max-w-48 h-auto rounded"
              />
              <p className="text-sm text-green-600 mt-2">{t.scanQR}</p>
            </div>
          )}
          
          {/* Account Details */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-2">
            {weddingData.qr_owner_name && (
              <div>
                <p className="text-sm text-green-700 font-medium">{t.accountOwner}:</p>
                <p className="text-green-800 font-semibold">{weddingData.qr_owner_name}</p>
              </div>
            )}
            {weddingData.qr_bank_name && (
              <div>
                <p className="text-sm text-green-700 font-medium">{t.bankName}:</p>
                <p className="text-green-800 font-semibold">{weddingData.qr_bank_name}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-green-600">
            {t.giftMessage}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {language === 'en' ? 'Gift information will be available soon.' : 'Maklumat hadiah akan tersedia tidak lama lagi.'}
          </p>
        </div>
      )}
    </div>
  );
};

const LanguageModal = ({ 
  t, 
  currentLanguage, 
  onLanguageChange, 
  onClose 
}: { 
  t: typeof translations.en; 
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onClose: () => void;
}) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-center text-green-800 mb-4">{t.selectLanguage}</h3>
    <div className="space-y-3">
      <button 
        onClick={() => { onLanguageChange('en'); onClose(); }}
        className={`w-full py-3 px-4 rounded-lg transition-colors ${
          currentLanguage === 'en' 
            ? 'bg-green-600 text-white' 
            : 'bg-green-50 text-green-700 hover:bg-green-100'
        }`}
      >
        {t.english}
      </button>
      <button 
        onClick={() => { onLanguageChange('ms'); onClose(); }}
        className={`w-full py-3 px-4 rounded-lg transition-colors ${
          currentLanguage === 'ms' 
            ? 'bg-green-600 text-white' 
            : 'bg-green-50 text-green-700 hover:bg-green-100'
        }`}
      >
        {t.malay}
      </button>
    </div>
  </div>
);

// Bottom Sheet Modal Component with Enhanced Animations
const BottomSheet = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Clean up after animation completes
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with fade animation */}
      <div 
        className={`absolute inset-0 backdrop-blur-sm transition-all duration-300 ease-out ${
          isAnimating ? 'bg-black/50 opacity-100' : 'bg-black/0 opacity-0'
        }`}
        onClick={handleBackdropClick}
      />
      
      {/* Bottom Sheet with slide animation */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl transition-all duration-500 ease-out safe-area-inset-bottom ${
          isAnimating 
            ? 'transform translate-y-0 opacity-100' 
            : 'transform translate-y-full opacity-0'
        }`}
        style={{
          boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)',
          transformOrigin: 'bottom center',
          maxHeight: '75vh'
        }}
      >
        <div className="flex flex-col h-full max-h-[75vh]">
          {/* Handle with subtle animation */}
          <div 
            className={`w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2 flex-shrink-0 transition-all duration-700 ease-out ${
              isAnimating ? 'transform scale-100 opacity-100' : 'transform scale-75 opacity-0'
            }`}
            style={{ transitionDelay: isAnimating ? '200ms' : '0ms' }}
          />
          
          {/* Header with staggered animation */}
          <div 
            className={`flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0 transition-all duration-600 ease-out ${
              isAnimating ? 'transform translate-y-0 opacity-100' : 'transform translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: isAnimating ? '300ms' : '0ms' }}
          >
            <h2 className="text-base font-semibold text-green-800">{title}</h2>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <CloseIcon />
            </button>
          </div>
          
          {/* Scrollable Content with staggered animation */}
          <div 
            className={`flex-1 overflow-y-auto px-4 py-4 transition-all duration-700 ease-out ${
              isAnimating ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: isAnimating ? '400ms' : '0ms' }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('ms'); // Default to Malay
  const [weddingData, setWeddingData] = useState<WeddingDetails | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showInvitation, setShowInvitation] = useState(false);

  // Get current translations
  const t = translations[language];

  useEffect(() => {
    fetchWeddingDetails();
  }, []);

  const fetchWeddingDetails = async () => {
    try {
      const response = await fetch('/api/wedding-details');
      const data = await response.json();
      
      if (data.success) {
        setWeddingData(data.data);
      }
    } catch (error) {
      console.error('Error fetching wedding details:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  // Add escape key handler to prevent getting stuck
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showInvitation) {
        setShowInvitation(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showInvitation]);

  const getModalContent = () => {
    switch (activeModal) {
      case 'calendar':
        return <CalendarModal t={t} weddingData={weddingData} language={language} />;
      case 'contact':
        return <ContactModal t={t} weddingData={weddingData} language={language} />;
      case 'location':
        return <LocationModal t={t} weddingData={weddingData} />;
      case 'rsvp':
        return <RSVPModal t={t} weddingData={weddingData} language={language} />;
      case 'note':
        return <NoteModal t={t} weddingData={weddingData} language={language} />;
      case 'gift':
        return <GiftModal t={t} weddingData={weddingData} language={language} />;
      case 'language':
        return <LanguageModal t={t} currentLanguage={language} onLanguageChange={handleLanguageChange} onClose={closeModal} />;
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (activeModal) {
      case 'calendar':
        return t.calendar;
      case 'contact':
        return t.contact;
      case 'location':
        return t.location;
      case 'rsvp':
        return t.rsvp;
      case 'note':
        return t.note;
      case 'gift':
        return t.giftTitle;
      case 'language':
        return t.language;
      default:
        return '';
    }
  };

  return (
    <div className="h-screen overflow-hidden relative font-sans">
      {/* Add browser-specific styles */}
      <style jsx global>{`
        /* iOS Safari specific */
        @supports (-webkit-touch-callout: none) {
          .ios-safe-area {
            height: calc(100vh - env(safe-area-inset-top));
            padding-top: env(safe-area-inset-top);
          }
          .ios-bottom-container {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 50;
            padding-bottom: env(safe-area-inset-bottom);
            display: block !important;
          }
          .ios-content-area {
            padding-bottom: 180px; /* Space for button + bottom bar */
          }
          .android-only {
            display: none !important;
          }
        }
        
        /* Android Chrome specific */
        @supports not (-webkit-touch-callout: none) {
          .android-safe-area {
            height: 100vh;
            height: 100dvh; /* Dynamic viewport height for Android */
          }
          .android-bottom-container {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 50;
            padding-bottom: 16px;
            display: block !important;
          }
          .android-content-area {
            padding-bottom: 180px; /* Space for button + bottom bar */
          }
          .ios-bottom-container {
            display: none !important;
          }
          .android-only {
            display: none !important;
          }
        }
        
        /* Ensure bottom bar is always visible */
        .bottom-navigation {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
        }

        /* Enhanced shimmer loading animation */
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        
        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      {/* Flip Container - iOS Compatible */}
      <div className="relative w-full h-full overflow-hidden">
        {/* Front Side - Main Wedding Page */}
        <div 
          className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
            showInvitation ? 'opacity-0 pointer-events-none transform scale-95' : 'opacity-100 pointer-events-auto transform scale-100'
          }`}
        >
          {/* Main Wedding Content */}
          <div className="w-full h-full bg-green-900 relative flex flex-col ios-safe-area android-safe-area">
            {/* Desktop Background Overlay */}
            <div className="hidden md:block absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 flex-1 flex justify-center overflow-hidden">
              {/* Desktop Note - Hidden on Mobile */}
              <div className="hidden md:block absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
                <div className="bg-white/90 backdrop-blur-sm text-green-800 text-sm px-4 py-2 rounded-full shadow-lg border border-green-100">
                  {t.bestViewedMobile}
                </div>
              </div>
              
              {/* Floating Language Selector */}
              <div className="absolute top-4 right-4 z-30">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'ms' : 'en')}
                  className="bg-white/90 backdrop-blur-sm text-green-800 text-sm font-bold px-3 py-2 rounded-full shadow-lg border border-green-100 hover:bg-white transition-all duration-200 hover:scale-105 active:scale-95 min-w-[50px]"
                >
                  {language.toUpperCase()}
                </button>
              </div>
              
              <div className="w-full max-w-md mx-auto flex flex-col h-full md:my-8 md:h-auto md:max-h-[calc(100vh-4rem)] md:rounded-3xl md:overflow-hidden md:shadow-2xl md:border md:border-white/20 relative">
                {/* Background Image */}
                <div className="absolute inset-0 z-0 overflow-hidden md:rounded-3xl">
                  <Image
                    src="/assets/images/bg.webp"
                    alt={t.weddingBackgroundAlt}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/20 md:bg-black/30" />
                </div>

                {/* Wedding Invitation Content - With bottom padding for fixed bottom bar */}
                <div className="relative z-10 flex-1 flex flex-col h-full ios-content-area android-content-area">
                  {/* Main content area - takes remaining space above bottom sections */}
                  <div className="flex-1 flex items-center justify-center px-4 pt-16 pb-4">
                    <div className="text-center text-white w-full">
                      {/* Islamic Ornament */}
                      <div className="mb-4">
                        <div className="flex justify-center mb-3">
                          <Image
                            src={'/assets/images/bismillah.png'}
                            alt="bismillah"
                            width={150}
                            height={150}
                            priority
                            className="w-[42vw] max-w-[160px] h-auto"
                          />
                        </div>
                        <div className="w-16 h-px bg-black/60 mx-auto mb-1" />
                        <div className="text-base tracking-widest opacity-80 text-black font-medium">
                          {weddingData ? (language === 'en' ? weddingData.event_type_en : weddingData.event_type_ms) : t.walimatul}
                        </div>
                        <div className="text-sm opacity-60 italic text-black">{t.weddingInvitation}</div>
                        <div className="w-16 h-px bg-black/60 mx-auto mt-1" />
                      </div>

                      {/* Names */}
                      <div className="mb-4">
                        {isLoadingData ? (
                          <div className="space-y-2">
                            <div className="h-12 bg-white/20 rounded shimmer"></div>
                            <div className="h-8 bg-white/20 rounded shimmer mx-auto w-12"></div>
                            <div className="h-12 bg-white/20 rounded shimmer"></div>
                          </div>
                        ) : (
                          <>
                            <h1 className="text-[2.8rem] md:text-6xl font-script mb-1 text-green-100 leading-tight">
                              {weddingData?.groom_name || t.defaultGroomName}
                            </h1>
                            <div className="text-2xl md:text-4xl mb-1 opacity-80 font-script">&</div>
                            <h1 className="text-[2.8rem] md:text-6xl font-script text-green-100 leading-tight">
                              {weddingData?.bride_name || t.defaultBrideName}
                            </h1>
                          </>
                        )}
                      </div>

                      {/* Date */}
                      <div className="mb-3">
                        <div className="w-20 h-px bg-white/60 mx-auto mb-2" />
                        {isLoadingData ? (
                          <div className="h-7 bg-white/20 rounded shimmer mx-auto w-48"></div>
                        ) : (
                          <div className="text-lg md:text-xl font-semibold">
                            {weddingData ? (language === 'en' ? weddingData.wedding_date : weddingData.wedding_date_ms) : t.date}
                          </div>
                        )}
                        <div className="w-20 h-px bg-white/60 mx-auto mt-2" />
                      </div>
                    </div>
                  </div>

                  {/* Android only: Invitation Button Section */}
                  <div className="relative z-20 px-4 pb-4 android-only">
                    <div className="text-center">
                      <button
                        onClick={() => setShowInvitation(true)}
                        className="bg-white/95 backdrop-blur-sm text-green-800 px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 inline-flex items-center space-x-2 border border-green-200/50 text-sm"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        <InvitationIcon />
                        <span className="font-medium">{t.viewInvitation}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side - Invitation Card */}
        <div 
          className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
            showInvitation ? 'opacity-100 pointer-events-auto transform scale-100' : 'opacity-0 pointer-events-none transform scale-95'
          }`}
        >
          {/* Invitation Card Content */}
          <div className="w-full h-full bg-white relative flex flex-col ios-safe-area android-safe-area">
            {/* Back Button */}
            <div className="flex-shrink-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
              <button
                onClick={() => setShowInvitation(false)}
                className="flex items-center space-x-2 text-green-700 hover:text-green-800 transition-colors"
              >
                <BackIcon />
                <span className="font-medium text-sm">{t.backToHome}</span>
              </button>
            </div>

            {/* Invitation Card */}
            <div className="flex-1 overflow-y-auto">
              <div className="min-h-full flex items-center justify-center p-4">
                <div className="w-full max-w-md mx-auto">
                  <InvitationCard weddingData={weddingData} language={language} t={t} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation Bar - Always visible */}
      <div className={`${showInvitation ? 'hidden' : 'block'}`}>
        {/* iOS: Combined container for button + bottom bar */}
        <div className="ios-bottom-container">
          {/* iOS Invitation Button */}
          <div className="px-4 pb-2 pt-2">
            <div className="text-center">
              <button
                onClick={() => setShowInvitation(true)}
                className="bg-white/95 backdrop-blur-sm text-green-800 px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 inline-flex items-center space-x-2 border border-green-200/50 text-sm"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <InvitationIcon />
                <span className="font-medium">{t.viewInvitation}</span>
              </button>
            </div>
          </div>

          {/* iOS Bottom Navigation */}
          <div className="px-4 pb-4 pt-2 bg-gradient-to-t from-black/40 to-transparent">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg shadow-black/10 border border-green-100/30 relative overflow-hidden">
              {/* Subtle Islamic top accent */}
              <div className="h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent"></div>
              
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-[0.015]">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23166534'%3E%3Ccircle cx='15' cy='15' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>
              
              {/* Navigation buttons */}
              <div className="relative grid grid-cols-5 gap-0.5 px-1 py-2">
                {/* Calendar */}
                <button
                  onClick={() => openModal('calendar')}
                  className="flex flex-col items-center space-y-0.5 p-1 rounded-xl hover:bg-green-50/80 transition-all duration-200 group active:scale-95"
                >
                  <div className="text-green-700 group-hover:text-green-800 group-hover:scale-105 transition-all duration-200 text-lg">
                    <CalendarIcon />
                  </div>
                  <span className="text-[0.625rem] font-medium text-green-700 group-hover:text-green-800">
                    {t.calendar}
                  </span>
                </button>

                {/* Contact */}
                <button
                  onClick={() => openModal('contact')}
                  className="flex flex-col items-center space-y-0.5 p-1 rounded-xl hover:bg-green-50/80 transition-all duration-200 group active:scale-95"
                >
                  <div className="text-green-700 group-hover:text-green-800 group-hover:scale-105 transition-all duration-200 text-lg">
                    <ContactIcon />
                  </div>
                  <span className="text-[0.625rem] font-medium text-green-700 group-hover:text-green-800">
                    {t.contact}
                  </span>
                </button>

                {/* Location */}
                <button
                  onClick={() => openModal('location')}
                  className="flex flex-col items-center space-y-0.5 p-1 rounded-xl hover:bg-green-50/80 transition-all duration-200 group active:scale-95"
                >
                  <div className="text-green-700 group-hover:text-green-800 group-hover:scale-105 transition-all duration-200 text-lg">
                    <LocationIcon />
                  </div>
                  <span className="text-[0.625rem] font-medium text-green-700 group-hover:text-green-800">
                    {t.location}
                  </span>
                </button>

                {/* RSVP */}
                <button
                  onClick={() => openModal('rsvp')}
                  className="flex flex-col items-center space-y-0.5 p-1 rounded-xl hover:bg-green-50/80 transition-all duration-200 group active:scale-95"
                >
                  <div className="text-green-700 group-hover:text-green-800 group-hover:scale-105 transition-all duration-200 text-lg">
                    <RSVPIcon />
                  </div>
                  <span className="text-[0.625rem] font-medium text-green-700 group-hover:text-green-800">
                    {t.rsvp}
                  </span>
                </button>

                {/* Gift */}
                <button
                  onClick={() => openModal('gift')}
                  className="flex flex-col items-center space-y-0.5 p-1 rounded-xl hover:bg-green-50/80 transition-all duration-200 group active:scale-95"
                >
                  <div className="text-green-700 group-hover:text-green-800 group-hover:scale-105 transition-all duration-200 text-lg">
                    <GiftIcon />
                  </div>
                  <span className="text-[0.625rem] font-medium text-green-700 group-hover:text-green-800">
                    {t.gift}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Android: Combined container for button + bottom bar */}
        <div className="android-bottom-container">
          {/* Android Invitation Button */}
          <div className="px-4 pb-2 pt-2">
            <div className="text-center">
              <button
                onClick={() => setShowInvitation(true)}
                className="bg-white/95 backdrop-blur-sm text-green-800 px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 inline-flex items-center space-x-2 border border-green-200/50 text-sm"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <InvitationIcon />
                <span className="font-medium">{t.viewInvitation}</span>
              </button>
            </div>
          </div>

          {/* Android Bottom Navigation */}
          <div className="px-4 pb-4 pt-2 bg-gradient-to-t from-black/40 to-transparent">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg shadow-black/10 border border-green-100/30 relative overflow-hidden">
              {/* Subtle Islamic top accent */}
              <div className="h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent"></div>
              
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-[0.015]">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23166534'%3E%3Ccircle cx='15' cy='15' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>
              
              {/* Navigation buttons */}
              <div className="relative grid grid-cols-5 gap-0.5 px-1 py-2">
                {/* Calendar */}
                <button
                  onClick={() => openModal('calendar')}
                  className="flex flex-col items-center space-y-0.5 p-1 rounded-xl hover:bg-green-50/80 transition-all duration-200 group active:scale-95"
                >
                  <div className="text-green-700 group-hover:text-green-800 group-hover:scale-105 transition-all duration-200 text-lg">
                    <CalendarIcon />
                  </div>
                  <span className="text-[0.625rem] font-medium text-green-700 group-hover:text-green-800">
                    {t.calendar}
                  </span>
                </button>

                {/* Contact */}
                <button
                  onClick={() => openModal('contact')}
                  className="flex flex-col items-center space-y-0.5 p-1 rounded-xl hover:bg-green-50/80 transition-all duration-200 group active:scale-95"
                >
                  <div className="text-green-700 group-hover:text-green-800 group-hover:scale-105 transition-all duration-200 text-lg">
                    <ContactIcon />
                  </div>
                  <span className="text-[0.625rem] font-medium text-green-700 group-hover:text-green-800">
                    {t.contact}
                  </span>
                </button>

                {/* Location */}
                <button
                  onClick={() => openModal('location')}
                  className="flex flex-col items-center space-y-0.5 p-1 rounded-xl hover:bg-green-50/80 transition-all duration-200 group active:scale-95"
                >
                  <div className="text-green-700 group-hover:text-green-800 group-hover:scale-105 transition-all duration-200 text-lg">
                    <LocationIcon />
                  </div>
                  <span className="text-[0.625rem] font-medium text-green-700 group-hover:text-green-800">
                    {t.location}
                  </span>
                </button>

                {/* RSVP */}
                <button
                  onClick={() => openModal('rsvp')}
                  className="flex flex-col items-center space-y-0.5 p-1 rounded-xl hover:bg-green-50/80 transition-all duration-200 group active:scale-95"
                >
                  <div className="text-green-700 group-hover:text-green-800 group-hover:scale-105 transition-all duration-200 text-lg">
                    <RSVPIcon />
                  </div>
                  <span className="text-[0.625rem] font-medium text-green-700 group-hover:text-green-800">
                    {t.rsvp}
                  </span>
                </button>

                {/* Gift */}
                <button
                  onClick={() => openModal('gift')}
                  className="flex flex-col items-center space-y-0.5 p-1 rounded-xl hover:bg-green-50/80 transition-all duration-200 group active:scale-95"
                >
                  <div className="text-green-700 group-hover:text-green-800 group-hover:scale-105 transition-all duration-200 text-lg">
                    <GiftIcon />
                  </div>
                  <span className="text-[0.625rem] font-medium text-green-700 group-hover:text-green-800">
                    {t.gift}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Modal */}
      <BottomSheet
        isOpen={activeModal !== null}
        onClose={closeModal}
        title={getModalTitle()}
      >
        {getModalContent()}
      </BottomSheet>
    </div>
  );
}
