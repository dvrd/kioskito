"use client";

import { type KeyboardEvent, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation'

import { ArrowRight } from "lucide-react";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { findProduct } from "@/lib/api";
import { shimmer, toBase64 } from "@/lib/utils";

type Option = Record<"value" | "label" | "img", string>;

export function SearchProduct() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Escape") {
        input.blur();
      }
    }
  };

  const handleSearch = (value: string) => {
    if (value.length === 0) {
      setOptions([])
    } else {
      startTransition(async () => {
        const response = await findProduct(value)
        if (response.ok) {
          let newOptions = response.value.products.map((product) => ({
            value: product.handle,
            label: product.title,
            img: product.featuredImage.url
          }));
          setOptions(newOptions)
        }
      })
    }
    setInputValue(value)
  }

  return (
    <Command onKeyDown={handleKeyDown} className="w-[350px] overflow-visible bg-transparent">
      <div
        className="group border border-input text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      >
        <CommandInput
          placeholder="Busque un producto..."
          className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          wrapperClassName="border-none focus-within:border-none"
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          ref={inputRef}
          value={inputValue}
          onValueChange={handleSearch}
        />
        <div className="relative z-10">
          {open && (
            <div className="absolute w-full top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              {loading && <CommandLoading />}
              {options.length > 0 && (
                <CommandList>
                  <CommandGroup heading="Productos">
                    {options.map((option) => (
                      <CommandItem
                        className="gap-4 cursor-pointer"
                        key={option.value}
                        value={option.value}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={(selected) => {
                          setOpen(false);
                          router.push(`/products/${selected}`);
                        }}
                      >
                        <Image
                          src={option.img}
                          alt={option.label}
                          width={60}
                          height={80}
                          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                          placeholder="blur"
                          className="h-auto w-auto object-cover animate-in zoom-out duration-300 transition-all hover:scale-105 aspect-square"
                        />
                        <span>{option.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              )}
              {inputValue.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setOpen(false);
                        router.push(`/search/?query=${inputValue}`);
                      }}
                      className="cursor-pointer"
                    >
                      Buscar: {inputValue}
                      <CommandShortcut>
                        <ArrowRight className="w-4 h-4" />
                      </CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Command>
  )
}
