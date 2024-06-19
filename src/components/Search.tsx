import React, { forwardRef, Fragment, Ref } from "react";
import { SystemSearch, SystemClear } from "@osn/icons/subsquare";
import { useIsDark } from "../lib/utils";
import clsx from "clsx";

interface SearchProps {
  onChange: (value: string) => void;
  placeholder?: string;
  prefix?: string[];
  value: string;
}

function Search(
  { onChange, placeholder, prefix, value }: SearchProps,
  ref: Ref<HTMLInputElement>
) {
  const isDark = useIsDark();

  return (
    <div className="flex items-center space-x-1.5 pl-3">
      <SystemSearch
        className={clsx(
          "w-4 h-4 pointer-events-none text-gray-400",
          isDark && "text-gray-600"
        )}
      />

      {prefix?.length
        ? prefix.map((p) => {
            return (
              <Fragment key={p}>
                <span className={clsx(isDark && "text-white")}>{p}</span>
                <span className="text-gray-500">/</span>
              </Fragment>
            );
          })
        : null}

      <div className="flex-1 relative">
        <input
          ref={ref}
          spellCheck={false}
          autoComplete="off"
          className={clsx(
            "py-4 px-0 border-none w-full focus:outline-none focus:border-none focus:ring-0 bg-transparent placeholder-gray-500",
            isDark && "text-white"
          )}
          onChange={(e) => {
            onChange(e.currentTarget.value);
          }}
          onFocus={(e) => {
            e.currentTarget.select();
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape" && value) {
              e.preventDefault();
              e.stopPropagation();
              onChange("");
            }
          }}
          id="command-palette-search-input"
          placeholder={placeholder}
          value={value}
          type="text"
          autoFocus
        />

        {value && (
          <button
            tabIndex={-1}
            type="button"
            onClick={() => {
              onChange("");
              const inputElement = document.getElementById(
                "command-palette-search-input"
              );
              if (inputElement) {
                inputElement.focus();
              }
            }}
          >
            <SystemClear
              className={clsx(
                "w-5 text-gray-300 hover:text-gray-500 transition absolute right-3 top-1/2 transform -translate-y-1/2",
                isDark && "text-gray-600 hover:text-gray-300"
              )}
            />
          </button>
        )}
      </div>
    </div>
  );
}

export default forwardRef(Search);
