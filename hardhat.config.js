import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    linea: {
      url: "https://rpc.linea.build",
      accounts: [process.env.PRIVATE_KEY || "eae2df73ab5da44772788e9bd71e2199d7e361e795ca5cba1213f3ac88936bda"],
    },
  },
};

export default config;