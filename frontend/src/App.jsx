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
import EditMemberModal from './components/modals/EditMemberModal';
import AuthModal from './components/modals/AuthModal';

// Streamlined Pages
import GanttDashboardPage from './pages/GanttDashboardPage';
import GrandChartPage from './pages/GrandChartPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ExportPage from './pages/ExportPage';

function MainLayout() {
  const { activeTab } = usePulse();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'gantt':
      case 'dashboard':
        return <GanttDashboardPage />;
      case 'grandchart':
      case 'contributions':
      case 'team-members':
        return <GrandChartPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'export':
      case 'export-reports':
        return <ExportPage />;
      default:
        return <GanttDashboardPage />;
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
      <EditMemberModal />
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
