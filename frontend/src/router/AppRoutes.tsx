import { Routes, Route } from 'react-router-dom'
import LegacyPagePlaceholder from '../pages/LegacyPagePlaceholder'
import RegisterPage from '../pages/RegisterPage'
import HomePage from '../pages/HomePage'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/cardphoto" element={<LegacyPagePlaceholder />} />
    <Route path="/cardtext" element={<LegacyPagePlaceholder />} />
    <Route path="/envelope" element={<LegacyPagePlaceholder />} />
    <Route path="/date" element={<LegacyPagePlaceholder />} />
    <Route path="/aroma" element={<LegacyPagePlaceholder />} />
  </Routes>
)

export default AppRoutes
