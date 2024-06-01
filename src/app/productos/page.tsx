"use client";

import {
  Alert,
  Badge,
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  NumberFormatter,
  SegmentedControl,
  Title,
} from "@mantine/core";
import classNames from "./Productos.module.css";
import segmentedControlClassnames from "@/components/shared/styles/SegmentedControl.module.css";
import { Suspense, useEffect, useState } from "react";
import { DessertType } from "@/lib/types";
import { useSuspenseQuery } from "@apollo/client";
import { GET_DESSERTS, GetDessertsResponse } from "@/lib/graphql/desserts";
import { IconInfoCircle } from "@tabler/icons-react";
import dynamic from "next/dynamic";

const CachedImage = dynamic(() => import("@/components/shared/CachedImage"), {
  ssr: false,
});

const Product = ({
  nombre,
  categoria,
  descripcion,
  imagen,
  precio,
  imagenPlaceholder,
}: DessertType) => {
  return (
    <Flex direction="column" h="100%" className={classNames.productCard}>
      <Box pos="relative" w="100%" h={300} className={classNames.imageWrapper}>
        <CachedImage
          className={classNames.productImage}
          src={imagen?.url} // src is optional now
          fill
          sizes="(max-width: 576px) 100vw, (max-width: 768px) 80vw, (max-width: 992px) 50vw, (max-width: 1200px) 33vw, 25vw"
          alt={nombre}
          placeholder={imagenPlaceholder ? "blur" : "empty"}
          blurDataURL={imagenPlaceholder ? imagenPlaceholder : undefined}
        />
      </Box>
      <Container py="sm" w="100%">
        <Flex align="center" justify="space-between">
          <Title variant="teal" order={3}>
            {nombre}
          </Title>
          <Badge size="lg" color="teal" variant="outline">
            <NumberFormatter prefix="$" value={precio} suffix=" MXN" />
          </Badge>
        </Flex>
        <Divider my="xs" label={categoria.nombre} labelPosition="left" />

        <span>{descripcion}</span>
      </Container>
    </Flex>
  );
};

const uniqueCategories = (desserts: DessertType[]) =>
  desserts.reduce((acc: Array<string>, dessert) => {
    if (!acc.includes(dessert.categoria.nombre)) {
      acc.push(dessert.categoria.nombre);
    }
    return acc;
  }, []);

export default function ProductsPage() {
  const {
    data: { productos: desserts },
  }: GetDessertsResponse = useSuspenseQuery(GET_DESSERTS, {
    variables: {
      where: { es_visible: { equals: true } },
    },
  });
  const [filteredDesserts, setFilteredDesserts] =
    useState<DessertType[]>(desserts);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  useEffect(() => {
    if (selectedCategory === "Todos") {
      return setFilteredDesserts(desserts);
    }
    const filteredDesserts = desserts.filter(
      (dessert: DessertType) => dessert.categoria.nombre === selectedCategory
    );
    setFilteredDesserts(filteredDesserts);
  }, [selectedCategory, desserts]);

  return (
    <Container size="xl">
      <Flex py="md" align="center" direction="column" gap="md">
        <Title>Nuestros Productos</Title>
      </Flex>
      <Suspense fallback={<div>Loading...</div>}>
        <Flex py="md" align="center" direction="column" gap="md">
          <Box>
            <SegmentedControl
              classNames={segmentedControlClassnames}
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
              color="teal"
              radius="xl"
              data={["Todos", ...uniqueCategories(desserts)]}
            />
          </Box>
        </Flex>
        {desserts.length === 0 ? (
          <Alert
            variant="light"
            color="teal"
            radius="xl"
            title="No hay productos disponibles"
            icon={<IconInfoCircle />}
          >
            Por el momento no hay productos disponibles en el catálogo. Por
            favor, intenta más tarde
          </Alert>
        ) : (
          <Grid gutter={20} align="stretch">
            {filteredDesserts.map((producto: DessertType) => (
              <Grid.Col
                key={producto.nombre}
                span={{ base: 12, md: 6, lg: 4, sm: 6, xs: 12 }}
              >
                <Product {...producto} />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Suspense>
    </Container>
  );
}
