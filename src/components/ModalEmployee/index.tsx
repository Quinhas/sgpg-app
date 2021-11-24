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
import { Select } from "@chakra-ui/select";
import { useToast } from "@chakra-ui/toast";
import { useAuth } from "@hooks/useAuth";
import api from "@services/api";
import formatCPF from "@utils/formatCPF";
import formatPhone from "@utils/formatPhone";
import { SGPGApplicationException } from "@utils/SGPGApplicationException";
import { cpf } from "cpf-cnpj-validator";
import { Field, FieldProps, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import { EmployeeDTO, EmployeeResponse } from "src/types/employee.interface";
import { Role } from "src/types/role.interface";
import * as yup from "yup";

interface ModalEmployeeProps {
  isOpen: boolean;
  onClose: (update?: boolean) => void;
  isEdit?: boolean;
  data?: EmployeeResponse;
}

type FormFields = {
  [key: string]: any;
  name: string;
  cpf: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone: string;
  addr: string;
  salary: number;
  role: number;
};

export function ModalEmployee({
  isOpen,
  onClose,
  isEdit,
  data,
}: ModalEmployeeProps) {
  const toast = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const auth = useAuth();

  const requiredMessage = "Campo obrigatório.";
  const validationSchema = yup.object().shape({
    name: yup.string().required(requiredMessage).trim(),
    cpf: yup
      .string()
      .required(requiredMessage)
      .trim()
      .test("validCPF", `CPF inválido.`, (value, context) => {
        if (value) {
          return cpf.isValid(value);
        } else {
          return false;
        }
      }),
    email: yup.string().email("E-mail inválido.").required(requiredMessage),
    password: yup.string(),
    confirmPassword: yup
      .string()
      .when("password", {
        is: (password: string) => password?.length > 0,
        then: yup.string().required(requiredMessage),
      })
      .oneOf([yup.ref("password"), null], "As senhas não correspondem."),
    phone: yup.string().required(requiredMessage),
    role: yup.number().required(requiredMessage),
    salary: yup.number().required(requiredMessage),
  });

  const initialValues: FormFields = {
    name: data?.employee_name ?? "",
    cpf: data?.employee_cpf ? formatCPF(data.employee_cpf) : "",
    addr: data?.employee_addr ?? "",
    email: data?.employee_email ?? "",
    phone: data?.employee_phone ? formatPhone(data.employee_phone) : "",
    role: data?.employee_role ?? -1,
    salary: data?.employee_salary ?? 0,
    password: "",
    confirmPassword: "",
  };

  const updateRoles = async () => {
    const _roles = await api.roles.getAll();
    setRoles(_roles);
  };

  useEffect(() => {
    updateRoles();
  }, []);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={"xl"}
        isCentered
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? "Editar" : "Novo"} Funcionário</ModalHeader>
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
                        "Dados do funcionário não informados."
                      );
                    }

                    const _employee: EmployeeDTO = {
                      employee_name: values.name,
                      employee_email: values.email,
                      employee_addr: values.addr,
                      employee_cpf: values.cpf.replace(/\D/g, ""),
                      employee_password:
                        values.password && values.password.trim() !== ""
                          ? values.password
                          : values.cpf.substr(0, 4),
                      employee_phone: values.phone.replace(/\D/g, "").trim(),
                      employee_role: Number(values.role),
                      employee_salary: values.salary,
                      created_by: data.created_by,
                      is_deleted: false,
                    };
                    await api.employees.update(data.employee_id, _employee);
                    onClose(true);
                    toast({
                      title: "Eba!",
                      description: "Funcionário atualizado com sucesso.",
                      isClosable: true,
                      position: "top-end",
                      status: "success",
                      duration: 3000,
                    });
                    return;
                  }
                  const cpf = values.cpf.replace(/\D/g, "");
                  const _employee: EmployeeDTO = {
                    employee_name: values.name,
                    employee_email: values.email,
                    employee_addr: values.addr,
                    employee_cpf: cpf,
                    employee_password:
                      values.password && values.password.trim() !== ""
                        ? values.password
                        : cpf.substr(0, 4),
                    employee_phone: values.phone.replace(/\D/g, "").trim(),
                    employee_role: Number(values.role),
                    employee_salary: values.salary,
                    created_by: auth.employee.employee_id,
                    is_deleted: false,
                  };
                  await api.employees.create(_employee);
                  toast({
                    title: "Eba!",
                    description: "Funcionário criado com sucesso.",
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
                  <FormControl
                    isInvalid={errors.name && touched.name ? true : false}
                    isRequired
                  >
                    <FormLabel>Nome</FormLabel>
                    <Field name="name">
                      {({ field }: FieldProps) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="e.g. John Doe"
                          p={"0 1rem"}
                          border={"1px solid"}
                          w={"100%"}
                        />
                      )}
                    </Field>
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={errors.cpf && touched.cpf ? true : false}
                    isRequired
                    isDisabled={isEdit}
                  >
                    <FormLabel>CPF</FormLabel>
                    <Field name="cpf">
                      {({ field }: FieldProps) => (
                        <Input
                          {...field}
                          as={ReactInputMask}
                          mask={"999.999.999-99"}
                          type="text"
                          placeholder="e.g. 999.999.999-99"
                          p={"0 1rem"}
                          border={"1px solid"}
                          w={"100%"}
                          inputMode={"numeric"}
                        />
                      )}
                    </Field>
                    <FormErrorMessage>{errors.cpf}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={errors.email && touched.email ? true : false}
                    isRequired
                  >
                    <FormLabel>E-mail</FormLabel>
                    <Field name="email">
                      {({ field }: FieldProps) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="e.g. john@doe.com"
                          p={"0 1rem"}
                          border={"1px solid"}
                          w={"100%"}
                        />
                      )}
                    </Field>
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <Flex gridGap={"0.5rem"}>
                    <FormControl
                      isInvalid={errors.role && touched.role ? true : false}
                      isDisabled={auth.employee?.employee_role != 4}
                    >
                      <FormLabel>Cargo</FormLabel>
                      <Field name="role">
                        {({ field }: FieldProps) => (
                          <Select {...field}>
                            <option value={-1} disabled hidden>
                              Selecione
                            </option>
                            {roles.map((role) => {
                              return (
                                <option key={role.role_id} value={role.role_id}>
                                  {role.role_title}
                                </option>
                              );
                            })}
                          </Select>
                        )}
                      </Field>
                      <FormErrorMessage>{errors.role}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isInvalid={errors.salary && touched.salary ? true : false}
                      isDisabled={auth.employee?.employee_role != 4}
                    >
                      <FormLabel>Salário</FormLabel>
                      <Field name="salary">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            type="number"
                            p={"0 1rem"}
                            border={"1px solid"}
                            w={"100%"}
                          />
                        )}
                      </Field>
                      <FormErrorMessage>{errors.salary}</FormErrorMessage>
                    </FormControl>
                  </Flex>

                  <Flex gridGap={"0.5rem"}>
                    <FormControl
                      isInvalid={
                        errors.password && touched.password ? true : false
                      }
                    >
                      <FormLabel>Senha</FormLabel>
                      <Field name="password">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            type="password"
                            p={"0 1rem"}
                            border={"1px solid"}
                            w={"100%"}
                          />
                        )}
                      </Field>
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isInvalid={
                        errors.confirmPassword && touched.confirmPassword
                          ? true
                          : false
                      }
                    >
                      <FormLabel>Confirmar Senha</FormLabel>
                      <Field name="confirmPassword">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            type="password"
                            p={"0 1rem"}
                            border={"1px solid"}
                            w={"100%"}
                          />
                        )}
                      </Field>
                      <FormErrorMessage>
                        {errors.confirmPassword}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>

                  <Flex gridGap={"0.5rem"} align={"center"}>
                    <FormControl
                      isInvalid={errors.phone && touched.phone ? true : false}
                      isRequired
                    >
                      <FormLabel>Telefone</FormLabel>
                      <Field name="phone">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            as={ReactInputMask}
                            type="text"
                            p={"0 1rem"}
                            border={"1px solid"}
                            w={"100%"}
                            mask={"(99) 9 9999-9999"}
                          />
                        )}
                      </Field>
                      <FormErrorMessage>{errors.phone}</FormErrorMessage>
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
