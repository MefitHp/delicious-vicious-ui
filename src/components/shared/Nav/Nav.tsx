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

  const Logo = () => (
    <Image
      component={NextImage}
      src={`${bucketStaticPath}/delicious-vicious-logo.png`}
      alt="Delicious Vicious"
      width={140}
      height={55}
      sizes="(max-width: 600px) 100vw, 140px"
      quality={75}
    />
  );

  return (
    <Box>
      <Paper shadow="md" className={classes.header}>
        <Group justify="space-between" h="100%">
          <Group>
            <Link prefetch={false} href="/">
              <Logo />
            </Link>
          </Group>
          <Group h="100%" gap={0} visibleFrom="sm">
            <Link
              prefetch={false}
              href="/"
              className={
                currentPath === "/" ? classes.linkActive : classes.link
              }
            >
              Inicio
            </Link>
            <Link
              prefetch={false}
              href="/productos"
              className={
                currentPath === "/productos" ? classes.linkActive : classes.link
              }
            >
              Produtos
            </Link>
            <Link
              prefetch={false}
              href="/como-hacer-mi-pedido"
              className={
                currentPath === "/como-hacer-mi-pedido"
                  ? classes.linkActive
                  : classes.link
              }
            >
              Cómo hago mi pedido?
            </Link>
          </Group>
          <Group visibleFrom="sm">
            <Link prefetch={false} href="/arma-tu-box">
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
        title={<Logo />}
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Divider my="sm" />
        <Link
          prefetch={false}
          onClick={closeDrawer}
          href="/"
          className={classes.link}
        >
          Inicio
        </Link>
        <Link
          prefetch={false}
          onClick={closeDrawer}
          href="/productos"
          className={classes.link}
        >
          Productos
        </Link>
        <Link
          prefetch={false}
          onClick={closeDrawer}
          href="/como-hacer-mi-pedido"
          className={classes.link}
        >
          Cómo hacer mi pedido?
        </Link>
        <Divider my="sm" />
        <Group justify="center" grow pb="xl" px="md">
          <Link
            prefetch={false}
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
