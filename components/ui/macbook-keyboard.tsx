"use client"

import React from "react"
import {
  AudioLines,
  VolumeX,
  Calculator,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Globe,
  Maximize,
  Mic,
  Moon,
  Play,
  Search,
  SkipBack,
  SkipForward,
  Sun,
  Volume2,
} from "lucide-react"

type KeyProps = {
  label?: React.ReactNode
  subLabel?: React.ReactNode
  icon?: React.ReactNode
  wide?: "sm" | "md" | "lg" | "xl"
}

const keyBase =
  "p-[0.5px] rounded-[4px] bg-white/[0.2] shadow-md shadow-white/55 hover:shadow-none hover:scale-[0.98] cursor-pointer transition duration-100"

const keyInsetStyle: React.CSSProperties = {
  boxShadow:
    "rgb(13, 13, 15) 0px -0.5px 2px 0px inset, rgb(13, 13, 15) -0.5px 0px 2px 0px inset",
}

const widthMap: Record<NonNullable<KeyProps["wide"]>, string> = {
  sm: "w-10",
  md: "w-[2.85rem]",
  lg: "w-[3.65rem]",
  xl: "w-[8.2rem]",
}

const Key = ({ label, subLabel, icon, wide }: KeyProps) => {
  return (
    <div className={keyBase}>
      <div
        className={`h-6 ${wide ? widthMap[wide] : "w-6"} bg-[#08090d] rounded-[3.5px] flex items-center justify-center`}
        style={keyInsetStyle}
      >
        <div className="text-[5px] w-full h-full text-white px-[3px] py-[2px] flex flex-col items-center justify-center leading-none font-medium">
          {icon && <span className="mb-[1px]">{icon}</span>}
          {subLabel && <span className="opacity-90">{subLabel}</span>}
          {label && <span>{label}</span>}
        </div>
      </div>
    </div>
  )
}

const MacBookKeyboard = () => {
  const functionRow = [
    { label: "esc", wide: "sm" as const },
    { icon: <Sun className="h-[6px] w-[6px]" />, label: "F1" },
    { icon: <Moon className="h-[6px] w-[6px]" />, label: "F2" },
    { icon: <Calculator className="h-[6px] w-[6px]" />, label: "F3" },
    { icon: <Search className="h-[6px] w-[6px]" />, label: "F4" },
    { icon: <Mic className="h-[6px] w-[6px]" />, label: "F5" },
    { icon: <Moon className="h-[6px] w-[6px]" />, label: "F6" },
    { icon: <SkipBack className="h-[6px] w-[6px]" />, label: "F7" },
    { icon: <Play className="h-[6px] w-[6px]" />, label: "F8" },
    { icon: <SkipForward className="h-[6px] w-[6px]" />, label: "F9" },
    { icon: <VolumeX className="h-[6px] w-[6px]" />, label: "F10" },
    { icon: <Volume2 className="h-[6px] w-[6px]" />, label: "F11" },
    { icon: <AudioLines className="h-[6px] w-[6px]" />, label: "F12" },
    { icon: <div className="h-4 w-4 rounded-full bg-black/80" /> },
  ]

  const row1 = ["~`", "!1", "@2", "#3", "$4", "%5", "^6", "&7", "*8", "(9", ")0", "_-", "+="]
  const row2 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{[", "}]", "|\\"]
  const row3 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", ":;", "\"'"]
  const row4 = ["Z", "X", "C", "V", "B", "N", "M", "<,", ">.", "?/"]

  return (
    <div>
      <div className="flex flex-row items-center justify-center gap-10 max-w-[88rem] mx-auto w-full">
        <div className="relative rounded-md bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 border border-white/20 p-1 translate-y-6 scale-[0.9] sm:scale-100 md:scale-[1.08] w-fit h-fit mx-auto shadow-[0_10px_40px_rgba(255,255,255,0.12),0_35px_60px_rgba(0,0,0,0.65)]">
          <div className="flex gap-[2px] mb-[2px] w-full flex-shrink-0">
            {functionRow.map((key, i) => (
              <Key key={`f-${i}`} label={key.label} icon={key.icon} wide={key.wide} />
            ))}
          </div>

          <div className="flex gap-[2px] mb-[2px] w-full flex-shrink-0">
            {row1.map((v) => (
              <Key key={v} subLabel={v[0]} label={v[1]} />
            ))}
            <Key label="delete" wide="sm" />
          </div>

          <div className="flex gap-[2px] mb-[2px] w-full flex-shrink-0">
            <Key label="tab" wide="sm" />
            {row2.map((v) => (
              <Key key={v} subLabel={v[0]} label={v[1]} />
            ))}
          </div>

          <div className="flex gap-[2px] mb-[2px] w-full flex-shrink-0">
            <Key label="caps lock" wide="md" />
            {row3.map((v) => (
              <Key key={v} subLabel={v[0]} label={v[1]} />
            ))}
            <Key label="return" wide="md" />
          </div>

          <div className="flex gap-[2px] mb-[2px] w-full flex-shrink-0">
            <Key label="shift" wide="lg" />
            {row4.map((v) => (
              <Key key={v} subLabel={v[0]} label={v[1]} />
            ))}
            <Key label="shift" wide="lg" />
          </div>

          <div className="flex gap-[2px] mb-[2px] w-full flex-shrink-0">
            <Key icon={<Globe className="h-[6px] w-[6px]" />} label="fn" />
            <Key icon={<ChevronUp className="h-[6px] w-[6px]" />} label="control" />
            <Key icon={<Maximize className="h-[6px] w-[6px]" />} label="option" />
            <Key icon={<Maximize className="h-[6px] w-[6px]" />} label="command" />
            <Key wide="xl" />
            <Key icon={<Maximize className="h-[6px] w-[6px]" />} label="command" />
            <Key icon={<Maximize className="h-[6px] w-[6px]" />} label="option" />
            <div className="w-[4.9rem] mt-[2px] h-6 p-[0.5px] rounded-[4px] flex flex-col justify-end items-center">
              <div className="flex gap-[0.5px]">
                <Key icon={<ChevronLeft className="h-[6px] w-[6px]" />} />
                <div className="flex flex-col gap-[0.5px]">
                  <Key icon={<ChevronUp className="h-[6px] w-[6px]" />} />
                  <Key icon={<ChevronDown className="h-[6px] w-[6px]" />} />
                </div>
                <Key icon={<ChevronRight className="h-[6px] w-[6px]" />} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MacBookKeyboard
