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
import { ModalRole } from "@components/ModalRole";
import api from "@services/api";
import { SGPGApplicationException } from "@utils/SGPGApplicationException";
import { GetStaticProps } from "next";
import React, { useState } from "react";
import { FaPencilAlt, FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { Role, RoleDTO } from "src/types/role.interface";

interface RolesPageProps {
  _roles: Role[];
}

export default function RolesPage({ _roles }: RolesPageProps) {
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
  const [roles, setRoles] = useState<Role[]>(_roles ?? []);
  const [selectedRole, setSelectedRole] = useState<Role>();
  const [isDeletingEmployee, setIsDeletingEmployee] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const updateRoleList = async () => {
    const _roles = await api.roles.getAll();
    setRoles(_roles);
  };

  const handleDelete = async () => {
    setIsDeletingEmployee(true);
    try {
      if (!selectedRole) {
        throw new SGPGApplicationException("Não há funcionário selecionado.");
      }
      const updatedRole: Partial<RoleDTO> = {
        role_desc: selectedRole.role_desc,
        role_title: selectedRole.role_title,
        created_by: selectedRole.created_by,
        is_deleted: true,
      };
      await api.roles.update(selectedRole.role_id, updatedRole);
      toast({
        title: "Eba!",
        description: "Cargo excluído com sucesso.",
        isClosable: true,
        position: "top-end",
        status: "success",
        duration: 3000,
      });
      await updateRoleList();
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
            <Heading fontSize={"3rem"}>Cargos</Heading>
            <Button
              colorScheme={"complementaryApp"}
              leftIcon={<FaPlus />}
              onClick={() => {
                setIsEdit(false);
                setSelectedRole(undefined);
                onOpenModal();
              }}
            >
              Novo Cargo
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
                  <Th>Título</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {roles.map((role) => (
                  <Tr
                    key={role.role_id}
                    _hover={{ backgroundColor: "blackAlpha.200" }}
                  >
                    <Td isNumeric>{role.role_id}</Td>
                    <Td>{role.role_title}</Td>
                    <Td p={0}>
                      <Flex gridGap={"0.5rem"}>
                        <IconButton
                          aria-label="Alterar cargo"
                          icon={<FaPencilAlt />}
                          size={"sm"}
                          colorScheme={"primaryApp"}
                          variant={"ghost"}
                          onClick={() => {
                            setIsEdit(true);
                            setSelectedRole(role);
                            onOpenModal();
                          }}
                        />
                        <IconButton
                          aria-label="Excluir cargo"
                          icon={<FaRegTrashAlt />}
                          size={"sm"}
                          colorScheme={"danger"}
                          variant={"ghost"}
                          onClick={() => {
                            onOpenConfirmDelete();
                            setSelectedRole(role);
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
      <ModalRole
        isOpen={isOpenModal}
        onClose={async (update: boolean = false) => {
          onCloseModal();
          if (update) {
            await updateRoleList();
          }
        }}
        isEdit={isEdit}
        data={selectedRole}
      />
      {selectedRole && (
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
                  Você realmente deseja excluir o cargo{" "}
                  <Text as={"span"} fontWeight={"semibold"}>
                    {selectedRole.role_title}
                  </Text>{" "}
                  de ID{" "}
                  <Text as={"span"} fontWeight={"semibold"}>
                    {selectedRole.role_id}
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
  const roles = await api.roles.getAll();

  return {
    props: {
      _roles: roles,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
