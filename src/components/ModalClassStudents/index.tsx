import Icon from "@chakra-ui/icon";
import { Flex, Heading } from "@chakra-ui/layout";
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/modal";
import { useToast } from "@chakra-ui/toast";
import { useAuth } from "@hooks/useAuth";
import React, { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Class } from "src/types/class.interface";
import { EmployeeResponse } from "src/types/employee.interface";

interface ModalClassProps {
  isOpen: boolean;
  onClose: (update?: boolean) => void;
  data?: Class;
}

export function ModalClassStudents({ isOpen, onClose, data }: ModalClassProps) {
  const toast = useToast();
  const auth = useAuth();
  const [teachers, setTeachers] = useState<EmployeeResponse[]>([]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{data?.class_name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              w={"100%"}
              justify={"center"}
              align={"center"}
              direction={"column"}
              my={'2rem'}
            >
              <Icon
                as={FaExclamationTriangle}
                boxSize={"8rem"}
                color={"warning.500"}
              />
              <Heading>Em construção!</Heading>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
