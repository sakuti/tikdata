import { fetchImageToBase64 } from "../utilities/media.js";

export async function computeAuthorStats(videos) {
  const authors = new Map();

  videos.forEach((v) => {
    const a =
      {
        author: v.author,
        stats: v.authorStats,
        videoId: v.id,
      } || {};

    const name = a.author.nickname || "Unknown";
    if (!authors.has(name)) authors.set(name, a);
  });

  const arr = Array.from(authors.values());
  const least = arr.reduce(
    (min, a) =>
      !min || a.stats.followerCount < min.stats.followerCount ? a : min,
    null,
  );
  const most = arr.reduce(
    (max, a) =>
      !max || a.stats.followerCount > max.stats.followerCount ? a : max,
    null,
  );

  return {
    totalAuthors: authors.size,
    leastFollowed: {
      id: least.author.id,
      nickname: least.author.nickname,
      uniqueId: least.author.uniqueId,
      verified: least.author.verified,
      avatar: await fetchImageToBase64(least.author.avatarThumb),
      followers: least.stats.followerCount,
    },
    mostFollowed: {
      id: most.author.id,
      nickname: most.author.nickname,
      uniqueId: most.author.uniqueId,
      verified: most.author.verified,
      avatar: await fetchImageToBase64(most.author.avatarThumb),
      followers: most.stats.followerCount,
    },
  };
}
