import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppContext'
import { GlobalAnnouncementOverlay } from './components/GlobalAnnouncementOverlay'
import { AIPage } from './pages/AIPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PatientPage } from './pages/PatientPage'
import { PreparationPage } from './pages/PreparationPage'
import { PreparationSummaryPage } from './pages/PreparationSummaryPage'
import { SafetyPage } from './pages/SafetyPage'
import { ScanPage } from './pages/ScanPage'
import { TrainingPage } from './pages/TrainingPage'
import { WaitingPage } from './pages/WaitingPage'
import { TechnicianDashboard } from './pages/TechnicianDashboard'

function Protected({ children }: { children: React.ReactNode }) {
  const { patient } = useApp()
  return patient.checkedIn ? children : <Navigate to="/scan" replace />
}

function StaffProtected({ children }: { children: React.ReactNode }) {
  const { staffAuthenticated } = useApp()
  return staffAuthenticated ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <><Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/patient" element={<PatientPage />} />
      <Route path="/preparation" element={<Protected><PreparationPage /></Protected>} />
      <Route path="/preparation-summary" element={<Protected><PreparationSummaryPage /></Protected>} />
      <Route path="/safety" element={<Protected><SafetyPage /></Protected>} />
      <Route path="/mr-safety" element={<Protected><SafetyPage /></Protected>} />
      <Route path="/training" element={<Protected><TrainingPage /></Protected>} />
      <Route path="/waiting" element={<Protected><WaitingPage /></Protected>} />
      <Route path="/ai" element={<Protected><AIPage /></Protected>} />
      <Route path="/technician" element={<StaffProtected><TechnicianDashboard /></StaffProtected>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes><GlobalAnnouncementOverlay /></>
  )
}
