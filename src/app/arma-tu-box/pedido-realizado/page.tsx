"use client";
import React from "react";
import { Box, Button, Container, Flex, Text, Title } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { IconBrandWhatsapp, IconHome } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { bucketStaticPath } from "@/lib/constants";
import selectBoxClasses from "./../../../components/ArmaTuBox/SelectBox.module.css";

const PedidoRealizado: React.FC = () => {
  const params = useSearchParams();

  const nombre = params?.get("nombre");
  const email = params?.get("email");

  return (
    <Container mt="md">
      <Title order={1} style={{ textAlign: "center" }}>
        ¡Gracias por tu compra, {nombre}!
      </Title>
      <Title order={2} c="gray.7" style={{ textAlign: "center" }} w="100%">
        Tu pedido ha sido realizado con éxito.
      </Title>
      <Box mt="md">
        <Text style={{ textAlign: "center" }} fw={500} size="lg">
          En breve recibirás un email en <b>{email}</b> con los detalles de tu
          pedido. <br />
          Para agilizar tu pedido, realiza el pago correspondiente y envíanos tu
          comprobante de pago a nuestro Whatsapp.
        </Text>
        <Flex direction="column" justify="center" align="center">
          <Box
            pos="relative"
            h={{ base: 350, sm: 266 }}
            w={{ base: "100%", sm: 400 }}
          >
            <Image
              className={selectBoxClasses.radioImage}
              src={`${bucketStaticPath}/LOGO_WITH_CAT.jpg`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={"Logo de Delicious Vicious"}
            />
          </Box>
          <Flex mt="lg" gap="lg">
            <Link href="/" passHref>
              <Button
                variant="light"
                leftSection={<IconHome size={14} />}
                color="teal"
              >
                Regresar al inicio
              </Button>
            </Link>
            <Link
              href="https://web.whatsapp.com/send/?phone=6505557475"
              passHref
              target="_blank"
            >
              <Button
                color="teal"
                leftSection={<IconBrandWhatsapp size={14} />}
              >
                Envíanos Whatsapp
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
};

const PedidoRealizadoWithSuspense = () => (
  <React.Suspense fallback="Cargando...">
    <PedidoRealizado />
  </React.Suspense>
);

export default PedidoRealizadoWithSuspense;
