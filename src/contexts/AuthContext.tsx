import { Flex, Spinner, Text, useColorMode } from "@chakra-ui/react";
import api from "@services/api";
import { SGPGApplicationException } from "@utils/SGPGApplicationException";
import router from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";

type User = {
  employee_id: number;
  employee_name: string;
  employee_email: string;
  employee_role: number;
  is_deleted: boolean;
};

type AuthContextType = {
  employee: User | undefined;
  isLogged: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<boolean>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [employee, setEmployee] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const { colorMode } = useColorMode();

  useEffect(() => {
    setLoading(true);
    (async () => {
      const storagedUser = localStorage.getItem("@SGPG:user");
      if (storagedUser) {
        setEmployee(JSON.parse(storagedUser));
        setIsLogged(true);
        setLoading(false);
        if (["/login"].includes(router.asPath)) {
          await router.replace("/");
        }
      } else {
        if (!["/login"].includes(router.asPath)) {
          await router.replace("/login");
        }
        setIsLogged(false);
        setEmployee(undefined);
        setLoading(false);
        localStorage.removeItem("@SGPG:user");
      }
    })();
  }, []);

  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      const employee = await api.employees.login(email, password);

      const user: User = {
        employee_id: employee.employee_id,
        employee_email: employee.employee_email,
        employee_name: employee.employee_name,
        employee_role: employee.employee_role,
        is_deleted: employee.is_deleted,
      };

      localStorage.setItem("@SGPG:user", JSON.stringify(user));
      setIsLogged(true);
      setEmployee(user);
      await router.push("/");
      return user;
    } catch (err: any) {
      if (err instanceof SGPGApplicationException) {
        throw err;
      } else {
        const error = err as Error;
        throw new SGPGApplicationException(error.message, error);
      }
    }
  };

  const signOut = async (): Promise<boolean> => {
    try {
      setIsLogged(false);
      setEmployee(undefined);
      localStorage.removeItem("@SGPG:user");
      return true;
    } catch (err: any) {
      if (err instanceof SGPGApplicationException) {
        throw err;
      } else {
        const error = err as Error;
        throw new SGPGApplicationException(error.message, error);
      }
    }
  };

  if (loading) {
    return (
      <Flex w={"100vw"} h={"100vh"} align={"center"} justify={"center"}>
        <Flex
          direction={"column"}
          align="center"
          gridGap={"1.5rem"}
          bg={colorMode === "light" ? "white" : "black"}
          boxShadow={"md"}
          py={"2rem"}
          px={"4rem"}
          borderRadius={"md"}
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="primaryApp.500"
            size="xl"
          />
          <Text color="gray.500">Carregando...</Text>
        </Flex>
      </Flex>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        employee,
        isLogged,
        signIn,
        signOut,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
