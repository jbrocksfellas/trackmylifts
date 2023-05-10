import { useEffect, useState } from "react";
import useAuth from "../useAuth";
import { apiAxios } from "../../utils/api.util";

export default function useFetch(url) {
  const { accessToken } = useAuth();

  const [data, setData] = useState(null);

  useEffect(() => {
    if (accessToken) {
      apiAxios.get(url, { headers: { Authorization: "Bearer " + accessToken } }).then;
    }
  }, [url, accessToken]);

  return { data };
}
