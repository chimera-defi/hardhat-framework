if (process.env.DOTENV_PATH) {
  console.log("Using custom .env path:", process.env.DOTENV_PATH)
  require("dotenv").config({ path: process.env.DOTENV_PATH })
} else {
  require("dotenv").config();
}
let secrets = false;
if (process.env.SECRETS_PATH) {
  console.log("Using custom secrets path:", process.env.SECRETS_PATH)
  secrets = require("./secrets.js");
}

function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item)
}

function isArray(item) {
  return item && Array.isArray(item)
}

function merge(target, source) {
  if (!source) { return target }
  let output = Object.assign({}, target)
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] })
        else output[key] = merge(target[key], source[key])
      } else if (isArray(source[key])) {
        output[key] = output[key].concat(source[key])
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}

function solcover(userSettings) {
  return merge({
    skipFiles: ["mocks/", "interfaces/"],
  }, userSettings)
}

function hardhat(userSettings) {
  require("@nomiclabs/hardhat-waffle")
  require("hardhat-deploy")
  require("solidity-coverage")
  require("hardhat-gas-reporter")
  require("@nomiclabs/hardhat-etherscan");
  require("hardhat-deploy-ethers");
  require("hardhat-contract-sizer");
  require("hardhat-abi-exporter");

  const { ethers } = require("ethers")

  let test_accounts = process.env.MNEMONIC && process.env.FUNDER_MNEMONIC
    ? [
      { privateKey: ethers.Wallet.fromMnemonic(process.env.MNEMONIC).privateKey, balance: "9900000000000000000000" },
      { privateKey: ethers.Wallet.fromMnemonic(process.env.FUNDER_MNEMONIC).privateKey, balance: "9900000000000000000000" }
    ]
    : {
      mnemonic: "test test test test test test test test test test test junk",
      accountsBalance: "990000000000000000000",
    }

  let accounts =
    process.env.MNEMONIC && process.env.FUNDER_MNEMONIC
      ? [ethers.Wallet.fromMnemonic(process.env.MNEMONIC).privateKey, ethers.Wallet.fromMnemonic(process.env.FUNDER_MNEMONIC).privateKey]
      : []

  if (secrets) {
    accounts = [`0x${secrets.MAINNET_PRIVATE_KEY}`]
  }
  if (process.env.PRIVATE_KEY) {
    accounts = [`0x${process.env.PRIVATE_KEY}`]
  }
  let networks = {

    hardhat: Object.assign(
      {
        blockGasLimit: 10_000_000,
        chainId: 31337,
        accounts: test_accounts,
      },
      process.env.ALCHEMY_API_KEY
        ? { forking: { url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`, blockNumber: 11829739 } }
        : {}
    ),
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 1,
      hardhat: {
        forking: {
          enabled: false,
          url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        },
      },
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 3,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 4,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 5,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 42,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    moonbase: {
      url: "https://rpc.testnet.moonbeam.network",
      accounts,
      chainId: 1287,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    arbitrum: {
      url: "https://kovan3.arbitrum.io/rpc",
      accounts,
      chainId: 79377087078960,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    binance: {
      url: "https://bsc-dataseed.binance.org/",
      accounts,
      chainId: 56,
      live: true,
      saveDeployments: true,
    },
    binancetest: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts,
      chainId: 97,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    matic: {
      url: "https://rpc-mainnet.maticvigil.com/",
      accounts,
      chainId: 137,
      live: true,
      saveDeployments: true,
    },
    fantom: {
      url: "https://rpcapi.fantom.network",
      accounts,
      chainId: 250,
      live: true,
      saveDeployments: true,
    },
    fantomtest: {
      url: "https://rpc.testnet.fantom.network/",
      accounts,
      chainId: 4002,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    avalanche: {
      url: "https://ava.spacejelly.network/api/ext/bc/C/rpc",
      accounts,
      chainId: 43114,
      live: true,
      saveDeployments: true,
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts,
      chainId: 43113,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts,
      chainId: 80001,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    huobi: {
      url: "https://http-mainnet.hecochain.com",
      accounts,
      chainId: 128,
      live: true,
      saveDeployments: true,
    },
    huobitest: {
      url: "https://http-testnet.hecochain.com",
      accounts,
      chainId: 256,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    okex: {
      url: "http://okexchain-rpc1.okex.com:26659",
      accounts,
      chainId: 66,
      live: true,
      saveDeployments: true,
    },
    okextest: {
      url: "http://okexchaintest-rpc1.okex.com:26659",
      accounts,
      chainId: 65,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    xdai: {
      url: "https://rpc.xdaichain.com",
      accounts,
      chainId: 100,
      live: true,
      saveDeployments: true,
    },
    tomo: {
      url: "https://rpc.tomochain.com",
      accounts,
      chainId: 88,
      live: true,
      saveDeployments: true,
    },
    tomotest: {
      url: "https://rpc.testnet.tomochain.com",
      accounts,
      chainId: 89,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    metis: {
      url: "https://rocketfuel.metis.io/?owner=435",
      accounts,
      chainId: 435,
      live: true,
      saveDeployments: true,
      gasPrice: 15000000,
      ovm: true,
    }
  }

  return merge({
    defaultNetwork: "hardhat",
    namedAccounts: {},
    // gasReporter: {
    //     enabled: true,
    //     outputFile: "gasReport.txt",
    //     noColors: true,
    //     currency: "USD",
    //     coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    // },
    gasReporter: {
      currency: "USD",
      gasPrice: 50,
      enabled: true,
      src: "./contracts",
    },
    etherscan: {
      // Your API key for Etherscan
      // Obtain one at https://etherscan.io/
      apiKey: process.env.ETHERSCAN_API,
    },
    contractSizer: {
      alphaSort: true,
      runOnCompile: true,
      disambiguatePaths: false,
    },
    abiExporter: {
      path: "./data/abi",
      clear: true,
      flat: true,
      only: [],
      spacing: 2,
    },
    networks: networks,
    paths: {
      artifacts: "artifacts",
      cache: "cache",
      deploy: "deploy",
      deployments: "deployments",
      imports: "imports",
      sources: "contracts",
      tests: "test",
    },
    solidity: compilersSol(),
    ovm: metisOvm(),
  }, userSettings)
}

function metisOvm() {
  return {
    solcVersion: '0.7.6', // Currently, we only support 0.5.16, 0.6.12, and 0.7.6 of the Solidity compiler
    optimizer: true,
    runs: 20
  }
}

function compilersSol() {
  return {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.5",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ]
  }
}

function prettier(userSettings) {
  return merge({
    overrides: [
      {
        files: "*.vue",
        options: {
          bracketSpacing: false,
          printWidth: 145,
          tabWidth: 4,
          useTabs: false,
          singleQuote: false,
          explicitTypes: "always",
          endOfLine: "lf",
          semi: false,
        },
      },
      {
        files: "*.sol",
        options: {
          bracketSpacing: false,
          printWidth: 145,
          tabWidth: 4,
          useTabs: false,
          singleQuote: false,
          explicitTypes: "always",
          endOfLine: "lf",
        },
      },
      {
        files: "*.js",
        options: {
          printWidth: 145,
          semi: false,
          trailingComma: "es5",
          tabWidth: 4,
          endOfLine: "lf",
        },
      },
      {
        files: "*.ts",
        options: {
          printWidth: 145,
          semi: false,
          trailingComma: "es5",
          tabWidth: 4,
          endOfLine: "lf",
        },
      },
      {
        files: "*.json",
        options: {
          printWidth: 145,
          semi: false,
          trailingComma: "es5",
          tabWidth: 4,
          endOfLine: "lf",
        },
      },
    ],
  }, userSettings)
}

module.exports = {
  hardhat,
  prettier,
  solcover,
  merge,
}
