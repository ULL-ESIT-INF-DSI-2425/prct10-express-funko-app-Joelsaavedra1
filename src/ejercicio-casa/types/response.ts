import { Funko } from "./funko.js";

/**
 * This type represents a response from the Funko Manager.
 * It includes the type of request, success status, and optional list of Funkos.
 */
export type ResponseType = {
  success: boolean;
  message?: string;
  funko?: Funko;
  funkos?: Funko[];
};
