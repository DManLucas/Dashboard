import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
import Image from "next/image";
import clsx from "clsx";

export default async function Home() {
  return (
    <>
      <section className="h-full w-full md:pt-44 mt-[-70px] relative flex items-center justify-center flex-col">
        {}
        <div
          className="absolute bottom-0 left-0 right-0 top-0 
          bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] 
          bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"
        ></div>
        <p className="text-center">Run your agency from one place</p>
        <div
          className="bg-gradient-to-r from-primary to-secondary-foreground 
        text-transparent bg-clip-text relative"
        >
          <h1 className="text-9xl font-bold text-center md:text-[300px]">
            Plura
          </h1>
        </div>
        <div
          className="flex justify-center items-center relative
        md:mt-[-70px]"
        >
          <Image
            src={"/assets/preview.png"}
            alt="The banner image"
            height={1200}
            width={1200}
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
          />
          <div
            className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background 
left-0 right-0 absolute z-10"
          ></div>
        </div>
      </section>
      <section className="flex justify-center items-center flex-col gap-4 md:mt-200">
        <h2 className="text-4xl text-center">Pick one that works for you</h2>
        <p className="text-muted-foreground text-center">
          Our straightforward pricing plans are tailored to meet your needs. if{" "}
          {"you're"} not <br />
          ready to commit you can get started for free
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap mt-6">
          {pricingCards.map((card) => (
            <Card
              key={card.title}
              className={clsx("w-[300px] flex flex-col justify-between", {
                "border-2 border-primary": card.title === "Unlimited Saas",
              })}
            >
              <CardHeader>
                <CardTitle
                  className={clsx("", {
                    "text-muted-foreground": card.title !== "Unlimited Saas",
                  })}
                >
                  {card.title}
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              {card.description}
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
