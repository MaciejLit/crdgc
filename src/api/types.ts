
export interface HeroSectionProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  ctaText: string;
  onCtaClick: () => void;
}

export interface RouteCardProps {
  title: string;
  image: string;
  holes: number;
}

export type MemberResult = {
  name: string;
  place: number | null;
  totalScore: number | null;
};

export type BagTagsResponse = {
  members?: MemberResult[];
  results?: MemberResult[];
  missingMembers?: string[];
};
