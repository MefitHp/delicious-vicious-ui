import * as React from "react";
import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

import { bucketStaticPath, clabe, phoneNumber } from "@/lib/constants";

export const EmailTemplate = ({
  nombre,
  email,
  telefono,
  referencia,
  direccion,
  google_maps_link,
  dia_entrega,
  hora_entrega,
  tipo_entrega,
  productos,
  total_orden,
}: any) => (
  <Html>
    <Head />
    <Preview>Confirmación de Orden</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Row>
            <Column>
              <Img
                src={`${bucketStaticPath}/delicious-vicious-logo.png`}
                width={650}
                height={257}
                alt="Delicious Vicious"
              />
            </Column>
            <Column align="right">
              <Text style={heading}>Orden realizada</Text>
            </Column>
          </Row>
        </Section>
        <Hr style={line} />
        <Section style={intro}>
          <Text style={introText}>Gracias por tu orden, {nombre}!</Text>
          <Text style={introText}>Aquí están los detalles de tu pedido:</Text>
        </Section>
        <Section style={intro}>
          <Text style={introText}>
            Para confirmar tu pedido y lo comencemos a preparar, envíanos una
            captura de tu depósito a nuestro whatsapp:
          </Text>
          <Text style={introText}>
            <strong>Cuenta CLABE:</strong> {clabe}
          </Text>
          <Section style={{ ...buttonContainer, textAlign: "center" }}>
            <Link
              href={`https://web.whatsapp.com/send/?phone=${phoneNumber}`}
              style={whatsappButton}
            >
              <Img
                src={`${bucketStaticPath}/whatsapp_icon.png`}
                width="16"
                height="16"
                alt="WhatsApp"
                style={whatsappIcon}
              />
              <span style={buttonText}>Whatsapp</span>
            </Link>
          </Section>
        </Section>
        <Section style={{ ...informationTable, borderCollapse: "collapse" }}>
          <Row style={informationTableRow}>
            <Column style={informationTableColumn}>
              <Text style={informationTableLabel}>Nombre</Text>
              <Text style={informationTableValue}>{nombre}</Text>
            </Column>
            <Column style={informationTableColumn}>
              <Text style={informationTableLabel}>Email</Text>
              <Text style={informationTableValue}>{email}</Text>
            </Column>
            <Column style={informationTableColumn}>
              <Text style={informationTableLabel}>Teléfono</Text>
              <Text style={informationTableValue}>{telefono}</Text>
            </Column>
          </Row>
          {tipo_entrega === "Delivery" && (
            <>
              <Row style={informationTableRow}>
                <Column style={informationTableColumn}>
                  <Text style={informationTableLabel}>Dirección</Text>
                  <Text style={informationTableValue}>{direccion}</Text>
                </Column>
                <Column style={informationTableColumn}>
                  <Text style={informationTableLabel}>Google Maps Link</Text>
                  <Link
                    href={google_maps_link}
                    style={{
                      ...informationTableValue,
                      color: "#15c",
                      textDecoration: "underline",
                    }}
                  >
                    {google_maps_link}
                  </Link>
                </Column>
              </Row>
              <Row style={informationTableRow}>
                <Column style={informationTableColumn}>
                  <Text style={informationTableLabel}>Fecha de entrega</Text>
                  <Text style={informationTableValue}>{dia_entrega}</Text>
                </Column>
                <Column style={informationTableColumn}>
                  <Text style={informationTableLabel}>Hora de entrega</Text>
                  <Text style={informationTableValue}>{hora_entrega}</Text>
                </Column>
              </Row>
            </>
          )}
          <Row style={informationTableRow}>
            <Column style={informationTableColumn}>
              <Text style={informationTableLabel}>Referencia</Text>
              <Text style={informationTableValue}>
                {referencia ? referencia : "No aplica"}
              </Text>
            </Column>
            <Column style={informationTableColumn}>
              <Text style={informationTableLabel}>Tipo de Entrega</Text>
              <Text style={informationTableValue}>{tipo_entrega}</Text>
            </Column>
          </Row>
        </Section>
        <Section style={productSection}>
          <Text style={productsTitle}>Productos</Text>
          <Text style={productsText}>{productos}</Text>
          <Text style={totalText}>Total: ${total_orden.toFixed(2)}</Text>
        </Section>
        <Hr style={line} />
        <Section style={{ ...footer, textAlign: "center" }}>
          <Text style={footerText}>
            Si tienes alguna pregunta, contacta con nosotros a través de{" "}
            <Link href="mailto:support@example.com" style={footerLink}>
              Contactanos
            </Link>
            .
          </Text>
          <Text style={footerText}>
            Gracias por comprar en Delicious-Vicious!
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default EmailTemplate;

const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  backgroundColor: "#ffffff",
  color: "#333",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "660px",
  maxWidth: "100%",
};

const header = {
  marginBottom: "20px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "300",
  color: "#888888",
};

const line = {
  border: "none",
  borderBottom: "1px solid #eee",
  margin: "20px 0",
};

const intro = {
  marginBottom: "20px",
};

const introText = {
  fontSize: "14px",
  color: "#555",
};

const informationTable = {
  width: "100%",
};

const informationTableRow = {
  marginBottom: "10px",
};

const informationTableColumn = {
  padding: "10px 0",
  borderBottom: "1px solid #eee",
};

const informationTableLabel = {
  fontSize: "12px",
  color: "#888",
  marginBottom: "5px",
};

const informationTableValue = {
  fontSize: "14px",
  color: "#333",
};

const productSection = {
  marginTop: "20px",
};

const productsTitle = {
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const productsText = {
  fontSize: "14px",
  color: "#555",
  whiteSpace: "pre-wrap",
};

const totalText = {
  fontSize: "16px",
  fontWeight: "bold",
  marginTop: "10px",
  color: "#333",
};

const footer = {
  marginTop: "20px",
  textAlign: "center",
};

const footerText = {
  fontSize: "12px",
  color: "#888",
  marginBottom: "10px",
};

const footerLink = {
  color: "#0d6efd",
  textDecoration: "none",
};

const buttonContainer = {
  textAlign: "center",
  margin: "20px 0",
};

const whatsappButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 20px",
  fontSize: "16px",
  fontWeight: "bold",
  color: "#fff",
  backgroundColor: "#25D366",
  borderRadius: "8px",
  textDecoration: "none",
};

const whatsappIcon = {
  marginRight: "10px",
  verticalAlign: "middle",
};

const buttonText = {
  verticalAlign: "middle",
};
