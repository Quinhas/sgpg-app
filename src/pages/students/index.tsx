import { useColorMode } from "@chakra-ui/color-mode";
import {
  Flex, Heading
} from "@chakra-ui/layout";
import MenuAside from "@components/MenuAside";
import { GetStaticProps } from "next";
import React from "react";

interface StudentsPageProps {}

export default function StudentsPage() {
  const { colorMode } = useColorMode();

  return (
    <Flex direction={"row"}>
      <MenuAside />
      <Flex p={"3.125rem"} grow={1} w={"100%"} direction={"column"}>
        <Heading fontSize={"3rem"}>Estudantes 🎓</Heading>
      </Flex>
    </Flex>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
