export interface ApiLocation {
  id: string;
  slug: string;
  transliteration: string | null;
  name: string;
  secondaryName: string;
  type: "Died" | "Born" | "Visited" | "Resided";
  regionId: string;
}
