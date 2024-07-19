
// This is the script to populate 
// the PostgresSQL database with fake dummy data

import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export function createRandomUser() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    company: faker.company.name(),
    zipCode: faker.location.zipCode(),
    country: faker.location.country(),
    state: faker.location.state(),
    city: faker.location.city(),
    birthdate: faker.date.birthdate(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.future(),
  };
}

export const seeder = faker.helpers.multiple(createRandomUser, {
  count: 20,
});

async function main() {
  for (let data of seeder) {
    await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        profile: {
          create: {
            avatar: data.avatar,
            company: data.company,
            zipCode: data.zipCode,
            country: data.country,
            state: data.state,
            city: data.city,
            birthDate: data.birthdate,
          }
        },
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

