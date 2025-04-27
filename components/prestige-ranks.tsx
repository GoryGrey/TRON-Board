import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const prestigeRanks = [
  {
    score: "0-49",
    rank: "凡人 • Commoner",
    chinese: "凡人",
    english: "Commoner",
    perks: "Cannot post more than once every 24 hours",
    color: "text-gray-400",
  },
  {
    score: "50-99",
    rank: "弟子 • Disciple",
    chinese: "弟子",
    english: "Disciple",
    perks: "No external links until 10威望值",
    color: "text-blue-400",
  },
  {
    score: "100-199",
    rank: "内门 • Inner Gate Disciple",
    chinese: "内门",
    english: "Inner Gate Disciple",
    perks: "Normal usage",
    color: "text-green-400",
  },
  {
    score: "200-399",
    rank: "执事 • Steward",
    chinese: "执事",
    english: "Steward",
    perks: "Eligible for invite-only threads",
    color: "text-yellow-400",
  },
  {
    score: "400-699",
    rank: "长老 • Elder",
    chinese: "长老",
    english: "Elder",
    perks: "Can see analytics previews early",
    color: "text-orange-400",
  },
  {
    score: "700-999",
    rank: "客卿 • Advisor",
    chinese: "客卿",
    english: "Advisor",
    perks: "Highlighted in comment threads",
    color: "text-purple-400",
  },
  {
    score: "1000+",
    rank: "宗师 • Grandmaster of TRON Board",
    chinese: "宗师",
    english: "Grandmaster of TRON Board",
    perks: "Red username, Leaderboard fame",
    color: "text-red-400",
  },
]

export default function PrestigeRanks() {
  return (
    <div>
      <h2 className="text-xl font-medium mb-2">
        威望值 Ranks
        <span className="chinese-caption block">威望值等级</span>
      </h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Score</TableHead>
              <TableHead>Rank</TableHead>
              <TableHead>Perks/Restrictions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prestigeRanks.map((rank) => (
              <TableRow key={rank.score}>
                <TableCell className="font-mono">{rank.score}</TableCell>
                <TableCell>
                  <span className={`${rank.color} font-medium`}>{rank.rank}</span>
                </TableCell>
                <TableCell
                  className={
                    rank.perks.includes("Cannot") || rank.perks.includes("No") ? "text-red-400" : "text-green-400"
                  }
                >
                  {rank.perks}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 p-3 border border-yellow-500/30 bg-yellow-500/10 rounded-sm">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Admin
          </Badge>
          <span className="text-yellow-500 font-medium">管理员 • TRON Board Court Official</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Full admin rights, Override score, Moderate users</p>
      </div>
    </div>
  )
}
