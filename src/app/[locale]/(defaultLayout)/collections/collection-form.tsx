"use client";

import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { checkCollectionSlug } from "@/lib/api/collections";
import { toSlug } from "@/lib/slug";
import {
  useCreateCollection,
  useUpdateCollection,
} from "@/react-query/mutations/collections";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createSchema = (currentSlug?: string) =>
  z.object({
    name: z.string().min(1),
    description: z.string(),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .refine(
        async (value) => {
          if (currentSlug && value === currentSlug) return true;
          const result = await checkCollectionSlug(value);
          return !result?.exists;
        },
        { message: "Slug is already taken" },
      ),
    visibility: z.enum(["PUBLIC", "UNLISTED"]),
  });

type FormData = z.infer<ReturnType<typeof createSchema>>;

interface CollectionFormProps {
  mode: "create" | "edit";
  initialData?: FormData;
  collectionId?: string;
}

export default function CollectionForm({
  mode,
  initialData,
  collectionId,
}: CollectionFormProps) {
  const t = useTranslations();
  const schema = useMemo(
    () => createSchema(initialData?.slug),
    [initialData?.slug],
  );
  const form = useForm<FormData>({
    resolver: zodResolver(schema, undefined, { mode: "async" }),
    reValidateMode: "onBlur",
    defaultValues: initialData || {
      name: "",
      description: "",
      slug: "",
      visibility: "PUBLIC",
    },
  });

  const createMutation = useCreateCollection();
  const updateMutation = useUpdateCollection();

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Watch for name changes and auto-generate slug
  const name = form.watch("name");
  const isSlugDirty = form.formState.dirtyFields.slug;

  useEffect(() => {
    // Only auto-generate slug if name changed and slug is not dirty
    if (!isSlugDirty) {
      const generatedSlug = toSlug(name);
      form.setValue("slug", generatedSlug, { shouldDirty: false });
    }
  }, [name, isSlugDirty, form]);

  const handleSubmit = (data: FormData) => {
    if (mode === "create") {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({
        id: collectionId!,
        ...data,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="max-w-2xl space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("collections.name.title")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("collections.name.placeholder")}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("collections.description.title")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={t("collections.description.placeholder")}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("collections.slug.title")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("collections.slug.placeholder")}
                  required
                />
              </FormControl>
              <FormDescription>
                {t("collections.slug.description")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("collections.visibility.title")}</FormLabel>
              <FormControl>
                <RadioGroup
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="mt-2"
                >
                  <FormItem className="flex items-center space-x-1">
                    <FormControl>
                      <RadioGroupItem value="PUBLIC" />
                    </FormControl>
                    <FormLabel>{t("collections.visibility.public")}</FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-1">
                    <FormControl>
                      <RadioGroupItem value="UNLISTED" />
                    </FormControl>
                    <FormLabel>
                      {t("collections.visibility.unlisted")}
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>

              <FormDescription>
                {t("collections.visibility.description")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-4">
          <Button type="submit" isLoading={isPending}>
            {mode === "create" ? t("common.create") : t("common.update")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
