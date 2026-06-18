import { Client, Storage, ID } from "appwrite";

const client = new Client();
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';

client
  .setEndpoint(endpoint)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const storage = new Storage(client);
export    { ID };
