import { Profile, YEARS } from "./types";

const MIN_SCORE = 6;

function arrayIntersection(a: string[], b: string[]): string[] {
  return a.filter((item) => b.includes(item));
}

function genderCompatible(user: Profile, candidate: Profile): boolean {
  if (!user.match_same_gender && !candidate.match_same_gender) return true;
  return user.gender === candidate.gender;
}

function yearBonus(user: Profile, candidate: Profile): number {
  if (!user.year || !candidate.year) return 0;
  const userIdx = YEARS.indexOf(user.year as (typeof YEARS)[number]);
  const candIdx = YEARS.indexOf(candidate.year as (typeof YEARS)[number]);
  if (userIdx === -1 || candIdx === -1) return 0;
  const diff = Math.abs(userIdx - candIdx);
  if (diff === 0) return 3;
  if (diff === 1) return 2;
  return 0;
}

export function findMatches(
  user: Profile,
  candidates: Profile[],
  limit = 5
): Profile[] {
  const eligible = candidates.filter((c) => {
    if (c.id === user.id) return false;
    if (!c.year || !c.gender || !c.location_preference.length || !c.time_preference.length || !c.day_preference.length) return false;
    if (!genderCompatible(user, c)) return false;
    if (!arrayIntersection(c.day_preference, user.day_preference).length) return false;
    if (!arrayIntersection(c.time_preference, user.time_preference).length) return false;
    if (!arrayIntersection(c.location_preference, user.location_preference).length) return false;
    return true;
  });

  const scored: [Profile, number][] = [];
  for (const c of eligible) {
    let score = 2 * arrayIntersection(c.day_preference, user.day_preference).length;
    score += 2 * arrayIntersection(c.time_preference, user.time_preference).length;
    if (arrayIntersection(c.location_preference, user.location_preference).length) score += 2;
    score += yearBonus(user, c);
    if (c.gender === user.gender) score += 1;
    if (c.verified && user.verified) score += 2;
    if (score >= MIN_SCORE) scored.push([c, score]);
  }

  scored.sort((a, b) => b[1] - a[1]);
  return scored.slice(0, limit).map(([profile]) => profile);
}
