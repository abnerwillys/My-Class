const db   = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'students' })

module.exports = {
  ...Base,
  async find(id) {
    try {
      const query = `
        SELECT students.*, teachers.name AS teacher_name
        FROM students
        LEFT JOIN teachers ON (students.teacher_id = teachers.id)
        WHERE students.id = ${id}
      `

      const results = await db.query(query)
      return results.rows[0]
    } catch (error) {
      if (error) throw `Database Error! ${error}`
    }
  },
  async teacherSelectOptions() {
    try {
      const query = `
        SELECT id, name 
        FROM teachers
        ORDER BY name ASC
      `
      const results = await db.query(query)
      return results.rows
    } catch (error) {
      if (error) throw `Database Error! ${error}`
    }
  },
}