import Link from "next/link";
import { Key } from "react";
import CardSort from "../components/CardSort";

export default async function searchPage(q: any) {
  const query = q.searchParams?.query;
  const getCards = async () => {
    const res = await fetch(
      `https://api.pokemontcg.io/v2/cards?q=name:"*${query}*"`
    );
    return res.json();
  };

  const data = await getCards();

  function getPrice(item: any) {
    let thePrice;
    let USD = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    if (item.tcgplayer?.prices?.normal?.market) {
      thePrice = item.tcgplayer?.prices?.normal?.market;
    } else if (item.tcgplayer?.prices?.holofoil?.market) {
      thePrice = item.tcgplayer?.prices?.holofoil?.market;
    } else if (item.tcgplayer?.prices?.reverseHolofoil?.market) {
      thePrice = item.tcgplayer?.prices?.reverseHolofoil?.market;
    } else if (item.tcgplayer?.prices?.unlimitedHolofoil?.market) {
      thePrice = item.tcgplayer?.prices?.unlimitedHolofoil?.market;
    } else if (item.tcgplayer?.prices?.uncommon?.market) {
      thePrice = item.tcgplayer?.prices?.uncommon?.market;
    } else {
      return "N/A";
    }
    return USD.format(thePrice);
  }

  function sortByPrice(data: any[], descending: boolean) {
    return data.sort((a, b) => {
      const priceA = parseFloat(getPrice(a).replace(/[^0-9.-]+/g, "")); // Extract numeric value from price
      const priceB = parseFloat(getPrice(b).replace(/[^0-9.-]+/g, ""));
      if (descending) {
        return priceB - priceA; // Descending order
      } else {
        return priceA - priceB; // Ascending order (default)
      }
    });
  }

  const sortedData = sortByPrice(data.data, true); // Sort high-to-low

  return (
    <div>
      <div className="h-16 px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 relative">
        <CardSort />
      </div>
      <ul
        className="grid grid-cols-2 gap-4 items-center mx-2
        md:grid-cols-3 md:mx-6
        lg:grid-cols-4 lg:mx-16
        2xl:grid-cols-5 2xl:mx-48"
      >
        {data.data.map(
          (
            item: {
              tcgplayer: any;
              number: string;
              set: any;
              images: any;
              name: string;
            },
            index: Key | null
          ) => (
            <li
              className="flex flex-center p-8 bg-gray-100 dark:bg-stone-900 rounded-xl shadow-md"
              key={index}
            >
              <Link href="/" className="relative">
                <img
                  src={item.images.small}
                  className="transition ease-in-out delay-150 hover:scale-105 hover:shadow-xl rounded-md shadow-md"
                />
                <p className="font-bold text-lg pt-4">
                  {item.name}
                  <br /> #{item.number}
                </p>
                <p className="text-gray-500 text-sm flex gap-1 pb-2 dark:text-gray-100">
                  {item.set.name}
                  <img src={item.set.images.symbol} className="w-5 h-5" />
                </p>
                <div className="flex justify-between border-t border-gray-400">
                  <p className="text-gray-500 text-sm pt-2 pr-14 dark:text-gray-100">
                    Market Price:
                  </p>
                  <span className="font-bold text-xl pt-2 text-green-700">
                    {getPrice(item)}
                  </span>
                </div>
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
