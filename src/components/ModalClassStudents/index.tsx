import { Button } from "@chakra-ui/button";
import { Box, Flex, Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/modal";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { useAuth } from "@hooks/useAuth";
import api from "@services/api";
import formatCPF from "@utils/formatCPF";
import { SGPGApplicationException } from "@utils/SGPGApplicationException";
import { Field, FieldProps, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import { Class } from "src/types/class.interface";
import { EmployeeResponse } from "src/types/employee.interface";
import { SocDTO } from "src/types/soc.interface";
import { Student } from "src/types/student.interface";
import * as yup from "yup";

interface ModalClassProps {
  isOpen: boolean;
  onClose: (update?: boolean) => void;
  data?: Class;
}

type FormFields = {
  cpf: string;
  name: string;
};

export function ModalClassStudents({ isOpen, onClose, data }: ModalClassProps) {
  const toast = useToast();
  const auth = useAuth();
  const [btnIncluir, setBtnIncluir] = useState(false);
  const [btnExcluir, setBtnExcluir] = useState(false);
  const [teachers, setTeachers] = useState<EmployeeResponse[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const requiredMessage = "Campo obrigatório.";
  const validationSchema = yup.object().shape({
    cpf: yup.string().required(requiredMessage),
  });

  const initialValues: FormFields = {
    cpf: "",
    name: "",
  };

  const checkStudent = (
    cpf: string,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => void
  ) => {
    const cpfOnlyNumbers = String(cpf.replace(/\D/g, ""));
    if (cpfOnlyNumbers.length == 11) {
      const student = students.find(
        (_student) => _student.student_cpf === cpfOnlyNumbers
      );
      if (!student) {
        getPermissaoBotoes(-1, setFieldValue);
      } else {
        getPermissaoBotoes(student.student_id, setFieldValue);
      }
    } else {
      setFieldValue("name", "");
      setBtnIncluir(false);
      setBtnExcluir(false);
    }
  };

  const getStudents = async () => {
    const _students = await api.students.getAll();
    console.log(_students);
    setStudents(_students);
  };

  const getPermissaoBotoes = (
    id: number,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => void
  ) => {
    // Checa se o estudante está cadastrado no banco de dados
    const student = students.find((_student) => _student.student_id == id);
    if (student) {
      // Checa se o estudante está cadastrado na classe
      if (
        data?.studentsofclass?.find(
          (_student) => _student.student_id === student.student_id
        )
      ) {
        // Ativa o botão excluir e desabilita o botão incluir
        setBtnExcluir(true);
        setBtnIncluir(false);
      } else {
        // Ativa o botão incluir e desabilita o botão excluir
        setBtnExcluir(false);
        setBtnIncluir(true);
      }
      setFieldValue("name", student.student_name);
    } else {
      setBtnIncluir(false);
      setBtnExcluir(false);
      setFieldValue("name", "");
      toast({
        title: "Opa!",
        description: "Aluno não cadastrado no banco de dados",
        isClosable: true,
        position: "top-end",
        status: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{data?.class_name}</ModalHeader>
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

                  if (!data) {
                    throw new SGPGApplicationException(
                      "Dados da turma não informados."
                    );
                  }

                  const cpfOnlyNumbers = String(values.cpf.replace(/\D/g, ""));

                  const student = students.find(
                    (_student) => _student.student_cpf === cpfOnlyNumbers
                  );

                  if (!student) {
                    throw new SGPGApplicationException(
                      "Dados do aluno não informados."
                    );
                  }

                  if (btnExcluir) {
                    await api.studentOfClass.delete(
                      data.class_id,
                      student.student_id
                    );
                    onClose(true);
                    toast({
                      title: "Eba!",
                      description: "Aluno removido com sucesso.",
                      isClosable: true,
                      position: "top-end",
                      status: "success",
                      duration: 3000,
                    });
                  }

                  if (btnIncluir) {
                    const _soc: SocDTO = {
                      class_id: data.class_id,
                      student_id: student.student_id,
                      created_by: auth.employee.employee_id,
                    };
                    await api.studentOfClass.create(_soc);
                    onClose(true);
                    toast({
                      title: "Eba!",
                      description: "Aluno incluído com sucesso.",
                      isClosable: true,
                      position: "top-end",
                      status: "success",
                      duration: 3000,
                    });
                  }
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
                setFieldValue,
              }) => (
                <Flex as={Form} gridGap={"0.5rem"} direction={"column"}>
                  <FormControl
                    isInvalid={errors.cpf && touched.cpf ? true : false}
                    isRequired
                  >
                    <FormLabel>CPF do Aluno</FormLabel>
                    <Field name="cpf">
                      {({ field }: FieldProps) => (
                        <Input
                          {...field}
                          as={ReactInputMask}
                          onBlur={(e) => {
                            handleBlur(e);
                            checkStudent(values.cpf, setFieldValue);
                          }}
                          mask={"999.999.999-99"}
                          type="text"
                          p={"0 1rem"}
                          border={"1px solid"}
                          w={"100%"}
                        />
                      )}
                    </Field>
                    <FormErrorMessage>{errors.cpf}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={errors.name && touched.name ? true : false}
                    isRequired
                    isReadOnly
                  >
                    <FormLabel>Nome do Aluno</FormLabel>
                    <Field name="name">
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
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>

                  <Box
                    h={"15rem"}
                    minH={"15rem"}
                    mt={"1rem"}
                    borderRadius={"md"}
                    maxH={"15rem"}
                    overflowY={"auto"}
                  >
                    <Table
                      size="sm"
                      borderRadius={"md"}
                      colorScheme={"primaryApp"}
                    >
                      <Thead>
                        <Tr bg={"primaryApp.600"}>
                          <Th
                            isNumeric
                            w={"15%"}
                            maxW={"15%"}
                            minW={"15%"}
                            color={"white"}
                          >
                            ID
                          </Th>
                          <Th
                            w={"12rem"}
                            maxW={"12rem"}
                            minW={"12rem"}
                            color={"white"}
                          >
                            Nome
                          </Th>
                          <Th
                            w={"35%"}
                            minW={"35%"}
                            maxW={"35%"}
                            color={"white"}
                          >
                            CPF
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.studentsofclass &&
                          data.studentsofclass.length > 0 &&
                          data.studentsofclass.map((student, index) => {
                            return (
                              <Tr
                                key={student.student_id}
                                bg={
                                  values.cpf ==
                                  student.students.student_cpf.replace(
                                    /\D/g,
                                    ""
                                  )
                                    ? "primaryApp.100"
                                    : ""
                                }
                                cursor={"pointer"}
                                _hover={{
                                  bg: "blackAlpha.200",
                                }}
                                onClick={() => {
                                  setFieldValue(
                                    "cpf",
                                    student.students.student_cpf,
                                    false
                                  );
                                  checkStudent(
                                    student.students.student_cpf,
                                    setFieldValue
                                  );
                                }}
                              >
                                <Td
                                  isNumeric
                                  w={"15%"}
                                  maxW={"15%"}
                                  minW={"15%"}
                                >
                                  {student.student_id}
                                </Td>
                                <Td w={"12rem"} maxW={"12rem"} minW={"12rem"}>
                                  <Text
                                    maxW={"100%"}
                                    whiteSpace={"nowrap"}
                                    overflow={"hidden"}
                                    textOverflow={"ellipsis"}
                                  >
                                    {student.students.student_name}
                                  </Text>
                                </Td>
                                <Td w={"35%"} minW={"35%"} maxW={"35%"}>
                                  {formatCPF(student.students.student_cpf)}
                                </Td>
                              </Tr>
                            );
                          })}
                        {!data?.studentsofclass ||
                          (data?.studentsofclass.length == 0 && (
                            <Tr>
                              <Td colSpan={3}>
                                <Text textAlign={"center"}>Não há data.</Text>
                              </Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </Box>

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
                      colorScheme={"danger"}
                      isDisabled={!dirty || !isValid || !btnExcluir}
                      isLoading={isSubmitting}
                    >
                      Excluir
                    </Button>
                    <Button
                      type="submit"
                      colorScheme={"success"}
                      isDisabled={!dirty || !isValid || !btnIncluir}
                      isLoading={isSubmitting}
                    >
                      Incluir
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
