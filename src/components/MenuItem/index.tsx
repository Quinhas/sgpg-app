import { Flex, useStyleConfig } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { IconType } from "react-icons/lib";

type MenuItemProps = {
  name: string;
  variant?: string;
  icon?: IconType;
  href: string;
};

export default function MenuItem({
  variant,
  name,
  icon,
  href,
  ...rest
}: MenuItemProps) {
  const styles = useStyleConfig("MenuItem", { variant });

  return (
    <NextLink href={href} {...rest}>
      <Flex __css={styles} gridGap={"0.5rem"}>
        {/* {page.icon && <Icon as={page.icon} boxSize={"1.25rem"} />} */}
        <a>{name}</a>
      </Flex>
    </NextLink>
  );
}
