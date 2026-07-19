"use client";

import { UserButton } from "@clerk/nextjs";

export function AccountMenu({
  authEnabled,
  initials,
}: {
  authEnabled: boolean;
  initials: string;
}) {
  if (authEnabled) {
    return (
      <UserButton
        appearance={{
          elements: {
            avatarBox: "size-8",
            userButtonPopoverCard: "bg-popover border-border",
          },
        }}
      />
    );
  }

  return (
    <button
      aria-label="Demo account"
      className="ml-1 grid size-8 place-items-center rounded-full bg-[#e4d8c7] text-xs font-semibold text-[#40352c]"
      type="button"
    >
      {initials}
    </button>
  );
}
