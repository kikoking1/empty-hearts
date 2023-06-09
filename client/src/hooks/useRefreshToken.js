import axios from "../util/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/api/Auth/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      return { ...prev, accessToken: response.data };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
