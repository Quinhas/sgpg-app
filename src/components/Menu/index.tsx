import {
  Button,
  Flex,
  IconButton,
  LightMode,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import MenuItem from "@components/MenuItem";
import { useRouter } from "next/router";
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Menu() {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  // const { signOut } = useAuth();
  const toast = useToast();

  const pages = [
    { name: "Inicial", href: "/" },
    { name: "Estudantes", href: "/students" },
    { name: "Instrumentos", href: "/instruments" },
    { name: "Eventos", href: "/events" },
    { name: "Funcionários", href: "/employees" },
    { name: "Cursos", href: "/classes" },
  ];

  const handleLogout = async () => {
    try {
      // await signOut();
      toast({
        description: "Usuário deslogado com sucesso.",
        status: "success",
        isClosable: true,

        position: "top",
      });
      await router.push("/login");
    } catch (error: any) {
      toast({
        description: error.message,
        status: "error",
        isClosable: true,

        position: "top",
      });
    }
  };

  return (
    <>
      <Flex grow={1} direction={"column"}>
        <Flex as={"ul"} direction={"column"} w={"100%"} grow={1}>
          {pages.map((page) => (
            <MenuItem
              key={page.href}
              href={page.href}
              name={page.name}
              variant={router.asPath === page.href ? "active" : ""}
            />
          ))}
        </Flex>
        <Flex justify={"space-between"} p={"1rem"}>
          <LightMode>
            <IconButton
              aria-label="Toggle theme"
              icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              borderRadius={"md"}
              colorScheme={"blackAlpha"}
              variant={"outline"}
            />
            <Button
              variant={"outline"}
              colorScheme={"blackAlpha"}
              onClick={handleLogout}
            >
              Sair
            </Button>
          </LightMode>
        </Flex>
      </Flex>
    </>
  );
}
