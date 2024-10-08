declare global {
  namespace PrismaJson {
    type BookVersion = {
      source: "openiti" | "turath" | "external";
      value: string;
    };

    type BookFlags = {
      aiSupported?: boolean;
      aiVersion?: string;
    };
  }
}

export {};
