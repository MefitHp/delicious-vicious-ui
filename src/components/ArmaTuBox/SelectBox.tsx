import React, { useState } from "react";
import {
  Box,
  Flex,
  Radio,
  Text,
  Title,
  UnstyledButton as RadioWrapper,
} from "@mantine/core";
import classes from "./SelectBox.module.css";
import { BoxType } from "@/lib/types";
import { bucketStaticPath } from "@/lib/constants";
import CachedImage from "../shared/CachedImage";

const SelectBox = ({ boxes, form }: { boxes: BoxType[]; form: any }) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    form.values.boxId ? form.values.boxId : boxes[0].id || ""
  );

  const handleOptionSelect = (id: string, size: string) => {
    setSelectedOption(id);
    form.setFieldValue("boxId", id);
    form.setFieldValue("boxSize", size);
  };

  const items = boxes.map((box: BoxType) => {
    const isSelected = box.id === selectedOption;
    return (
      <RadioWrapper
        key={box.id}
        onClick={() => handleOptionSelect(box.id, box.size)}
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
            <Box>
              <Title order={3} variant="green">
                {box.nombre}
              </Title>
              <Text>
                <Title order={3} c="gray.9" component="span">
                  Incluye{" "}
                  <Text span c="green" inherit>
                    {box.size}
                  </Text>{" "}
                  piezas
                </Title>
              </Text>
            </Box>
            <Box p="xl" opacity={isSelected ? 1 : 0}>
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
