import { Button } from "@chakra-ui/button";
import { useColorMode } from "@chakra-ui/color-mode";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  IconButton,
  useToast
} from "@chakra-ui/react";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import MenuAside from "@components/MenuAside";
import { ModalInstrument } from "@components/ModalInstrument";
import api from "@services/api";
import { SGPGApplicationException } from "@utils/SGPGApplicationException";
import { GetStaticProps } from "next";
import React, { useState } from "react";
import { FaPencilAlt, FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { Instrument, InstrumentDTO } from "src/types/instrument.interface";

interface InstrumentPageProps {
  _instruments: Instrument[];
}

export default function InstrumentsPage({ _instruments }: InstrumentPageProps) {
  const { colorMode } = useColorMode();
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const {
    isOpen: isOpenConfirmDelete,
    onOpen: onOpenConfirmDelete,
    onClose: onCloseConfirmDelete,
  } = useDisclosure();
  const cancelRef = React.useRef(null);
  const toast = useToast();
  const [instruments, setInstruments] = useState<Instrument[]>(
    _instruments ?? []
  );
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>();
  const [isDeletingInstrument, setIsDeletingInstrument] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const updateInstrumentList = async () => {
    const _instruments = await api.instruments.getAll();
    setInstruments(_instruments);
  };

  const handleDelete = async () => {
    setIsDeletingInstrument(true);
    try {
      if (!selectedInstrument) {
        throw new SGPGApplicationException("Não há instrumento selecionado.");
      }
      const updatedInstrument: Partial<InstrumentDTO> = {
        instrument_model: selectedInstrument.instrument_model,
        instrument_brand: selectedInstrument.instrument_brand,
        instrument_student: selectedInstrument.instrument_student,
        instrument_type: selectedInstrument.instrument_type,
        created_by: selectedInstrument.created_by,
        is_deleted: true,
      };
      await api.instruments.update(
        selectedInstrument.instrument_id,
        updatedInstrument
      );
      toast({
        title: "Eba!",
        description: "Instrumento excluído com sucesso.",
        isClosable: true,
        position: "top-end",
        status: "success",
        duration: 3000,
      });
      await updateInstrumentList();
      onCloseConfirmDelete();
      setIsDeletingInstrument(false);
    } catch (error) {
      setIsDeletingInstrument(false);
      console.log(error);
      toast({
        title: "Opa!",
        description:
          "Não foi possível completar sua requisição. Contate um administrador.",
        isClosable: true,
        position: "top-end",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <Flex direction={"row"}>
        <MenuAside />
        <Flex
          m={"3.125rem"}
          grow={1}
          w={"100%"}
          direction={"column"}
          gridGap={"1.25rem"}
        >
          <Flex align={"center"} justify={"space-between"}>
            <Heading fontSize={"3rem"}>Instrumentos</Heading>
            <Button
              colorScheme={"complementaryApp"}
              leftIcon={<FaPlus />}
              onClick={() => {
                setIsEdit(false);
                setSelectedInstrument(undefined);
                onOpenModal();
              }}
            >
              Novo Instrumento
            </Button>
          </Flex>

          <Box
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
                  <Th>Modelo</Th>
                  <Th>Tipo</Th>
                  <Th>Marca</Th>
                  {/* <Th>Emprestado</Th> */}
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
                    <Td>{instrument.instrument_model}</Td>
                    <Td>
                      {instrument.instrumenttype?.instrumenttype_name ?? "-"}
                    </Td>
                    <Td>
                      {instrument.instrumentbrand?.instrumentbrand_name ?? "-"}
                    </Td>
                    {/* <Td>{instrument.instrument_student ?? "-"}</Td> */}
                    <Td p={0}>
                      <Flex gridGap={"0.5rem"}>
                        <IconButton
                          aria-label="Alterar instrumento"
                          icon={<FaPencilAlt />}
                          size={"sm"}
                          colorScheme={"primaryApp"}
                          variant={"ghost"}
                          onClick={() => {
                            setIsEdit(true);
                            setSelectedInstrument(instrument);
                            onOpenModal();
                          }}
                        />
                        <IconButton
                          aria-label="Excluir instrumento"
                          icon={<FaRegTrashAlt />}
                          size={"sm"}
                          colorScheme={"danger"}
                          variant={"ghost"}
                          onClick={() => {
                            onOpenConfirmDelete();
                            setSelectedInstrument(instrument);
                          }}
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Flex>
      </Flex>
      <ModalInstrument
        isOpen={isOpenModal}
        onClose={async (update: boolean = false) => {
          onCloseModal();
          if (update) {
            await updateInstrumentList();
          }
        }}
        isEdit={isEdit}
        data={selectedInstrument}
      />
      {selectedInstrument && (
        <>
          <AlertDialog
            isOpen={isOpenConfirmDelete}
            leastDestructiveRef={cancelRef}
            onClose={onCloseConfirmDelete}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Excluir funcionário
                </AlertDialogHeader>

                <AlertDialogBody>
                  Você realmente deseja excluir o instrumento{" "}
                  <Text as={"span"} fontWeight={"semibold"}>
                    {selectedInstrument.instrument_model}
                  </Text>{" "}
                  de ID{" "}
                  <Text as={"span"} fontWeight={"semibold"}>
                    {selectedInstrument.instrument_id}
                  </Text>
                  ?
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onCloseConfirmDelete}>
                    Cancelar
                  </Button>
                  <Button colorScheme="red" onClick={handleDelete} ml={3}>
                    Excluir
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const instruments = await api.instruments.getAll();

  return {
    props: {
      _instruments: instruments,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
