import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
    .createPool({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        port: process.env.PORT,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        connectionLimit: 10,
        waitForConnections: true,
    })
    .promise();
pool.getConnection()
    .then((con) => console.log("connected to the database"))
    .catch((err) => console.log("error connecting to the database"));

export async function findUser(ID) {
    const con = await pool.getConnection();
    const user = await con.query("SELECT id FROM users WHERE id = ?", [ID]);
    con.release();
    return user;
}

export async function getUserInfo(ID) {
    let con;
    try {
        con = await pool.getConnection();
        const [links] = await con.query("SELECT links.id , url , bg_color , radius , color, text FROM users JOIN links ON links.user_id = users.id WHERE users.id = ?  ;", [ID]);
        const [[pageData]] = await con.query("SELECT users.id , name , username, background , font ,bio FROM users JOIN pages ON pages.user_id = users.id WHERE users.id = ?", [ID]);
        con.release();
        return [pageData, links];
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getLinkTree(username) {
    const con = await pool.getConnection();
    const [links] = await con.query("SELECT url , bg_color  , radius , color , text FROM users JOIN links ON links.user_id = users.id WHERE username = ?  ;", [username]);
    const [[pageData]] = await con.query("SELECT name , username, background , font ,bio FROM users JOIN pages ON pages.user_id = users.id WHERE users.username = ?", [username]);
    con.release();
    return [pageData, links];
}

export async function getUser(username) {
    const con = await pool.getConnection();
    const [[user]] = await con.query("SELECT * FROM users WHERE username = ?  ", [username]);

    const [[page]] = await con.query("SELECT pages.id , background ,font , user_id FROM users join pages on username = ? ;", [username]);
    const [links] = await con.query("SELECT links.id , url , bg_color ,radius , user_id FROM users join links on username = ? ; ", [username]);
    con.release();
    return [user, page, links];
}
export async function createUser({ name, username, password, bio }) {
    let con;
    try {
        con = await pool.getConnection();
        await con.query("INSERT INTO users (name , username, password , bio) VALUES  (? , ? , ? , ? ) ; ", [name, username, password, bio]);

        const [[newUser]] = await con.query("SELECT id FROM users WHERE username = ? ; ", [username]);

        await con.query("INSERT INTO pages (user_id ) VALUES (?) ;", [newUser.id]);
        con.release();

        return [null, newUser.id];
    } catch (err) {
        console.log(err);
        return [new Error("Failed to create user"), null];
    }
}
export async function getUserByUsername(username) {
    const con = await pool.getConnection();
    const [[user]] = await con.query("SELECT COUNT(*) as USERS from users where username = ?  ; ", [username]);
    con.release();
    return user;
}

export async function addLink({ userId, text, url, color, bg_color, radius }) {
    let con;
    try {
        con = await pool.getConnection();

        await con.query("INSERT INTO links (user_id,text , url, color , bg_color , radius) VALUES (?,?,?,?,?,?) ; ", [userId, text, url, color, bg_color, radius]);
        con.release();
    } catch (err) {
        return new Error("Failed to create link");
    }
}

export async function deleteLink({ userId, linkId }) {
    let con;
    try {
        con = await pool.getConnection();
        await con.query("DELETE FROM links WHERE id = ? AND user_id = ? ; ", [linkId, Number(userId)]);
        con.release();
    } catch {
        return new Error("Failed to delete link");
    }
}

export async function editPage({ userId, font, background }) {
    let con;
    try {
        con = await pool.getConnection();
        await con.query("UPDATE pages SET font = ? , background = ? WHERE user_id = ? ;", [font, background, userId]);
        con.release();
    } catch {
        return new Error("Failed to edit page");
    }
}

export async function changeUserDetails({ field, userId, value }) {
    let con;
    try {
        con = await pool.getConnection();
        await con.query(`UPDATE ${field == "font" || field == "background" ? "pages" : "users"} SET ${field} = ? WHERE ${field == "font" || field == "background" ? "user_id" : "id"} = ? ; `, [
            value,
            userId,
        ]);
        con.release();
    } catch (err) {
        console.log(err);
        return new Error("Failed to edit details");
    }
}

export async function deleteUser(userId) {
    let con;
    try {
        con = await pool.getConnection();
        await con.query("DELETE FROM users WHERE id = ? ", [userId]);
        con.release();
    } catch {
        return new Error("Failed to delete user Account");
    }
}
