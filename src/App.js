// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import AuthProvider from './contexts/AuthContext';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ScrollToTop />
        <BaseOptionChartStyle />
        <Router />
      </AuthProvider>
    </ThemeProvider>
  );
}
