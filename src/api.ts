import axios from 'axios';

const API_ODDS_URL = 'https://api.the-odds-api.com/v4/sports/basketball_nba/odds/';
const API_EVENTS_URL = 'https://api.the-odds-api.com/v4/sports/basketball_nba/events/';
const API_KEY = [
  'b52a9454e4debad17c2d97210ef9e90c',
  'e5353f118308573f9d6e8af041131ffe',
  '454e54ff8674e4ee4944ad3d6398d5c7',
];

let currentKeyIndex = 0;

const handle401 = async (originalFunction: () => Promise<any>) => {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEY.length;
  console.warn(`API key ${API_KEY[currentKeyIndex]} unauthorized. Switching to next key.`);
  return originalFunction();
};

export const fetchH2HOdds = async () => {
  try {
    const response = await axios.get(API_ODDS_URL, {
      params: {
        regions: 'au',
        markets: 'h2h',
        apiKey: API_KEY[currentKeyIndex],
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) return handle401(fetchH2HOdds);
    console.error('Error fetching odds:', error);
    throw error;
  }
};

export const fetchSpreadOdds = async () => {
  try {
    const response = await axios.get(API_ODDS_URL, {
      params: {
        regions: 'au',
        markets: 'spreads',
        apiKey: API_KEY[currentKeyIndex],
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) return handle401(fetchSpreadOdds);
    console.error('Error fetching odds:', error);
    throw error;
  }
};

export const fetchTotalOdds = async () => {
  try {
    const response = await axios.get(API_ODDS_URL, {
      params: {
        regions: 'au',
        markets: 'totals',
        apiKey: API_KEY[currentKeyIndex],
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) return handle401(fetchTotalOdds);
    console.error('Error fetching odds:', error);
    throw error;
  }
};

export const fetchGameIds = async (): Promise<string[]> => {
  try {
    const response = await axios.get(API_EVENTS_URL, {
      params: {
        regions: 'au',
        apiKey: API_KEY[currentKeyIndex],
      },
    });
    const data = response.data;
    const ids: string[] = data.map((game: any) => game.id);
    return ids;
  } catch (error: any) {
    if (error.response?.status === 401) return handle401(fetchGameIds);
    console.error('Error fetching game IDs:', error);
    return [];
  }
};

export const fetchPlayerPropsForGame = async (gameId: string): Promise<any> => {
  try {
    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/basketball_nba/events/${gameId}/odds?apiKey=${API_KEY[currentKeyIndex]}&regions=au&markets=player_assists`
    );

    if (res.status === 401) {
      currentKeyIndex = (currentKeyIndex + 1) % API_KEY.length;
      console.warn(`API key ${API_KEY[currentKeyIndex]} unauthorized. Switching to next key.`);
      return fetchPlayerPropsForGame(gameId);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching player props:', error);
    throw error;
  }
};