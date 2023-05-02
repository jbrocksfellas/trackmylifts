"use client";

import { useRouter } from "next/navigation";
import { getAccessToken, getTokenExpiry, getUser, logOut } from "../../utils/auth.util";
import { useEffect, useState } from "react";

export default function useAuth() {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) router.push("/login");
    else {
      const user = getUser();

      setAccessToken(token);
      setUser(user);

      const exp = getTokenExpiry();
      if (Date.now() >= exp * 1000) {
        console.log("expired");
        logOut();
        router.push("/login");
      }
    }
  }, []);

  return { accessToken, user, logOut };
}
