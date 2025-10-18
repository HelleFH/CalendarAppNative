export type UpdateEntryProps = {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
  testID?: string;
    [key: string]: any; 
    
};
