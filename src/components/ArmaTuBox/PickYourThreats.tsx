import React, { useEffect, useState } from "react";
import { DessertType, ProductJsonType, StockType } from "@/lib/types";
import { Box, Flex, SegmentedControl } from "@mantine/core";
import Quantity from "../Quantity";
import segmentedControlClassnames from "@/components/shared/styles/SegmentedControl.module.css";

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
    values: { boxSize, boxCategoryId, boxCategoryName },
  } = form;

  const [filteredDesserts, setFilteredDesserts] =
    useState<DessertType[]>(desserts);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    boxCategoryName ? boxCategoryName : "Todos"
  );

  // If there's no box category selected, exclude the desserts that are sold by box

  useEffect(() => {
    if (boxCategoryId) {
      // If there's a box category selected, filter the desserts by that category
      const filteredDesserts = desserts.filter((dessert: DessertType) => {
        return dessert?.categoria?.id === boxCategoryId;
      });
      setFilteredDesserts(filteredDesserts);
    } else {
      const dessersList = desserts.filter(
        (dessert) => !dessert.categoria?.se_vende_por_caja
      );
      // From the remaining desserts, filter by selected category
      if (selectedCategory === "Todos") {
        return setFilteredDesserts(dessersList);
      }
      const filteredByCategory = dessersList.filter(
        (dessert: DessertType) => dessert.categoria.nombre === selectedCategory
      );
      setFilteredDesserts(filteredByCategory);
    }
  }, [selectedCategory, desserts, boxCategoryId]);

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
      <Flex justify="center" mt="xs" mb={3}>
        <SegmentedControl
          classNames={segmentedControlClassnames}
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          color="teal"
          radius="xl"
          data={
            boxCategoryName
              ? [`${boxCategoryName}`]
              : [
                  "Todos",
                  ...uniqueCategories(
                    boxCategoryId
                      ? desserts
                      : desserts.filter(
                          (dessert) => !dessert.categoria?.se_vende_por_caja
                        )
                  ),
                ]
          }
        />
      </Flex>
      <Box p="md" style={{ overflowY: "auto" }}>
        {items}
      </Box>
    </Flex>
  );
};

export default PickYourThreats;
