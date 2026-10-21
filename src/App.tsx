import { useState } from 'react';
import { TabType, ServiceType, VisitTicket, Announcement } from './types';
import { INITIAL_TICKETS, ANNOUNCEMENTS } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { TicketQueueScreen } from './components/TicketQueueScreen';
import { ServicesScreen } from './components/ServicesScreen';
import { TicketModal } from './components/TicketModal';
import { FacilityModal } from './components/FacilityModal';
import { ArticleModal } from './components/ArticleModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationsModal } from './components/NotificationsModal';
import { DatabaseModal } from './components/DatabaseModal';
import { PortalWebsite } from './components/PortalWebsite';

export default function App() {
  // Mode: 'website' (Website Resmi Lapas & Portal Admin) vs 'mobile' (Aplikasi Mobile Warga)
  const [viewMode, setViewMode] = useState<'website' | 'mobile'>('website');
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);

  // Mobile App state
  const [currentTab, setCurrentTab] = useState<TabType>('beranda');
  const [regServiceType, setRegServiceType] = useState<ServiceType>('tatap_muka');
  
  // Data state
  const [tickets, setTickets] = useState<VisitTicket[]>(INITIAL_TICKETS);
  const [announcements] = useState<Announcement[]>(ANNOUNCEMENTS);
  
  // Modal states
  const [selectedTicket, setSelectedTicket] = useState<VisitTicket | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(1);

  // Active primary ticket
  const activeTicket = tickets.find(t => t.status === 'active') || null;

  const handleOpenTicketModal = (ticket: VisitTicket) => {
    setSelectedTicket(ticket);
    setIsTicketModalOpen(true);
  };

  const handleOpenAnnouncement = (ann: Announcement) => {
    setSelectedAnnouncement(ann);
    setIsArticleModalOpen(true);
  };

  const handleNavigateToTab = (tab: TabType, serviceType?: ServiceType) => {
    if (serviceType) {
      setRegServiceType(serviceType);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateTicket = (newTicket: VisitTicket) => {
    setTickets(prev => [newTicket, ...prev]);
  };

  const handleCancelTicket = (ticketId: string) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status: 'cancelled' } : t))
    );
  };

  if (viewMode === 'website') {
    return (
      <>
        <PortalWebsite
          onOpenDatabase={() => setIsDatabaseModalOpen(true)}
          onSwitchToMobile={() => setViewMode('mobile')}
        />
        <DatabaseModal
          isOpen={isDatabaseModalOpen}
          onClose={() => setIsDatabaseModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col selection:bg-[#d3e4fe]">
      {/* Top Fixed App Bar */}
      <Header
        unreadNotificationsCount={unreadNotifications}
        onOpenNotifications={() => {
          setIsNotificationsModalOpen(true);
          setUnreadNotifications(0);
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onNavigateHome={() => setCurrentTab('beranda')}
        onSwitchToWebsite={() => setViewMode('website')}
        onOpenDatabase={() => setIsDatabaseModalOpen(true)}
      />

      {/* Main Mobile App Shell */}
      <main className="flex-1 flex flex-col relative w-full pt-20 pb-24 bg-[#f8f9ff] max-w-[480px] mx-auto min-h-screen shadow-[0_0_24px_rgba(15,41,66,0.03)] border-x border-[#0f2942]/5">
        {currentTab === 'beranda' && (
          <HomeScreen
            activeTicket={activeTicket}
            announcements={announcements}
            onOpenTicketModal={handleOpenTicketModal}
            onOpenFacilityModal={() => setIsFacilityModalOpen(true)}
            onOpenAnnouncement={handleOpenAnnouncement}
            onNavigateToTab={handleNavigateToTab}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}

        {currentTab === 'pendaftaran' && (
          <RegistrationScreen
            initialServiceType={regServiceType}
            onCreateTicket={handleCreateTicket}
            onNavigateHome={() => setCurrentTab('beranda')}
            onViewTicket={ticket => {
              setSelectedTicket(ticket);
              setIsTicketModalOpen(true);
            }}
          />
        )}

        {currentTab === 'tiket-antrean' && (
          <TicketQueueScreen
            tickets={tickets}
            onOpenTicketModal={handleOpenTicketModal}
            onNavigateToRegister={() => setCurrentTab('pendaftaran')}
          />
        )}

        {currentTab === 'layanan' && <ServicesScreen />}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={currentTab}
        onChangeTab={tab => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeTicketCount={tickets.filter(t => t.status === 'active').length}
      />

      {/* Modals & Dialogs */}
      <TicketModal
        ticket={selectedTicket}
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onCancelTicket={handleCancelTicket}
      />

      <FacilityModal
        isOpen={isFacilityModalOpen}
        onClose={() => setIsFacilityModalOpen(false)}
      />

      <ArticleModal
        announcement={selectedAnnouncement}
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        onNavigateToTicket={() => {
          if (activeTicket) {
            handleOpenTicketModal(activeTicket);
          } else {
            setCurrentTab('tiket-antrean');
          }
        }}
      />

      {/* Database Explorer Modal */}
      <DatabaseModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
      />
    </div>
  );
}
