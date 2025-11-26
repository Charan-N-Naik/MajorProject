const mongoose = require("mongoose");
let initData = require("./data.js");
const Listing = require("../model/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// const initDB = async () => {
//     await Listing.deleteMany({});
//   // Authorization  adding owner 
//   //   initData = initData.data.map((obj) => ({
//   //   ...obj,
//   //   owner: "69195d5935cd4728d9a56a4f",
//   // }));
//   // console.log(initData);
  
  
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };
const initDB = async () => {
  await Listing.deleteMany({});

  // Add owner to each listing
  initData.data = initData.data.map((obj)=> ({
    ...obj,
    owner: "69195d5935cd4728d9a56a4f",
  }));// importent think is the heare adding each in the object in array

  await Listing.insertMany(initData.data);

  console.log("data was initialized");
};

initDB();