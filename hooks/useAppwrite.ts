import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useAppwrite = (fn: any) => {
  const [isLoading, setIsLaoding] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setIsLaoding(true);

    try {
      const res = await fn();
      setData(res);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLaoding(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, isLoading, refetch };
};

export default useAppwrite;
