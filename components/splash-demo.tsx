"use client"

import { useState } from "react"

export default function SplashDemo() {
  const [activeEffect, setActiveEffect] = useState<string>("liquid-splash")

  return (
    <div className="forum-card animate-fade-in">
      <h2 className="text-lg font-medium mb-3 pixel-text">
        TRON Red Splash Effects
        <span className="chinese-caption block">波场红色飞溅效果</span>
      </h2>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-4">
          Click on the buttons below to see different splash effects. These effects can be applied to any clickable
          element.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`px-3 py-1 text-sm border ${activeEffect === "liquid-splash" ? "border-tron text-tron" : "border-muted-foreground text-muted-foreground"}`}
            onClick={() => setActiveEffect("liquid-splash")}
          >
            Liquid Splash
          </button>
          <button
            className={`px-3 py-1 text-sm border ${activeEffect === "droplet-effect" ? "border-tron text-tron" : "border-muted-foreground text-muted-foreground"}`}
            onClick={() => setActiveEffect("droplet-effect")}
          >
            Droplet Effect
          </button>
          <button
            className={`px-3 py-1 text-sm border ${activeEffect === "multi-droplet" ? "border-tron text-tron" : "border-muted-foreground text-muted-foreground"}`}
            onClick={() => setActiveEffect("multi-droplet")}
          >
            Multi-Droplet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`bg-card border border-dashed border-tron/40 flex items-center justify-center p-6 h-32 ${activeEffect} tron-highlight`}
        >
          <span className="text-center">Click Me!</span>
        </div>

        <button className={`tron-button ${activeEffect}`}>
          TRON Button
          <span className="chinese-caption block">波场按钮</span>
        </button>

        <div className={`forum-card ${activeEffect} tron-highlight`}>
          <p className="text-center">Interactive Card</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button className={`bracket-button ${activeEffect}`}>
          Try the effect on any element!
          <span className="chinese-caption block">在任何元素上尝试效果！</span>
        </button>
      </div>
    </div>
  )
}
