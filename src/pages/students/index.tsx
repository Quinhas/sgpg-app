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
import { ModalStudent } from "@components/ModalStudent";
import { useAuth } from "@hooks/useAuth";
import api from "@services/api";
import formatCPF from "@utils/formatCPF";
import formatPhone from "@utils/formatPhone";
import { SGPGApplicationException } from "@utils/SGPGApplicationException";
import { GetStaticProps } from "next";
import React, { useState } from "react";
import { FaPencilAlt, FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { Student, StudentDTO } from "src/types/student.interface";

interface StudentsPageProps {
  _students: Student[];
}

export default function StudentsPage({ _students }: StudentsPageProps) {
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
  const [students, setStudents] = useState<Student[]>(_students ?? []);
  const [selectedStudent, setSelectedStudent] = useState<Student>();
  const [isDeletingInstrument, setIsDeletingInstrument] = useState(false);
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

  const updateStudentsList = async () => {
    const _students = await api.students.getAll();
    setStudents(_students);
  };

  const handleDelete = async () => {
    setIsDeletingInstrument(true);
    try {
      if (!selectedStudent) {
        throw new SGPGApplicationException("Não há estudante selecionado.");
      }
      const updatedStudent: Partial<StudentDTO> = {
        student_addr: selectedStudent.student_addr,
        student_cpf: selectedStudent.student_cpf,
        student_email: selectedStudent.student_email,
        student_name: selectedStudent.student_name,
        student_phone: selectedStudent.student_phone,
        student_responsible: selectedStudent.student_responsible,
        student_rg: selectedStudent.student_rg,
        student_scholarship: selectedStudent.student_scholarship,
        created_by: selectedStudent.created_by,
        is_deleted: true,
      };
      await api.students.update(selectedStudent.student_id, updatedStudent);
      toast({
        title: "Eba!",
        description: "Aluno excluído com sucesso.",
        isClosable: true,
        position: "top-end",
        status: "success",
        duration: 3000,
      });
      await updateStudentsList();
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
            <Heading fontSize={"3rem"}>Alunos</Heading>
            <Button
              colorScheme={"complementaryApp"}
              leftIcon={<FaPlus />}
              onClick={() => {
                setIsEdit(false);
                setSelectedStudent(undefined);
                onOpenModal();
              }}
              disabled={!canCreate}
            >
              Novo Aluno
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
                  <Th>Nome</Th>
                  {/* <Th>Responsável</Th> */}
                  <Th>Telefone</Th>
                  <Th>CPF</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {students.map((student) => (
                  <Tr
                    key={student.student_id}
                    _hover={{ backgroundColor: "blackAlpha.200" }}
                  >
                    <Td isNumeric>{student.student_id}</Td>
                    <Td>{student.student_name}</Td>
                    {/* <Td>{student.student_responsible ?? "-"}</Td> */}
                    <Td>
                      {student.student_phone
                        ? formatPhone(student.student_phone)
                        : "-"}
                    </Td>
                    <Td>{canUpdate ? formatCPF(student.student_cpf) : '-'}</Td>
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
                            setSelectedStudent(student);
                            onOpenModal();
                          }}
                          disabled={!canUpdate}
                        />
                        <IconButton
                          aria-label="Excluir instrumento"
                          icon={<FaRegTrashAlt />}
                          size={"sm"}
                          colorScheme={"danger"}
                          variant={"ghost"}
                          onClick={() => {
                            onOpenConfirmDelete();
                            setSelectedStudent(student);
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
      <ModalStudent
        isOpen={isOpenModal}
        onClose={async (update: boolean = false) => {
          onCloseModal();
          if (update) {
            await updateStudentsList();
          }
        }}
        isEdit={isEdit}
        data={selectedStudent}
      />
      {selectedStudent && (
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
                  Você realmente deseja excluir o aluno{" "}
                  <Text as={"span"} fontWeight={"semibold"}>
                    {selectedStudent.student_name}
                  </Text>{" "}
                  de ID{" "}
                  <Text as={"span"} fontWeight={"semibold"}>
                    {selectedStudent.student_id}
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
  const students = await api.students.getAll();

  return {
    props: {
      _students: students,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
