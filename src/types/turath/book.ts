export interface TurathBookResponse {
  meta: {
    id: number;
    name: string;
    type: number;
    printed: number;
    info: string;
    info_long: string;
    version: string; // example: 1.0
    author_id: number;
    cat_id: number;
    date_built: number;
    author_page_start: number;
    pdf_links?: {
      files: string[];
      size: number; // in bytes
      root?: string;
    };
  };
  indexes: {
    volumes: string[];
    headings: {
      title: string;
      level: number;
      page: number;
      pageIndex?: number;
    }[];
    print_pg_to_pg: Record<string, number>; // example '1,1': 1
    page_map: string[]; // example: ['1,1', '1,2']
    page_headings: Record<string, number[]>;
    non_author: string[];
  };
  pages: {
    text: string;
    vol: string;
    page: number;
  }[];
}
