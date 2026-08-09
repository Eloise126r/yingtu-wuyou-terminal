import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppContext'
import { AIPage } from './pages/AIPage'
import { CallingPage } from './pages/CallingPage'
import { EmergencyPage } from './pages/EmergencyPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PatientPage } from './pages/PatientPage'
import { PreparationPage } from './pages/PreparationPage'
import { PreparationSummaryPage } from './pages/PreparationSummaryPage'
import { SafetyPage } from './pages/SafetyPage'
import { ScanPage } from './pages/ScanPage'
import { TrainingPage } from './pages/TrainingPage'
import { WaitingPage } from './pages/WaitingPage'

function Protected({ children }: { children: React.ReactNode }) {
  const { patient } = useApp()
  return patient.checkedIn ? children : <Navigate to="/scan" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/patient" element={<PatientPage />} />
      <Route path="/preparation" element={<Protected><PreparationPage /></Protected>} />
      <Route path="/preparation-summary" element={<Protected><PreparationSummaryPage /></Protected>} />
      <Route path="/safety" element={<Protected><SafetyPage /></Protected>} />
      <Route path="/mr-safety" element={<Protected><SafetyPage /></Protected>} />
      <Route path="/training" element={<Protected><TrainingPage /></Protected>} />
      <Route path="/waiting" element={<Protected><WaitingPage /></Protected>} />
      <Route path="/calling" element={<Protected><CallingPage /></Protected>} />
      <Route path="/emergency" element={<Protected><EmergencyPage /></Protected>} />
      <Route path="/ai" element={<Protected><AIPage /></Protected>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
