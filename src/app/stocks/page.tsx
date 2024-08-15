"use client";
import React, { use, useEffect, useState } from "react";
import {
  ActionIcon,
  Alert,
  Button,
  Container,
  Flex,
  Table,
  Title,
} from "@mantine/core";

import { StockType } from "@/lib/types";

import Link from "next/link";
import {
  IconCheck,
  IconEdit,
  IconInfoCircle,
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { DELETE_STOCK, GET_STOCKS } from "@/lib/graphql/stocks";

type GetStocksResponse = {
  data: {
    stocks: StockType[];
  };
  refetch: () => void;
};
export default function Stocks() {
  const {
    data: { stocks },
    refetch,
  }: GetStocksResponse = useSuspenseQuery(GET_STOCKS);
  const [deleteStock, { loading: isLoading }] = useMutation(DELETE_STOCK);
  const [error, setError] = useState<Error | null>(null);
  const { push: redirect } = useRouter();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const rows = stocks.map((stock) => (
    <Table.Tr
      key={stock.id}
      bg={
        !stock.es_valido
          ? "var(--mantine-color-gray-light)"
          : "var(--mantine-color-green-light)"
      }
    >
      <Table.Td>
        {dayjs(stock.valido_desde).tz().format("dddd D MMMM YYYY, hh:mm A")}
      </Table.Td>
      <Table.Td>
        {dayjs(stock.valido_hasta).tz().format("dddd D MMMM YYYY, hh:mm A")}
      </Table.Td>

      <Table.Td>{stock.es_valido ? "Si" : "No"}</Table.Td>
      <Table.Td>
        <Flex gap="xs">
          <Link href={`/stocks/editar/${stock.id}`}>
            <ActionIcon variant="filled" aria-label="Editar">
              <IconEdit style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          </Link>
          <ActionIcon
            loading={isLoading}
            variant="filled"
            color="red"
            aria-label="Eliminar stock"
            onClick={() => onDeleteStock(stock.id)}
          >
            <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  const onDeleteStock = async (id: string) => {
    try {
      await deleteStock({
        variables: {
          where: { id },
        },
      });
      notifications.show({
        title: "Stock eliminado",
        message: "El stock ha sido eliminado exitosamente",
        autoClose: 4000,
        position: "top-right",
        color: "red",
        icon: <IconCheck />,
      });
      refetch();
      redirect("/stocks");
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
        console.error(`unable to delete stock`, err);
      }
    }
  };

  return (
    <Container py="md">
      <Flex w="100%" justify="space-between">
        <Title order={1}>Stocks</Title>
        <Link href="/stocks/crear">
          <Button>Crear un nuevo stock</Button>
        </Link>
      </Flex>
      {error && (
        <Alert
          my="md"
          variant="light"
          color="red"
          title=" Hubo un error al eliminar el stock, envíale una captura de esto a Mefit"
          icon={<IconInfoCircle />}
        >
          {error.message}
        </Alert>
      )}
      {stocks.length ? (
        <Table verticalSpacing="md" withTableBorder my="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Valido Desde</Table.Th>
              <Table.Th>Valido Hasta</Table.Th>
              <Table.Th>Esta activo?</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      ) : (
        <Alert
          my="md"
          variant="light"
          title="No hay stocks"
          icon={<IconInfoCircle />}
        >
          Crea un stock para empezar a vender
        </Alert>
      )}
    </Container>
  );
}
