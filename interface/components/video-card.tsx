"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Share2,
  Play,
  Clock,
  User,
  ExternalLink,
  Hash,
  Calendar,
  BarChart3,
  FileDigit,
} from "lucide-react";
import type { Video } from "@/types/video";
import { Skeleton } from "./ui/skeleton";
import { Separator } from "./ui/separator";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MediaEmbed } from "./media-embed";

interface VideoCardProps {
  video: Video;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

function formatNumberFull(num: number): string {
  return num.toLocaleString();
}

function formatDuration(seconds: number): string {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatDurationFull(seconds: number): string {
  if (!seconds) return "0 seconds";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) return `${remainingSeconds} seconds`;
  if (remainingSeconds === 0)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  return `${minutes}m ${remainingSeconds}s`;
}

function formatDate(timestamp: number): string {
  if (!timestamp) return "";
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateFull(timestamp: number): string {
  if (!timestamp) return "Unknown";
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatItem({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      <div className="p-2 rounded-md bg-background">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col flex-1 gap-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-base font-medium">{value}</p>
      </div>
    </div>
  );
}

function VideoDetailDialog({ video }: { video: Video }) {
  const allHashtags = video.textExtra?.filter((extra) => extra.hashtagName);

  return (
    <DialogContent className="sm:max-w-svw max-w-2xl bg-transparent h-svh p-0 gap-0">
      <DialogHeader className="sr-only p-6 pb-0">
        <DialogTitle className="text-xl">Video Details</DialogTitle>
      </DialogHeader>

      <div className="overflow-scroll px-6 backdrop-blur-2xl">
        <ScrollArea className="flex flex-1 p-12">
          <div className="flex-1 flex flex-col md:grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <MediaEmbed video={video} />
            </div>

            <div className="col-span-2">
              <div className="space-y-6 pt-4">
                {/* Author Section */}
                <section className="space-y-3">
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted flex items-center justify-center">
                        <Avatar className="rounded-none w-12 h-12">
                          <AvatarImage
                            src={video.author?.avatarThumb}
                            alt={`@${video.author?.uniqueId}`}
                          />
                          <AvatarFallback>
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {video.author?.nickname || "Unknown"}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          @{video.author?.uniqueId || "unknown"}
                        </p>
                      </div>
                      {video.isAd && (
                        <Badge variant="secondary">Ad</Badge>
                      )}
                    </div>
                    {video.author?.id && (
                      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                        Author ID: {video.author.id}
                      </p>
                    )}
                  </div>
                </section>

                <Separator />

                {/* Description Section */}
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <ExternalLink className="h-4 w-4" />
                    <span>Description</span>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <p className="text-sm whitespace-pre-wrap">
                      {video.desc || "No description available"}
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Hashtags Section */}
                {allHashtags && allHashtags.length > 0 && (
                  <>
                    <section className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Hash className="h-4 w-4" />
                        <span>Hashtags ({allHashtags.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {allHashtags.map((extra, index) => (
                          <Badge
                            key={`${extra.hashtagName}-${index}`}
                            variant="outline"
                            className="text-sm"
                          >
                            #{extra.hashtagName}
                          </Badge>
                        ))}
                      </div>
                    </section>
                    <Separator />
                  </>
                )}

                {/* Video Info Section */}
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Video Information</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <StatItem
                      icon={Calendar}
                      label="Posted "
                      value={formatDateFull(video.createTime)}
                    />
                    <StatItem
                      icon={Clock}
                      label="Duration"
                      value={formatDurationFull(video.video?.duration || 0)}
                    />
                    <StatItem
                      icon={FileDigit}
                      label="Video ID"
                      value={video.id}
                    />
                  </div>
                </section>

                <Separator />

                {/* Stats Section */}
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <BarChart3 className="h-4 w-4" />
                    <span>Engagement Statistics</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <StatItem
                      icon={Play}
                      label="Views"
                      value={formatNumber(video.stats?.playCount || 0)}
                      subValue={formatNumberFull(video.stats?.playCount || 0)}
                    />
                    <StatItem
                      icon={Heart}
                      label="Likes"
                      value={formatNumber(video.stats?.diggCount || 0)}
                      subValue={formatNumberFull(video.stats?.diggCount || 0)}
                    />
                    <StatItem
                      icon={MessageCircle}
                      label="Comments"
                      value={formatNumber(video.stats?.commentCount || 0)}
                      subValue={formatNumberFull(
                        video.stats?.commentCount || 0,
                      )}
                    />
                    <StatItem
                      icon={Share2}
                      label="Shares"
                      value={formatNumber(video.stats?.shareCount || 0)}
                      subValue={formatNumberFull(video.stats?.shareCount || 0)}
                    />
                  </div>

                  {/* Engagement Rate */}
                  {video.stats?.playCount && video.stats.playCount > 0 && (
                    <StatItem
                      icon={Share2}
                      label="Engagement Rate"
                      value={
                        (
                          ((video.stats.diggCount +
                            video.stats.commentCount +
                            video.stats.shareCount) /
                            video.stats.playCount) *
                          100
                        ).toFixed(2) + "%"
                      }
                    />
                  )}
                </section>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </DialogContent>
  );
}

export function VideoCard({ video }: VideoCardProps) {
  const hashtags = video.textExtra
    ?.filter((extra) => extra.hashtagName)
    .slice(0, 3);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="border flex flex-col rounded-none p-4 space-y-3 hover:border-neutral-700 hover:brightness-125 hover:bg-neutral-950 hover:cursor-pointer select-none">
          <div className="grid grid-cols-4 gap-6">
            <div className="h-full col-span-3 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm truncate">
                  {video.author?.uniqueId || "Unknown"}
                </span>
                {video.isAd && (
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    Ad
                  </Badge>
                )}
              </div>

              {video.createTime && (
                <p className="text-xs align-top text-muted-foreground">
                  {formatDate(video.createTime)}
                  {video.video?.duration > 0 && (
                    <span> / {formatDuration(video.video?.duration)} min</span>
                  )}
                </p>
              )}

              <p className="h-10 w-full text-sm text-muted-foreground line-clamp-2 min-h-10">
                {video.desc || "No description"}
              </p>
            </div>

            <div className="rounded overflow-hidden w-full h-full max-h-29 relative">
              <Image
                src={video.video?.cover}
                alt="Video cover"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 place-items-center pt-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>{formatNumber(video.stats?.diggCount || 0)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span>{formatNumber(video.stats?.commentCount || 0)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="h-3 w-3" />
              <span>{formatNumber(video.stats?.shareCount || 0)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Play className="h-3 w-3" />
              <span>{formatNumber(video.stats?.playCount || 0)}</span>
            </div>
          </div>

          <div className="flex flex-row-reverse mt-4 gap-1 min-h-5.5">
            {hashtags && hashtags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {hashtags.map((extra, index) => (
                  <Badge
                    key={`${extra.hashtagName}-${index}`}
                    variant="outline"
                    className="text-xs rounded-none py-1"
                  >
                    #{extra.hashtagName}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-[10px] mt-auto opacity-25">
                video doesn't have hashtags
              </span>
            )}
          </div>
        </div>
      </DialogTrigger>

      <VideoDetailDialog video={video} />
    </Dialog>
  );
}
