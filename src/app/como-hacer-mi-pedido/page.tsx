import React from "react";
import { Container, Text, Title } from "@mantine/core";

const ComoHacerMiPedido: React.FC = () => {
  const Highlight = ({ text }: { text: string }) => (
    <Text span style={{ color: "var(--mantine-color-teal-5)" }} inherit>
      {` ${text} `}
    </Text>
  );

  return (
    <Container pt="lg">
      <Title variant="teal" style={{ textAlign: "center" }}>
        Cómo hago mi pedido?
      </Title>
      <Title
        order={2}
        c="gray.7"
        style={{ textAlign: "center" }}
        w="100%"
        mt="lg"
      >
        Los lunes a las
        <Highlight text="10 AM" />
        subiremos nuestró menú a la página. <br /> <br />
        De <Highlight text="lunes a miércoles" />
        podrás agendar tu pedido, y lo comenzaremos a preparar una vez que hayas
        hecho el
        <Highlight text="pago por transferencia" />. <br /> <br />
        De <Highlight text="jueves a sábado" /> hacemos las
        <Highlight text="entregas de pedidos" />, puede ser Pick-Up o a
        domicilio. <br /> <br />
        No te preocupes, te enviaremos un
        <Highlight text="email" /> para recordarte los detalles de tu pedido.{" "}
        <br /> <br />
        <Highlight text="¡Y listo! Es así de fácil tener tus placeres adictivos." />
      </Title>
    </Container>
  );
};

export default ComoHacerMiPedido;
