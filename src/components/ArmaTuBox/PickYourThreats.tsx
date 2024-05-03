import React, { useEffect, useState } from "react";
import { DessertType, ProductJsonType, StockType } from "../../types";
import { Box, Flex, SegmentedControl } from "@mantine/core";
import Quantity from "../Quantity";
import segmentedControlClassnames from "./../ArmaTuBox/SelectBox.module.css";

const uniqueCategories = (desserts: DessertType[]) =>
  desserts.reduce((acc: Array<string>, dessert) => {
    if (!acc.includes(dessert.categoria.nombre)) {
      acc.push(dessert.categoria.nombre);
    }
    return acc;
  }, []);

const PickYourThreats = ({
  desserts,
  form,
  stock,
  totalDesserts,
  setTotalDesserts,
  orderProducts,
  setOrderProducts,
}: {
  desserts: DessertType[];
  form: any;
  stock: StockType;
  totalDesserts: number;
  setTotalDesserts: (value: number) => void;
  orderProducts: ProductJsonType;
  setOrderProducts: (value: ProductJsonType) => void;
}) => {
  const {
    values: { boxSize },
  } = form;
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

  const items = filteredDesserts.map((dessert) => (
    <Quantity
      key={dessert.id}
      dessert={dessert}
      stockQuantity={stock.productos[dessert.id]}
      boxSize={boxSize}
      totalDesserts={totalDesserts}
      setTotalDesserts={setTotalDesserts}
      orderProducts={orderProducts}
      setOrderProducts={setOrderProducts}
    />
  ));
  return (
    <Flex
      mah="calc(100vh - 330px)"
      style={{ overflow: "hidden" }}
      direction="column"
    >
      <Flex justify="center" mt="xs">
        <SegmentedControl
          classNames={segmentedControlClassnames}
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          color="teal"
          radius="xl"
          data={["Todos", ...uniqueCategories(desserts)]}
        />
      </Flex>
      <Box p="lg" style={{ overflowY: "auto" }}>
        {items}
      </Box>
    </Flex>
  );
};

export default PickYourThreats;
