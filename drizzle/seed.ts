import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { v4 as uuidv4 } from "uuid";
import { loremIpsum } from "lorem-ipsum";

import { categories, products } from "drizzle/schema";
import type { Category, Product } from "../app/lib/types";

const client = createClient({
  url: process.env.TURSO_DB_URL as string,
  authToken: process.env.TURSO_DB_AUTH_TOKEN as string,
});

const db = drizzle(client);

const price = () => Math.floor(Math.random() * 80) + 20;
const getIndex = Math.random() > 0.5 ? 1 : 0;

async function seed() {
  const categoryData: Category[] = [
    {
      name: "Cool Mugs",
      id: uuidv4(),
      image:
        "https://res.cloudinary.com/djx5h4cjt/image/upload/v1686305552/twitpics/mug-club/cool-mugs.jpg",
    },
    {
      name: "Lame Mugs",
      id: uuidv4(),
      image:
        "https://res.cloudinary.com/djx5h4cjt/image/upload/v1686305552/twitpics/mug-club/lame-mugs.jpg",
    },
  ];

  const storedCategories: any = await db
    .insert(categories)
    .values(categoryData)
    .returning()
    .all();

  console.log("Inserted ", storedCategories.length, " categories!");

  const productsData: Product[] = [
    {
      id: uuidv4(),
      name: "The lazy Mug",
      description: loremIpsum({ count: 1, units: "paragraphs" }),
      price: price() as number,
      categoryId: storedCategories[getIndex].id as string,
      image:
        "https://res.cloudinary.com/djx5h4cjt/image/upload/v1686293638/twitpics/mug-club/the-lazy-mug.jpg",
    },
    {
      id: uuidv4(),
      name: "Life suprizes Mug",
      description: loremIpsum({ count: 1, units: "paragraphs" }),
      price: price() as number,
      categoryId: storedCategories[getIndex].id as string,
      image:
        "https://res.cloudinary.com/djx5h4cjt/image/upload/v1686291852/twitpics/mug-club/life-suprises-mug.jpg",
    },
    {
      id: uuidv4(),
      name: "The fox DJ Mug",
      description: loremIpsum({ count: 1, units: "paragraphs" }),
      price: price() as number,
      categoryId: storedCategories[getIndex].id as string,
      image:
        "https://res.cloudinary.com/djx5h4cjt/image/upload/v1686266379/twitpics/mug-club/djing-fox.jpg",
    },
    {
      id: uuidv4(),
      name: "The Motivational Mug",
      description: loremIpsum({ count: 1, units: "paragraphs" }),
      price: price() as number,
      categoryId: storedCategories[getIndex].id as string,
      image:
        "https://res.cloudinary.com/djx5h4cjt/image/upload/v1686011456/twitpics/mug-club/motivational-mug.jpg",
    },
    {
      id: uuidv4(),
      name: "The Hardworking Mug",
      description: loremIpsum({ count: 1, units: "paragraphs" }),
      price: price() as number,
      categoryId: storedCategories[getIndex].id as string,
      image:
        "https://res.cloudinary.com/djx5h4cjt/image/upload/v1686266387/twitpics/mug-club/hardworking-mug.jpg",
    },
    {
      id: uuidv4(),
      name: "The encouraging Mug",
      description: loremIpsum({ count: 1, units: "paragraphs" }),
      price: price() as number,
      categoryId: storedCategories[getIndex].id as string,
      image:
        "https://res.cloudinary.com/djx5h4cjt/image/upload/v1686292523/twitpics/mug-club/encouraging-mug.jpg",
    },
    {
      id: uuidv4(),
      name: "The Tea-bagged Mug",
      description: loremIpsum({ count: 1, units: "paragraphs" }),
      price: price() as number,
      categoryId: storedCategories[getIndex].id as string,
      image:
        "https://res.cloudinary.com/djx5h4cjt/image/upload/v1686292534/twitpics/mug-club/tea-bagged-mug.jpg",
    },
    {
      id: uuidv4(),
      name: "The Baby Art Mug",
      description: loremIpsum({ count: 1, units: "paragraphs" }),
      price: price() as number,
      categoryId: storedCategories[getIndex].id as string,
      image:
        "https://res.cloudinary.com/djx5h4cjt/image/upload/v1686292548/twitpics/mug-club/baby-art-mug.jpg",
    },
    {
      id: uuidv4(),
      name: "The Golden Touch Mug",
      description: loremIpsum({ count: 1, units: "paragraphs" }),
      price: price() as number,
      categoryId: storedCategories[getIndex].id as string,
      image:
        "https://res.cloudinary.com/djx5h4cjt/image/upload/v1686292781/twitpics/mug-club/golden-handle-mug.jpg",
    },
    {
      id: uuidv4(),
      name: "The Adventurous mug",
      description: loremIpsum({ count: 1, units: "paragraphs" }),
      price: price() as number,
      categoryId: storedCategories[getIndex].id as string,
      image:
        "https://res.cloudinary.com/djx5h4cjt/image/upload/v1686292729/twitpics/mug-club/adventurous-mug.jpg",
    },
    {
      id: uuidv4(),
      name: "The Real Estate Mug",
      description: loremIpsum({ count: 1, units: "paragraphs" }),
      price: price() as number,
      categoryId: storedCategories[getIndex].id as string,
      image:
        "https://res.cloudinary.com/djx5h4cjt/image/upload/v1686292792/twitpics/mug-club/real-estate-mug.jpg",
    },
    {
      id: uuidv4(),
      name: "The Morning Mug",
      description: loremIpsum({ count: 1, units: "paragraphs" }),
      price: price() as number,
      categoryId: storedCategories[getIndex].id as string,
      image:
        "https://res.cloudinary.com/djx5h4cjt/image/upload/v1686292987/twitpics/mug-club/morning-mug.jpg",
    },
  ];

  const storedProducts: any = await db
    .insert(products)
    .values(productsData)
    .returning()
    .all();

  console.log("Inserted ", storedProducts.length, " products!");

  process.exit(0);
}

seed();
