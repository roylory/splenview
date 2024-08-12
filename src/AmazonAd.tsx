import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import CloseIcon from "./assets/icons/xmark.svg?react"
import AmazonStars from "./AmazonStars"
import { toCommaSeparatedString } from "./utils/number"

const adItems = [
  {
    name: "Akira Toriyama's Manga Theater Hardcover - December 7, 2021",
    desc: "An extensive collection of imaginative and action-packed short stories from the creator of Dragon Ball, Akira Toriyama! From Akira Toriyama, the legendary manga creator of Dragon Ball, comes this special collection of short stories spanning the first few decades of his career. Serving as both a collection of his early works and a history of his life as a manga writer and illustrator, this giant tome is packed with everything you could ever want as a fan of classic shonen manga.",
    image: "https://m.media-amazon.com/images/I/81UUncqngWL._SL1500_.jpg",
    url: "https://amzn.to/44VchvH",
    stars: 4.8,
    reviews: 564,
  },
  {
    name: "Comfyable Puffy Laptop Sleeve 13 Inch 14 Inch, Quilted Puffer Carrying Case, Pillow Case Compatible for MacBook Air M2 M1 M3 2024, MacBook Pro 13 Inch 14 Inch",
    desc: '13 INCH CASE - Our laptop case is compatible for all MacBook Air 13 M3 2024 A3113 & MacBook Pro 13" laptops including M2 2022 M1 2020 2021, and also compatible with MacBook Pro 14-inch M3 /M2 Pro/Max 2023 & M1 2021 A2442. Interior dimensions: 13.5 x 9.5 x 0.7 Inches, Exterior dimensions: 14 x 10 x 0.7 inches, allows for use with a wide variety of laptop and tablet models.',
    image: "https://m.media-amazon.com/images/I/71rljFajxwL._AC_SX679_.jpg",
    url: "https://amzn.to/3X12Ad4",
    stars: 4.7,
    reviews: 197,
  },
]

const AmazonAd: FC = () => {
  const { t } = useTranslation()
  const [closed, setClosed] = useState(false)
  const adItem = adItems[Math.floor(Math.random() * adItems.length)]

  if (closed) return null

  return (
    <div className="fixed left-1/2 top-1/2 min-w-80 max-w-xl -translate-x-1/2 -translate-y-1/2 transform shadow-2xl shadow-black">
      <div className="relative flex h-8 items-center justify-center bg-pink-900 text-white">
        <span className="text-sm font-semibold">{t("others.ad")}</span>
        <CloseIcon
          className="absolute right-2 ml-2 h-3 w-3 cursor-pointer"
          onClick={() => setClosed(true)}
        />
      </div>
      <div
        className="flex cursor-pointer flex-col gap-3 bg-white px-8 py-5 md:flex-row md:gap-6 md:px-5"
        onClick={() => window.open(adItem.url, "_blank")}
      >
        <div className="flex items-center justify-center">
          <img
            src={adItem.image}
            alt={adItem.name}
            className="max-h-40 min-w-40 max-w-56 object-contain md:max-h-56"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="line-clamp-2 text-center font-semibold md:line-clamp-3 md:text-left lg:line-clamp-2">
            {adItem.name}
          </p>
          <div className="flex items-center justify-center gap-1 text-sm font-semibold text-gray-500 md:justify-start">
            <div className="flex items-center">
              <AmazonStars rating={adItem.stars} />
            </div>
            <span>{adItem.stars.toFixed(1)}</span>
            <span className="md:hidden lg:block">
              ({toCommaSeparatedString(adItem.reviews)} ratings)
            </span>
          </div>
          <p className="mb-3 mt-2 line-clamp-4 text-sm leading-5 text-gray-500">
            {adItem.desc}
          </p>
          <div className="flex justify-center md:justify-start">
            <a
              className="mb-1 whitespace-nowrap rounded bg-yellow-500 px-3 py-2 text-sm text-black transition-colors duration-300 ease-in-out"
              style={{ fontStretch: "condensed" }}
              href={adItem.url}
              target="_blank"
              rel="noreferrer noopener nofollow sponsored"
            >
              Shop on Amazon
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AmazonAd
