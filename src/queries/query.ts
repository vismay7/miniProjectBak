//-- get All courses
export const getAllCourse = () =>
  `SELECT
    c.id AS course_id,
    c.title AS course_title,
    c.description AS course_description,
    c.price AS course_price,
    c.is_free AS course_is_free,
    cat.name AS category_name,
    subcat.name AS subcategory_name,
    JSON_ARRAYAGG (
        JSON_OBJECT (
            'topic_id',
            t.id,
            'topic_title',
            t.title,
            'subtopics', (
                SELECT
                    JSON_ARRAYAGG (
                        JSON_OBJECT (
                            'subtopic_id',
                            st.id,
                            'subtopic_title',
                            st.title
                        )
                    )
                FROM
                    Subtopic st
                WHERE
                    st.topic_id = t.id
            )
        )
    ) AS topics,
    JSON_ARRAYAGG (
        JSON_OBJECT (
            'subtopic_id',
            f.subtopic_id,
            'file_id',
            f.id,
            'file_name',
            f.filename,
            'file_path',
            f.filepath
        )
    ) AS files
FROM Course c
    JOIN Category cat ON c.category_id = cat.id
    JOIN Subcategory subcat ON c.subcategory_id = subcat.id
    LEFT JOIN Topic t ON c.id = t.course_id
    LEFT JOIN File f ON t.id = f.subtopic_id
GROUP BY c.id;`;
//-- create course
export const createCourseQuery = (title: string, description: string, price: string, is_free: boolean, category_id: number, subcategory_id: number) => `
      INSERT INTO Course (title, description, price, is_free, category_id, subcategory_id)
      VALUES ('${title}', '${description}', ${price}, ${is_free}, ${category_id}, ${subcategory_id});
    `;

//-- update course
export const updateCourseQuery = (title: string, description: string, price: string, is_free: boolean, topicTitle: string, subTopicTitle: string, courseId: number) =>
  `
UPDATE Course AS c
LEFT JOIN Topic AS t ON t.course_id = c.id
LEFT JOIN Subtopic AS st ON st.topic_id = t.id
SET
    c.title = '${title}', 
    c.description = '${description}',
    c.price = ${price},
    c.is_free = ${is_free},
    t.title = '${topicTitle}', 
    st.title = '${subTopicTitle}'
WHERE
    c.id = ${courseId};

`;

//-- delete course
export const deleteCourseQuery = (courseId: number) => `DELETE FROM Course WHERE id = ${courseId}`;

//-- user enrolled course
export const getUserEnrolledCourse = `SELECT u.id AS user_id, u.fullname AS user_fullname, u.email AS user_email, JSON_ARRAYAGG ( JSON_OBJECT ( 'course_id', c.id, 'course_title', c.title, 'course_description', c.description, 'course_category', cat.name, 'course_subcategory', subcat.name, 'course_price', c.price, 'course_is_free', c.is_free, 'enrollment_progress', e.progress ) ) AS enrolled_courses FROM User u JOIN Enrollment e ON u.id = e.user_id JOIN Course c ON e.course_id = c.id JOIN Category cat ON c.category_id = cat.id JOIN Subcategory subcat ON c.subcategory_id = subcat.id WHERE u.id = 1 GROUP BY u.email;`;

//-- get all categories
export const getAllCategories = "SELECT  c.id AS category_id, c.name AS category_name, JSON_ARRAYAGG (JSON_OBJECT ('id', s.id, 'name', s.name)) AS subcategories FROM Category c LEFT JOIN Subcategory s ON c.id = s.category_id GROUP BY c.id, c.name;";

//-- user paymeny HISTORY
export const getUserPaymentHistroy = (userId: number) => `SELECT
  u.id AS user_id,
  u.fullname AS user_fullname,
  u.email AS user_email,
  JSON_ARRAYAGG (
    JSON_OBJECT (
      'payment_id',
      p.id,
      'course_id',
      c.id,
      'course_title',
      c.title,
      'payment_amount',
      p.amount,
      'payment_date',
      p.paid_at
    )
  ) AS payment_history
FROM
  User u
  JOIN Payment p ON u.id = p.user_id
  JOIN Course c ON p.course_id = c.id
WHERE
  u.id = ${userId}
GROUP BY
  u.email;`;

//-- get User cart
export const getUserCart = `SELECT u.id AS user_id, u.fullname AS user_fullname, u.email AS user_email, JSON_ARRAYAGG ( JSON_OBJECT ( 'cart_item_id', ci.id, 'course_id', c.id, 'course_title', c.title, 'course_description', c.description, 'course_category', cat.name, 'course_subcategory', subcat.name, 'course_price', c.price, 'course_is_free', c.is_free ) ) AS cart_items FROM User u JOIN CartItem ci ON u.id = ci.user_id JOIN Course c ON ci.course_id = c.id JOIN Category cat ON c.category_id = cat.id JOIN Subcategory subcat ON c.subcategory_id = subcat.id WHERE u.id = 1 GROUP BY u.email;`;

//-- delete a cart course according to USER
export const DeletUserCart = `DELETE FROM CartItem WHERE user_id = 1 AND course_id = 2;`;

//-- delete a enrolled course according to USER
export const removeEnrolledCourse = `DELETE FROM Enrollment WHERE user_id = 1 AND course_id = 1;`;

//-- get All Users
export const Users = `SELECT * FROM \`User\``;
//-- get All Users
export const User = (userId: number) => `SELECT * FROM \`User\` WHERE id=${userId}`;

//-- get Perticular course details
export const getCourseDetails = (courseId: number) => `
SELECT
    c.id AS course_id,
    c.title AS course_title,
    c.description AS course_description,
    c.price AS course_price,
    c.is_free AS course_is_free,
    cat.name AS category_name,
    subcat.name AS subcategory_name,
    JSON_ARRAYAGG (
        JSON_OBJECT (
            'topic_id',
            t.id,
            'topic_title',
            t.title,
            'subtopics',
            (
                SELECT
                    JSON_ARRAYAGG (
                        JSON_OBJECT ('subtopic_id', st.id, 'subtopic_title', st.title)
                    )
                FROM
                    Subtopic st
                WHERE
                    st.topic_id = t.id
            )
        )
    ) AS topics,
    JSON_ARRAYAGG (
        JSON_OBJECT (
            'file_id',
            f.id,
            'file_name',
            f.filename,
            'file_path',
            f.filepath
        )
    ) AS files
FROM
    Course c
    JOIN Category cat ON c.category_id = cat.id
    JOIN Subcategory subcat ON c.subcategory_id = subcat.id
    LEFT JOIN Topic t ON c.id = t.course_id
    LEFT JOIN File f ON t.id = f.topic_id
WHERE
    c.id = ${courseId}
GROUP BY
    c.id;`;

//-- get all payment
export const getAllPaymentQuery = `SELECT
  u.id as user_id,
  u.fullname as user_fullname,
  u.email as user_password,
  c.title as course_title,
  -- c.price as course_price,
  CASE
    WHEN c.price = 0 THEN "Free"
    ELSE c.price
  END as course_price,
  c.description as course_description,
  p.amount as course_payment,
  p.paid_at as payment_paid_at
from
  \`User\` u
  LEFT JOIN \`Payment\` p ON u.id = p.user_id
  LEFT JOIN \`Course\` c ON c.id = p.course_id;`;

//-- get all orders
export const AllOrder = `SELECT o.id,u.fullname,u.email,JSON_ARRAYAGG(JSON_OBJECT("course_id",c.id,"course_title",c.title,"course_description",c.description)) as course_details FROM coursera.\`Orders\` o LEFT JOIN \`OrderItem\` oi ON o.id=oi.order_id LEFT JOIN \`User\` u ON u.id=o.user_id JOIN \`Course\` c ON c.id=oi.course_id GROUP BY o.id`;

export const UserOrder = (userId: number) => `SELECT o.id,u.fullname,u.email,JSON_ARRAYAGG(JSON_OBJECT("course_id",c.id,"course_title",c.title,"course_description",c.description)) as course_details FROM coursera.\`Orders\` o LEFT JOIN \`OrderItem\` oi ON o.id=oi.order_id LEFT JOIN \`User\` u ON u.id=o.user_id JOIN \`Course\` c ON c.id=oi.course_id WHERE u.id=${userId} GROUP BY o.id`;

export const deleteUserOrder = (orderId: number) => `DELETE from Orders o JOIN OrderItem oi ON o.id=oi.order_id WHERE o.id = ${orderId}`;

export const createPaymentQuery = (userId: number, courseId: number) => `INSERT INTO Payment (user_id,course_id) VALUE (${userId},${courseId})`;
