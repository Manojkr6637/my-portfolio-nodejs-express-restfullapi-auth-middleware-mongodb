const { MongoClient, ObjectId } = require('mongodb');
/**
 * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
 * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
 */
// const connectionURL = "mongodb+srv://sah123manoj:0PPbE00uBYcH4Jjp@cluster0.fctqwj6.mongodb.net/?retryWrites=true&w=majority";

const connectionURL = 'mongodb://127.0.0.1:27017' // localhost:27017
const client = new MongoClient(connectionURL);
const dbName = 'my-portfolio';
const id = new ObjectId();

async function insertOne(ob) {
    // Use connect method to connect to the server
    await client.connect();
    const db = await client.db(dbName);
    const collection = await db.collection('skills');
    let result = null
    try {
        const result = await collection.insertOne({
            _id: id,
            uuid: ob.uuid,
            title: ob.title,
            description: ob.description
        }); // duplicate key error



    } catch (error) {
        if (error) {
            console.log(`Error worth logging: ${error}`); // special case for some reason
        }
        throw error; // still want to crash
    }
    client.close();

    return result;
}
async function insertMany(ob) {
    // Use connect method to connect to the server
    await client.connect();
    const db = await client.db(dbName);
    const collection = await db.collection('skills');
    let dd = null
    try {

        dd = await collection.insertMany([ob])


    } catch (error) {
        if (error) {
            console.log(`Error worth logging: ${error}`); // special case for some reason
        }
        throw error; // still want to crash
    }
    client.close()
    return dd;
}
async function find() {
    await client.connect();
    const db = await client.db(dbName);
    const collection = await db.collection('skills');
    let data = null;
    try {
        data = await collection.find({}).toArray();

        console.log('Found documents =>', data);
        // console.log('eee', data)
        // data1.then((res) => {
        //     console.log('ddd', res)
        //     data = res
        // })
    } catch (error) {
        if (error) {
            console.log(`Error worth logging: ${error}`); // special case for some reason
        }
        throw error; // still want to crash
    }
    client.close()
    return data
}
async function findOne(uuid) {
    await client.connect();
    const db = await client.db(dbName);
    const collection = await db.collection('skills');
    let data = null;
    try {
        // data = await collection.findOne({ uuid: uuid }).toArray();
        data = await collection.find({ uuid: uuid }).toArray();
        console.log('Found documents =>', data, uuid);
        // console.log('eee', data)
        // data1.then((res) => {
        //     console.log('ddd', res)
        //     data = res
        // })
    } catch (error) {
        if (error) {
            console.log(`Error worth logging: ${error}`); // special case for some reason
        }
        throw error; // still want to crash
    }
    client.close()
    return data
}
async function updateOne(uuid, ob) {
    await client.connect();
    const db = await client.db(dbName);
    const collection = await db.collection('skills');
    let data = null;
    try {
        // data = await collection.findOne({ uuid: uuid }).toArray();
        data = await collection.updateOne({ uuid: uuid }, { $set: ob });
        console.log('Found documents =>', data, uuid);

    } catch (error) {
        if (error) {
            console.log(`Error worth logging: ${error}`); // special case for some reason
        }
        throw error; // still want to crash
    }
    client.close()
    return data
}
async function deleteOne(uuid) {
    await client.connect();
    const db = await client.db(dbName);
    const collection = await db.collection('skills');
    let data = null;
    try {
        // data = await collection.findOne({ uuid: uuid }).toArray();
        data = await collection.deleteOne({ uuid: uuid });
    } catch (error) {
        if (error) {
            console.log(`Error worth logging: ${error}`); // special case for some reason
        }
        throw error; // still want to crash
    }
    client.close()
    return data
}
// main()
//     .then(console.log)
//     .catch(console.error)
//     .finally(() => client.close());


module.exports = {
    insertOne: insertOne,
    insertMany: insertMany,
    find: find,
    findOne: findOne,
    updateOne: updateOne,
    deleteOne: deleteOne
};