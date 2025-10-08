// src/config/configDb.js
import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

import { User } from "../entities/user.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,         // ✅ ok para DEV y la tarea
  logging: false,
  entities: [User],          // 👈 registra la entidad
});

export async function connectDB() {
  await AppDataSource.initialize();
  console.log("DB OK");
}
