export interface ReviewBadge {
  platform: "G2" | "Capterra";
  rating: number;
  reviewCount: number;
  badgeText?: string;
}

export const reviewBadges: ReviewBadge[] = [
  {
    platform: "G2",
    rating: 4.8,
    reviewCount: 150,
    badgeText: "Top Rated",
  },
  {
    platform: "Capterra",
    rating: 4.7,
    reviewCount: 125,
    badgeText: "Best Value",
  },
];

