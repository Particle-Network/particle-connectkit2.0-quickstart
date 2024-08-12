import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Particle Connect 2.0",
  description:
    "Leverage Particle Connect 2.0 for social and native Web3 logins",
  icons: {
    icon: "/favicon.ico",
  },
};

const Header: React.FC = () => {
  const mainHeading = {
    text: "Welcome to",
    linkHref: "https://particle.network",
    linkImageSrc: "/dark.png",
    linkImageAlt: "Particle Logo",
    linkImageWidth: 240,
    linkImageHeight: 24,
  };

  const subHeading =
    "Leverage Particle Connect 2.0 for social and native Web3 logins";

  return (
    <>
      <h1 className="text-4xl mt-4 font-bold mb-12 text-center flex items-center justify-center">
        {mainHeading.text}
        <a
          href={mainHeading.linkHref}
          className="text-purple-400 hover:text-purple-300 transition duration-300 ml-2"
        >
          <Image
            src={mainHeading.linkImageSrc}
            alt={mainHeading.linkImageAlt}
            width={mainHeading.linkImageWidth}
            height={mainHeading.linkImageHeight}
          />
        </a>
      </h1>
      <h2 className="text-xl font-bold mb-6">{subHeading}</h2>
    </>
  );
};

export default Header;
