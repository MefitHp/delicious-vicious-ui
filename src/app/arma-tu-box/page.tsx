"use client";

import {
  Container,
  Title,
  Stepper,
  Button,
  Group,
  Text,
  Box,
  rem,
} from "@mantine/core";
import { useState } from "react";
import SelectBox from "../../components/ArmaTuBox/SelectBox";
import { useForm } from "@mantine/form";

import PickYourThreats from "../../components/ArmaTuBox/PickYourThreats";
import dayjs from "dayjs";
import Address from "../../components/ArmaTuBox/Address";
import {
  IconCookie,
  IconFileDescription,
  IconMap2,
  IconPackage,
} from "@tabler/icons-react";
import OrderSummary from "../../components/ArmaTuBox/OrderSummary";
// import { createOrder, updateStock } from "../../apolloClient/gqlQuery";
import { useRouter } from "next/navigation";
import { DessertType, ProductJsonType } from "@/lib/types";

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

export default function CraftYourBox({
  boxes = [],
  desserts = [],
  stock = null,
}) {
  const [active, setActive] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDesserts, setTotalDesserts] = useState<number>(0);
  const [orderProducts, setOrderProducts] = useState<ProductJsonType>({});
  const { push: redirect } = useRouter();
  console.log({ stock });

  const onCreateOrder = async (orderData: any) => {
    setIsLoading(true);
    const updatedStock = { ...stock.productos };
    Object.entries(orderProducts).forEach(([productId, quantity]) => {
      if (updatedStock[productId]) {
        updatedStock[productId] -= quantity;
      }
    });
    // try {
    //   await client.mutate({
    //     mutation: { ...updateStock },
    //     variables: {
    //       where: { id: stock.id },
    //       data: {
    //         productos: updatedStock,
    //       },
    //     },
    //   });

    //   await client.mutate({
    //     mutation: { ...createOrder },
    //     variables: {
    //       data: orderData,
    //     },
    //   });

    //   setIsLoading(false);
    //   redirect("/arma-tu-box/pedido-realizado");
    // } catch (err) {
    //   if (err instanceof Error) {
    //     // setError(err);
    //     console.error(`unable to create order`, err);
    //   }
    //   setIsLoading(false);
    // }
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

  if (!stock)
    return (
      <Container pt="lg">
        <Title variant="teal">Lo sentimos!</Title>
        <Text>No hay stock para esta semana</Text>
      </Container>
    );
  console.log({ form });
  return (
    <Container pt="lg">
      <Title variant="teal">Arma tu caja</Title>
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
            <IconFileDescription style={{ width: rem(18), height: rem(18) }} />
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
          loading={isLoading}
          disabled={
            active === 1 ? totalDesserts !== form.values?.boxSize : false
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
            disabled={isLoading}
            size="lg"
            variant="default"
            onClick={prevStep}
            fullWidth
          >
            Regresar
          </Button>
        )}
      </Group>
    </Container>
  );
}

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   const context = await keystoneContext.withRequest(req, res);
//   const boxes = await context.query.Box.findMany({
//     query: `
//       id
//       nombre
//       size
//       imagen {
//         url
//       }
//       `,
//     where: { es_visible: { equals: true } },
//   });

//   const desserts = await context.query.Producto.findMany({
//     query: `
//     id
//     nombre
//     categoria {
//       id
//       nombre
//     }
//     descripcion
//     precio
//     imagen {
//       url
//     }
//     `,
//     where: { es_visible: { equals: true } },
//   });

//   const stock = await context.query.Stock.findMany({
//     where: {
//       es_valido: { equals: true },
//       valido_desde: { gt: dayjs().utc().startOf("week").toISOString() },
//     },
//     take: 1,
//     query: `
//     id
//     valido_desde
//     valido_hasta
//     productos
//     es_valido
//     `,
//   });

//   return {
//     props: {
//       boxes,
//       desserts,
//       stock: stock.length ? stock[0] : null,
//     },
//   };
// };
