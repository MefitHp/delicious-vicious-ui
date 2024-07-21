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
    (portada: BannerType) => portada.es_vertical
  );

  const wideBanners = portadas.filter(
    (portada: BannerType) => !portada.es_vertical
  );
  console.log({ isMobile });
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
          <Title>¡Bienvenidos a Delicious Vicious!</Title>
          <Text size="xl">
            Nos apasiona crear galletas estilo NY y brownies decadentes que te
            dejarán sin aliento. Cada bocado está lleno de sabor y textura, ¡te
            garantizamos que te dejarán queriendo más!
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
          <Title>Perfectas para cada ocasión</Title>
          <Text size="xl">
            Nuestras delicias son perfectas para cualquier ocasión, desde
            celebraciones hasta simplemente darse un capricho después de un
            largo día.
          </Text>
        </Flex>
      </SimpleGrid>
      <SimpleGrid cols={{ sm: 2, xs: 1 }} spacing="0">
        <Flex className={classes.card}>
          <Title>Únete a nosotros</Title>
          <Text size="xl">
            Sweetaholics orgullosos! Abrazamos nuestra pasión por los sabores
            caramelizados, los esponjosos brownies y las tentadoras texturas.
            Sabemos que es un amor incondicional y elegimos no resistirnos a el.
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
