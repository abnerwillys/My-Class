const faker = require('faker')

const Student = require('../app/models/Student')
const Teacher = require('../app/models/Teacher')
const { date } = require('../lib/useful')

let teachersIds   = []
let totalTeachers = 10
let totalStudents = 5

const possiblesGrades    = ['5g','6g','7g','8g','Fr','Sp','Jr','Sr']
const possibleGraduation = ['Hs','Cl','Un','Ma','PHD']
const possibleClass_type = ['IP', 'EL']
const possibleExpertise  = ['Matemática', 'Inglês', 'Programação', 'Física', 'Química', 'Música', 'Geografia']

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateFieldsTeacher() {
  const birth      =  date(randomDate(new Date(1990, 0, 1), new Date(2012, 0, 1))).iso
  const graduation =  possibleGraduation[Math.floor(Math.random() * possibleGraduation.length)]
  const class_type =  possibleClass_type[Math.floor(Math.random() * possibleClass_type.length)]
  const expertise  =  []

  possibleExpertise.forEach(item => {
    const shouldInsert = Math.round(Math.random()) === 0 ? false : true

    if (shouldInsert) expertise.push(item)
  })

  return { birth, graduation, class_type, expertise: expertise.join(', ')}
}

function generateFieldsStudent() {
  const birth        =  date(randomDate(new Date(1990, 0, 1), new Date(2012, 0, 1))).iso
  const grade_school =  possiblesGrades[Math.floor(Math.random() * possiblesGrades.length)]
  const course_load  =  Math.ceil(Math.random() * 20)
  const teacher_id   =  teachersIds[Math.floor(Math.random() * totalTeachers)]

  return { birth, grade_school, course_load, teacher_id }
}


async function createTeachers() {
  const teachers = []

  while (teachers.length < totalTeachers) {
    const { birth, class_type, graduation, expertise } = generateFieldsTeacher()

    teachers.push({
      avatar_url: 'https://source.unsplash.com/collection/8874679/500x500',
      name: faker.name.firstName(),
      birth,
      graduation,
      class_type,
      expertise,
    })
  }

  const teachersPromise = teachers.map(teacher => Teacher.create(teacher))

  teachersIds = await Promise.all(teachersPromise)
}

async function createStudents() {
  let students = []

  while(students.length < totalStudents) {
    const { birth, grade_school, course_load, teacher_id} = generateFieldsStudent()

    students.push({
      avatar_url: 'https://source.unsplash.com/collection/8874679/500x500',
      name: faker.name.firstName(),
      email: faker.internet.email(),
      birth,
      grade_school,
      course_load,
      teacher_id,
    })
  }

  const studentsPromise = students.map(student => Student.create(student))

  await Promise.all(studentsPromise)
}

async function init() {
  await createTeachers()
  await createStudents()
}

init()