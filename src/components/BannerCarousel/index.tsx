import { Paper, rem } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { BannerType } from "@/lib/types";

import classes from "./CardsCarousel.module.css";

function Card({ imagen }: BannerType) {
  return (
    <Paper
      shadow="md"
      p="xl"
      style={{ backgroundImage: `url(${imagen?.url})` }}
      className={classes.card}
    />
  );
}

const BannerCarousel = ({ items, isPortrait }: any) => {
  return (
    <Carousel
      className={isPortrait ? classes.portraitBanner : classes.wideBanner}
      withIndicators
      slideSize={{ base: "100%", sm: "100%" }}
      slideGap={{ base: rem(2), sm: "xl" }}
      align="start"
      slidesToScroll={1}
      classNames={classes}
    >
      {items.map((item: BannerType) => (
        <Carousel.Slide key={item.id}>
          <Card {...item} />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};

export default BannerCarousel;
