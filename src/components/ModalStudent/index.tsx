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
import isEmpty from "@utils/checkIsEmpty";
import formatCPF from "@utils/formatCPF";
import formatPhone from "@utils/formatPhone";
import { SGPGApplicationException } from "@utils/SGPGApplicationException";
import { cpf } from "cpf-cnpj-validator";
import { Field, FieldProps, Form, Formik } from "formik";
import React from "react";
import ReactInputMask from "react-input-mask";
import { Student, StudentDTO } from "src/types/student.interface";
import * as yup from "yup";

interface ModalStudentProps {
  isOpen: boolean;
  onClose: (update?: boolean) => void;
  isEdit?: boolean;
  data?: Student;
}

type FormFields = {
  [key: string]: any;
  name: string;
  rg: string;
  cpf: string;
  email: string;
  phone: string;
  addr: string;
};

export function ModalStudent({
  isOpen,
  onClose,
  isEdit,
  data,
}: ModalStudentProps) {
  const toast = useToast();
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
    email: yup.string().email("E-mail inválido."),
    phone: yup.string(),
    rg: yup.string().trim(),
    addr: yup.string().required(requiredMessage).trim(),
  });

  const initialValues: FormFields = {
    name: data?.student_name ?? "",
    cpf: data?.student_cpf ? formatCPF(data.student_cpf) : "",
    addr: data?.student_addr ?? "",
    email: data?.student_email ?? "",
    phone: data?.student_phone ? formatPhone(data.student_phone) : "",
    rg: data?.student_rg ?? "",
    password: "",
    confirmPassword: "",
  };

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
          <ModalHeader>{isEdit ? "Editar" : "Novo"} Aluno</ModalHeader>
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
                        "Dados do aluno não informados."
                      );
                    }
                    const _student: StudentDTO = {
                      student_name: values.name,
                      student_email: isEmpty(values.email),
                      student_addr: values.addr,
                      student_cpf: values.cpf.replace(/\D/g, ""),
                      student_phone: isEmpty(
                        values.phone.replace(/\D/g, "").trim()
                      ),
                      student_responsible: null,
                      student_rg: values.rg.replace(/\D/g, ""),
                      student_scholarship: null,
                      created_by: auth.employee.employee_id,
                      is_deleted: false,
                    };
                    await api.students.update(data.student_id, _student);
                    onClose(true);
                    toast({
                      title: "Eba!",
                      description: "Aluno atualizado com sucesso.",
                      isClosable: true,
                      position: "top-end",
                      status: "success",
                      duration: 3000,
                    });
                    return;
                  }
                  const _student: StudentDTO = {
                    student_name: values.name,
                    student_email: values.email,
                    student_addr: values.addr,
                    student_cpf: values.cpf.replace(/\D/g, ""),
                    student_phone: values.phone.replace(/\D/g, "").trim(),
                    student_responsible: null,
                    student_rg: values.rg.replace(/\D/g, ""),
                    student_scholarship: null,
                    created_by: auth.employee.employee_id,
                    is_deleted: false,
                  };
                  await api.students.create(_student);
                  toast({
                    title: "Eba!",
                    description: "Aluno criado com sucesso.",
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

                  <Flex gridGap={"0.5rem"}>
                    <FormControl
                      isInvalid={errors.rg && touched.rg ? true : false}
                    >
                      <FormLabel>RG</FormLabel>
                      <Field name="rg">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            as={ReactInputMask}
                            mask={"99.999.999-9"}
                            type="text"
                            placeholder="e.g. 99.999.999-9"
                            p={"0 1rem"}
                            border={"1px solid"}
                            w={"100%"}
                            inputMode={"numeric"}
                          />
                        )}
                      </Field>
                      <FormErrorMessage>{errors.rg}</FormErrorMessage>
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
                  </Flex>

                  <Flex gridGap={"0.5rem"} align={"center"}>
                    <FormControl
                      isInvalid={errors.email && touched.email ? true : false}
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
                    <FormControl
                      isInvalid={errors.phone && touched.phone ? true : false}
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

                  <FormControl
                    isInvalid={errors.addr && touched.addr ? true : false}
                    isRequired
                  >
                    <FormLabel>Endereço</FormLabel>
                    <Field name="addr">
                      {({ field }: FieldProps) => (
                        <Input
                          {...field}
                          type="text"
                          p={"0 1rem"}
                          border={"1px solid"}
                          w={"100%"}
                        />
                      )}
                    </Field>
                    <FormErrorMessage>{errors.addr}</FormErrorMessage>
                  </FormControl>

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
