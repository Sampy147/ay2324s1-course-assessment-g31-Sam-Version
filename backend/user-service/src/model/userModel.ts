import db from "../db";

export type user_role = "User" | "Admin";
export interface User {
  user_id: string;
  username: string;
  user_role: user_role;
}

export const userFunctions = {
  async insertUser(user: User): Promise<void> {
    try {
      const query = `
                INSERT INTO public.users (user_id, username, user_role)
                VALUES ($1, $2, $3);
            `;
      const values = [user.user_id, user.username, user.user_role];
      await db.query(query, values);
    } catch (error) {
      console.error("Error inserting user:", error);
      throw error;
    }
  },

  async getUserById(id: string): Promise<User | null> {
    try {
      const uuidConvert = id;
      const queryResult = await db.query<User>(
        "SELECT * FROM public.users WHERE user_id = $1",
        [uuidConvert]
      );

      if (queryResult.rows && queryResult.rows.length > 0) {
        const user = queryResult.rows[0];
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user by id:", error);
      throw error;
    }
  },

  async deleteUserById(id: string): Promise<void> {
    try {
      // const uuidConvert = parse(id);
      const uuidConvert = id;
      const deleteResult = await db.query(
        "DELETE FROM public.users WHERE user_id = $1",
        [uuidConvert]
      );

      if (deleteResult.rowCount === 0) {
        throw new Error("User not found.");
      }
      console.log("User has been deleted from query");
    } catch (error) {
      console.error("Error deleting user by id:", error);
      throw error;
    }
  },

  async updateUsername(id: string, username: string): Promise<void> {
    try {
      const uuidConvert = id;
      const updateResult = await db.query(
        "UPDATE public.users SET username = $2 WHERE user_id = $1",
        [uuidConvert, username]
      );
      if (updateResult.rowCount === 1) {
        console.log("Profile updated successfully");
      } else {
        console.error("User not found or profile update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },
};
