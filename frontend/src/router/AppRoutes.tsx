import { Routes, Route } from 'react-router-dom'
import CardPhotoPage from '../pages/CardPhotoPage'
import CardTextPage from '../pages/CardTextPage'
import EnvelopePage from '../pages/EnvelopePage'
import DatePage from '../pages/DatePage'
import AromaPage from '../pages/AromaPage'
import RegisterPage from '../pages/RegisterPage'
import HomePage from '../pages/HomePage'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/cardphoto" element={<CardPhotoPage />} />
    <Route path="/cardtext" element={<CardTextPage />} />
    <Route path="/envelope" element={<EnvelopePage />} />
    <Route path="/date" element={<DatePage />} />
    <Route path="/aroma" element={<AromaPage />} />
  </Routes>
)

export default AppRoutes
