module.exports = {
  age(timestamp) {
    const today = new Date()
    const birthDate = new Date(timestamp)

    let age = today.getFullYear() - birthDate.getFullYear()
    const month = today.getMonth() - birthDate.getMonth()

    if (month < 0 || month == 0
      && today.getDate() < birthDate.getDate()) {
      age = age - 1
    }

    return age
  },
  date(timestamp) {
    const date = new Date(timestamp)

    const year = date.getUTCFullYear()
    const month = `0${date.getUTCMonth() + 1}`.slice(-2)
    const day = `0${date.getUTCDate()}`.slice(-2)

    return {
      day,
      month,
      year,
      iso: `${year}-${month}-${day}`,
      birthday: `${day} / ${month}`,
      format: `${day} / ${month} / ${year}`
    }
  },
  graduation(graduation) {
    const educationLevel = {
      Hs: "High School",
      Cl: "Associate's Degree",
      Un: "Bachelor's Degree",
      Ma: "Master's",
      PHD: "Doctorate"
    }

    const keys = Object.keys(educationLevel)

    for (key of keys) {
      if (key == graduation) return educationLevel[key]
    }

    return "Graduation not Found!"
  },
  grade(grade) {
    const grade_list = {
      '5g': "5th grade",
      '6g': "6th grade",
      '7g': "7th grade",
      '8g': "8th grade",
      'Fr': "Freshman",
      'Sp': "Sophomore",
      'Jr': "Junior",
      'Sr': "Senior",
    }

    const keys = Object.keys(grade_list)

    for (key of keys) {
      if (key == grade) return grade_list[key]
    }
    return "Grade school not found!"
  },
  transformExpertise(teacher) {
    if (typeof (teacher.expertise) == typeof "String") {
      return teacher.expertise.split(',')
    }

    return teacher.expertise
  },
  areTheFieldsFilled(body) {
    const keys = Object.keys(body)
  
    for (key of keys) {
      if (body[key] == "") {
        return {
          message: 'Por favor, preencha todos os campos!'
        }
      }
    }
  
    return null
  }
}