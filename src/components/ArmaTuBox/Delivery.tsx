import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Combobox,
  Select,
  SimpleGrid,
  TextInput,
  useCombobox,
} from "@mantine/core";
import usePlacesAutocomplete, {
  // getGeocode,
  // getLatLng,
  getDetails,
} from "use-places-autocomplete";
import GoogleMap, { MapOptions } from "google-maps-react-markers";
import { notifications } from "@mantine/notifications";
import { IconMapPinFilled } from "@tabler/icons-react";
import dayjs from "dayjs";
import { days, isDayDisabled } from "@/lib/date_utils";

interface Coordinates {
  place_id?: string;
  lat: number | null;
  lng: number | null;
}

interface Place {
  description: string;
  place_id: string;
}

const Delivery = ({ form }: { form: any }) => {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    place_id: "",
    lat: null,
    lng: null,
  });
  const mapRef = useRef<google.maps.Map | null>(null);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete({
    callbackName: "initMap",
    debounce: 300,
  });

  useEffect(() => {
    setValue(form.values.direccion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onGoogleApiLoaded = ({ map }: { map: google.maps.Map }) => {
    mapRef.current = map;
  };

  const options = data.map((place: Place) => {
    const { description, place_id } = place;

    return (
      <Combobox.Option
        key={place_id}
        value={description}
        onClick={() => {
          form.setFieldValue("direccion", description);
          getDetails({
            placeId: place.place_id,
            fields: ["formatted_address", "geometry", "name", "url"],
          })
            .then((placesResult: google.maps.places.PlaceResult | string) => {
              if (typeof placesResult === "string") {
                // Handle the case when placesResult is a string
              } else {
                const { geometry, formatted_address, url } = placesResult;

                form.setFieldValue("direccion_completa", formatted_address);
                form.setFieldValue("google_maps_link", url);
                const { lat, lng } = geometry?.location ?? {};
                const newCoordinates = {
                  lat: lat ? lat() : null,
                  lng: lng ? lng() : null,
                };
                setCoordinates({ ...newCoordinates, place_id });
                if (mapRef.current) {
                  if (newCoordinates.lat && newCoordinates.lng) {
                    mapRef.current.setCenter(
                      new google.maps.LatLng(
                        newCoordinates.lat,
                        newCoordinates.lng
                      )
                    );
                    mapRef.current.setZoom(18);
                  }
                }
              }
            })
            .catch((error) => {
              notifications.show({
                title: "Error",
                message: "No se pudo obtener la ubicación, intenta de nuevo.",
                color: "red",
                autoClose: 4000,
              });
            });
          combobox.toggleDropdown();
        }}
      >
        {description}
      </Combobox.Option>
    );
  });

  return (
    <>
      <Box my="md">
        <TextInput
          withAsterisk
          value={form.values.nombre}
          label="A quien se lo enviamos?"
          placeholder="Ej. Juán Perez"
          {...form.getInputProps("nombre")}
        />
        <Combobox
          store={combobox}
          onOptionSubmit={(val) => {
            setValue(val);
          }}
        >
          <Combobox.Target>
            <TextInput
              {...form.getInputProps("direccion")}
              label="Dirección"
              value={value}
              onChange={(e) => {
                setValue(e.currentTarget.value);
                form.setFieldValue("direccion", e.currentTarget.value);
              }}
              onClick={() => combobox.toggleDropdown()}
              placeholder="Ej. Calle 5 de Mayo #123 Col. Centro"
            />
          </Combobox.Target>
          <Combobox.Dropdown>
            <Combobox.Options>
              {status === "OK" && options ? (
                options
              ) : (
                <Combobox.Option value="none" disabled>
                  Sin resultados
                </Combobox.Option>
              )}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
        <TextInput
          withAsterisk
          value={form.values.referencia}
          label="Referencia"
          placeholder="Ej. Frente a la plaza"
          {...form.getInputProps("referencia")}
        />
        <SimpleGrid
          cols={{ sm: 2, xs: 1 }}
          spacing="sm"
          display="grid"
          style={{ alignItems: "end" }}
        >
          <Select
            label="Día de entrega"
            placeholder="Selecciona un día"
            description="Para entregas el día siguiente, has tu pedido antes de las 6 PM"
            required
            allowDeselect={false}
            data={Object.keys(days).map((dayName) => {
              return {
                value: dayjs(days[dayName]).format("dddd, DD [de] MMMM"),
                disabled: isDayDisabled(days[dayName]),
              };
            })}
            {...form.getInputProps("diaEntrega")}
          />
          <Select
            label="Hora de entrega"
            placeholder="Selecciona una hora"
            required
            data={[
              // from 10 am to 9 pm with 1/2 hours intervals with AM/PM format
              "10:00 AM",
              "10:30 AM",
              "11:00 AM",
              "11:30 AM",
              "12:00 PM",
              "12:30 PM",
              "01:00 PM",
              "01:30 PM",
              "02:00 PM",
              "02:30 PM",
              "03:00 PM",
              "03:30 PM",
              "04:00 PM",
              "04:30 PM",
              "05:00 PM",
              "05:30 PM",
              "06:00 PM",
              "06:30 PM",
            ]}
            {...form.getInputProps("horaEntrega")}
          />
        </SimpleGrid>
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
      </Box>
      <GoogleMap
        defaultCenter={{ lat: 20.087517, lng: -98.759266 }}
        defaultZoom={13}
        loadScriptExternally
        status={ready ? "ready" : "loading"}
        mapMinHeight="50vh"
        onGoogleApiLoaded={onGoogleApiLoaded}
      >
        <div
          style={{
            position: "absolute",
            transform: "translate(-50%, -100%)",
          }}
          lat={coordinates.lat}
          lng={coordinates.lng}
          marker-id={"any-unique-id"}
          // TODO: Change location marker icon
          draggable={false}
          // @ts-ignore-next-line
          onDragEnd={(e: any, { latLng }: { latLng: google.maps.LatLng }) => {
            // Specify type for e and latLng parameters
            // setCoordinates({
            //   lat: latLng.lat(),
            //   lng: latLng.lng(),
            //   place_id: coordinates.place_id,
            // });
            // return console.log("Drag ended", latLng);
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconMapPinFilled
              style={{
                width: 30,
                height: 30,
                color: "var(--mantine-color-red-6)",
              }}
              stroke={1.5}
              size={30}
            />
          </div>
        </div>
      </GoogleMap>
    </>
  );
};

export default Delivery;
