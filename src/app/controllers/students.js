const { date, grade, areTheFieldsFilled } = require('../../lib/useful')
const Student = require('../models/Student')

module.exports = {
  async index(req, res) {
    try {
      let { filter, page, limit } = req.query

      page  = page  || 1
      limit = limit || 5
      let offset = limit * (page - 1)

      const params = {
        filter,
        limit,
        offset,
        where: 'name',
        or: 'email',
        orderBy: 'name',
        ascOrDesc: 'ASC'
      }

      const students = await Student.paginate(params)
      students.forEach(student => {
        student.grade_school = grade(student.grade_school)
      })

      const pagination = {
        totalPages: Math.ceil(students[0].total / limit),
        page
      }

      return res.render("students/index", { students, pagination, filter })

    } catch (error) {
      const messageErrorFilter = "Not found any register!"
      console.log(error)
      return res.render("students/index", { messageErrorFilter, error: `ATENÇÃO: ${error}` })
    }
  },
  async create(req, res) {
    try {
      const teacherOptions = await Student.teacherSelectOptions()

      return res.render("students/create", { teacherOptions })
    } catch (error) {
      console.log(error)
    }
  },
  async post(req, res) {
    try {
      const checkFields = areTheFieldsFilled(req.body)
      if (checkFields) {
        const teacherOptions = await Student.teacherSelectOptions()
        return res.render('students/create', { 
          teacherOptions,
          student: req.body,
          error: checkFields.message
        })
      }
    
      const studentId = await Student.create({
        ...req.body,
        birth: date(req.body.birth).iso
      })

      return res.render("students/show", { 
        student: { avatar_url: req.body.avatar_url },
        action_feedback: true,
        pathRedirect: `/students/${studentId}`
      })
    } catch (error) {
      console.error(error)
      const teacherOptions = await Student.teacherSelectOptions()
      return res.render('students/create', { 
        teacherOptions,
        student: req.body,
        error: `ATENÇÃO: ${error}`
      })
    }
  },
  async show(req, res) {
    try {
      const { id } = req.params

      const student = await Student.find(id)
      if(!student) return res.send('Student not found!')

      student.birthday = date(student.birth).birthday
      student.grade_school = grade(student.grade_school)

      return res.render('students/show', {student})
    } catch (error) {
      console.error(error)
    }
  },
  async edit(req, res) {
    try {
      const { id } = req.params

      const student = await Student.find(id)
      if(!student) return res.send('Student not found!')
      student.birth = date(student.birth).iso

      const teacherOptions = await Student.teacherSelectOptions()

      return res.render("students/edit", {student, teacherOptions })
    } catch (error) {
      console.error(error)
    }
  },
  async put(req, res) {
    try {
      const { id } = req.body

      const checkFields = areTheFieldsFilled(req.body)
      if (checkFields) {
        const teacherOptions = await Student.teacherSelectOptions()
        return res.render('students/edit', { 
          teacherOptions,
          student: req.body,
          error: checkFields.message
        })
      }

      await Student.update(id, {
        ...req.body,
        birth: date(req.body.birth).iso
      })

      return res.render("students/show", { 
        student: { avatar_url: req.body.avatar_url },
        action_feedback: true,
        pathRedirect: `/students/${id}`
      })
    } catch (error) {
      console.error(error)
      const teacherOptions = await Student.teacherSelectOptions()
      return res.render('students/edit', { 
        teacherOptions,
        student: req.body,
        error: `ATENÇÃO: ${error}`
      })
    }
  },
  async delete(req, res) {
    try {
      await Student.delete(req.body.id)

      return res.render("students/show", { 
        student: { avatar_url: req.body.avatar_url },
        action_feedback: true,
        pathRedirect: `/students`
      })
    } catch (error) {
      console.error(error)
    }
  },
}