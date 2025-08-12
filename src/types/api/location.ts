export interface ApiLocation {
  id: string;
  slug: string;
  name: string;
  secondaryName: string;
  type: "Died" | "Born" | "Visited" | "Resided";
  regionId: string;
}
