import { Submission } from "../../entities/submission..entite";
import { ISubmission } from "../types/schem.interface";

export interface ISubmissionRepository{
  create (data: Partial<ISubmission>): Promise<Submission | null>
  findByTaskId (
    data: Partial<ISubmission>
  ): Promise<Submission[] | null> 
   update (
     id: string,
     data: Partial<ISubmission>
   ): Promise<Submission | null> 
}