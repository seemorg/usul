interface Geometry {
  coordinates: number[];
  type: string;
}

interface AlthurayyaData {
  visual_center: string;
}

interface CornuData {
  coord_certainty: string;
  coord_lat: string;
  coord_lon: string;
  cornu_URI: string;
  region_code: string;
  region_spelled: string;
  top_type_hom: string;
  top_type_orig: string;
  toponym_arabic: string;
  toponym_arabic_other: string;
  toponym_buckwalter: string;
  toponym_search: string;
  toponym_translit: string;
  toponym_translit_other: string;
}

type Source = {
  rate: number;
  status: string;
  title: string;
};

interface Property {
  althurayyaData: AlthurayyaData;
  cornuData: CornuData;
  sources_arabic: Record<string, Source>;
  sources_english: Record<string, Source>;
}

export interface Place {
  geometry: Geometry;
  properties: Property;
  type: string;
}
