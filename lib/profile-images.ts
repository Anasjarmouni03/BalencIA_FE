import type { TeamEmployee, UserProfile } from "@/types";

const STOCK_PROFILE_IMAGES = [
  "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2",
  "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2",
  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2",
  "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2",
  "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2",
  "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2",
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2",
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2",
  "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2",
  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2",
  "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2",
  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2",
  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2&sat=10",
  "https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2",
  "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2",
];

const assignedImageByUserId = new Map<string, string>();
const usedImageUrls = new Set<string>();
const PINNED_IMAGE_INDEX_BY_NAME: Record<string, number> = {
  "youssef alaoui": 1,
  "fatima zahra idrissi": 2,
  "mehdi benchrifa": 4,
  "amina tazi": 12,
  "nadia bensouda": 15,
};

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

function hashKey(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getProfileImageUrl(person: Pick<UserProfile, "id" | "name" | "avatar_url"> | Pick<TeamEmployee, "id" | "name" | "avatar_url">): string {
  if (person.avatar_url) return person.avatar_url;

  const normalizedName = person.name.trim().toLowerCase();
  const pinnedIndex = PINNED_IMAGE_INDEX_BY_NAME[normalizedName];
  if (pinnedIndex != null && pinnedIndex >= 0 && pinnedIndex < STOCK_PROFILE_IMAGES.length) {
    const pinnedImage = STOCK_PROFILE_IMAGES[pinnedIndex];
    assignedImageByUserId.set(person.id, pinnedImage);
    usedImageUrls.add(pinnedImage);
    return pinnedImage;
  }

  if (assignedImageByUserId.has(person.id)) {
    return assignedImageByUserId.get(person.id)!;
  }

  const seed = `${person.id}:${person.name}`.toLowerCase();
  const startIndex = hashKey(seed) % STOCK_PROFILE_IMAGES.length;

  // Keep avatars unique across users whenever possible.
  for (let offset = 0; offset < STOCK_PROFILE_IMAGES.length; offset += 1) {
    const candidate = STOCK_PROFILE_IMAGES[(startIndex + offset) % STOCK_PROFILE_IMAGES.length];
    if (!usedImageUrls.has(candidate)) {
      assignedImageByUserId.set(person.id, candidate);
      usedImageUrls.add(candidate);
      return candidate;
    }
  }

  // Fallback once all images are used.
  const fallback = STOCK_PROFILE_IMAGES[startIndex];
  assignedImageByUserId.set(person.id, fallback);
  return fallback;
}
