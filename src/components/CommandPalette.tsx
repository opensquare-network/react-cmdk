import FreeSearchAction from "./FreeSearchAction";
import Icon from "./Icon";
import List from "./List";
import ListItem from "./ListItem";
import Page from "./Page";
import React, {
  HTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import Search from "./Search";
import {
  OpenContext,
  PageContext,
  RenderLinkContext,
  SearchContext,
  SelectContext,
  ThemeContext,
} from "../lib/context";
import { RenderLink, Theme } from "../types";
import { Dialog } from "@headlessui/react";
import clsx from "clsx";

interface CommandPaletteProps {
  onChangeSelected?: (value: number) => void;
  onChangeSearch: (search: string) => void;
  onChangeOpen: (isOpen: boolean) => void;
  renderLink?: RenderLink;
  placeholder?: string;
  children: ReactNode;
  footer?: ReactNode;
  selected?: number;
  isOpen: boolean;
  search: string;
  page?: string;
  theme?: Theme;
  className?: HTMLAttributes<HTMLDivElement>["className"];
}

function CommandPalette({
  selected: selectedParent,
  placeholder = "Search",
  onChangeSelected,
  onChangeSearch,
  onChangeOpen,
  renderLink,
  children,
  isOpen,
  footer,
  search,
  page,
  theme = "light",
  className,
}: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selected, setSelected] =
    typeof selectedParent === "number" && onChangeSelected
      ? [selectedParent, onChangeSelected]
      : useState<number>(0);

  const [searchPrefix, setSearchPrefix] = useState<string[] | undefined>();
  const isDark = theme === "dark";

  function handleChangeSelected(direction?: "up" | "down") {
    const items = document.querySelectorAll(".command-palette-list-item");

    let index = 0;
    let newIndex = 0;
    let newItem: Element;

    if (direction === "down") {
      items.forEach((_, i) => {
        if (i === selected) {
          index = i;
        }
      });

      newIndex = index === items.length - 1 ? 0 : index + 1;
    } else if (direction === "up") {
      items.forEach((_, i) => {
        if (i === selected) {
          index = i;
        }
      });

      newIndex = !index ? items.length - 1 : index - 1;
    } else {
      setSelected(0);
    }

    newItem = items[newIndex];

    if (newItem && typeof newIndex === "number") {
      setSelected(newIndex);
      newItem.scrollIntoView({
        behavior: "smooth",
        block: newIndex ? "center" : "end",
      });
    }
  }

  function handleSelect() {
    const items = document.querySelectorAll(
      ".command-palette-list-item"
    ) as NodeListOf<HTMLButtonElement | HTMLAnchorElement>;

    let index = 0;
    let item: HTMLAnchorElement | HTMLButtonElement;

    items.forEach((_, i) => {
      if (i === selected) {
        index = i;
      }
    });

    item = items[index];

    if (item) {
      item.click();

      if (
        item.attributes.getNamedItem("data-close-on-select")?.value === "true"
      ) {
        onChangeOpen(false);
      }
    }
  }

  useEffect(() => {
    handleChangeSelected();
  }, [search]);

  useEffect(() => {
    setSelected(0);
    inputRef.current?.focus?.();
  }, [page]);

  return (
    <div
      onKeyDown={(e) => {
        if (
          e.key === "ArrowDown" ||
          (e.ctrlKey && e.key === "n") ||
          (e.ctrlKey && e.key === "j")
        ) {
          e.preventDefault();
          e.stopPropagation();
          handleChangeSelected("down");
        } else if (
          e.key === "ArrowUp" ||
          (e.ctrlKey && e.key === "p") ||
          (e.ctrlKey && e.key === "k")
        ) {
          e.preventDefault();
          e.stopPropagation();
          handleChangeSelected("up");
        } else if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          handleSelect();
        }
      }}
    >
      <ThemeContext.Provider value={{ theme }}>
        <Dialog
          open={isOpen}
          initialFocus={inputRef}
          as="div"
          className={clsx("command-palette", className)}
          onClose={() => {
            onChangeOpen(false);
          }}
        >
          <div className="command-palette-content antialiased">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-80" />

            <div className="fixed inset-0 overflow-y-auto flex items-center justify-center">
              <div className="flex w-full h-[450px] items-start justify-center p-4">
                <Dialog.Panel
                  className={clsx(
                    "command-palette-content-panel",
                    "w-full max-h-full shadow-lg rounded-lg max-w-xl flex flex-col overflow-hidden divide-y",
                    isDark ? "bg-gray-900 divide-gray-800" : "bg-white"
                  )}
                >
                  <PageContext.Provider
                    value={{
                      setSearchPrefix,
                      searchPrefix,
                      page,
                    }}
                  >
                    <Search
                      onChange={onChangeSearch}
                      placeholder={placeholder}
                      prefix={searchPrefix}
                      value={search}
                      ref={inputRef}
                    />
                  </PageContext.Provider>

                  <div
                    className="flex-1 overflow-y-auto focus:outline-none p-2 space-y-4"
                    tabIndex={-1}
                  >
                    <OpenContext.Provider value={{ isOpen, onChangeOpen }}>
                      <PageContext.Provider
                        value={{ page, searchPrefix, setSearchPrefix }}
                      >
                        <SearchContext.Provider value={{ search }}>
                          <SelectContext.Provider value={{ selected }}>
                            <RenderLinkContext.Provider value={{ renderLink }}>
                              {children}
                            </RenderLinkContext.Provider>
                          </SelectContext.Provider>
                        </SearchContext.Provider>
                      </PageContext.Provider>
                    </OpenContext.Provider>
                  </div>

                  {footer}
                </Dialog.Panel>
              </div>
            </div>
          </div>
        </Dialog>
      </ThemeContext.Provider>
    </div>
  );
}

CommandPalette.Page = Page;
CommandPalette.List = List;
CommandPalette.ListItem = ListItem;
CommandPalette.Icon = Icon;
CommandPalette.FreeSearchAction = FreeSearchAction;

export default CommandPalette;
