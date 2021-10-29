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
import { ModalEditEmployee } from "@components/ModalEditEmployee";
import { ModalNewEmployee } from "@components/ModalNewEmployee";
import api from "@services/api";
import { SGPGApplicationException } from "@utils/SGPGApplicationException";
import { GetStaticProps } from "next";
import React, { useState } from "react";
import { FaPencilAlt, FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { EmployeeDTO, EmployeeResponse } from "src/types/employee.interface";

interface EmployeePageProps {
  _employees: EmployeeResponse[];
}

export default function EmployeesPage({ _employees }: EmployeePageProps) {
  const { colorMode } = useColorMode();
  const {
    isOpen: isOpenNew,
    onOpen: onOpenNew,
    onClose: onCloseNew,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenConfirmDelete,
    onOpen: onOpenConfirmDelete,
    onClose: onCloseConfirmDelete,
  } = useDisclosure();
  const cancelRef = React.useRef(null);
  const toast = useToast();
  const [employees, setEmployees] = useState<EmployeeResponse[]>(
    _employees ?? []
  );
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponse>();
  const [isDeletingEmployee, setIsDeletingEmployee] = useState(false);

  const updateEmployeeList = async () => {
    const _employees = await api.getAllEmployees();
    setEmployees(_employees);
  };

  const handleDelete = async () => {
    setIsDeletingEmployee(true);
    try {
      if (!selectedEmployee) {
        throw new SGPGApplicationException("Não há funcionário selecionado.");
      }
      const updatedEmployee: Partial<EmployeeDTO> = {
        employee_name: selectedEmployee.employee_name,
        employee_cpf: selectedEmployee.employee_cpf,
        employee_email: selectedEmployee.employee_email,
        employee_phone: selectedEmployee.employee_phone,
        employee_addr: selectedEmployee.employee_addr,
        employee_role: selectedEmployee.employee_role,
        employee_salary: selectedEmployee.employee_salary,
        created_by: selectedEmployee.created_by,
        is_deleted: true,
      };
      console.log(updatedEmployee);
      const _employee = await api.updateEmployee(
        selectedEmployee.employee_id,
        updatedEmployee
      );
      console.log(_employee);
      toast({
        title: "Eba!",
        description: "Funcionário excluído com sucesso.",
        isClosable: true,
        position: "top-end",
        status: "success",
        duration: 3000,
      });
      await updateEmployeeList();
      onCloseConfirmDelete();
      setIsDeletingEmployee(false);
    } catch (error) {
      setIsDeletingEmployee(false);
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
            <Heading fontSize={"3rem"}>Funcionários 💼</Heading>
            <Button
              colorScheme={"complementaryApp"}
              leftIcon={<FaPlus />}
              onClick={onOpenNew}
            >
              Novo Funcionário
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
                  <Th>CPF</Th>
                  <Th>E-mail</Th>
                  <Th>Telefone</Th>
                  <Th>Função</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {employees.map((employee) => (
                  <Tr
                    key={employee.employee_id}
                    _hover={{ backgroundColor: "blackAlpha.200" }}
                  >
                    <Td isNumeric>{employee.employee_id}</Td>
                    <Td>{employee.employee_name}</Td>
                    <Td>{employee.employee_cpf}</Td>
                    <Td>{employee.employee_email}</Td>
                    <Td>{employee.employee_phone}</Td>
                    <Td>{employee.employee_role}</Td>
                    <Td p={0}>
                      <Flex gridGap={"0.5rem"}>
                        <IconButton
                          aria-label="Alterar funcionário"
                          icon={<FaPencilAlt />}
                          size={"sm"}
                          colorScheme={"primaryApp"}
                          variant={"ghost"}
                          onClick={() => {
                            onOpenEdit();
                            setSelectedEmployee(employee);
                          }}
                        />
                        <IconButton
                          aria-label="Excluir funcionário"
                          icon={<FaRegTrashAlt />}
                          size={"sm"}
                          colorScheme={"danger"}
                          variant={"ghost"}
                          onClick={() => {
                            onOpenConfirmDelete();
                            setSelectedEmployee(employee);
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
      <ModalNewEmployee
        isOpen={isOpenNew}
        onClose={async () => {
          await updateEmployeeList();
          onCloseNew();
        }}
      />
      {selectedEmployee && (
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
                  Você realmente deseja excluir o funcionário{" "}
                  <Text as={"span"} fontWeight={"semibold"}>
                    {selectedEmployee.employee_name}
                  </Text>{" "}
                  de ID{" "}
                  <Text as={"span"} fontWeight={"semibold"}>
                    {selectedEmployee.employee_id}
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
          <ModalEditEmployee
            isOpen={isOpenEdit}
            onClose={async () => {
              await updateEmployeeList();
              onCloseEdit();
            }}
            employee={selectedEmployee}
          />
        </>
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const employees = await api.getAllEmployees();

  return {
    props: {
      _employees: employees,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
