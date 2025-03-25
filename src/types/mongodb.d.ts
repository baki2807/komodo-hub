declare module '@/lib/mongodb' {
  import { Db } from 'mongodb';
  export function connectToDatabase(): Promise<Db>;
  export function disconnectFromDatabase(): Promise<void>;
} 