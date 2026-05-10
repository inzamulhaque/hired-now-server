export interface IFreelancer {
  id: string;
  userId: string;
  title?: string;
  bio?: string;
  skills: string | string[];
  hourlyRate?: Number;
  availability: boolean;
}
