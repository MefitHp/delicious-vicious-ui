"use client";
import React, { useState } from "react";
import {
  Alert,
  Flex,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import Delivery from "./Delivery";
import segmentedControlClassnames from "./../../components/ArmaTuBox/SelectBox.module.css";
import { IconInfoCircle } from "@tabler/icons-react";

const Address = ({ form }: { form: any }) => {
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(
    form?.values?.deliveryType
  );

  return (
    <>
      <Flex justify="center">
        <SegmentedControl
          classNames={segmentedControlClassnames}
          value={deliveryType}
          onChange={(value) => {
            form.setFieldValue(
              "deliveryType",
              deliveryType === "delivery" ? "pickup" : "delivery"
            );
            setDeliveryType(
              deliveryType === "delivery" ? "pickup" : "delivery"
            );
          }}
          color="teal"
          radius="xl"
          data={["delivery", "pickup"]}
        />
      </Flex>

      {deliveryType === "delivery" ? (
        <Delivery form={form} />
      ) : (
        <>
          <Stack
            bg="var(--mantine-color-body)"
            align="stretch"
            justify="center"
            gap="sm"
            py="sm"
          >
            <Alert
              variant="light"
              color="teal"
              title="Donde recoger?"
              icon={<IconInfoCircle />}
            >
              Puedes recoger tu pedido en{" "}
              <Text span c="#37614c" td="underline" fs="italic" inherit>
                Mon Petit Chou
              </Text>{" "}
              de 11am a 2pm. O de 4pm a 6pm en{" "}
              <Text span c="#37614c" td="underline" fs="italic" inherit>
                Calle 5 de febrero #118, col. Periodistas.
              </Text>
              <br />
              <Text span fw={700} inherit>
                Nota: No te preocupes, te mandaremos esta la información a tu
                correo cuando concluyas tu orden.
              </Text>
            </Alert>
            <TextInput
              withAsterisk
              value={form.values.nombre}
              label="Quién hace el pedido?"
              placeholder="Ej. Juán Perez"
              {...form.getInputProps("nombre")}
            />
            <TextInput
              withAsterisk
              value={form.values.email}
              label="Correo electrónico (para enviarte la información)"
              placeholder="Ej. juanperez@mail.com"
              {...form.getInputProps("email")}
            />
            <TextInput
              withAsterisk
              value={form.values.telefono}
              label="Teléfono"
              placeholder="Ej. 1234567890"
              {...form.getInputProps("telefono")}
            />
          </Stack>
          <Flex>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3746.367473885749!2d-98.74395902425374!3d20.11871128131259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d109bb64f0e2ef%3A0xb143e8db076011e1!2sMon%20Petit%20Chou!5e0!3m2!1sen!2smx!4v1713329703128!5m2!1sen!2smx"
              loading="lazy"
              style={{ width: "100%", height: "50vh", border: 0 }}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Flex>
        </>
      )}
    </>
  );
};

export default Address;
