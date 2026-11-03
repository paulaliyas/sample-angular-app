import { Contributor, InitiativeMember } from '../initiative.models';
import banks from './banks.json';

/**
 * Mock only: generated rows for testing the tables and pagination with large lists.
 * The output is the same on every run (seeded), so a bug seen once can be found again.
 */

const FIRST = ['Mohammed', 'Abdullah', 'Fahad', 'Khalid', 'Saud', 'Faisal', 'Nasser', 'Sultan', 'Turki', 'Bandar', 'Majed', 'Omar', 'Yousef', 'Ibrahim', 'Saleh', 'Nora', 'Sara', 'Reem', 'Hessa', 'Lama', 'Maha', 'Abeer', 'Dalal', 'Amal'];
const MIDDLE = ['Abdullah', 'Mohammed', 'Ali', 'Hamad', 'Saad', 'Abdulaziz', 'Mansour', 'Ahmed', 'Sulaiman', 'Fahad', 'Khalid', 'Ibrahim'];
const LAST = ['Al-Harbi', 'Al-Qahtani', 'Al-Shammari', 'Al-Otaibi', 'Al-Dosari', 'Al-Ghamdi', 'Al-Zahrani', 'Al-Mutairi', 'Al-Anazi', 'Al-Khudhair', 'Al-Subaie', 'Al-Malki', 'Al-Balawi', 'Al-Juhani', 'Al-Rashidi', 'Al-Shehri'];
const BANK_CODES = Object.keys(banks) as (keyof typeof banks)[];

/** Small seeded random generator (mulberry32), so the data doesn't change between reloads */
function random(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * `count` contributors with unique IDs (starting at 1000000001, so they never clash with the JSON mock).
 * About 1 in 3 has no IBAN, so the bank account step has rows on both tabs.
 */
export function generateContributors(count: number): Contributor[] {
  const rand = random(42);
  const pick = <T>(list: T[]): T => list[Math.floor(rand() * list.length)];
  const digits = (n: number): string => Array.from({ length: n }, () => Math.floor(rand() * 10)).join('');

  return Array.from({ length: count }, (_, i) => {
    const wage = 4000 + Math.round(rand() * 160) * 50; // 4,000 – 12,000 in steps of 50
    const year = 2010 + Math.floor(rand() * 16);
    const month = String(1 + Math.floor(rand() * 12)).padStart(2, '0');
    const day = String(1 + Math.floor(rand() * 28)).padStart(2, '0');
    const contributor: Contributor = {
      nnid: String(1000000001 + i),
      name: `${pick(FIRST)} ${pick(MIDDLE)} ${pick(LAST)}`,
      joiningDate: `${year}/${month}/${day}`,
      wage,
      benefitAmount: wage,
    };
    if (rand() > 0.33) {
      const bankCode = pick(BANK_CODES);
      const iban = `SA${digits(2)}${bankCode}${digits(18)}`;
      contributor.iban = iban;
      contributor.maskedIban = `${iban.slice(0, 6)}*********${iban.slice(-4)}`;
      contributor.bankName = banks[bankCode];
    }
    return contributor;
  });
}

/** Enrolled members for the dashboard's Manage Contributors table, made from the given contributors. */
export function generateMembers(contributors: Contributor[]): InitiativeMember[] {
  return contributors.map((c, i) => ({
    ...c,
    requestId: String(1384792827 + Math.floor(i / 25)), // 25 members per request
    benefitStart: '2026/08/18',
    benefitEnd: '2026/11/18',
  }));
}
