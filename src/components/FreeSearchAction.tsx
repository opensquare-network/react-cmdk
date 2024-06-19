import ListItem, { ButtonProps, LinkProps } from "./ListItem";
import React, { useContext } from "react";
import { SearchContext } from "../lib/context";
import { useIsDark } from "../lib/utils";
import clsx from "clsx";

interface FreeSearchActionProps extends Omit<ButtonProps & LinkProps, "index"> {
  index?: number;
  label?: string;
}

export default function FreeSearchAction({
  label = "Search for",
  ...props
}: FreeSearchActionProps) {
  const { search } = useContext(SearchContext);
  const isDark = useIsDark();

  return (
    <ListItem index={0} showType={false} {...props}>
      <span className={clsx("max-w-md truncate", isDark && "text-white")}>
        {label} <span className="font-semibold">"{search}"</span>
      </span>
    </ListItem>
  );
}
