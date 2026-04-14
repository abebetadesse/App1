import express from 'express';
const router = express.Router();

// Mock student/course data
let students = [
  { id: 1, name: 'Alice Johnson', email: 'alice@student.edu', grade: 'A', enrolledCourses: [101, 102] },
  { id: 2, name: 'Bob Smith', email: 'bob@student.edu', grade: 'B', enrolledCourses: [101] },
  { id: 3, name: 'Charlie Brown', email: 'charlie@student.edu', grade: 'A', enrolledCourses: [102, 103] },
];

let courses = [
  { id: 101, name: 'Mathematics 101', instructor: 'Dr. Smith', schedule: 'Mon/Wed 10:00 AM' },
  { id: 102, name: 'Computer Science 101', instructor: 'Prof. Johnson', schedule: 'Tue/Thu 2:00 PM' },
  { id: 103, name: 'Physics 101', instructor: 'Dr. Williams', schedule: 'Mon/Fri 1:00 PM' },
];

let assignments = [
  { id: 1, courseId: 101, title: 'Algebra Assignment', dueDate: '2024-02-01' },
  { id: 2, courseId: 102, title: 'Programming Project', dueDate: '2024-02-15' },
  { id: 3, courseId: 103, title: 'Physics Lab Report', dueDate: '2024-01-30' },
];

let grades = [
  { studentId: 1, courseId: 101, assignmentId: 1, score: 95, grade: 'A' },
  { studentId: 1, courseId: 102, assignmentId: 2, score: 88, grade: 'B+' },
  { studentId: 2, courseId: 101, assignmentId: 1, score: 78, grade: 'C+' },
];

// GET /api/student
router.get('/', (req, res) => {
  const { search, grade, courseId } = req.query;
  
  let filteredStudents = [...students];
  
  if (search) {
    filteredStudents = filteredStudents.filter(student =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (grade) {
    filteredStudents = filteredStudents.filter(student => student.grade === grade);
  }
  
  if (courseId) {
    filteredStudents = filteredStudents.filter(student => 
      student.enrolledCourses.includes(parseInt(courseId))
    );
  }
  
  res.json({
    success: true,
    message: 'Students retrieved',
    data: {
      students: filteredStudents.map(student => ({
        ...student,
        courses: courses.filter(course => student.enrolledCourses.includes(course.id)),
      })),
      total: filteredStudents.length,
      grades: [...new Set(students.map(s => s.grade))],
    },
  });
});

// GET /api/student/:id
router.get('/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  
  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found',
    });
  }
  
  const studentCourses = courses.filter(course => student.enrolledCourses.includes(course.id));
  const studentAssignments = assignments.filter(assignment =>
    student.enrolledCourses.includes(assignment.courseId)
  );
  const studentGrades = grades.filter(grade => grade.studentId === student.id);
  
  res.json({
    success: true,
    message: 'Student details retrieved',
    data: {
      ...student,
      courses: studentCourses,
      assignments: studentAssignments,
      grades: studentGrades,
      performance: {
        averageScore: studentGrades.length > 0
          ? studentGrades.reduce((sum, g) => sum + g.score, 0) / studentGrades.length
          : 0,
        completedAssignments: studentGrades.length,
        totalAssignments: studentAssignments.length,
        completionRate: studentAssignments.length > 0
          ? (studentGrades.length / studentAssignments.length) * 100
          : 0,
      },
    },
  });
});

// POST /api/student
router.post('/', (req, res) => {
  const { name, email, enrolledCourses = [] } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required',
    });
  }
  
  // Validate courses exist
  const invalidCourses = enrolledCourses.filter(
    courseId => !courses.some(course => course.id === courseId)
  );
  
  if (invalidCourses.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Invalid course IDs: ${invalidCourses.join(', ')}`,
    });
  }
  
  const newStudent = {
    id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
    name,
    email,
    grade: 'N/A', // Initial grade
    enrolledCourses,
    enrolledAt: new Date().toISOString().split('T')[0],
  };
  
  students.push(newStudent);
  
  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data: newStudent,
  });
});

// PUT /api/student/:id
router.put('/:id', (req, res) => {
  const studentIndex = students.findIndex(s => s.id === parseInt(req.params.id));
  
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Student not found',
    });
  }
  
  // Validate courses if provided
  if (req.body.enrolledCourses) {
    const invalidCourses = req.body.enrolledCourses.filter(
      courseId => !courses.some(course => course.id === courseId)
    );
    
    if (invalidCourses.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid course IDs: ${invalidCourses.join(', ')}`,
      });
    }
  }
  
  students[studentIndex] = {
    ...students[studentIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  
  res.json({
    success: true,
    message: 'Student updated successfully',
    data: students[studentIndex],
  });
});

// DELETE /api/student/:id
router.delete('/:id', (req, res) => {
  const studentIndex = students.findIndex(s => s.id === parseInt(req.params.id));
  
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Student not found',
    });
  }
  
  const deletedStudent = students.splice(studentIndex, 1)[0];
  
  // Remove student's grades
  grades = grades.filter(grade => grade.studentId !== deletedStudent.id);
  
  res.json({
    success: true,
    message: 'Student deleted successfully',
    data: deletedStudent,
  });
});

// GET /api/student/:id/grades
router.get('/:id/grades', (req, res) => {
  const studentId = parseInt(req.params.id);
  const student = students.find(s => s.id === studentId);
  
  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found',
    });
  }
  
  const studentGrades = grades.filter(grade => grade.studentId === studentId);
  
  const gradeSummary = student.enrolledCourses.map(courseId => {
    const course = courses.find(c => c.id === courseId);
    const courseGrades = studentGrades.filter(g => g.courseId === courseId);
    
    return {
      courseId,
      courseName: course?.name || 'Unknown',
      grades: courseGrades,
      average: courseGrades.length > 0
        ? courseGrades.reduce((sum, g) => sum + g.score, 0) / courseGrades.length
        : 0,
    };
  });
  
  res.json({
    success: true,
    message: 'Student grades retrieved',
    data: {
      studentId,
      studentName: student.name,
      gradeSummary,
      overallAverage: gradeSummary.length > 0
        ? gradeSummary.reduce((sum, course) => sum + course.average, 0) / gradeSummary.length
        : 0,
    },
  });
});

// POST /api/student/:id/grades
router.post('/:id/grades', (req, res) => {
  const studentId = parseInt(req.params.id);
  const { courseId, assignmentId, score } = req.body;
  
  if (!courseId || !assignmentId || score === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Course ID, assignment ID, and score are required',
    });
  }
  
  const student = students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found',
    });
  }
  
  // Verify student is enrolled in the course
  if (!student.enrolledCourses.includes(courseId)) {
    return res.status(400).json({
      success: false,
      message: 'Student is not enrolled in this course',
    });
  }
  
  // Calculate grade letter
  const calculateGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };
  
  const gradeLetter = calculateGrade(score);
  
  // Check if grade already exists for this assignment
  const existingGradeIndex = grades.findIndex(
    grade => grade.studentId === studentId && 
             grade.courseId === courseId && 
             grade.assignmentId === assignmentId
  );
  
  if (existingGradeIndex !== -1) {
    // Update existing grade
    grades[existingGradeIndex] = {
      ...grades[existingGradeIndex],
      score,
      grade: gradeLetter,
      updatedAt: new Date().toISOString(),
    };
    
    res.json({
      success: true,
      message: 'Grade updated',
      data: grades[existingGradeIndex],
    });
  } else {
    // Create new grade
    const newGrade = {
      studentId,
      courseId,
      assignmentId,
      score,
      grade: gradeLetter,
      recordedAt: new Date().toISOString(),
    };
    
    grades.push(newGrade);
    
    res.status(201).json({
      success: true,
      message: 'Grade recorded',
      data: newGrade,
    });
  }
});

// GET /api/student/courses/available
router.get('/courses/available', (req, res) => {
  res.json({
    success: true,
    message: 'Available courses',
    data: {
      courses,
      total: courses.length,
      stats: {
        byStudent: students.map(student => ({
          studentId: student.id,
          studentName: student.name,
          enrolledCount: student.enrolledCourses.length,
        })),
      },
    },
  });
});

export default router;