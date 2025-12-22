import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useAuth = () => {
  const [authData, setAuthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const user = useSelector((state) => state.auth?.user ?? null);
  const token = useSelector((state) => state.auth?.token ?? null);

  useEffect(() => {
    if (token && user) {
      const userData = {
        id: user?.id ?? null,
        name: user?.name ?? null,
        userType: user?.user_type ?? null,
        email: user?.email ?? null,
      };
      setAuthData({ user: userData });
    } else {
      setAuthData({ user: null });
    }
    setIsLoading(false);
  }, [token, user]); 

  return { data: authData, isLoading };
};

export default useAuth;
