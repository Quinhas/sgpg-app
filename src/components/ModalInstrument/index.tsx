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
import { SGPGApplicationException } from "@utils/SGPGApplicationException";
import { Field, FieldProps, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Instrument, InstrumentDTO } from "src/types/instrument.interface";
import { InstrumentBrand } from "src/types/instrumentbrand.interface";
import { InstrumentType } from "src/types/instrumenttype.interface";
import * as yup from "yup";

interface ModalInstrumentProps {
  isOpen: boolean;
  onClose: (update?: boolean) => void;
  isEdit?: boolean;
  data?: Instrument;
}

type FormFields = {
  model: string;
  brand: number;
  student: number;
  type: number;
};

export function ModalInstrument({
  isOpen,
  onClose,
  isEdit,
  data,
}: ModalInstrumentProps) {
  const toast = useToast();
  const [types, setTypes] = useState<InstrumentType[]>([]);
  const [brands, setBrands] = useState<InstrumentBrand[]>([]);
  const auth = useAuth();

  const requiredMessage = "Campo obrigatório.";
  const validationSchema = yup.object().shape({
    model: yup.string().required(requiredMessage).trim(),
    brand: yup.number().required(requiredMessage),
    type: yup.number().required(requiredMessage),
  });

  const initialValues: FormFields = {
    brand: data?.instrument_brand ?? -1,
    student: data?.instrument_student ?? -1,
    type: data?.instrument_type ?? -1,
    model: data?.instrument_model ?? "",
  };

  const getTypes = async () => {
    const _types = await api.instrumenttypes.getAll();
    setTypes(_types);
  };

  const getBrands = async () => {
    const _brands = await api.instrumentbrands.getAll();
    setBrands(_brands);
  };

  useEffect(() => {
    getTypes();
    getBrands();
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? "Editar" : "Novo"} Instrumento</ModalHeader>
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
                        "Dados do instrumento não informados."
                      );
                    }
                    const _instrument: InstrumentDTO = {
                      instrument_brand: values.brand,
                      instrument_model: values.model,
                      instrument_type: values.type,
                      created_by: data.created_by,
                      is_deleted: false,
                    };
                    await api.instruments.update(
                      data.instrument_id,
                      _instrument
                    );
                    onClose(true);
                    toast({
                      title: "Eba!",
                      description: "Instrumento atualizado com sucesso.",
                      isClosable: true,
                      position: "top-end",
                      status: "success",
                      duration: 3000,
                    });
                    return;
                  }
                  const _instrument: InstrumentDTO = {
                    instrument_model: values.model,
                    instrument_brand: Number(values.brand),
                    instrument_type: Number(values.type),
                    created_by: auth.employee.employee_id,
                    is_deleted: false,
                  };
                  console.log(_instrument);
                  await api.instruments.create(_instrument);
                  toast({
                    title: "Eba!",
                    description: "Instrumento criado com sucesso.",
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
                      isInvalid={errors.model && touched.model ? true : false}
                      isRequired
                    >
                      <FormLabel>Modelo</FormLabel>
                      <Field name="model">
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
                      <FormErrorMessage>{errors.model}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isInvalid={errors.type && touched.type ? true : false}
                      isRequired
                    >
                      <FormLabel>Tipo</FormLabel>
                      <Field name="type">
                        {({ field }: FieldProps) => (
                          <Select {...field}>
                            <option value={-1} disabled hidden>
                              Selecione
                            </option>
                            {types.map((type) => {
                              return (
                                <option
                                  key={type.instrumenttype_id}
                                  value={type.instrumenttype_id}
                                >
                                  {type.instrumenttype_name}
                                </option>
                              );
                            })}
                          </Select>
                        )}
                      </Field>
                      <FormErrorMessage>{errors.type}</FormErrorMessage>
                    </FormControl>
                  </Flex>

                  <Flex gridGap={"0.5rem"} align={"center"}>
                    <FormControl
                      isInvalid={errors.brand && touched.brand ? true : false}
                      isRequired
                    >
                      <FormLabel>Marca</FormLabel>
                      <Field name="brand">
                        {({ field }: FieldProps) => (
                          <Select {...field}>
                            <option value={-1} disabled hidden>
                              Selecione
                            </option>
                            {brands.map((brand) => {
                              return (
                                <option
                                  key={brand.instrumentbrand_id}
                                  value={brand.instrumentbrand_id}
                                >
                                  {brand.instrumentbrand_name}
                                </option>
                              );
                            })}
                          </Select>
                        )}
                      </Field>
                      <FormErrorMessage>{errors.brand}</FormErrorMessage>
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
