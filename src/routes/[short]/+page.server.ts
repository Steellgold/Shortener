import { getLink } from "$lib/utils/db/Supabase";
import { error as SvelteKitError, type LoadEvent } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }: LoadEvent) {
  const { short } = params;
  const link = await getLink(short as string);

  if (!link) {
    throw SvelteKitError(404, {
      message: "Link not found",
      code: 404
    });
  }

  // throw redirect(301, String(link.baseUrl));

  return {
    redirect: link.url,
    shortUrl: link.shortUrl
  };
}