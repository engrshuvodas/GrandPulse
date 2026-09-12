import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { PulseProvider, usePulse } from './context/PulseContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Toast from './components/common/Toast';

// Modals
import LogContributionModal from './components/modals/LogContributionModal';
import NewTaskModal from './components/modals/NewTaskModal';
import MemberDossierModal from './components/modals/MemberDossierModal';
import AddMemberModal from './components/modals/AddMemberModal';
import AuthModal from './components/modals/AuthModal';

// Pages
import DashboardPage from './pages/DashboardPage';
import KanbanPage from './pages/KanbanPage';
import ContributionsPage from './pages/ContributionsPage';
import TeamMembersPage from './pages/TeamMembersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ExportPage from './pages/ExportPage';

function MainLayout() {
  const { activeTab } = usePulse();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'tasks-kanban':
        return <KanbanPage />;
      case 'contributions':
      case 'activity-history':
      case 'settings':
        return <ContributionsPage />;
      case 'team-members':
        return <TeamMembersPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'export-reports':
        return <ExportPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface antialiased selection:bg-primary selection:text-on-primary">
      {/* Fixed Left Navigation Rail */}
      <Sidebar />

      {/* Fixed Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="pl-64 pt-16 bg-background min-h-screen px-space-xl pb-space-2xl">
        {renderActivePage()}
      </main>

      {/* Interactive Global Modals */}
      <LogContributionModal />
      <NewTaskModal />
      <MemberDossierModal />
      <AddMemberModal />
      <AuthModal />

      {/* Toast Notification */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PulseProvider>
        <MainLayout />
      </PulseProvider>
    </AuthProvider>
  );
}
