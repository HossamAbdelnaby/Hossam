import fs from 'fs/promises';
import path from 'path';

const CLANS_FILE_PATH = path.join(process.cwd(), 'data', 'clans.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(CLANS_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read clans from file
export async function getRegisteredClans(): Promise<any[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(CLANS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return [];
  }
}

// Save clans to file
export async function saveRegisteredClans(clans: any[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(CLANS_FILE_PATH, JSON.stringify(clans, null, 2));
  } catch (error) {
    console.error('Error saving clans to file:', error);
    throw error;
  }
}

// Add a new clan
export async function addRegisteredClan(clan: any): Promise<void> {
  try {
    const clans = await getRegisteredClans();
    clans.push(clan);
    await saveRegisteredClans(clans);
  } catch (error) {
    console.error('Error adding clan:', error);
    throw error;
  }
}

// Update a clan
export async function updateRegisteredClan(clanId: string, updates: any): Promise<any | null> {
  try {
    const clans = await getRegisteredClans();
    const clanIndex = clans.findIndex(c => c.id === clanId);
    
    if (clanIndex === -1) {
      return null;
    }
    
    clans[clanIndex] = { ...clans[clanIndex], ...updates };
    await saveRegisteredClans(clans);
    return clans[clanIndex];
  } catch (error) {
    console.error('Error updating clan:', error);
    throw error;
  }
}

// Delete a clan
export async function deleteRegisteredClan(clanId: string): Promise<boolean> {
  try {
    const clans = await getRegisteredClans();
    const initialLength = clans.length;
    const filteredClans = clans.filter(c => c.id !== clanId);
    
    if (filteredClans.length === initialLength) {
      return false; // Clan not found
    }
    
    await saveRegisteredClans(filteredClans);
    return true;
  } catch (error) {
    console.error('Error deleting clan:', error);
    throw error;
  }
}