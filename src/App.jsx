import { useNavigate } from "react-router-dom";
import SessionTimeoutTracker from "./components/session-timeout-tracker/session-timeout-tracker";
import { Toaster } from "sonner";
import ScrollToTop from "./components/common/scroll-to-top";
import AppRoutes from "./routes/app-routes";
import appLogout from "./utils/logout";
import { useSelector } from "react-redux";

function App() {
  const time = useSelector((state) => state.auth.tokenExpireAt * 60 * 1000);
  const handleLogout = () => {
    appLogout();
  };
  return (
    <>
      {/* <DisabledRightClick /> */}
      <Toaster richColors position="top-right" />
      <ScrollToTop />
      <SessionTimeoutTracker expiryTime={time} onLogout={handleLogout} />
      <AppRoutes />
    </>
  );
}

export default App;
