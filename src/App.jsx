import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import CustomCursor from './components/ui/CustomCursor';
import ScrollProgress from './components/ui/ScrollProgress';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import './index.css';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
ScrollTrigger.defaults({ fastScrollEnd: true });

const Router = () => {
  const { intent } = useAuth();
  return intent ? <LoginPage /> : <MainPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <div className="noise" />
      <CustomCursor />
      <ScrollProgress />
      <Router />
    </AuthProvider>
  );
}
