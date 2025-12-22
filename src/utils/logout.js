import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { logout } from "@/store/auth/authSlice";
import { persistor } from "@/store/store";

const appLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const cookiesToRemove = [
        "token",
        "id",
        "name",
        "username",
        "chapter_id",
        "viewer_chapter_ids",
        "user_type_id",
        "token-expire-time",
        "ver_con",
        "email",
        "currentYear",
        "favorite_chapters",
        "recent_chapters",
      ];
      cookiesToRemove.forEach((cookie) => Cookies.remove(cookie));

      localStorage.clear();

      await persistor.flush();

      dispatch(logout());

      navigate("/");

      setTimeout(() => persistor.purge(), 1000);
    } catch (error) {
      // message.error(error?.response?.data?.message || "Logout Error");
      console.error("Logout failed:", error);
    }
  };

  return handleLogout;
};

export default appLogout;
