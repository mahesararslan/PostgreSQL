import { Client } from 'pg';

const client = new Client({
    connectionString: "postgresql://ArslanDB_owner:ypGfsK7Dqw1Y@ep-young-violet-a5ypagtn.us-east-2.aws.neon.tech/ArslanDB?sslmode=require"
});

async function createEmployeesTable() {
    try {
        await client.connect();
        console.log("connection successfull");

        const result = await client.query('CREATE TABLE employees (id SERIAL PRIMARY KEY, username VARCHAR(50) UNIQUE NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);');
        console.log(result);
    }
    catch(err) {
        console.log("Error in creating the table: ", err)
    } finally {
        await client.end();
    }
}

// User can send A sql query as an input field, which could and run and cause problems.
// To resolve this SQL injection is used, approach:

async function insertData(username: string, email: string, password: string) {
    const client = new Client({
        connectionString: "postgresql://ArslanDB_owner:ypGfsK7Dqw1Y@ep-young-violet-a5ypagtn.us-east-2.aws.neon.tech/ArslanDB?sslmode=require"
    });

    try {
        await client.connect();

        // Use parameterized query to avoid SQL injection
        const insertQuery = "INSERT INTO employees (username, email, password) VALUES ($1, $2, $3);";  
        const values = [username, email, password];
        const res = await client.query(insertQuery, values);
        console.log("Insertion Success: ", res);

    }
    catch(err) {
        console.log("Error during the insertion: ", err)
    } finally {
        await client.end();
    }
}

async function getUser(email: string) {
    const client = new Client({
        connectionString: "postgresql://ArslanDB_owner:ypGfsK7Dqw1Y@ep-young-violet-a5ypagtn.us-east-2.aws.neon.tech/ArslanDB?sslmode=require"
    });

    try {
        await client.connect();

        const query = "SELECT * FROM employees WHERE email=$1";
        const values = [email]  
        const result = await client.query(query, values);

        if(result.rows.length > 0) {
            console.log("Employee Found: ", result.rows[0]);
            return result.rows[0];
        }
        else {
            console.log("No Employee found with the given email");
            return null
        }

    }
    catch(err) {
        console.log("Error during fetching employee: ", err)
        throw err;
    } finally {
        await client.end();
    }
}

// createEmployeesTable().catch(console.error);
// insertData('username1', 'user1@gmail.com', 'pass1').catch(console.error);
getUser('user1@gmail.com').catch(console.error);

