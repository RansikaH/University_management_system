-- Sample users are now created by DataInitializer component with proper password encoding

-- Sample data for testing
INSERT INTO courses (title, code, description, credits, instructor, max_students) VALUES
('Introduction to Computer Science', 'CS101', 'Basic concepts of computer science and programming', 3, 'Dr. John Smith', 30);

INSERT INTO courses (title, code, description, credits, instructor, max_students) VALUES
('Data Structures and Algorithms', 'CS201', 'Advanced data structures and algorithm design', 4, 'Dr. Jane Doe', 25);

INSERT INTO courses (title, code, description, credits, instructor, max_students) VALUES
('Database Management Systems', 'CS301', 'Design and implementation of database systems', 3, 'Prof. Mike Johnson', 20);

INSERT INTO courses (title, code, description, credits, instructor, max_students) VALUES
('Web Development', 'CS350', 'Modern web development technologies', 3, 'Dr. Sarah Wilson', 35);

INSERT INTO courses (title, code, description, credits, instructor, max_students) VALUES
('Software Engineering', 'CS401', 'Software development lifecycle and methodologies', 4, 'Prof. David Brown', 25);

INSERT INTO students (student_id, first_name, last_name, email, phone, date_of_birth) VALUES
('S001', 'Alice', 'Johnson', 'alice.johnson@university.edu', '+1234567890', '2001-05-15');

INSERT INTO students (student_id, first_name, last_name, email, phone, date_of_birth) VALUES
('S002', 'Bob', 'Smith', 'bob.smith@university.edu', '+1234567891', '2000-08-22');

INSERT INTO students (student_id, first_name, last_name, email, phone, date_of_birth) VALUES
('S003', 'Carol', 'Davis', 'carol.davis@university.edu', '+1234567892', '2001-12-10');

INSERT INTO students (student_id, first_name, last_name, email, phone, date_of_birth) VALUES
('S004', 'David', 'Wilson', 'david.wilson@university.edu', '+1234567893', '2000-03-18');

INSERT INTO students (student_id, first_name, last_name, email, phone, date_of_birth) VALUES
('S005', 'Emma', 'Brown', 'emma.brown@university.edu', '+1234567894', '2001-07-25');

-- Sample registrations
INSERT INTO registrations (student_id, course_id, status, registration_date) VALUES
(1, 1, 'ENROLLED', NOW());

INSERT INTO registrations (student_id, course_id, status, registration_date) VALUES
(1, 2, 'COMPLETED', NOW());

INSERT INTO registrations (student_id, course_id, status, registration_date) VALUES
(2, 1, 'ENROLLED', NOW());

INSERT INTO registrations (student_id, course_id, status, registration_date) VALUES
(3, 3, 'COMPLETED', NOW());

INSERT INTO registrations (student_id, course_id, status, registration_date) VALUES
(4, 4, 'ENROLLED', NOW());

-- Sample results/grades
INSERT INTO results (student_id, course_id, score, grade, exam_type, exam_date, remarks) VALUES
(1, 2, 92.5, 'A_PLUS', 'FINAL', NOW(), 'Excellent performance in algorithms');

INSERT INTO results (student_id, course_id, score, grade, exam_type, exam_date, remarks) VALUES
(1, 1, 88.0, 'A_PLUS', 'FINAL', NOW(), 'Good understanding of CS fundamentals');

INSERT INTO results (student_id, course_id, score, grade, exam_type, exam_date, remarks) VALUES
(2, 1, 75.5, 'A', 'MIDTERM', NOW(), 'Needs improvement in programming concepts');

INSERT INTO results (student_id, course_id, score, grade, exam_type, exam_date, remarks) VALUES
(3, 3, 95.0, 'A_PLUS', 'FINAL', NOW(), 'Outstanding database design project');

INSERT INTO results (student_id, course_id, score, grade, exam_type, exam_date, remarks) VALUES
(4, 4, 82.0, 'A', 'PROJECT', NOW(), 'Well-designed web application');

INSERT INTO results (student_id, course_id, score, grade, exam_type, exam_date, remarks) VALUES
(1, 1, 85.0, 'A_PLUS', 'QUIZ', NOW(), 'Good grasp of basic concepts');

INSERT INTO results (student_id, course_id, score, grade, exam_type, exam_date, remarks) VALUES
(2, 1, 78.0, 'A', 'ASSIGNMENT', NOW(), 'Satisfactory coding assignment');
