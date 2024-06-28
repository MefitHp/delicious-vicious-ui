import React, { useState } from "react";
import {
  Grid,
  Box,
  Flex,
  Title,
  Text,
  Badge,
  NumberFormatter,
  Button,
  Input,
  rem,
} from "@mantine/core";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import { DessertType, ProductJsonType } from "@/lib/types";
import selectBoxClasses from "./../ArmaTuBox/SelectBox.module.css";
import classes from "./Quantity.module.css";
import { bucketStaticPath } from "@/lib/constants";
import dynamic from "next/dynamic";

const CachedImage = dynamic(() => import("@/components/shared/CachedImage"), {
  ssr: false,
});

const Quantity = ({
  dessert,
  boxSize,
  stockQuantity,
  totalDesserts,
  setTotalDesserts,
  orderProducts,
  setOrderProducts,
}: {
  dessert: DessertType;
  boxSize: number;
  stockQuantity: number;
  totalDesserts: number;
  setTotalDesserts: (value: number) => void;
  orderProducts: ProductJsonType;
  setOrderProducts: (value: ProductJsonType) => void;
}) => {
  const [quantity, setQuantity] = useState(orderProducts[dessert.id] || 0);
  const { id, nombre, descripcion, precio, imagen, imagenPlaceholder } =
    dessert;

  const handleIncrease = () => {
    if (quantity < stockQuantity && totalDesserts < boxSize) {
      setQuantity(quantity + 1);
      setTotalDesserts(totalDesserts + 1);
      // @ts-ignore
      setOrderProducts((curr: ProductJsonType) => {
        return {
          ...curr,
          [id]: (curr[id] || 0) + 1,
        };
      });
    }
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      setTotalDesserts(totalDesserts - 1);
      // @ts-ignore
      setOrderProducts((curr: ProductJsonType) => {
        if (curr[id] === 1) {
          const { [id]: _, ...rest } = curr;
          return rest;
        }

        return {
          ...curr,
          [id]: (curr[id] || 0) - 1,
        };
      });
    }
  };

  return (
    <Grid key={id} gutter="xs" p="md">
      <Grid.Col span={{ base: 12, sm: 4, lg: 4 }}>
        <Box pos="relative" h={{ base: 266, sm: 200 }}>
          <CachedImage
            className={selectBoxClasses.radioImage}
            src={imagen?.url || `${bucketStaticPath}/LOGO_WITH_CAT.webp`}
            fill
            alt={nombre}
            sizes="(max-width: 576px) 100vw, (max-width: 768px) 80vw, (max-width: 992px) 50vw, (max-width: 1200px) 33vw, 25vw"
            placeholder={imagenPlaceholder ? "blur" : "empty"}
            blurDataURL={imagenPlaceholder ? imagenPlaceholder : undefined}
          />
        </Box>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 5, lg: 5 }} order={{ base: 3, sm: 2 }}>
        <Flex
          className={selectBoxClasses.boxDescription}
          flex={{ base: "auto", sm: 1 }}
          align="center"
          justify="center"
          h="100%"
        >
          <Flex direction="column">
            <Title order={3} variant="green">
              {nombre}{" "}
              {stockQuantity <= 5 && stockQuantity !== 0 && (
                <Badge color="teal">
                  {stockQuantity === 1 ? "Queda" : "Quedan"} {stockQuantity}
                </Badge>
              )}
            </Title>
            <Text>
              <Title order={5} c="gray.7" component="span">
                {descripcion}
              </Title>
            </Text>
            <Badge
              size="lg"
              color="teal"
              variant="outline"
              className={classes.badge}
            >
              <NumberFormatter prefix="$" value={precio} suffix=" MXN" />
            </Badge>
          </Flex>
        </Flex>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 3, lg: 3 }} order={{ base: 2, sm: 3 }}>
        <Flex direction="column" align="center" justify="center" h="100%">
          {stockQuantity > 0 ? (
            <>
              <Title order={3} variant="green">
                Cantidad
              </Title>
              <Flex>
                <Button
                  onClick={handleDecrease}
                  disabled={quantity === 0 && totalDesserts === boxSize}
                >
                  <IconMinus
                    style={{ width: rem(12), height: rem(12) }}
                    stroke={1.5}
                  />
                </Button>
                <Input
                  classNames={classes}
                  type="number"
                  value={quantity}
                  onChange={(event) => {
                    if (Number(event.target.value) > boxSize)
                      return setQuantity((curr) => curr);
                    setQuantity(Number(event.target.value));
                  }}
                />
                <Button
                  onClick={handleIncrease}
                  disabled={quantity === 0 && totalDesserts === boxSize}
                >
                  <IconPlus style={{ width: rem(12), height: rem(12) }} />
                </Button>
              </Flex>
            </>
          ) : (
            <Title order={5} variant="green">
              Producto agotado!
            </Title>
          )}
        </Flex>
      </Grid.Col>
    </Grid>
  );
};

export default Quantity;
