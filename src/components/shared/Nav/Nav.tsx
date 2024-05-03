"use client";
import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  Image,
  Paper,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NextImage from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import classes from "./Nav.module.css";
import { bucketStaticPath } from "@/lib/constants";

const Nav = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const currentPath = usePathname();

  return (
    <Box>
      <Paper shadow="md" className={classes.header}>
        <Group justify="space-between" h="100%">
          <Group>
            <Image
              component={NextImage}
              src={`${bucketStaticPath}/delicious-vicious-logo.png`}
              alt="Delicious Vicious"
              width="0"
              height="0"
              sizes="100vw"
              style={{ width: "140px", height: "auto" }}
            />
          </Group>
          <Group h="100%" gap={0} visibleFrom="sm">
            <Link
              href="/"
              className={
                currentPath === "/" ? classes.linkActive : classes.link
              }
            >
              Inicio
            </Link>
            <Link
              href="/productos"
              className={
                currentPath === "/productos" ? classes.linkActive : classes.link
              }
            >
              Produtos
            </Link>
            <Link
              href="/contacto"
              className={
                currentPath === "/contacto" ? classes.linkActive : classes.link
              }
            >
              Contacto
            </Link>
          </Group>

          <Group visibleFrom="sm">
            <Link href="/arma-tu-box" className={classes.link}>
              <Button>Arma tu Box! 📦</Button>
            </Link>
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </Paper>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Divider my="sm" />
        <Link onClick={closeDrawer} href="/" className={classes.link}>
          Inicio
        </Link>
        <Link onClick={closeDrawer} href="/productos" className={classes.link}>
          Productos
        </Link>
        <Link onClick={closeDrawer} href="/contacto" className={classes.link}>
          Contacto
        </Link>
        <Divider my="sm" />
        <Group justify="center" grow pb="xl" px="md">
          <Link
            onClick={closeDrawer}
            href="/arma-tu-box"
            className={classes.link}
          >
            <Button>Arma tu Box! 📦</Button>
          </Link>
        </Group>
      </Drawer>
    </Box>
  );
};

export default Nav;