import { Html, Heading, Text } from "@react-email/components";

const EmailTemplate = ({ nombre }: { nombre: string }) => {
  return (
    <Html lang="en">
      <Heading as="h1">Gracias por tu compra!</Heading>
      <Text>Gracias por tu compra, {nombre}!</Text>
    </Html>
  );
};
export default EmailTemplate;
