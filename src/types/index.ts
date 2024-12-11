interface _PublicationDetails {
  investigator?: string;
  publisher?: string;
  publisherLocation?: string;
  editionNumber?: string;
  publicationYear?: number; // hijri
}

type SplitsData = { start: number; end: number }[];

declare global {
  namespace PrismaJson {
    type PublicationDetails = _PublicationDetails;

    type BookVersion = (
      | {
          source: "openiti" | "turath" | "external";
        }
      | {
          source: "pdf";
          ocrBookId?: string;
          splitsData?: SplitsData;
        }
    ) & {
      id: string;
      value: string;
      publicationDetails?: PublicationDetails;
      aiSupported?: boolean;
      keywordSupported?: boolean;
    };

    interface AuthorExtraProperties {
      _airtableReference?: string;
    }

    interface BookExtraProperties {
      _airtableReference?: string;
    }

    type BookPhysicalDetails = (
      | {
          type: "manuscript";
        }
      | ({
          type: "published";
        } & PublicationDetails)
    ) & {
      notes?: string;
    };

    interface GenreExtraProperties {
      _airtableReference?: string;
    }

    interface AdvancedGenreExtraProperties {
      _airtableReference?: string;
      simpleGenreId?: string; // id in Genres table
    }
  }
}

export {};
