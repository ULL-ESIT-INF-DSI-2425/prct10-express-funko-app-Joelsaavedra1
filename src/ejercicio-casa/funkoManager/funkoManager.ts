import { Funko } from "../types/funko.js";
import { ResponseType } from "../types/response.js";
import * as path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs/promises";

/**
 * Directory where user funkos are stored.
 */
export const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../../users");

/**
 * @param userName - Name of the user
 * @param funko - Funko object to be added
 * @returns A promise that resolves to a ResponseType objectindicating the
 * success or failure of the operation and a message.
 */
export async function addFunko(
  userName: string,
  funko: Funko,
): Promise<ResponseType> {
  if (funko.ID < 0 || typeof funko.ID !== "number") {
    return { success: false, message: "Funko ID is not valid" };
  }
  const userPath = path.join(__dirname, userName);
  await fs.mkdir(userPath, { recursive: true });
  const funkoPath = path.join(userPath, `${funko.ID}.json`);
  try {
    await fs.access(funkoPath);
    return {
      success: false,
      message: `Funko with ID ${funko.ID} already exists`,
    };
  } catch {
    await fs.writeFile(funkoPath, JSON.stringify(funko, null, 2));
    return { success: true, message: "Funko added" };
  }
}

/**
 * @param userName - Name of the user
 * @param funko - Funko object to be updated
 * @returns A promise that resolves to a ResponseType objectindicating the
 * success or failure of the operation and a message.
 */
export async function updateFunko(
  userName: string,
  funko: Funko,
): Promise<ResponseType> {
  const userPath = path.join(__dirname, userName);
  const funkoPath = path.join(userPath, `${funko.ID}.json`);
  try {
    await fs.access(funkoPath);
    await fs.writeFile(funkoPath, JSON.stringify(funko, null, 2));
    return { success: true, message: "Funko updated" };
  } catch {
    return { success: false, message: "Funko not found" };
  }
}

/**
 * @param userName - Name of the user
 * @param funkoID - ID of the Funko to be deleted
 * @returns A promise that resolves to a ResponseType object indicating the
 * success or failure of the operation and a message.
 */
export async function deleteFunko(
  userName: string,
  funkoID: number,
): Promise<ResponseType> {
  const userPath = path.join(__dirname, userName);
  const funkoPath = path.join(userPath, `${funkoID}.json`);
  try {
    await fs.access(funkoPath);
    await fs.rm(funkoPath);
    return { success: true, message: "Funko deleted" };
  } catch {
    return { success: false, message: "Funko not found" };
  }
}

/**
 * @param userName - Name of the user
 * @returns A promise that resolves to a ResponseType object containing an array
 * of Funko objects or an error message if the user directory is not found.
 */
export async function listFunkos(userName: string): Promise<ResponseType> {
  const userPath = path.join(__dirname, userName);
  try {
    await fs.access(userPath);
    const userFiles = await fs.readdir(userPath);
    const userFunkos: Funko[] = await Promise.all(
      userFiles.map(async (file) =>
        JSON.parse(await fs.readFile(path.join(userPath, file), "utf-8")),
      ),
    );
    return { success: true, message: "Funkos found", funkos: userFunkos };
  } catch {
    return {
      success: false,
      message: "User directory not found",
    };
  }
}

/**
 * @param userName - Name of the user
 * @param funkoID - ID of the Funko to be shown
 * @returns A promise that resolves to a ResponseType object containing the Funko
 * or an error message if the Funko is not found.
 */
export async function showFunko(
  userName: string,
  funkoID: number,
): Promise<ResponseType> {
  const userPath = path.join(__dirname, userName);
  const funkoPath = path.join(userPath, `${funkoID}.json`);
  try {
    await fs.access(funkoPath);
    const funkoData = await fs.readFile(funkoPath, "utf-8");
    const userFunko: Funko = JSON.parse(funkoData);
    return { success: true, message: "Funko found", funko: userFunko };
  } catch {
    return { success: false, message: "Funko not found" };
  }
}
