const dotenv = require("dotenv");
dotenv.config();
const { createClient } = require("@libsql/client");

const tursoConfig = {
  url: process.env.VITE_TURSO_DB_URL,
  authToken: process.env.VITE_TURSO_DB_AUTH_TOKEN
}
const tursoClient = createClient(tursoConfig);

const allProducts = require("./products-data.json");
const categories = [
  {
    name: "Furniture",
    uuid: "furniture",
  },
  {
    name: "Clothing",
    uuid: "clothing",
  },
  {
    name: "Electronics",
    uuid: "electronics",
  },
];

console.log(allProducts.length, categories.length);

// * Seed categories
categories.forEach(async (category) => {
  const itemInsert = await tursoClient.execute({
    sql: "insert into categories(id, name) values(?, ?);",
    args: [category.uuid, category.name]
  });
  console.log(itemInsert);
})

// * Seed products

const productsInsertTimer = {start: 0, end: 0}
let count = 0;

async function seed(){
  productsInsertTimer.start = Date.now();
  allProducts.forEach(async (item) => {
    try {
      await tursoClient.execute({
        sql: "insert into products(id, name, description, price, category_id, image, created_at) values(?, ?, ?, ?, ?, ?, ?);",
        args: [item.id, item.name, item.description, item.price, item.category_id, item.image, item.created_at]
      });
      console.log("Added product with id: ", item.id);
      count++;
      if(count === allProducts.length){
        productsInsertTimer.end = Date.now();
        console.log("Transaction took: ",
          (productsInsertTimer.end - productsInsertTimer.start)/1000,
          " seconds"
        )
      }
    } catch (error) {
      throw error;
    }
  });
}

seed();