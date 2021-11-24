import { Button } from "@chakra-ui/button";
import {
    FormControl,
    FormErrorMessage,
    FormHelperText,
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
import { Textarea } from "@chakra-ui/textarea";
import { useToast } from "@chakra-ui/toast";
import { useAuth } from "@hooks/useAuth";
import api from "@services/api";
import { SGPGApplicationException } from "@utils/SGPGApplicationException";
import { Field, FieldProps, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Class, ClassDTO } from "src/types/class.interface";
import { EmployeeResponse } from "src/types/employee.interface";
import * as yup from "yup";

interface ModalClassProps {
  isOpen: boolean;
  onClose: (update?: boolean) => void;
  isEdit?: boolean;
  data?: Class;
}

type FormFields = {
  name: string;
  desc?: string;
  teacher?: number;
  duration?: number;
  days?: string;
};

export function ModalClass({ isOpen, onClose, isEdit, data }: ModalClassProps) {
  const toast = useToast();
  const auth = useAuth();
  const [teachers, setTeachers] = useState<EmployeeResponse[]>([]);

  const requiredMessage = "Campo obrigatório.";
  const validationSchema = yup.object().shape({
    name: yup.string().required(requiredMessage).trim(),
    desc: yup.string().trim(),
    teacher: yup.number(),
    duration: yup.number(),
    days: yup.string().trim(),
  });

  const initialValues: FormFields = {
    name: data?.class_name ?? "",
    desc: data?.class_desc ?? undefined,
    teacher: data?.class_teacher ?? -1,
    duration: data?.class_duration ?? undefined,
    days: data?.class_days ?? undefined,
  };

  const getTeachers = async () => {
    const _teachers = (await api.employees.getAll()).filter(
      (employee) => employee.employee_role == 1
    );
    setTeachers(_teachers);
  };

  useEffect(() => {
    getTeachers();
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? "Editar" : "Nova"} Turma</ModalHeader>
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
                        "Dados da turma não informados."
                      );
                    }
                    const _class: ClassDTO = {
                      class_name: values.name,
                      class_desc: values.desc ?? null,
                      class_days: values.days ?? null,
                      class_duration: values.duration ?? null,
                      class_teacher: values.teacher
                        ? Number(values.teacher)
                        : null,
                      created_by: data.created_by,
                      is_deleted: false,
                    };
                    await api.classes.update(data.class_id, _class);
                    onClose(true);
                    toast({
                      title: "Eba!",
                      description: "Turma atualizada com sucesso.",
                      isClosable: true,
                      position: "top-end",
                      status: "success",
                      duration: 3000,
                    });
                    return;
                  }
                  const _class: ClassDTO = {
                    class_name: values.name,
                    class_desc: values.desc ?? null,
                    class_days: values.days ?? null,
                    class_duration: values.duration ?? null,
                    class_teacher: values.teacher
                      ? Number(values.teacher)
                      : null,
                    created_by: auth.employee.employee_id,
                    is_deleted: false,
                  };
                  await api.classes.create(_class);
                  toast({
                    title: "Eba!",
                    description: "Turma criada com sucesso.",
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
                    <FormLabel>Turma</FormLabel>
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

                  <FormControl
                    isInvalid={errors.desc && touched.desc ? true : false}
                  >
                    <FormLabel>Descrição</FormLabel>
                    <Field name="desc">
                      {({ field }: FieldProps) => (
                        <Textarea
                          {...field}
                          placeholder="Descrição"
                          maxLength={350}
                          resize={"none"}
                        />
                      )}
                    </Field>
                    <FormErrorMessage>{errors.desc}</FormErrorMessage>
                  </FormControl>

                  <Flex gridGap={"0.5rem"}>
                    <FormControl
                      isInvalid={
                        errors.duration && touched.duration ? true : false
                      }
                    >
                      <FormLabel>Duração (minutos)</FormLabel>
                      <Field name="duration">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            type="number"
                            p={"0 1rem"}
                            border={"1px solid"}
                            w={"100%"}
                            inputMode={"numeric"}
                          />
                        )}
                      </Field>
                      <FormErrorMessage>{errors.duration}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isInvalid={
                        errors.teacher && touched.teacher ? true : false
                      }
                    >
                      <FormLabel>Professor</FormLabel>
                      <Field name="teacher">
                        {({ field }: FieldProps) => (
                          <Select {...field}>
                            <option value={-1} disabled hidden>
                              Selecione
                            </option>
                            {teachers.map((teacher) => {
                              return (
                                <option
                                  key={teacher.employee_id}
                                  value={teacher.employee_id}
                                >
                                  {teacher.employee_name}
                                </option>
                              );
                            })}
                          </Select>
                        )}
                      </Field>
                      <FormErrorMessage>{errors.teacher}</FormErrorMessage>
                    </FormControl>
                  </Flex>

                  <FormControl
                    isInvalid={errors.days && touched.days ? true : false}
                  >
                    <FormLabel>Dias</FormLabel>
                    <Field name="days">
                      {({ field }: FieldProps) => (
                        <Input
                          {...field}
                          type="text"
                          p={"0 1rem"}
                          border={"1px solid"}
                          w={"100%"}
                          placeholder={"e.g. SEGUNDA, QUARTA"}
                        />
                      )}
                    </Field>
                    <FormHelperText>
                      Insira os dias separados por vírgula e sem o
                      &quot;Feira&quot;
                      <br /> Exemplo: SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA
                    </FormHelperText>
                    <FormErrorMessage>{errors.days}</FormErrorMessage>
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
