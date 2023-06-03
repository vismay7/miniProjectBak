import { Request, Response } from "express";
import prisma from "../config/dbConfig";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// http://localhost/
// Get all courses
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        Category: {
          include: { parent_category: true },
        },
        Topics: {
          include: { subtopics: true },
        },
      },
    });
    res.status(200).json(courses);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// http://localhost/course/1
// Get a course by ID
export const getCourse = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = await prisma.course.findFirst({ where: { id: courseId }, include: { Category: true } });

    if (!course) {
      res.status(404).json({ error: "Course not found" });
    } else {
      res.status(200).json(course);
    }
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { course_title, course_description, course_price, course_is_free, category_name, subcategory_name, topics } = req.body;

    const category = await findOrCreateCategory(category_name);
    const subcategory = await findOrCreateSubcategory(subcategory_name, category.id);

    const course = await prisma.course.create({
      data: {
        title: course_title,
        description: course_description,
        price: course_price,
        is_free: course_is_free,
        categoryId: subcategory.id,
      },
    });

    res.status(200).json({ message: "Course created successfully!", course: course });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);

    // Extract updated course details from request body
    const { title, description, price, is_free, category_name, subcategory_name } = req.body;

    // Find the course by courseId
    const course = await prisma.course.findUnique({ where: { id: courseId } });

    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    const category = await findOrCreateCategory(category_name);
    const subcategory = await findOrCreateSubcategory(subcategory_name, category.id);
    const updateCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title: title || course.title,
        description: description || course.description,
        price: price || course.price,
        is_free: is_free || course.is_free,
        categoryId: subcategory.id || course.categoryId,
      },
    });

    res.status(200).json({ message: "Course updated successfully", course: updateCourse });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);

    await prisma.course.delete({ where: { id: courseId } });

    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const fileUpload = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const courseId = parseInt(req.body);
    const s3 = new S3Client({ region: "south-ap-1" });
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });
    if (!course) {
      res.status(404).json({ message: "Course Not Found" });
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const fileKey = `videos/${crypto.randomUUID()}_${file.originalname}`;

        const uploadParams = {
          Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
          Key: fileKey,
          Body: file.buffer,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        // Generate the S3 object URL
        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.your-aws-region.amazonaws.com/${fileKey}`;

        // Save the uploaded file information in the database
        const uploadedFile = await prisma.file.create({
          data: {
            filename: fileKey,
            filepath: fileUrl,
          },
        });

        return uploadedFile;
      })
    );
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};

const findOrCreateCategory = async (category_name: string) => {
  let category = await prisma.category.findFirst({ where: { name: category_name } });

  if (!category) {
    category = await prisma.category.create({ data: { name: category_name } });
  }

  return category;
};

const findOrCreateSubcategory = async (subcategory_name: string, parent_category_id: number) => {
  let subcategory = await prisma.category.findFirst({ where: { name: subcategory_name } });

  if (!subcategory) {
    subcategory = await prisma.category.create({ data: { name: subcategory_name, parent_category_id } });
  }

  return subcategory;
};
