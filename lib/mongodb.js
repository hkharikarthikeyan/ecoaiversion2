import { MongoClient } from "mongodb"

// Directly define the MongoDB URI
const uri = "mongodb+srv://harik:hari919597@cluster1.vpugu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"

let client
let clientPromise

// Check if we are in development mode
if (process.env.NODE_ENV === "development") {
  // Use a global variable to preserve the client promise during development
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production, create a new client and connect
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise

