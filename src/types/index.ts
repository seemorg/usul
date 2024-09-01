declare global {
  namespace PrismaJson {
    type BookVersion = { source: "openiti" | "turath"; value: string };

    type BookFlags = {
      aiSupported?: boolean;
    };
  }
}

export {};
