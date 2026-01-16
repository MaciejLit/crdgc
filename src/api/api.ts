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
  points7?: number | null;
  totalPoints: number;
  className: string;
}

export const fetchCombinedResults = async (season: string = 'vol3'): Promise<{ [key: string]: CombinedResult[] }> => {
  const endpoint = `results-crl-${season}`;
  const response = await axios.get(`http://localhost:3000/${endpoint}`);
  return response.data;
};
