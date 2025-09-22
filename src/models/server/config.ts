import env from "@/app/env";
import { IndexType } from "node-appwrite";

import { Avatars, Client, Databases, Storage, Users } from "node-appwrite";
import { db, questionCollection } from "../name";

const client = new Client()
  .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
  .setProject(env.appwrite.projectId) // Your project ID
  .setKey(env.appwrite.apikey); // Your secret API key;

client.setSession(Date.now().toString()); //somehow fix the server caching issue :)

const databases = new Databases(client);
const avatars = new Avatars(client);
const storage = new Storage(client);
const users = new Users(client);

export { client, databases, users, avatars, storage };
