"use client";
import { SimpleGrid, Box, Flex, Title, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { useSuspenseQuery } from "@apollo/client";
import { Suspense } from "react";
import dynamic from "next/dynamic";

import { GET_BANNERS, GetBannersReponse } from "@/lib/graphql/general_queries";
import BannerCarousel from "@/components/BannerCarousel";
import { bucketStaticPath } from "@/lib/constants";
import { BannerType } from "@/lib/types";
import classes from "./page.module.css";

const CachedImage = dynamic(() => import("@/components/shared/CachedImage"), {
  ssr: false,
});

export default function Page() {
  const {
    data: { portadas },
  }: GetBannersReponse = useSuspenseQuery(GET_BANNERS, {
    variables: {
      where: { es_visible: { equals: true } },
    },
  });

  const isMobile = useMediaQuery("(max-width: 750em)");

  const portraitBanners = portadas.filter(
    (portada: BannerType) => portada.es_version_movil
  );

  const wideBanners = portadas.filter(
    (portada: BannerType) => !portada.es_version_movil
  );

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        {portraitBanners.length !== 0 && (
          <BannerCarousel items={portraitBanners} isPortrait={true} />
        )}
        {wideBanners.length !== 0 && (
          <BannerCarousel items={wideBanners} isPortrait={false} />
        )}
      </Suspense>
      <SimpleGrid cols={{ sm: 2, xs: 1 }} spacing="0">
        <Flex className={classes.card}>
          <Title>NOS DECLARAMOS SWEETAHOLICS</Title>
          <Text size="xl">
            Celebramos la alegría de cada mordisco, el éxtasis de cada bocado
            azucarado y la inquebrantable devoción por lo dulce. Sabemos que hay
            quienes nos llaman adictos, pero nosotros preferimos considerarnos
            amantes fervientes de los placeres azucarados.
          </Text>
        </Flex>
        <Box pos="relative" mih={500}>
          <CachedImage
            isStatic
            style={{ objectFit: "cover" }}
            src={`${bucketStaticPath}/ny_style.webp`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="Cookie box"
          />
        </Box>
      </SimpleGrid>
      <SimpleGrid cols={{ sm: 2, xs: 1 }} spacing="0">
        <Box pos="relative" mih={500}>
          <CachedImage
            isStatic
            style={{ objectFit: "cover" }}
            src={`${bucketStaticPath}/anytime.webp`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="Cookie box"
          />
        </Box>
        <Flex className={classes.card}>
          {/* <Title>Perfectas para cada ocasión</Title> */}
          <Text size="xl">
            Abrazamos nuestra pasión por los sabores caramelizados, los
            esponjosos brownies y las tentadoras texturas. Sabemos que es un
            amor incondicional y decidimos no resistirnos a él. ¿Quién puede
            negar el poder de una crujiente galleta o el abrazo cálido de un
            brownie recién horneado? Nosotros elegimos deleitarnos con esta
            locura dulce, porque sabemos que una vida sin dulzura es como una
            carcajada sin risa.
          </Text>
        </Flex>
      </SimpleGrid>
      <SimpleGrid cols={{ sm: 2, xs: 1 }} spacing="0">
        <Flex className={classes.card}>
          {/* <Title>Únete a nosotros</Title> */}
          <Text size="xl">
            En este mundo, no hay límites para nuestras creaciones. Desde las
            galletas clásicas que nos transportan a la nostalgia de la infancia,
            hasta los brownies innovadores que desafían todas las expectativas,
            estamos aquí para demostrar que ser adicto a lo dulce puede ser algo
            maravilloso.
          </Text>
        </Flex>
        <Box pos="relative" mih={500}>
          <CachedImage
            isStatic
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={`${bucketStaticPath}/join_us.webp`}
            alt="Cookie box"
          />
        </Box>
      </SimpleGrid>
    </>
  );
}
