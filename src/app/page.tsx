"use client";
import { SimpleGrid, Box, Flex, Title, Text } from "@mantine/core";

import classes from "./page.module.css";
import { useSuspenseQuery } from "@apollo/client";
import { GET_BANNERS, GetBannersReponse } from "@/lib/graphql/general_queries";
// import BannerCarousel from "@/components/BannerCarousel";
// import { Suspense } from "react";
import { bucketStaticPath } from "@/lib/constants";

export default function Page() {
  const {
    data: { portadas: banners },
  }: GetBannersReponse = useSuspenseQuery(GET_BANNERS, {
    variables: {
      where: { es_visible: { equals: true } },
    },
  });

  return (
    <>
      {/* <Suspense fallback={<div>Loading...</div>}>
        {banners.length !== 0 && <BannerCarousel items={banners} />}
      </Suspense> */}
      <SimpleGrid cols={{ sm: 2, xs: 1 }} spacing="0">
        <Flex className={classes.card} p="xl" px={80}>
          <Title order={1}>Eat</Title>
          <Text size="xl">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque
            expedita libero tempora aspernatur rem culpa officia, nihil
            praesentium, suscipit nam nesciunt ut maiores iusto deleniti odio
            corporis exercitationem fugiat voluptates?
          </Text>
        </Flex>
        <Box
          className={classes.imageCard}
          style={{
            backgroundImage: `url("${bucketStaticPath}/COOKIE_BOX_CLOSED.jpg")`,
          }}
        />
      </SimpleGrid>
      <SimpleGrid cols={{ sm: 2, xs: 1 }} spacing="0">
        <Box
          className={classes.imageCard}
          style={{
            backgroundImage: `url("${bucketStaticPath}/COOKIE_BOX_CLOSEUP.jpg")`,
          }}
        />
        <Flex className={classes.card} p="xl" px={80}>
          <Title order={1}>Drink</Title>
          <Text size="xl">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque
            expedita libero tempora aspernatur rem culpa officia, nihil
            praesentium, suscipit nam nesciunt ut maiores iusto deleniti odio
            corporis exercitationem fugiat voluptates?
          </Text>
        </Flex>
      </SimpleGrid>
      <SimpleGrid cols={{ sm: 2, xs: 1 }} spacing="0">
        <Flex className={classes.card} p="xl" px={80}>
          <Title order={1}>Enjoy</Title>
          <Text size="xl">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque
            expedita libero tempora aspernatur rem culpa officia, nihil
            praesentium, suscipit nam nesciunt ut maiores iusto deleniti odio
            corporis exercitationem fugiat voluptates?
          </Text>
        </Flex>
        <Box
          className={classes.imageCard}
          style={{
            backgroundImage: `url("${bucketStaticPath}/LOGO_WITH_CAT.webp")`,
          }}
        />
      </SimpleGrid>
    </>
  );
}
