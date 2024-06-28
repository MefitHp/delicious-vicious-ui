import { Container, Group, ActionIcon, rem, Paper } from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import classes from "./Footer.module.css";
import Link from "next/link";
import { phoneNumber } from "@/lib/constants";

export default function Footer() {
  return (
    <Paper shadow="sm" className={classes.footer}>
      <Container className={classes.inner}>
        <h3>Delicious Vicious</h3>
        <Group
          gap={0}
          className={classes.links}
          justify="flex-end"
          wrap="nowrap"
        >
          <Link
            href="https://www.facebook.com/profile.php?id=61557506345127"
            target="_blank"
          >
            <ActionIcon size="lg" color="gray" variant="subtle">
              <IconBrandFacebook
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Link>
          <Link
            href="https://www.instagram.com/deliciousvicious.mx/"
            target="_blank"
          >
            <ActionIcon size="lg" color="gray" variant="subtle">
              <IconBrandInstagram
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Link>
          <Link
            href={`https://web.whatsapp.com/send/?phone=${phoneNumber}`}
            target="_blank"
          >
            <ActionIcon size="lg" color="gray" variant="subtle">
              <IconBrandWhatsapp
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Link>
        </Group>
      </Container>
    </Paper>
  );
}
