import React, { useState } from "react";
import {
  Box,
  Flex,
  Radio,
  Title,
  UnstyledButton as RadioWrapper,
  Stack,
} from "@mantine/core";
import classes from "./SelectBox.module.css";
import { BoxType } from "@/lib/types";
import { bucketStaticPath } from "@/lib/constants";
import dynamic from "next/dynamic";

const CachedImage = dynamic(() => import("@/components/shared/CachedImage"), {
  ssr: false,
});

const SelectBox = ({
  boxes,
  form,
  resetCounters,
}: {
  boxes: BoxType[];
  form: any;
  resetCounters: () => void;
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    form.values.boxId ? form.values.boxId : boxes[0].id || ""
  );

  const handleOptionSelect = (box: BoxType) => {
    setSelectedOption(box.id);
    form.setFieldValue("boxId", box.id);
    form.setFieldValue("boxSize", box.size);
    form.setFieldValue("boxCategoryId", box.categoria?.id);
    form.setFieldValue("boxCategoryName", box.categoria?.nombre);
    form.setFieldValue(
      "boxCategorySellsByBox",
      box.categoria?.se_vende_por_caja
    );
    resetCounters();
  };

  const items = boxes.map((box: BoxType) => {
    const isSelected = box.id === selectedOption;
    return (
      <RadioWrapper
        key={box.id}
        onClick={() => handleOptionSelect(box)}
        data-checked={isSelected || undefined}
        className={classes.radioWrapper}
      >
        <Radio
          value={box.id}
          checked={isSelected}
          label={box.nombre}
          display="none"
        />
        <Flex
          wrap="wrap"
          align="center"
          direction={{ base: "column", sm: "row" }}
        >
          <Box
            pos="relative"
            h={{ base: 350, sm: 266 }}
            w={{ base: "100%", sm: 400 }}
          >
            <CachedImage
              className={classes.radioImage}
              src={box.imagen?.url || `${bucketStaticPath}/LOGO_WITH_CAT.webp`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={box.nombre}
            />
          </Box>

          <Flex
            className={classes.boxDescription}
            flex={{ base: "auto", sm: 1 }}
            align="center"
            justify="center"
            h={{ base: 150, sm: "auto" }}
          >
            <Box px="sm">
              <Title order={3} variant="green">
                {box.nombre}
              </Title>
              <Stack gap={0}>
                {box.descripcion && (
                  <>
                    <Title order={4} c="gray.9" component="span" fw="unset">
                      {box.descripcion}
                    </Title>
                  </>
                )}
              </Stack>
            </Box>
            <Box opacity={isSelected ? 1 : 0} style={{ fontSize: 40 }}>
              🍪
            </Box>
          </Flex>
        </Flex>
      </RadioWrapper>
    );
  });
  return (
    <div>
      <Radio.Group
        className={classes.radioGroup}
        value={selectedOption}
        name="selectBox"
        variant="vertical"
        withAsterisk
        {...form.getInputProps("boxId")}
      >
        {items}
      </Radio.Group>
    </div>
  );
};

export default SelectBox;
