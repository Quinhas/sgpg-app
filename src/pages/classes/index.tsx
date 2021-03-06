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
import { ModalClass } from "@components/ModalClass";
import { ModalClassStudents } from "@components/ModalClassStudents";
import { useAuth } from "@hooks/useAuth";
import api from "@services/api";
import { SGPGApplicationException } from "@utils/SGPGApplicationException";
import { GetStaticProps } from "next";
import React, { useState } from "react";
import {
  FaPencilAlt,
  FaPlus,
  FaRegTrashAlt,
  FaUserGraduate
} from "react-icons/fa";
import { Class, ClassDTO } from "src/types/class.interface";

interface ClassesPageProps {
  _classes: Class[];
}

export default function ClassesPage({ _classes }: ClassesPageProps) {
  const { colorMode } = useColorMode();
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const {
    isOpen: isOpenModalStudents,
    onOpen: onOpenModalStudents,
    onClose: onCloseModalStudents,
  } = useDisclosure();
  const {
    isOpen: isOpenConfirmDelete,
    onOpen: onOpenConfirmDelete,
    onClose: onCloseConfirmDelete,
  } = useDisclosure();
  const cancelRef = React.useRef(null);
  const toast = useToast();
  const [classes, setClasses] = useState<Class[]>(_classes ?? []);
  const [selectedClass, setSelectedClass] = useState<Class>();
  const [isDeletingClass, setIsDeletingClass] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { employee } = useAuth();
  const canCreate = employee?.employee_role
    ? [4, 3].includes(employee.employee_role)
    : false;
  const canUpdate = employee?.employee_role
    ? [4, 3].includes(employee.employee_role)
    : false;
  const canDelete = employee?.employee_role
    ? [4].includes(employee.employee_role)
    : false;

  const updateClassList = async () => {
    const _classes = await api.classes.getAll();
    setClasses(_classes);
  };

  const handleDelete = async () => {
    setIsDeletingClass(true);
    try {
      if (!selectedClass) {
        throw new SGPGApplicationException("N??o h?? turma selecionada.");
      }
      const updatedClass: Partial<ClassDTO> = {
        class_name: selectedClass.class_name,
        class_desc: selectedClass.class_desc,
        class_days: selectedClass.class_days,
        class_duration: selectedClass.class_duration,
        class_teacher: selectedClass.class_teacher,
        created_by: selectedClass.created_by,
        is_deleted: true,
      };
      await api.classes.update(selectedClass.class_id, updatedClass);
      toast({
        title: "Eba!",
        description: "Turma exclu??da com sucesso.",
        isClosable: true,
        position: "top-end",
        status: "success",
        duration: 3000,
      });
      await updateClassList();
      onCloseConfirmDelete();
      setIsDeletingClass(false);
    } catch (error) {
      setIsDeletingClass(false);
      console.log(error);
      toast({
        title: "Opa!",
        description:
          "N??o foi poss??vel completar sua requisi????o. Contate um administrador.",
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
            <Heading fontSize={"3rem"}>Turmas</Heading>
            <Button
              colorScheme={"complementaryApp"}
              leftIcon={<FaPlus />}
              onClick={() => {
                setIsEdit(false);
                setSelectedClass(undefined);
                onOpenModal();
              }}
              disabled={!canCreate}
            >
              Nova turma
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
                  <Th>Turma</Th>
                  <Th>Dura????o</Th>
                  <Th>Professor</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {classes.map((sgpgClass) => (
                  <Tr
                    key={sgpgClass.class_id}
                    _hover={{ backgroundColor: "blackAlpha.200" }}
                  >
                    <Td isNumeric>{sgpgClass.class_id}</Td>
                    <Td>{sgpgClass.class_name}</Td>
                    <Td>
                      {sgpgClass.class_duration
                        ? `${sgpgClass.class_duration}min`
                        : "-"}
                    </Td>
                    <Td>{sgpgClass.employees?.employee_name ?? "-"}</Td>
                    <Td p={0}>
                      <Flex gridGap={"0.5rem"}>
                        <IconButton
                          aria-label="Alterar alunos da turma"
                          icon={<FaUserGraduate />}
                          size={"sm"}
                          colorScheme={"primaryApp"}
                          variant={"ghost"}
                          onClick={() => {
                            setIsEdit(true);
                            setSelectedClass(sgpgClass);
                            onOpenModalStudents();
                          }}
                          disabled={
                            sgpgClass.class_teacher != employee?.employee_id
                              ? !canUpdate
                              : false
                          }
                        />
                        <IconButton
                          aria-label="Alterar turma"
                          icon={<FaPencilAlt />}
                          size={"sm"}
                          colorScheme={"primaryApp"}
                          variant={"ghost"}
                          onClick={() => {
                            setIsEdit(true);
                            setSelectedClass(sgpgClass);
                            onOpenModal();
                          }}
                          disabled={!canUpdate}
                        />
                        <IconButton
                          aria-label="Excluir turma"
                          icon={<FaRegTrashAlt />}
                          size={"sm"}
                          colorScheme={"danger"}
                          variant={"ghost"}
                          onClick={() => {
                            onOpenConfirmDelete();
                            setSelectedClass(sgpgClass);
                          }}
                          disabled={!canDelete}
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
      <ModalClass
        isOpen={isOpenModal}
        onClose={async (update: boolean = false) => {
          onCloseModal();
          if (update) {
            await updateClassList();
          }
        }}
        isEdit={isEdit}
        data={selectedClass}
      />
      <ModalClassStudents
        isOpen={isOpenModalStudents}
        onClose={async (update: boolean = false) => {
          onCloseModalStudents();
          if (update) {
            await updateClassList();
          }
        }}
        data={selectedClass}
      />
      {selectedClass && (
        <>
          <AlertDialog
            isOpen={isOpenConfirmDelete}
            leastDestructiveRef={cancelRef}
            onClose={onCloseConfirmDelete}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Excluir turma
                </AlertDialogHeader>

                <AlertDialogBody>
                  Voc?? realmente deseja excluir a turma{" "}
                  <Text as={"span"} fontWeight={"semibold"}>
                    {selectedClass.class_name}
                  </Text>{" "}
                  de ID{" "}
                  <Text as={"span"} fontWeight={"semibold"}>
                    {selectedClass.class_id}
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
  const classes = await api.classes.getAll();

  return {
    props: {
      _classes: classes,
    },
    revalidate: 10
  };
};
