export interface VideoAuthor {
  id: string;
  uniqueId: string;
  nickname: string;
  avatarThumb?: string;
}

export interface VideoStats {
  diggCount: number;
  shareCount: number;
  commentCount: number;
  playCount: number;
}

export interface VideoPlayAddr {
  urlList: string[];
}

export interface ImageURL {
  urlList: string[];
}

export interface ImagePostImage {
  imageURL: ImageURL;
}

export interface ImagePost {
  images: ImagePostImage[];
}

export interface Video {
  id: string;
  desc: string;
  createTime: number;
  video: {
    playAddr: string;
    duration: number;
    cover: string;
    zoomCover: {
      "240": string;
      "480": string;
      "720": string;
      "960": string;
    };
  };
  author?: VideoAuthor;
  stats?: VideoStats;
  isAd?: boolean;
  textExtra?: Array<{
    hashtagName?: string;
  }>;
  imagePost?: ImagePost;
}

export interface AuthorOption {
  value: string;
  label: string;
  count: number;
}

export interface HashtagOption {
  value: string;
  label: string;
  count: number;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface VideoFilters {
  selectedAuthor: string | null;
  selectedHashtag: string | null;
  adOnly: boolean;
  dateRange: DateRange;
  durationRange: [number, number];
}
