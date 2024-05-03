import React from "react";
import { DessertType, ProductJsonType } from "@/lib/types";
import {
  Box,
  Divider,
  NumberFormatter,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";

const OrderSummary = ({
  form,
  orderProducts,
  desserts,
}: {
  form: any;
  orderProducts: ProductJsonType;
  desserts: DessertType[];
}) => {
  const rows = Object.keys(orderProducts).map((productId) => {
    const dessert = desserts.find((d) => d.id === productId);
    const quantity = orderProducts[productId];
    const price = dessert?.precio || 0;
    const total = quantity * price;

    return (
      <Table.Tr key={productId}>
        <Table.Td>{dessert?.nombre}</Table.Td>
        <Table.Td
          style={{
            textAlign: "center",
          }}
        >
          x{quantity}
        </Table.Td>
        <Table.Td>${price}</Table.Td>
        <Table.Td>${total}</Table.Td>
      </Table.Tr>
    );
  });

  const total = Object.keys(orderProducts).reduce((acc, productId) => {
    const dessert = desserts.find((d) => d.id === productId);
    const quantity = orderProducts[productId];
    const price = dessert?.precio || 0;
    const total = quantity * price;

    return acc + total;
  }, 0);

  return (
    <Box>
      <Title>Resumen de tu pedido</Title>
      <Stack mb="sm" gap="xs">
        <Text span>
          <Text fw={700} span>
            A quien entregamos?:{" "}
          </Text>
          {form.values.nombre}
        </Text>
        <Text span>
          <Text fw={700} span>
            Email:{" "}
          </Text>
          {form.values.email}
        </Text>
        <Text span>
          <Text fw={700} span>
            Teléfono:{" "}
          </Text>
          {form.values.telefono}
        </Text>
        <Text span>
          <Text fw={700} span>
            Tipo de entrega:{" "}
          </Text>
          {form.values.deliveryType === "delivery"
            ? "Entrega a domicilio"
            : "Pick-up"}
        </Text>

        {form.values.deliveryType === "delivery" ? (
          <>
            <Divider />
            <Text span>
              <Text fw={700} span>
                Día de entrega:{" "}
              </Text>
              {form.values.diaEntrega}
            </Text>
            <Text span>
              <Text fw={700} span>
                Hora de entrega:{" "}
              </Text>
              {form.values.horaEntrega}
            </Text>
            <Text span>
              <Text fw={700} span>
                Dirección:{" "}
              </Text>
              {form.values.direccion}
            </Text>
            <Text span>
              <Text fw={700} span>
                Referencia:{" "}
              </Text>
              {form.values.referencia}
            </Text>
          </>
        ) : null}
      </Stack>
      <Table horizontalSpacing="lg" verticalSpacing="lg" captionSide="bottom">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Producto</Table.Th>
            <Table.Th>Cantidad</Table.Th>
            <Table.Th>Precio Unitario</Table.Th>
            <Table.Th>Total</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
        <Table.Caption
          style={{
            fontWeight: "bold",
            fontSize: "1.2em",
            textAlign: "right",
          }}
        >
          Total: {""}
          <NumberFormatter prefix="$" value={total} suffix=" MXN" />
        </Table.Caption>
      </Table>
    </Box>
  );
};

export default OrderSummary;
