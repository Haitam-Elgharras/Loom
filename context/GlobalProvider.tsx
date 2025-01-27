import { getCurrentUser } from "@/lib/appwrite";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface GlobalContextType {
  loggedInUser: any;
  isLoggedIn: boolean;
  isLoading: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  setLoggedInUser: (user: any) => void;
}

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setLoggedInUser(res);
        } else {
          setIsLoggedIn(false);
          setLoggedInUser(null);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        loggedInUser,
        isLoggedIn,
        isLoading,
        setIsLoggedIn,
        setLoggedInUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
