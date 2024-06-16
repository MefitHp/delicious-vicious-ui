"use client";
import { SimpleGrid, Box, Flex, Title, Text } from "@mantine/core";

import classes from "./page.module.css";
// import { useSuspenseQuery } from "@apollo/client";
// import { GET_BANNERS, GetBannersReponse } from "@/lib/graphql/general_queries";
// import BannerCarousel from "@/components/BannerCarousel";
// import { Suspense } from "react";
import { bucketStaticPath } from "@/lib/constants";
import dynamic from "next/dynamic";

const CachedImage = dynamic(() => import("@/components/shared/CachedImage"), {
  ssr: false,
});

export default function Page() {
  // const {
  //   data: { portadas: banners },
  // }: GetBannersReponse = useSuspenseQuery(GET_BANNERS, {
  //   variables: {
  //     where: { es_visible: { equals: true } },
  //   },
  // });

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
        <Box pos="relative">
          <CachedImage
            isStatic
            style={{ objectFit: "cover" }}
            src={`${bucketStaticPath}/COOKIE_BOX_CLOSED.webp`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="Cookie box"
          />
        </Box>
      </SimpleGrid>
      <SimpleGrid cols={{ sm: 2, xs: 1 }} spacing="0">
        <Box pos="relative">
          <CachedImage
            isStatic
            style={{ objectFit: "cover" }}
            src={`${bucketStaticPath}/COOKIE_BOX_CLOSEUP.webp`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="Cookie box"
          />
        </Box>
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
        <Box pos="relative">
          <CachedImage
            isStatic
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={`${bucketStaticPath}/LOGO_WITH_CAT.webp`}
            alt="Cookie box"
          />
        </Box>
      </SimpleGrid>
    </>
  );
}
