import type {PageLoad} from "./$types"

import {backend} from "$lib/backend";

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch(backend("ping"))
  const data = await response.json();

  return {
    message: data.message
  };
};
