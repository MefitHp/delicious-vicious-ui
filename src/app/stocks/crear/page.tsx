"use client";
import dayjs from "dayjs";
import React, { useState } from "react";

import {
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  Input,
  NumberInput,
  SimpleGrid,
  Table,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { Calendar, DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";

import {
  endOfStockValidity,
  isInSaleRange,
  isInWeekRange,
  startOfStockValidity,
} from "@/lib/date_utils";
import { GET_DESSERTS, GetDessertsResponse } from "@/lib/graphql/desserts";
import { CREATE_STOCK } from "@/lib/graphql/stocks";
import { DessertType, ProductJsonType, StockType } from "@/lib/types";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import calendarStyles from "../CalendarStyles.module.css";

function generateDessertObject(desserts: DessertType[]) {
  // Initialize an empty object
  const dessertObject: ProductJsonType = {};

  // Iterate over the desserts array and generate keys for each dessert ID with a fixed value of 0
  desserts.forEach((dessert) => {
    dessertObject[dessert.id] = Math.floor(Math.random() * 11);
  });

  return dessertObject;
}

export default function Crear() {
  const {
    data: { productos: desserts },
  }: GetDessertsResponse = useSuspenseQuery(GET_DESSERTS, {
    variables: {
      where: { es_visible: { equals: true } },
    },
  });
  const [createStock, { loading: isLoading }] = useMutation(CREATE_STOCK);
  const [hovered, setHovered] = useState<Date | null>(null);
  const [value, setValue] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [stockData, setStockData] = useState<Omit<StockType, "id">>({
    valido_desde: null,
    valido_hasta: null,
    es_valido: true,
    productos: generateDessertObject(desserts),
    actualizado_en: new Date(),
  });
  const { push: redirect } = useRouter();
  const { productos, valido_desde, valido_hasta } = stockData;

  const onCreateStock = async () => {
    try {
      await createStock({
        variables: {
          data: stockData,
        },
      });

      notifications.show({
        title: "Stock creado",
        message: "El stock ha sido creado exitosamente",
        autoClose: 4000,
        position: "top-right",
        color: "teal",
        icon: <IconCheck />,
      });

      redirect("/stocks");
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
        console.error(`unable to create stock`, err);
        window?.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }
  };

  const rows = desserts.map((dessert) => (
    <Table.Tr
      key={dessert.id}
      bg={
        productos[dessert.id] === 0
          ? "var(--mantine-color-gray-light)"
          : "var(--mantine-color-green-light)"
      }
    >
      <Table.Td>{dessert.nombre}</Table.Td>
      <Table.Td>{dessert.categoria?.nombre}</Table.Td>

      <Table.Td>
        <NumberInput
          w={100}
          name="cantidad"
          value={productos[dessert.id]}
          allowNegative={false}
          onChange={(value) => {
            const newProductos: ProductJsonType = {
              ...productos,
              [dessert.id]: Number(value),
            };
            setStockData({ ...stockData, productos: newProductos });
          }}
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container mt="md">
      <Title variant="teal" style={{ textAlign: "center" }}>
        Crear Stock
      </Title>
      {error &&
        (error.message.includes("Unique constraint failed") ? (
          <Alert color="red" title="Error" style={{ marginBottom: 16 }}>
            Ya existe un stock creado para las fechas seleccionadas. Intenta con
            otras fechas.
          </Alert>
        ) : (
          <Alert
            my="md"
            variant="light"
            color="red"
            title="Hubo un error al crear el stock, envíale una captura de esto a Mefit"
            icon={<IconInfoCircle />}
          >
            {error.message}
          </Alert>
        ))}
      <SimpleGrid
        cols={{ sm: 2, xs: 1 }}
        py="md"
        style={{ border: "1px solid green", borderRadius: 8 }}
      >
        <Flex align="center" justify="center">
          <Box>
            <Box mb="md">
              <Flex align="center" gap="xs">
                <Badge size="xs" circle /> Días en los que el stock estará
                disponible.
              </Flex>
              <Flex align="center" gap="xs">
                <Badge size="xs" circle color="#92ff9f" /> Días en los que se
                entregarán los productos.
              </Flex>
            </Box>
            <Input.Wrapper label="Valido desde: ">
              <Input
                value={
                  valido_desde
                    ? dayjs(valido_desde).utc().format("DD-MMMM-YY - hh:mm a")
                    : "No seleccionado"
                }
                error={!valido_desde}
                required
                readOnly
              />
            </Input.Wrapper>
            <Input.Wrapper label="Valido hasta: ">
              <Input
                value={
                  valido_hasta
                    ? dayjs(valido_hasta).utc().format("DD-MMMM-YY - hh:mm a")
                    : "No seleccionado"
                }
                required
                readOnly
                error={!valido_hasta}
              />
            </Input.Wrapper>
            <Divider my="md" />
            <Checkbox
              checked={stockData.es_valido}
              onChange={(e) => {
                setStockData({
                  ...stockData,
                  es_valido: e.currentTarget.checked,
                });
              }}
              label="Este stock es válido?"
            />
          </Box>
        </Flex>
        <Flex justify="center" align="center" direction="column">
          <Text>Da click en la semana en la que que el stock será válido:</Text>
          <Calendar
            withCellSpacing={false}
            classNames={calendarStyles}
            getDayProps={(rawDate) => {
              const date = dayjs(rawDate).utc().startOf("date").toDate();

              const isHovered = isInWeekRange(date, hovered);
              const isSelected = isInWeekRange(date, value);
              const isInRange = isHovered || isSelected;
              const isOnSaleRange = isInSaleRange(date, value);

              return {
                onMouseEnter: () => setHovered(date),
                onMouseLeave: () => setHovered(null),
                inRange: isInRange,
                firstInRange: isInRange && date.getDay() === 1,
                lastInRange: isInRange && date.getDay() === 3,
                selected: isSelected,
                weekend: isOnSaleRange,
                onClick: (e) => {
                  setStockData({
                    ...stockData,
                    valido_desde: startOfStockValidity(date, true),
                    valido_hasta: dayjs(endOfStockValidity(date))
                      .utc()
                      .toDate(),
                  });
                  setValue(date);
                },
              };
            }}
          />
        </Flex>
      </SimpleGrid>
      <Divider my="md" />
      <Flex align="center" gap="xs">
        <Text size="md" fw={500}>
          Ingrese la cantidad de productos que desea agregar al stock.{" "}
        </Text>
        <Tooltip
          label="Los articulos con cantidad 0, seran mostrados en color gris y se
        mostraran cómo agotados en la lista de productos y al momento armar tu
        box."
        >
          <IconInfoCircle color="blue" />
        </Tooltip>
      </Flex>
      <Table verticalSpacing="md" withTableBorder my="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Categoria</Table.Th>
            <Table.Th>Cantidad</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Button
        fullWidth
        loading={isLoading}
        disabled={!valido_desde || !valido_hasta}
        onClick={() => {
          onCreateStock();
        }}
      >
        Guardar Stock
      </Button>
    </Container>
  );
}
