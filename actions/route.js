"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "passop";
const COLLECTION_NAME = "passwords";

let client;
let db;

export async function savepassword(object) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).insertOne(object);
}

export async function findpasswords(email) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const data = await db.collection(COLLECTION_NAME).find({ email:email }).toArray();

    return data.map(item => ({
        id: item._id.toString(),
        site: item.site,
        username: item.username,
        password: item.password
    }));
}

export async function deletepassword(id) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
}

export async function handleEdit(id, update) {
    const client = await clientPromise;
  const db = client.db(DB_NAME);
  await db.collection(COLLECTION_NAME).updateOne(
    { _id: new ObjectId(id) },
    { $set: update }
  );
}
