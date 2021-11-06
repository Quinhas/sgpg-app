import { useColorMode } from "@chakra-ui/color-mode";
import {
  Flex,
  Grid,
  Heading,
  LinkBox,
  LinkOverlay,
  Text
} from "@chakra-ui/layout";
import MenuAside from "@components/MenuAside";
import { useAuth } from "@hooks/useAuth";
import api from "@services/api";
import checkPlural from "@utils/checkPlural";
import { GetStaticProps } from "next";
import NextLink from "next/link";
import React from "react";
import CountUp from "react-countup";

interface CardProps {
  value: number;
  title: string;
  href: string;
}

interface HomeProps {
  numberOf: {
    students: number;
    instruments: number;
    employees: number;
    classes: number;
  };
}

const Card = ({ title, value, href }: CardProps) => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      as={LinkBox}
      bgColor={"primaryApp.600"}
      textColor={colorMode === "light" ? "light" : "dark"}
      h={"9.25rem"}
      borderRadius={"lg"}
      grow={1}
      direction={"column"}
      boxShadow={"sm"}
      align={"center"}
      justify={"center"}
      transition={"0.2s ease"}
      _hover={{
        transform: "scale(1.02)",
      }}
    >
      <Heading fontSize={"3rem"} fontWeight={700}>
        <CountUp
          start={0}
          end={value}
          delay={0}
          duration={0.5}
          preserveValue={true}
        />
      </Heading>

      <NextLink href={href} passHref>
        <LinkOverlay>
          <Text fontFamily={"heading"} fontSize={"1.5rem"} fontWeight={400}>
            {title}
          </Text>
        </LinkOverlay>
      </NextLink>
    </Flex>
  );
};

export default function Home({ numberOf }: HomeProps) {
  const { colorMode } = useColorMode();
  const auth = useAuth();

  return (
    <Flex direction={"row"}>
      <MenuAside />
      <Flex p={"3.125rem"} grow={1} w={"100%"} direction={"column"}>
        <Heading fontSize={"3rem"}>
          Olá,{" "}
          {auth.employee?.employee_name
            ? auth.employee?.employee_name.split(" ")[0]
            : "Usuário"}
          !
        </Heading>
        <Grid
          mt={"1.5rem"}
          gridGap={"3.125rem"}
          templateColumns={["repeat(1, 1fr)", "repeat(4, 1fr)"]}
        >
          <Card
            value={numberOf.students ?? 0}
            title={`Estudante${checkPlural(numberOf.students)}`}
            href={"students"}
          />
          <Card
            value={numberOf.instruments ?? 0}
            title={`Instrumento${checkPlural(numberOf.instruments)}`}
            href={"instruments"}
          />
          <Card
            value={numberOf.employees ?? 0}
            title={`Funcionário${checkPlural(numberOf.employees)}`}
            href={"employees"}
          />
          <Card
            value={numberOf.classes ?? 0}
            title={`Curso${checkPlural(numberOf.classes)}`}
            href={"classes"}
          />
        </Grid>
      </Flex>
    </Flex>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const students = await api.students.getAll();
  const instruments = await api.instruments.getAll();
  const employees = await api.employees.getAll();
  const classes = await api.classes.getAll();

  return {
    props: {
      numberOf: {
        students: students.length,
        instruments: instruments.length,
        employees: employees.length,
        classes: classes.length,
      },
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
