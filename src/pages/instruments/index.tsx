import { Button, IconButton } from "@chakra-ui/button";
import { useColorMode } from "@chakra-ui/color-mode";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import MenuAside from "@components/MenuAside";
import { api } from "@services/api";
import { GetStaticProps } from "next";
import React from "react";
import { FaPencilAlt, FaPlus, FaRegTrashAlt } from "react-icons/fa";

type Instrument = {
  instrument_id: number;
  instrument_type: number;
  instrument_model: string;
  instrument_brand: number;
  instrument_student?: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  is_deleted?: boolean;
};

interface InstrumentsPageProps {
  instruments: Instrument[];
}

export default function InstrumentsPage({ instruments }: InstrumentsPageProps) {
  const { colorMode } = useColorMode();

  return (
    <Flex direction={"row"}>
      <MenuAside />
      <Flex
        m={"3.125rem"}
        grow={1}
        w={"100%"}
        direction={"column"}
        gridGap={"1.25rem"}
      >
        <Heading fontSize={"3rem"}>🎹 Instrumentos</Heading>
        <Box
          h={"calc(100% - 3rem - 1.25rem)"}
          borderRadius={"lg"}
          boxShadow={"sm"}
          minH={"18.75rem"}
          border={"1px solid"}
          borderColor={
            colorMode === "light" ? "blackAlpha.500" : "whiteAlpha.500"
          }
        >
          <Table colorScheme={"blackAlpha"} variant={"striped"}>
            <Thead>
              <Tr>
                <Th isNumeric>ID</Th>
                <Th>Tipo</Th>
                <Th>Modelo</Th>
                <Th>Marca</Th>
                <Th>Emprestado</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {instruments.map((instrument) => (
                <Tr
                  key={instrument.instrument_id}
                  _hover={{ backgroundColor: "blackAlpha.200" }}
                >
                  <Td isNumeric>{instrument.instrument_id}</Td>
                  <Td>{instrument.instrument_type}</Td>
                  <Td>{instrument.instrument_model}</Td>
                  <Td>{instrument.instrument_brand}</Td>
                  <Td>{instrument.instrument_student ?? "-"}</Td>
                  <Td p={0}>
                    <Flex gridGap={"0.5rem"}>
                      <IconButton
                        aria-label="Alterar instrumento"
                        icon={<FaPencilAlt />}
                        size={"sm"}
                        colorScheme={"primaryApp"}
                        variant={"ghost"}
                      />
                      <IconButton
                        aria-label="Excluir instrumento"
                        icon={<FaRegTrashAlt />}
                        size={"sm"}
                        colorScheme={"danger"}
                        variant={"ghost"}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Flex>
          <Button colorScheme={"complementaryApp"} leftIcon={<FaPlus />}>
            Novo Instrumento
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const res = (
    await api.get<{ message: string; data: Instrument[] }>("/instruments")
  ).data;

  const instruments = res.data.map<Instrument>((instrument) => {
    return {
      ...instrument,
    };
  });

  return {
    props: {
      instruments: instruments,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
