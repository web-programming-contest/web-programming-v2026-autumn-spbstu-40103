export class Course {
  constructor(courseId, title, students = []) {
    this.courseId = courseId;
    this.title = title;
    this.students = students;
  }

  addStudent(student) {
    if (!student.name || student.name.trim() === '') {
      throw new Error('Имя студента не может быть пустым.');
    }

    if (this.students.some((s) => s.id === student.id)) {
      throw new Error(
        `Студент с ID ${student.id} уже записан на курс «${this.title}».`,
      );
    }
    this.students.push({id: student.id, name: student.name});
  }

  removeStudent(studentId) {
    const index = this.students.findIndex((s) => s.id === studentId);
    if (index === -1) {
      throw new Error(
        `Студента с ID ${studentId} нет на курсе «${this.title}».`,
      );
    }
    this.students.splice(index, 1);
  }

  get studentCount() {
    return this.students.length;
  }
}

export function groupCoursesByStudentCount(courses) {
  const result = {};
  for (const course of courses) {
    if (!result[course.studentCount]) {
      result[course.studentCount] = [];
    }
    result[course.studentCount].push(course.title);
  }
  return result;
}

export function getUniqueStudents(courses) {
  const unique = new Map();
  for (const course of courses) {
    for (const student of course.students) {
      if (!unique.has(student.id)) {
        unique.set(student.id, student);
      }
    }
  }
  return [...unique.values()];
}

export function getCoursesByStudentId(courses, studentId) {
  return courses.filter((course) =>
    course.students.some((s) => s.id === studentId),
  );
}

export function groupStudentsByCourse(courses) {
  const result = {};
  for (const course of courses) {
    result[course.title] = [...course.students];
  }
  return result;
}

export function getCoursesWithMaxStudents(courses) {
  if (courses.length === 0) {
    return [];
  }
  const max = Math.max(...courses.map((c) => c.studentCount));
  return courses.filter((c) => c.studentCount === max);
}

export function createSampleCourses() {
  return [
    new Course(1, 'JavaScript', [
      {id: 1, name: 'd1mene'},
      {id: 2, name: 'Пал Лаич'},
      {id: 3, name: 'Егор Е.'},
    ]),
    new Course(2, 'HTML и CSS', [
      {id: 4, name: 'Ронни Коулман'},
      {id: 5, name: 'Гордей'},
    ]),
    new Course(3, 'Базы данных', [
      {id: 6, name: 'Иван'},
      {id: 7, name: 'Мария'},
      {id: 8, name: 'Елена'},
    ]),
  ];
}
