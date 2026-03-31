import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import TeacherManagement from './pages/TeacherManagement';
import InspectionManagement from './pages/InspectionManagement';
import ExamPeriodInspection from './pages/ExamPeriodInspection';
import WeeklyTasks from './pages/WeeklyTasks';
import MonthlyTasks from './pages/MonthlyTasks';
import Competitions from './pages/Competitions';
import ExamPreparation from './pages/ExamPreparation';
import Notifications from './pages/Notifications';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quan-ly-giao-vien" element={<TeacherManagement />} />
            <Route path="/kiem-tra-noi-bo" element={<InspectionManagement />} />
            <Route path="/kiem-tra-cac-ky" element={<ExamPeriodInspection />} />
            <Route path="/cong-viec-tuan" element={<WeeklyTasks />} />
            <Route path="/cong-viec-thang" element={<MonthlyTasks />} />
            <Route path="/hoi-thi" element={<Competitions />} />
            <Route path="/ra-de-kiem-tra" element={<ExamPreparation />} />
            <Route path="/thong-bao" element={<Notifications />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
