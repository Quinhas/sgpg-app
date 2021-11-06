import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Text,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { useAuth } from "@hooks/useAuth";
import { Field, FieldProps, Form, Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { FaMoon, FaSignInAlt, FaSun } from "react-icons/fa";
import * as yup from "yup";

type FormFields = {
  [key: string]: any;
  email: string;
  password: string;
};

export default function LoginPage() {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const toast = useToast();
  const auth = useAuth();

  const requiredMessage = "Campo obrigatório.";
  const validationSchema = yup.object().shape({
    email: yup.string().email("E-mail inválido.").required(requiredMessage),
    password: yup.string().required(requiredMessage),
  });

  const initialValues: FormFields = {
    email: "",
    password: "",
  };

  return (
    <Flex grow={1} direction={"column"} p={"2rem"}>
      <Flex justify={"flex-end"}>
        <IconButton
          aria-label="Toggle theme"
          icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
          onClick={toggleColorMode}
          variant={"outline"}
          colorScheme="primaryApp"
          borderRadius={"md"}
        />
      </Flex>
      <Flex grow={1} align={"center"} justify={"center"}>
        <Flex
          direction={"column"}
          w={"sm"}
          textAlign={"center"}
          gridGap={"1rem"}
          bg={colorMode === "light" ? "white" : "black"}
          borderRadius={"md"}
          p={"2rem"}
          py={"5rem"}
          boxShadow={"md"}
        >
          <Flex alignSelf={"center"} direction={"column"}>
            <Heading color={"primaryApp.500"} fontWeight={800}>
              SGPG
            </Heading>
            <Text
              fontFamily={"heading"}
              fontWeight={"semibold"}
              textColor={"gray.500"}
            >
              Sistema de Gerenciamento do Projeto Guri
            </Text>
          </Flex>
          <Formik
            initialValues={initialValues}
            onSubmit={async (values) => {
              try {
                await auth.signIn(values.email, values.password);
                toast({
                  title: "Eba!",
                  description: "Usuário logado com sucesso.",
                  isClosable: true,
                  position: "top-end",
                  status: "success",
                  duration: 3000,
                });
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

                <FormControl
                  isInvalid={errors.password && touched.password ? true : false}
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

                <Button
                  type="submit"
                  w={"100%"}
                  rightIcon={<FaSignInAlt />}
                  isLoading={isSubmitting}
                  isDisabled={!dirty || !isValid}
                  colorScheme={"primaryApp"}
                >
                  Entrar
                </Button>
              </Flex>
            )}
          </Formik>
        </Flex>
      </Flex>
    </Flex>
  );
}
