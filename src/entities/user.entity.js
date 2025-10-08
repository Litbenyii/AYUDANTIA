// src/entities/user.entity.js
import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: { primary: true, type: Number, generated: true },
    email: { type: String, unique: true },
    password: { type: String },
  },
});
