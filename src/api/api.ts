import axios from 'axios';

export interface CombinedResult {
  name: string;
  place: number;
  points1: number | null;
  points2: number | null;
  points3: number | null;
  points4: number | null;
  points5: number | null;
  points6: number | null;
  totalPoints: number;
  className: string;
}

export const fetchCombinedResults = async (): Promise<{ [key: string]: CombinedResult[] }> => {
  const response = await axios.get('http://localhost:3000/combined-results');
  return response.data;
};
