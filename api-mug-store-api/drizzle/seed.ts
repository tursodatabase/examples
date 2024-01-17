import { v4 as uuidv4 } from 'uuid';
import { loremIpsum } from 'lorem-ipsum';

import { db } from './migrate';
import { categories, mugs } from './schema';

const description = loremIpsum({ count: 2, units: 'paragraphs' });
const price = Math.floor(Math.random() * 80) + 20;
const getIndex = Math.random() > 0.5 ? 1 : 0;

async function seed() {
  const categoryData = [
    {
      name: 'Cool Mugs',
      id: uuidv4(),
    },
    {
      name: 'Lame Mugs',
      id: uuidv4(),
    },
  ];

  const storedCategories: any = await db
    .insert(categories)
    .values(categoryData)
    .returning()
    .all();

  console.log(`Inserted ${storedCategories.length} categories!`);

  const mugsData = [
    {
      id: uuidv4(),
      name: 'The lazy mug',
      description,
      price,
      categoryId: storedCategories[getIndex].id as string,
      image:
        'https://res.cloudinary.com/djx5h4cjt/image/upload/v1686293638/twitpics/mug-club/the-lazy-mug.jpg',
      updatedAt: Date.now(),
      createdAt: Date.now(),
    },
    {
      id: uuidv4(),
      name: 'Life suprizes mug',
      description,
      price,
      categoryId: storedCategories[getIndex].id as string,
      image:
        'https://res.cloudinary.com/djx5h4cjt/image/upload/v1686291852/twitpics/mug-club/life-suprises-mug.jpg',
      updatedAt: Date.now(),
      createdAt: Date.now(),
    },
    {
      id: uuidv4(),
      name: 'The fox DJ mug',
      description,
      price,
      categoryId: storedCategories[getIndex].id as string,
      image:
        'https://res.cloudinary.com/djx5h4cjt/image/upload/v1686266379/twitpics/mug-club/djing-fox.jpg',
      updatedAt: Date.now(),
      createdAt: Date.now(),
    },
    {
      id: uuidv4(),
      name: 'Motivational mug',
      description,
      price,
      categoryId: storedCategories[getIndex].id as string,
      image:
        'https://res.cloudinary.com/djx5h4cjt/image/upload/v1686011456/twitpics/mug-club/motivational-mug.jpg',
      updatedAt: Date.now(),
      createdAt: Date.now(),
    },
    {
      id: uuidv4(),
      name: 'Hard-working mug',
      description,
      price,
      categoryId: storedCategories[getIndex].id as string,
      image:
        'https://res.cloudinary.com/djx5h4cjt/image/upload/v1686266387/twitpics/mug-club/hardworking-mug.jpg',
      updatedAt: Date.now(),
      createdAt: Date.now(),
    },
    {
      id: uuidv4(),
      name: 'The encouraging mug',
      description,
      price,
      categoryId: storedCategories[getIndex].id as string,
      image:
        'https://res.cloudinary.com/djx5h4cjt/image/upload/v1686292523/twitpics/mug-club/heather-ford-6fiz86Ql3UA-unsplash.jpg',
      updatedAt: Date.now(),
      createdAt: Date.now(),
    },
    {
      id: uuidv4(),
      name: 'Tea-bagged mug',
      description,
      price,
      categoryId: storedCategories[getIndex].id as string,
      image:
        'https://res.cloudinary.com/djx5h4cjt/image/upload/v1686292534/twitpics/mug-club/juliana-kozoski-dOTTLLj_Th4-unsplash.jpg',
      updatedAt: Date.now(),
      createdAt: Date.now(),
    },
    {
      id: uuidv4(),
      name: 'Baby art mug',
      description,
      price,
      categoryId: storedCategories[getIndex].id as string,
      image:
        'https://res.cloudinary.com/djx5h4cjt/image/upload/v1686292548/twitpics/mug-club/baby-art-mug.jpg',
      updatedAt: Date.now(),
      createdAt: Date.now(),
    },
    {
      id: uuidv4(),
      name: 'Golden handle mug',
      description,
      price,
      categoryId: storedCategories[getIndex].id as string,
      image:
        'https://res.cloudinary.com/djx5h4cjt/image/upload/v1686292781/twitpics/mug-club/golden-handle-mug.jpg',
      updatedAt: Date.now(),
      createdAt: Date.now(),
    },
    {
      id: uuidv4(),
      name: 'The adventurous mug',
      description,
      price,
      categoryId: storedCategories[getIndex].id as string,
      image:
        'https://res.cloudinary.com/djx5h4cjt/image/upload/v1686292729/twitpics/mug-club/adventurous-mug.jpg',
      updatedAt: Date.now(),
      createdAt: Date.now(),
    },
    {
      id: uuidv4(),
      name: 'Real-estate mug',
      description,
      price,
      categoryId: storedCategories[getIndex].id as string,
      image:
        'https://res.cloudinary.com/djx5h4cjt/image/upload/v1686292792/twitpics/mug-club/real-estate-mug.jpg',
      updatedAt: Date.now(),
      createdAt: Date.now(),
    },
    {
      id: uuidv4(),
      name: 'Morning-mug mug',
      description,
      price,
      categoryId: storedCategories[getIndex].id as string,
      image:
        'https://res.cloudinary.com/djx5h4cjt/image/upload/v1686292987/twitpics/mug-club/morning-mug.jpg',
      updatedAt: Date.now(),
      createdAt: Date.now(),
    },
  ];

  const storedMugs: any = await db
    .insert(mugs)
    .values(mugsData)
    .returning()
    .all();

  console.log(`Inserted ${storedMugs.length} mugs!`);

  process.exit(0);
}

seed();
