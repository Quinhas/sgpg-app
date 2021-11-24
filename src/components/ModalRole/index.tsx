import { Button } from "@chakra-ui/button";
import {
  FormControl,
  FormErrorMessage,
  FormLabel
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Flex } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/modal";
import { useToast } from "@chakra-ui/toast";
import { useAuth } from "@hooks/useAuth";
import api from "@services/api";
import { SGPGApplicationException } from "@utils/SGPGApplicationException";
import { Field, FieldProps, Form, Formik } from "formik";
import React from "react";
import { Role, RoleDTO } from "src/types/role.interface";
import * as yup from "yup";

interface ModalRoleProps {
  isOpen: boolean;
  onClose: (update?: boolean) => void;
  isEdit?: boolean;
  data?: Role;
}

type FormFields = {
  title: string;
  desc: string;
};

export function ModalRole({ isOpen, onClose, isEdit, data }: ModalRoleProps) {
  const toast = useToast();
  const auth = useAuth();

  const requiredMessage = "Campo obrigatório.";
  const validationSchema = yup.object().shape({
    title: yup.string().required(requiredMessage).trim(),
  });

  const initialValues: FormFields = {
    title: data?.role_title ?? "",
    desc: data?.role_desc ?? "",
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? "Editar" : "Novo"} Cargo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={initialValues}
              onSubmit={async (values) => {
                try {
                  if (!auth.employee) {
                    throw new SGPGApplicationException(
                      "Usuário não possui permissão."
                    );
                  }
                  if (isEdit) {
                    if (!data) {
                      throw new SGPGApplicationException(
                        "Dados do cargo não informados."
                      );
                    }
                    const _role: RoleDTO = {
                      role_title: values.title,
                      role_desc: values.desc,
                      created_by: data.created_by,
                      is_deleted: false,
                    };
                    await api.roles.update(data.role_id, _role);
                    onClose(true);
                    toast({
                      title: "Eba!",
                      description: "Cargo atualizado com sucesso.",
                      isClosable: true,
                      position: "top-end",
                      status: "success",
                      duration: 3000,
                    });
                    return;
                  }
                  const _role: RoleDTO = {
                    role_title: values.title,
                    role_desc: values.desc,
                    created_by: auth.employee.employee_id,
                    is_deleted: false,
                  };
                  await api.roles.create(_role);
                  toast({
                    title: "Eba!",
                    description: "Cargo criado com sucesso.",
                    isClosable: true,
                    position: "top-end",
                    status: "success",
                    duration: 3000,
                  });
                  onClose(true);
                } catch (error) {
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
              }}
              validationSchema={validationSchema}
            >
              {({
                touched,
                errors,
                dirty,
                isValid,
                handleBlur,
                handleChange,
                values,
                isSubmitting,
              }) => (
                <Flex as={Form} gridGap={"0.5rem"} direction={"column"}>
                  <Flex gridGap={"0.5rem"} align={"center"}>
                    <FormControl
                      isInvalid={errors.title && touched.title ? true : false}
                      isRequired
                    >
                      <FormLabel>Título</FormLabel>
                      <Field name="title">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            type="text"
                            placeholder="e.g. Professor"
                            p={"0 1rem"}
                            border={"1px solid"}
                            w={"100%"}
                          />
                        )}
                      </Field>
                      <FormErrorMessage>{errors.title}</FormErrorMessage>
                    </FormControl>
                  </Flex>

                  <Flex
                    as={ModalFooter}
                    px={"0"}
                    justify={"flex-end"}
                    py={"1rem"}
                    gridGap={"1rem"}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => {
                        onClose();
                      }}
                    >
                      Voltar
                    </Button>
                    <Button
                      type="submit"
                      colorScheme={"success"}
                      isDisabled={!dirty || !isValid}
                      isLoading={isSubmitting}
                    >
                      Salvar
                    </Button>
                  </Flex>
                </Flex>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
