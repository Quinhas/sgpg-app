import { Button } from "@chakra-ui/button";
import {
  FormControl,
  FormErrorMessage,
  FormLabel
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Flex, Stack } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/modal";
import { Radio, RadioGroup } from "@chakra-ui/radio";
import { useToast } from "@chakra-ui/toast";
import api from "@services/api";
import { cpf } from "cpf-cnpj-validator";
import { Field, FieldProps, Form, Formik } from "formik";
import React from "react";
import ReactInputMask from "react-input-mask";
import { EmployeeDTO } from "src/types/employee.interface";
import * as yup from "yup";

interface ModalNewEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
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
  isDeleted: string;
};

export function ModalNewEmployee({ isOpen, onClose }: ModalNewEmployeeProps) {
  const toast = useToast();

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
    isDeleted: yup.string().required(requiredMessage),
    phone: yup.string().required(requiredMessage),
  });

  const initialValues: FormFields = {
    name: "",
    cpf: "",
    addr: "",
    email: "",
    isDeleted: "no",
    phone: "",
    role: -1,
    salary: 0,
    password: "",
    confirmPassword: "",
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Novo Funcionário</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={initialValues}
              onSubmit={async (values) => {
                console.log(values);
                try {
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
                    employee_role: 2,
                    employee_salary: values.salary,
                    created_by: 1,
                    is_deleted: values.isDeleted === "yes" ? true : false,
                  };
                  const employee = await api.createEmployee(_employee);
                  toast({
                    title: "Eba!",
                    description: "Funcionário criado com sucesso.",
                    isClosable: true,
                    position: "top-end",
                    status: "success",
                    duration: 3000,
                  });
                  onClose();
                } catch (error) {
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

                    <Flex
                      as={FormControl}
                      isInvalid={
                        errors.isDeleted && touched.isDeleted ? true : false
                      }
                      isRequired
                      align={"center"}
                      direction={"column"}
                    >
                      <FormLabel>Usuário Ativo</FormLabel>

                      <Field name="isDeleted">
                        {({ field }: FieldProps) => (
                          <RadioGroup {...field}>
                            <Stack spacing={"1rem"} direction="row">
                              <Radio
                                colorScheme="danger"
                                {...field}
                                value={"yes"}
                              >
                                Não
                              </Radio>
                              <Radio
                                colorScheme="success"
                                {...field}
                                value={"no"}
                              >
                                Sim
                              </Radio>
                            </Stack>
                          </RadioGroup>
                        )}
                      </Field>
                      <FormErrorMessage>{errors.isDeleted}</FormErrorMessage>
                    </Flex>
                  </Flex>

                  <Flex
                    as={ModalFooter}
                    px={"0"}
                    justify={"flex-end"}
                    py={"1rem"}
                    gridGap={"1rem"}
                  >
                    <Button variant="ghost" onClick={onClose}>
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
