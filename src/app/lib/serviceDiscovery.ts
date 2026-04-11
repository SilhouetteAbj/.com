import Fuse from 'fuse.js';

import discoveryMetadata from '@/app/data/serviceDiscoveryKeywords.json';
import { SERVICE_CATEGORIES } from '@/app/data/servicesData';

type DiscoveryMetadataEntry = {
  key: string;
  description: string;
  keywords: string[];
};

export type DiscoveryResult = {
  key: string;
  testId: string;
  name: string;
  description: string;
  categoryId: string;
  categoryTitle: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  popular: boolean;
  route: string;
  keywords: string[];
  normalizedName: string;
  normalizedDescription: string;
  normalizedCategoryTitle: string;
  normalizedKeywords: string;
};

export type DiscoveryQuickTag = {
  label: string;
  query: string;
};

const QUICK_TAGS: DiscoveryQuickTag[] = [
  { label: 'Ultrasound', query: 'ultrasound' },
  { label: 'DNA Test', query: 'dna test' },
  { label: 'Full Body Checkup', query: 'full body checkup' },
  { label: 'Malaria Symptoms', query: 'malaria symptoms' },
];

const metadataMap = new Map(
  (discoveryMetadata as DiscoveryMetadataEntry[]).map((entry) => [entry.key, entry])
);

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (value: string) => normalizeText(value).split(' ').filter(Boolean);

const buildFallbackDescription = (
  categoryTitle: string,
  categoryDescription: string,
  tags?: string[]
) => {
  if (tags && tags.length > 0) {
    return `Diagnostic option within ${categoryTitle} commonly used for ${tags.join(', ')} concerns.`;
  }

  return categoryDescription;
};

const uniqueTokens = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

export const SERVICE_DISCOVERY_RESULTS: DiscoveryResult[] = SERVICE_CATEGORIES.flatMap((category) =>
  category.tests.map((test) => {
    const key = `${category.id}:${test.id}`;
    const metadata = metadataMap.get(key);
    const keywords = uniqueTokens([
      ...tokenize(test.name),
      ...tokenize(category.title),
      ...tokenize(category.description),
      ...(test.tags ?? []).flatMap((tag) => tokenize(tag)),
      ...(metadata?.keywords ?? []).flatMap((keyword) => tokenize(keyword)),
    ]);

    const description =
      metadata?.description
      ?? buildFallbackDescription(category.title, category.description, test.tags);

    return {
      key,
      testId: test.id,
      name: test.name,
      description,
      categoryId: category.id,
      categoryTitle: category.title,
      accentColor: category.accentColor,
      gradientFrom: category.gradientFrom,
      gradientTo: category.gradientTo,
      popular: Boolean(test.popular),
      route: `/services/category/${category.id}?test=${test.id}`,
      keywords,
      normalizedName: normalizeText(test.name),
      normalizedDescription: normalizeText(description),
      normalizedCategoryTitle: normalizeText(category.title),
      normalizedKeywords: keywords.join(' '),
    };
  })
);

const discoveryFuse = new Fuse(SERVICE_DISCOVERY_RESULTS, {
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  shouldSort: true,
  threshold: 0.35,
  keys: [
    { name: 'name', weight: 0.42 },
    { name: 'keywords', weight: 0.34 },
    { name: 'description', weight: 0.18 },
    { name: 'categoryTitle', weight: 0.06 },
  ],
});

const getManualScore = (result: DiscoveryResult, normalizedQuery: string, tokens: string[]) => {
  let score = 0;

  if (result.normalizedName.includes(normalizedQuery)) score += 28;
  if (result.normalizedKeywords.includes(normalizedQuery)) score += 24;
  if (result.normalizedDescription.includes(normalizedQuery)) score += 12;

  for (const token of tokens) {
    if (result.normalizedName.includes(token)) score += 10;
    if (result.normalizedKeywords.includes(token)) score += 8;
    if (result.normalizedDescription.includes(token)) score += 4;
    if (result.normalizedCategoryTitle.includes(token)) score += 3;
  }

  if (result.popular) score += 2;

  return score;
};

export const DISCOVERY_QUICK_TAGS = QUICK_TAGS;

export const FEATURED_DISCOVERY_RESULTS = SERVICE_DISCOVERY_RESULTS
  .filter((result) => result.popular)
  .slice(0, 6);

export function searchDiscoveryTests(query: string, limit = 6) {
  const normalizedQuery = normalizeText(query);

  if (normalizedQuery.length < 2) {
    return FEATURED_DISCOVERY_RESULTS.slice(0, limit);
  }

  const tokens = tokenize(query);
  const combined = new Map<string, { result: DiscoveryResult; score: number; fuzzyScore: number }>();

  for (const result of SERVICE_DISCOVERY_RESULTS) {
    const manualScore = getManualScore(result, normalizedQuery, tokens);
    if (manualScore > 0) {
      combined.set(result.key, { result, score: manualScore, fuzzyScore: 1 });
    }
  }

  for (const match of discoveryFuse.search(normalizedQuery, { limit: limit * 4 })) {
    const existing = combined.get(match.item.key);
    const fuzzyBoost = Math.round((1 - (match.score ?? 1)) * 20);
    combined.set(match.item.key, {
      result: match.item,
      score: (existing?.score ?? 0) + fuzzyBoost,
      fuzzyScore: match.score ?? existing?.fuzzyScore ?? 1,
    });
  }

  return Array.from(combined.values())
    .sort((a, b) =>
      b.score - a.score
      || a.fuzzyScore - b.fuzzyScore
      || Number(b.result.popular) - Number(a.result.popular)
      || a.result.name.localeCompare(b.result.name)
    )
    .slice(0, limit)
    .map(({ result }) => result);
}
