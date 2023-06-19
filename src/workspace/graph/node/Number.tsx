import { FC, useState } from "react";
import { NodeProps } from "reactflow";
import BaseNode, { NodeConfig } from "./Base";
import { NodeEndpointType } from "./BaseHandle";
import { inputStyles } from "./styles";

export const config: NodeConfig = {
  outputs: [
    {
      id: "output-number",
      label: "Number",
      type: NodeEndpointType.Number,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
  ],
};

export type NodeData = {
  value?: number;
};

const NumberNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const [value, setValue] = useState<number>(data.value ?? 0);

  return (
    <BaseNode id={id} data={data} config={config} label="Number" {...props}>
      <input
        className={inputStyles}
        type="number"
        onChange={(e) => setValue(Number(e.target.value))}
        value={value}
      />
    </BaseNode>
  );
};

export default NumberNode;