const BASE = 'https://images.unsplash.com/photo-';
const PARAMS = '?w=800&q=80&fit=crop&h=450&auto=format';

const u = (id: string) => `${BASE}${id}${PARAMS}`;

export const RESOURCE_THUMBNAILS: Record<string, string[]> = {
  ChatGPT: [
    u('1677442135703-59657440c3db'),
    u('1620712943543-bcc4688e7485'),
    u('1526374965328-7f61d4dc18c5'),
    u('1655720031546-cd6c6f12b0e4'),
    u('1488229297570-58520851e868'),
  ],
  Claude: [
    u('1635070041078-e363dbe005cb'),
    u('1618005182384-a83a8bd57fbe'),
    u('1519389950473-47ba0277781c'),
    u('1580927752452-89d86da3fa0a'),
    u('1635070041040-42f60da3c5c3'),
  ],
  Content: [
    u('1455390582262-044cdead277a'),
    u('1499951360447-b19be8fe80f5'),
    u('1542435503-4c6c8a5b4b1a'),
    u('1471107340929-a87cd0f5b5f3'),
    u('1432888498266-38ffec3eaf0a'),
  ],
  Productivity: [
    u('1484480974693-6ca0a78fb36b'),
    u('1507238691740-187a5b1d37b8'),
    u('1498050108023-c5249f4df085'),
    u('1545987796-200677720183'),
    u('1517694712202-14dd9538aa97'),
  ],
  Business: [
    u('1460925895917-afdab827c52f'),
    u('1507003211169-0a1dd7228f2d'),
    u('1486406146926-c627a92ad1ab'),
    u('1664575599736-c5197c684128'),
    u('1553729459-efe14ef6055d'),
  ],
  Tools: [
    u('1518770660439-4636190af475'),
    u('1504868584819-f8e8b4b6d7e3'),
    u('1451187580459-43490279c0fa'),
    u('1558618666-fcd25c85cd64'),
    u('1581092580497-e0d23cbdf1dc'),
  ],
};

export const BLOG_THUMBNAILS: Record<string, string[]> = {
  'Content Creation': RESOURCE_THUMBNAILS.Content,
  'AI Comparison':    RESOURCE_THUMBNAILS.Tools,
  'Productivity':     RESOURCE_THUMBNAILS.Productivity,
  'Prompting':        RESOURCE_THUMBNAILS.ChatGPT,
  'Business':         RESOURCE_THUMBNAILS.Business,
  'Tools':            RESOURCE_THUMBNAILS.Tools,
};

export function pickThumbnail(
  map: Record<string, string[]>,
  category: string,
  seed?: string
): string {
  const pool = map[category] ?? Object.values(map).flat();
  if (pool.length === 0) return '';
  const index = seed
    ? seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % pool.length
    : Math.floor(Math.random() * pool.length);
  return pool[index];
}
