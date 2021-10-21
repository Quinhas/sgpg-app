import { useColorMode } from "@chakra-ui/color-mode";
import { Flex, Heading } from "@chakra-ui/layout";
import Menu from "@components/Menu";
import { useRouter } from "next/dist/client/router";

export default function MenuAside() {
  const router = useRouter();
  const { colorMode } = useColorMode();

  return (
    <Flex
      h={"100vh"}
      minW={"18rem"}
      maxW={"18rem"}
      bg={"primaryApp.600"}
      boxShadow={"md"}
      gridGap={"1.5rem"}
      position={"sticky"}
      top={"0"}
      direction={"column"}
      pt={"3.125rem"}
    >
      <Flex
        align={"center"}
        fontSize={"1.3rem"}
        cursor={"pointer"}
        transition={"0.2s ease-in-out"}
        onClick={() => router.push("/")}
        gridGap={"0.25rem"}
        h={"3.5rem"}
        px={"1rem"}
      >
        <Heading fontSize={"3rem"} color={"light"} margin={"0 auto"}>
          SGPG
        </Heading>
      </Flex>
      <Menu />
    </Flex>
  );
}
