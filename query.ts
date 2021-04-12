import { Pool } from "pg";
export default (query: string, values: any, cb: Function) => {
  const pool = new Pool({
    database: 'rstorm',
    host: 'localhost',
    password: 'postgres',
    user: 'postgres',
    port: 5432
  });
  pool.connect((err, client, release) => {
    if (err) {
      return cb(err);
    }
    console.log('dingo running query', query);
    client.query(query, values, (err, results) => {
      release();
      if (err) {
        return cb(err);
      }

      return cb(null, results.rows, results);
    });
  });
};
