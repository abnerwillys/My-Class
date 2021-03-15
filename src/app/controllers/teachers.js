const { transformExpertise, age, date, graduation, areTheFieldsFilled } = require('../../lib/useful')
const Teacher = require('../models/Teacher')

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
        or: 'expertise',
        orderBy: 'total_students',
        ascOrDesc: 'DESC'
      }

      const teachers = await Teacher.paginate(params)
      teachers.forEach(teacher => {
        teacher.expertise = transformExpertise(teacher)
      })

      const pagination = {
        totalPages: Math.ceil(teachers[0].total / limit),
        page
      }

      return res.render("teachers/index", { teachers, pagination, filter })
      
    } catch (error) {
      const messageErrorFilter = "Not found any register!"
      console.log(error)
      return res.render("teachers/index", { messageErrorFilter, error: `ATENÇÃO: ${error}` })
    }
  },
  create(req, res) {
    return res.render("teachers/create")
  },
  async post(req, res) {
    try {
      const checkFields = areTheFieldsFilled(req.body)
      if (checkFields) return res.render('teachers/create', { 
        teacher: req.body,
        error: checkFields.message
      })
      
      const teacherId = await Teacher.create({
        ...req.body,
        birth: date(req.body.birth).iso
      })

      return res.render("teachers/show", { 
        teacher: { avatar_url: req.body.avatar_url },
        action_feedback: true,
        pathRedirect: `/teachers/${teacherId}`
      })
    } catch (error) {
      console.log(error)
      return res.render('teachers/create', { 
        teacher: req.body,
        error: `ATENÇÃO: ${error}`
      })
    }
  },
  async show(req, res) {
    try {
      const { id } = req.params

      const teacher = await Teacher.findById(id)
      if(!teacher) return res.send('Teacher not found!')

      teacher.age = age(teacher.birth)
      teacher.expertise  = transformExpertise(teacher)
      teacher.graduation = graduation(teacher.graduation)
      teacher.created_at = date(teacher.created_at).format

      return res.render('teachers/show', {teacher})
    } catch (error) {
      console.log(error)
    }
  },
  async edit(req, res) {
    try {
      const { id } = req.params

      const teacher = await Teacher.findById(id)
      if(!teacher) return res.send('Teacher not found!')
      teacher.birth = date(teacher.birth).iso

      return res.render(`teachers/edit`, {teacher})
    } catch (error) {
      console.error(error)
    }
  },
  async put(req, res) {
    try {
      const { id } = req.body

      const checkFields = areTheFieldsFilled(req.body)
      if (checkFields) return res.render('teachers/edit', { 
        teacher: req.body,
        error: checkFields.message
      })

      await Teacher.update(id, {
        ...req.body,
        birth: date(req.body.birth).iso
      })

      return res.render("teachers/show", { 
        teacher: { avatar_url: req.body.avatar_url },
        action_feedback: true,
        pathRedirect: `/teachers/${id}`
      })
    } catch (error) {
      console.error(error)
      return res.render('teachers/edit', { 
        teacher: req.body,
        error: `ATENÇÃO: ${error}`
      })
    }
  },
  async delete(req, res) {
    try {
      await Teacher.delete(req.body.id)

      return res.render("teachers/show", { 
        teacher: { avatar_url: req.body.avatar_url },
        action_feedback: true,
        pathRedirect: `/teachers`
      })
    } catch (error) {
      console.error(error)
    }
  },
}