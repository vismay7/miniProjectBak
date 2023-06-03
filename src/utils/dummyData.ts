import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const seedData = async () => {
  try {
    // Dummy User data
    await prisma.user.createMany({
      data: [
        {
          fullname: "Peter Parker",
          email: "Peter@example.com",
          password: "password123",
          is_verfied: true,
          is_admin: true,
        },
        {
          fullname: "John Doe",
          email: "john@example.com",
          password: "password123",
          is_verfied: false,
          is_admin: false,
        },
        {
          fullname: "Jane Wissle",
          email: "jane@example.com",
          password: "password123",
          is_verfied: true,
          is_admin: false,
        },
      ],
    });

    // Dummy Category data
    await prisma.category.createMany({
      data: [
        {
          name: "Programming",
        },
        {
          name: "JavaScript",
          parent_category_id: 1,
        },
        {
          name: "Python",
          parent_category_id: 1,
        },
        {
          name: "GoLang",
          parent_category_id: 1,
        },
      ],
    });

    // Dummy Course data
    await prisma.course.createMany({
      data: [
        {
          title: "Introduction to JavaScript",
          description: "Learn the basics of JavaScript programming language.",
          price: 29.99,
          is_free: false,
        },
        {
          title: "Introduction to Python",
          description: "Learn the basics of JavaScript programming language.",
          price: 29.99,
          is_free: false,
        },
        {
          title: "Introduction to GoLang",
          description: "Learn the basics of JavaScript programming language.",
          price: 0.0,
          is_free: true,
        },
      ],
    });

    // Dummy Cart data
    await prisma.cart.createMany({
      data: [
        {
          userId: 2,
          courseId: 1,
        },
        {
          userId: 2,
          courseId: 2,
        },
        {
          userId: 3,
          courseId: 1,
        },
        {
          userId: 3,
          courseId: 2,
        },
      ],
    });

    // Dummy Enrollment data
    await prisma.enrollment.createMany({
      data: [
        {
          enrolled_at: new Date(),
          progress: 50,
          userId: 2,
          courseId: 1,
        },
        {
          enrolled_at: new Date(),
          progress: 20,
          userId: 2,
          courseId: 2,
        },
        {
          enrolled_at: new Date(),
          progress: 80,
          userId: 2,
          courseId: 3,
        },
      ],
    });

    // Dummy Payment data
    await prisma.payment.createMany({
      data: [
        {
          amount: 29.99,
          paid_at: new Date(),
          userId: 2,
          courseId: 1,
        },
      ],
    });

    // Dummy OTP data
    await prisma.otp.createMany({
      data: [
        {
          otp: 123456,
          expires_at: new Date(),
          userId: 2,
        },
      ],
    });

    // Dummy Topic data
    await prisma.topic.createMany({
      data: [
        {
          title: "Variables and Data Types",
          courseId: 1,
        },
        {
          title: "var data-type",
          parentId: 1,
        },
        {
          title: "let data-type",
          parentId: 1,
        },
        {
          title: "const data-type",
          parentId: 1,
        },
      ],
    });

    // Dummy File data
    await prisma.file.createMany({
      data: [
        {
          filename: "var.pdf",
          filepath: "/path/to/example.pdf",
          topicId: 2,
        },
        {
          filename: "let.pdf",
          filepath: "/path/to/example.pdf",
          topicId: 3,
        },
        {
          filename: "const.pdf",
          filepath: "/path/to/example.pdf",
          topicId: 4,
        },
      ],
    });

    // Dummy Orders data
    await prisma.orders.createMany({
      data: [
        {
          created_at: new Date(),
          userId: 2,
          courseId: 1,
        },
        {
          created_at: new Date(),
          userId: 2,
          courseId: 2,
        },
      ],
    });

    // Dummy OrderItem data
    await prisma.orderItem.createMany({
      data: [
        {
          quantity: 1,
          courseId: 1,
          ordersId: 1, // Set the appropriate Orders ID
        },
        {
          quantity: 1,
          courseId: 2,
          ordersId: 2, // Set the appropriate Orders ID
        },
        // Add more order item data objects here if needed
      ],
    });

    // Dummy CourseThumbnail data
    await prisma.courseThumbnail.createMany({
      data: [
        {
          filename: "javascript_thumbnail.jpg",
          filepath: "/path/to/javascript_thumbnail.jpg",
          courseId: 1,
        },
        {
          filename: "python_thumbnail.jpg",
          filepath: "/path/to/python_thumbnail.jpg",
          courseId: 2,
        },
        // Add more course thumbnail data objects here if needed
      ],
    });
    console.log("Dummy data added successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
};
export { seedData };
