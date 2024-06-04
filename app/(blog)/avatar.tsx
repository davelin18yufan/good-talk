import { Image } from "next-sanity/image";

import type { Author } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";

interface Props {
  name: string;
  picture: Exclude<Author["picture"], undefined> | null;
}

export default function Avatar({ name, picture }: Props) {
  return (
    <div className="flex items-center text-lg sm:text-xl">
      {picture?.asset?._ref ? (
        <div className="mr-4 h-12 w-12 relative">
          <Image
            alt={picture?.alt || ""}
            className="h-full rounded-full object-cover"
            fill
            src={
              urlForImage(picture)
                ?.height(96)
                .width(96)
                .fit("crop")
                .url() as string
            }
          />
        </div>
      ) : (
        <div className="mr-1">By </div>
      )}
      <div className="text-pretty text-lg sm:text-xl font-bold">{name}</div>
    </div>
  )
}
