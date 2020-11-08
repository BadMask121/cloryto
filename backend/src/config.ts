import { getColonyNetworkClient, Network } from "@colony/colony-js";
import dotenv from "dotenv";
import { Wallet } from "ethers";
import { InfuraProvider } from "ethers/providers";
import admin from "firebase-admin";
import * as functions from "firebase-functions";
import Pusher from "pusher";
import { RedisClient } from "redis";

dotenv.config();

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://cloryto-33cb8.firebaseio.com",
});

app.firestore().settings({ ignoreUndefinedProperties: true });

export const func = functions; // cloud function

export const db = app.firestore(); // firebase db

export const dev = process.env.NODE_ENV === "development";

// // pusher config
export const pusher = new Pusher({
  host: "api.pusherapp.com",
  useTLS: !dev,
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
});

const MAINNET_NETWORK_ADDRESS = process.env.MAINNET_NETWORK_ADDRESS;
const MAINNET_BETACOLONY_ADDRESS = process.env.MAINNET_BETACOLONY_ADDRESS;
const MAINNET_PROJECT_ID = process.env.MAINNET_PROJECT_ID;

// Get a new Infura provider (don't worry too much about this)
const provider = new InfuraProvider("mainnet", MAINNET_PROJECT_ID);

// Get a random wallet
// You don't really need control over it, since you won't be firing any trasactions out of it
const wallet = Wallet.createRandom();
// Connect your wallet to the provider
const connectedWallet = wallet.connect(provider);

export const getColonyClient = async () => {
  // Get a network client instance
  const networkClient = await getColonyNetworkClient(
    Network.Mainnet,
    connectedWallet,
    MAINNET_NETWORK_ADDRESS as any
  );
  // Get the colony client instance for the betacolony
  const colonyClient = await networkClient.getColonyClient(
    MAINNET_BETACOLONY_ADDRESS
  );

  return colonyClient;
};

const config = {
  hashSalt: 10,

  redis: {
    options: {
      host: process.env.REDISHOST || "localhost",
      port: Number(process.env.REDISPORT) || 6379,
    },
    client: (null as unknown) as RedisClient,
  },

  baseURL: process.env.BASE_URL,
};

export default config;

// export const FieldValue = FieldValue;
