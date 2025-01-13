import { User } from "@clerk/nextjs/server";
import Image from "next/image";
import React from "react";

type Props = {
  user?: null | User;
};

const Navigation = ({ user }: Props) => {
  return (
    <div
      className="p-4 flex items-center justify-between
  relative"
    >
      <aside className="flex items-center gap-2">
        <Image
          src={"./assets/plura-logo.svg"}
          alt="Plura logo"
          height={40}
          width={40}
        />
      </aside>
    </div>
  );
};
