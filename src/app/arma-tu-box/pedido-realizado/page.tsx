import React from "react";
import { Title } from "@mantine/core";

interface PedidoRealizadoProps {
  // Add any props you need here
}

const PedidoRealizado: React.FC<PedidoRealizadoProps> = () => {
  return (
    <div>
      <Title order={1}>Pedido Realizado</Title>
      {/* Add your component content here */}
    </div>
  );
};

export default PedidoRealizado;
