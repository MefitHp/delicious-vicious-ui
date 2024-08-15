"use client";
import dayjs from "dayjs";
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
import { Calendar } from "@mantine/dates";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DessertType, ProductJsonType, StockType } from "@/lib/types";
import { endOfWeek, isInWeekRange, startOfWeek } from "@/lib/date_utils";

import calendarStyles from "../../CalendarStyles.module.css";

import { notifications } from "@mantine/notifications";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { GET_EDIT_STOCK_DATA } from "@/lib/graphql/general_queries";
import { UPDATE_STOCK } from "@/lib/graphql/stocks";

type GetDessertsResponse = {
  data: {
    productos: DessertType[];
    stock: StockType;
  };
};
type EditStockProps = {
  params: {
    id: string;
  };
};

export default function EditarStock({ params: { id } }: EditStockProps) {
  const {
    data: { productos: desserts, stock },
  }: GetDessertsResponse = useSuspenseQuery(GET_EDIT_STOCK_DATA, {
    variables: {
      stockWhere: { id },
      productosWhere: { es_visible: { equals: true } },
    },
  });
  const [updateStock, { loading: isLoading }] = useMutation(UPDATE_STOCK);
  const [hovered, setHovered] = useState<Date | null>(null);
  const [value, setValue] = useState<Date | null>(
    stock.valido_desde
      ? dayjs(stock.valido_desde).tz().toDate()
      : stock.valido_desde
  );
  const [error, setError] = useState<Error | null>(null);
  const [stockData, setStockData] = useState<StockType>(stock);
  const { push: redirect } = useRouter();

  const { productos, valido_desde, valido_hasta, es_valido, actualizado_en } =
    stockData;

  const onUpdateStock = async () => {
    try {
      const { id, __typename, ...updatedData } = stockData;
      await updateStock({
        variables: {
          where: { id: stock.id },
          data: { ...updatedData },
        },
      });

      notifications.show({
        title: "Stock actualizado",
        message: "El stock ha sido actualizado exitosamente",
        autoClose: 4000,
        position: "top-right",
        color: "teal",
        icon: <IconCheck />,
      });

      redirect("/stocks");
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
        console.error(`unable to update stock`, err);
        window?.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }
  };

  if (!stock) return <p>Stock no encontrado</p>;

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
          min={0}
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
        Actualizar Stock
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
            title="Hubo un error al actualizar el stock, envíale una captura de esto a Mefit"
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
                value={dayjs(valido_desde).tz().format("DD-MMMM-YY - hh:mm a")}
                error={!valido_desde}
                required
                readOnly
              />
            </Input.Wrapper>
            <Input.Wrapper label="Valido hasta: ">
              <Input
                value={dayjs(valido_hasta).tz().format("DD-MMMM-YY - hh:mm a")}
                error={!valido_hasta}
                required
                readOnly
              />
            </Input.Wrapper>
            <Divider my="md" />
            <Checkbox
              checked={es_valido}
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
            getDayProps={(date) => {
              const isHovered = isInWeekRange(date, hovered);
              const isSelected = isInWeekRange(date, value);
              const isInRange = isHovered || isSelected;
              return {
                onMouseEnter: () => setHovered(date),
                onMouseLeave: () => setHovered(null),
                inRange: isInRange,
                firstInRange: isInRange && date.getDay() === 1,
                lastInRange: isInRange && date.getDay() === 5,
                selected: isSelected,
                onClick: (e) => {
                  setStockData({
                    ...stockData,
                    valido_desde: startOfWeek(date),
                    valido_hasta: endOfWeek(date),
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
          onUpdateStock();
        }}
      >
        Guardar Cambios
      </Button>
    </Container>
  );
}
