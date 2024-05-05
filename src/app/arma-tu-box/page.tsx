"use client";

import { useForm } from "@mantine/form";
import { Suspense, useState } from "react";
import {
  Box,
  Button,
  Container,
  Group,
  Stepper,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import {
  IconCookie,
  IconFileDescription,
  IconMap2,
  IconPackage,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

import SelectBox from "@/components/ArmaTuBox/SelectBox";
import Address from "@/components/ArmaTuBox/Address";
import OrderSummary from "@/components/ArmaTuBox/OrderSummary";
import PickYourThreats from "@/components/ArmaTuBox/PickYourThreats";

import {
  CREATE_ORDER,
  GET_CRAFT_YOUR_BOX_DATA,
} from "@/lib/graphql/general_queries";
import { UPDATE_STOCK } from "@/lib/graphql/stocks";
import { BoxType, DessertType, ProductJsonType } from "@/lib/types";

function processFormValues(
  values: any,
  desserts: DessertType[],
  orderProducts: ProductJsonType
) {
  const {
    nombre,
    email,
    telefono,
    referencia,
    direccion_completa,
    google_maps_link,
    diaEntrega,
    horaEntrega,
    deliveryType,
    boxId,
  } = values;
  const orderProductsSummary = Object.entries(orderProducts)
    .map(([productId, quantity]) => {
      const product = desserts.find((dessert) => dessert.id === productId);
      if (product) {
        return `${product.nombre} x ${quantity}`;
      }
      return "";
    })
    .filter(Boolean)
    .join("\n");
  const order_total = Object.entries(orderProducts)
    .map(([productId, quantity]) => {
      const product = desserts.find((dessert) => dessert.id === productId);
      if (product) {
        return product.precio * quantity;
      }
      return 0;
    })
    .reduce((acc, price) => acc + price, 0);

  if (values.deliveryType === "delivery") {
    const submitData = {
      nombre,
      email,
      telefono,
      referencia,
      direccion: direccion_completa,
      google_maps_link,
      dia_entrega: diaEntrega,
      hora_entrega: horaEntrega,
      tipo_entrega: deliveryType === "delivery" ? "Delivery" : "Pickup",
      productos: orderProductsSummary,
      total_orden: order_total,
      box: {
        connect: {
          id: boxId,
        },
      },
    };

    return submitData;
  }

  if (values.deliveryType === "pickup") {
    const submitData = {
      nombre,
      email,
      telefono,
      tipo_entrega: deliveryType === "delivery" ? "Delivery" : "Pickup",
      productos: orderProductsSummary,
      total_orden: order_total,
      box: {
        connect: {
          id: boxId,
        },
      },
    };

    return submitData;
  }

  return {};
}

export type GetCraftYourBoxResponse = {
  data: {
    boxes: BoxType[];
    productos: DessertType[];
    stocks: any;
  };
};

export default function ArmaTuBox() {
  const {
    data: {
      boxes,
      productos: desserts,
      stocks: [stock],
    },
  }: GetCraftYourBoxResponse = useSuspenseQuery(GET_CRAFT_YOUR_BOX_DATA, {
    variables: {
      where: { es_visible: { equals: true } },
      productosWhere: { es_visible: { equals: true } },
      stocksTake: 1,
      stocksWhere: {
        es_valido: { equals: true },
        valido_desde: {
          equals: dayjs().utc().startOf("week").toISOString(),
        },
      },
    },
  });
  const [createOrder, { loading: isLoading }] = useMutation(CREATE_ORDER);
  const [updateStock, { loading: isStockLoading }] = useMutation(UPDATE_STOCK);

  const [active, setActive] = useState(0);
  const [totalDesserts, setTotalDesserts] = useState<number>(0);
  const [orderProducts, setOrderProducts] = useState<ProductJsonType>({});
  const { push: redirect } = useRouter();
  const form = useForm({
    initialValues: {
      boxId: boxes.length ? boxes[0].id : "",
      deliveryType: "delivery", // "delivery" | "pickup"
      boxSize: boxes.length ? boxes[0].size : "",
      // Delivery fields
      nombre: "Carlos Alfonso",
      email: "c_alfonso@gmail.com",
      telefono: "7711234567",
      referencia: "Sahuan de las chivas",
      direccion: "",
      direccion_completa: "",
      google_maps_link: "",
      diaEntrega: "",
      horaEntrega: "",
    },

    validate: (values) => {
      if (active === 2) {
        const deliveryErrors = {
          nombre: values.nombre.trim().length < 5 ? "Nombre inválido" : null,
          referencia:
            values.referencia.trim().length < 5 ? "Referencia inválida" : null,
          direccion: !values.direccion.trim().length
            ? "Selecciona una ubicación"
            : null,
          diaEntrega: !values.diaEntrega ? "Selecciona un día" : null,
          horaEntrega: !values.horaEntrega ? "Selecciona una hora" : null,
          email:
            values.email.trim().length === 0 ||
            (values.email.trim().length > 0 &&
              !/\S+@\S+\.\S+/.test(values.email))
              ? "Email inválido"
              : null,
          telefono:
            !/^\d+$/.test(values.telefono) || values.telefono.trim().length < 10
              ? "Teléfono inválido"
              : null,
        };
        const pickupErrors = {
          nombre: values.nombre.trim().length < 5 ? "Nombre inválido" : null,
          email:
            values.email.trim().length === 0 ||
            (values.email.trim().length > 0 &&
              !/\S+@\S+\.\S+/.test(values.email))
              ? "Email inválido"
              : null,
          telefono:
            values.telefono.trim().length < 10 || !/^\d+$/.test(values.telefono)
              ? "Teléfono inválido"
              : null,
        };

        return values.deliveryType === "delivery"
          ? deliveryErrors
          : pickupErrors;
      }

      if (active === 3) {
      }
      return {};
    },
  });

  if (!stock || boxes.length === 0 || desserts.length === 0) {
    const errorMessages = {
      stock: !stock ? "No hay stock para esta semana" : null,
      boxes: boxes.length === 0 ? "No hay cajas disponibles" : null,
      desserts: desserts.length === 0 ? "No hay productos disponibles" : null,
    };

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Container pt="lg">
          <Title variant="teal">Lo sentimos!</Title>
          {errorMessages.stock && (
            <Text color="red" my="md">
              {errorMessages.stock}
            </Text>
          )}
          {errorMessages.boxes && (
            <Text color="red" my="md">
              {errorMessages.boxes}
            </Text>
          )}
          {errorMessages.desserts && (
            <Text color="red" my="md">
              {errorMessages.desserts}
            </Text>
          )}
        </Container>
      </Suspense>
    );
  }

  const onCreateOrder = async (orderData: any) => {
    const updatedStock = { ...stock.productos };
    Object.entries(orderProducts).forEach(([productId, quantity]) => {
      if (updatedStock[productId]) {
        updatedStock[productId] -= quantity;
      }
    });
    try {
      await updateStock({
        variables: {
          where: { id: stock.id },
          data: {
            productos: updatedStock,
          },
        },
      });

      await createOrder({
        variables: {
          data: orderData,
        },
      });

      redirect("/arma-tu-box/pedido-realizado");
    } catch (err) {
      if (err instanceof Error) {
        // setError(err);
        console.error(`unable to create order`, err);
      }
    }
  };

  const nextStep = () =>
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      if (current === 3) {
        const orderData = processFormValues(
          form.values,
          desserts,
          orderProducts
        );

        onCreateOrder(orderData);
        return current;
      }
      return current < 3 ? current + 1 : current;
    });
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Container pt="lg">
      <Title variant="teal">Arma tu caja</Title>
      <Suspense fallback={<div>Loading...</div>}>
        <Stepper active={active} onStepClick={setActive} size="sm">
          <Stepper.Step
            icon={<IconPackage style={{ width: rem(18), height: rem(18) }} />}
          >
            <Box my="md">
              <SelectBox boxes={boxes} form={form} />
            </Box>
          </Stepper.Step>
          <Stepper.Step
            icon={<IconCookie style={{ width: rem(18), height: rem(18) }} />}
          >
            <Box my="md">
              <PickYourThreats
                desserts={desserts}
                form={form}
                stock={stock}
                totalDesserts={totalDesserts}
                setTotalDesserts={setTotalDesserts}
                orderProducts={orderProducts}
                setOrderProducts={setOrderProducts}
              />
            </Box>
          </Stepper.Step>
          <Stepper.Step
            icon={<IconMap2 style={{ width: rem(18), height: rem(18) }} />}
          >
            <Box my="md">
              <Address form={form} />
            </Box>
          </Stepper.Step>
          <Stepper.Step
            icon={
              <IconFileDescription
                style={{ width: rem(18), height: rem(18) }}
              />
            }
          >
            <OrderSummary
              form={form}
              orderProducts={orderProducts}
              desserts={desserts}
            />
          </Stepper.Step>
          <Stepper.Completed>
            <p>Order Completed</p>
          </Stepper.Completed>
        </Stepper>

        <Group justify="center" my="md">
          <Button
            onClick={nextStep}
            size="lg"
            fullWidth
            loading={isLoading || isStockLoading}
            disabled={
              active === 1
                ? totalDesserts !== Number(form.values?.boxSize)
                : false
            }
          >
            {active === 1
              ? `Threats seleccionados: ${totalDesserts}/${form.values.boxSize} `
              : active === 3
              ? `Confirmar orden`
              : `Siguiente`}
          </Button>
          {active !== 0 && (
            <Button
              disabled={isLoading || isStockLoading}
              size="lg"
              variant="default"
              onClick={prevStep}
              fullWidth
            >
              Regresar
            </Button>
          )}
        </Group>
      </Suspense>
    </Container>
  );
}