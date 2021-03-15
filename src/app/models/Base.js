const db = require('../../config/db');

function findBase(filters, table) {
  let query = `SELECT * FROM ${table}`;

  if (filters) {
    Object.keys(filters).map((key) => {
      query += ` ${key}`;

      Object.keys(filters[key]).map((field) => {
        query += ` ${field} = '${filters[key][field]}'`;
      });
    });
  }

  return db.query(query);
}

const Base = {
  init({ table }) {
    if (!table) throw new Error('Invalid Params!');

    this.table = table;
    return this;
  },
  async paginate(params) {
    try {
      const {
        filter,
        limit,
        offset,
        where,
        or,
        orderBy,
        ascOrDesc
      } = params

      let query = "", 
          filterQuery = "",
          subQuery = `(
            SELECT count(*) 
            FROM ${this.table}
          ) AS total`

      if (filter) {
        filterQuery = `
          WHERE ${this.table}.${where} ILIKE '%${filter}%'
          OR ${this.table}.${or} ILIKE '%${filter}%'
        `

        subQuery = `(
          SELECT count(*) 
          FROM ${this.table}
          ${filterQuery}
        ) AS total`
      }
      
      if (this.table === 'students') {
        query = `
          SELECT ${this.table}.*, ${subQuery}
          FROM ${this.table}
          ${filterQuery}
        `
      }

      if (this.table === 'teachers') {
        query = `
          SELECT ${this.table}.*, ${subQuery}, count(students) AS total_students
          FROM ${this.table}
          LEFT JOIN students ON (students.teacher_id = ${this.table}.id)
          ${filterQuery}
          GROUP BY ${this.table}.id 
        `
      }

      query = `
        ${query}
        ${orderBy ? `ORDER BY ${orderBy} ${ascOrDesc}` : ''}
        LIMIT ${limit} OFFSET ${offset}
      `

      const results = await db.query(query)
      return results.rows
    } catch (error) {
      if (error) throw `Database error! ${error}`
    }
  },
  async findById(id) {
    try {
      const results = await findBase({ where: { id } }, this.table);
      return results.rows[0];
    } catch (error) {
      console.error(error);
    }
  },
  async create(fields) {
    try {
      let keys = [],
        values = [];

      Object.keys(fields).map((key) => {
        keys.push(key);
        values.push(`'${fields[key]}'`);
      });

      const query = `
        INSERT INTO ${this.table} 
        (${keys.join(',')})
        VALUES (${values.join(',')})
        RETURNING id
      `;

      const results = await db.query(query);
      return results.rows[0].id;
    } catch (error) {
      console.error(error);
    }
  },
  update(id, fields) {
    try {
      let update = [];

      Object.keys(fields).map((key) => {
        //example model => category_id='id da categoria',
        const line = `${key} = '${fields[key]}'`;
        update.push(line);
      });

      let query = `
        UPDATE ${this.table} SET
        ${update.join(',')}
        WHERE id = ${id}
      `;

      return db.query(query);
    } catch (error) {
      console.error(error);
    }
  },
  delete(id) {
    try {
      return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = Base;
