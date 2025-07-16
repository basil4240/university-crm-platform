import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { genSalt, hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const users = [];

    const salt = await genSalt();
    const hashedPassword = await hash('123456789', salt);

    // Generate 30 users with role LECTURER or ADMIN
    for (let i = 0; i < 30; i++) {
        const role = i < 20 ? Role.LECTURER : Role.ADMIN; // 20 lecturers, 10 admins
        users.push({
            email: faker.internet.email().toLowerCase(),
            password: hashedPassword,
            role,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        });
    }

    // Generate 70 users with role STUDENT
    for (let i = 0; i < 70; i++) {
        users.push({
            email: faker.internet.email().toLowerCase(),
            password: hashedPassword,
            role: Role.STUDENT,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        });
    }

    await prisma.user.createMany({
        data: users,
        skipDuplicates: true,
    });

    console.log('Seeded 100 users');

    const lecturers = await prisma.user.findMany({
        where: { role: Role.LECTURER },
        select: { id: true },
    });

    const courses = [];
    for (let i = 0; i < 30; i++) {
        const lecturer = lecturers[i % lecturers.length];
        courses.push({
            title: faker.lorem.words({ min: 2, max: 5 }),
            credits: faker.number.int({ min: 2, max: 6 }),
            lecturerId: lecturer.id,
            syllabus: faker.lorem.paragraphs({ min: 1, max: 3 }),
            description: faker.lorem.sentences({ min: 2, max: 4 }),
            semester: faker.helpers.arrayElement(['First', 'Second']),
            year: faker.number.int({ min: 2022, max: 2024 }),
            isActive: faker.datatype.boolean(),
        });
    }

    await prisma.course.createMany({
        data: courses,
        skipDuplicates: true,
    });

    console.log('Seeded 30 courses');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });