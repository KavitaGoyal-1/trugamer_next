import { Link } from "@/types/link";
import { Store } from "@/types/store";

const GameLinksAndStores = ({
  links,
  stores,
}: {
  links: Link[] | undefined;
  stores: Store[] | undefined;
}) => {
  return (
    <div className="grid grid-cols-1 max-[500px]:grid-cols-2 justify-start gap-4">
      <div className="grid gap-[7px]">
        <h3>Links</h3>
        {links !== null && links !== undefined && links.length > 0 ? (
          links.map((item: Link) => (
            <a
              key={item.id}
              href={item.link}
              className="font-normal opacity-60 text-base text-white justify-self-start"
              rel="nofollow"
            >
              {item.text}
            </a>
          ))
        ) : (
          <p className="font-normal opacity-60 text-base">N/A</p>
        )}
      </div>

      <div className="grid gap-[7px]">
        <h3>Stores</h3>
        {stores !== null && stores !== undefined && stores.length > 0 ? (
          stores.map((item: Link) => (
            <a
              key={item.id}
              href={item.link}
              className="font-normal opacity-60 text-base text-white justify-self-start"
              rel="nofollow"
            >
              {item.text}
            </a>
          ))
        ) : (
          <p className="font-normal opacity-60 text-base">N/A</p>
        )}
      </div>
    </div>
  );
};

export default GameLinksAndStores;
