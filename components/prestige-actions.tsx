"use client"

import { prestigeActions } from "@/lib/reputation"

interface PrestigeActionsProps {
  className?: string
}

export default function PrestigeActions({ className }: PrestigeActionsProps) {
  const positiveActions = Object.values(prestigeActions).filter((action) => action.value > 0)
  const negativeActions = Object.values(prestigeActions).filter((action) => action.value < 0)

  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-3 pixel-text">
        威望值 Actions
        <span className="chinese-caption block">威望值行动</span>
      </h3>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-green-400 mb-2">Positive Actions</h4>
          <div className="bg-card/50 border border-border p-3 rounded-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-2">Action</th>
                  <th className="text-right pb-2">威望值</th>
                </tr>
              </thead>
              <tbody>
                {positiveActions.map((action, index) => (
                  <tr key={index} className="border-b border-border/30 last:border-0">
                    <td className="py-2 text-muted-foreground">{action.description}</td>
                    <td className="py-2 text-right text-green-400">+{action.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-red-400 mb-2">Negative Actions</h4>
          <div className="bg-card/50 border border-border p-3 rounded-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-2">Action</th>
                  <th className="text-right pb-2">威望值</th>
                </tr>
              </thead>
              <tbody>
                {negativeActions.map((action, index) => (
                  <tr key={index} className="border-b border-border/30 last:border-0">
                    <td className="py-2 text-muted-foreground">{action.description}</td>
                    <td className="py-2 text-right text-red-400">{action.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
