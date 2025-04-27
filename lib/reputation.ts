// Reputation system for Yī Bāng (威望值 - Prestige Value)

export interface PrestigeRank {
  minScore: number
  title: {
    chinese: string
    english: string
  }
  color?: string
  restrictions?: string[]
  perks?: string[]
  isAdmin?: boolean
}

export interface PrestigeAction {
  type: string
  value: number
  description: string
}

// Prestige ranks based on 威望值 (Prestige Value)
export const prestigeRanks: PrestigeRank[] = [
  {
    minScore: 0,
    title: {
      chinese: "凡人",
      english: "Commoner",
    },
    color: "text-gray-400",
    restrictions: ["Cannot post more than once every 24 hours"],
  },
  {
    minScore: 50,
    title: {
      chinese: "弟子",
      english: "Disciple",
    },
    color: "text-blue-400",
    restrictions: ["No external links until 10威望值"],
  },
  {
    minScore: 100,
    title: {
      chinese: "内门",
      english: "Inner Gate Disciple",
    },
    color: "text-green-400",
    perks: ["Normal usage"],
  },
  {
    minScore: 200,
    title: {
      chinese: "执事",
      english: "Steward",
    },
    color: "text-yellow-400",
    perks: ["Eligible for invite-only threads"],
  },
  {
    minScore: 400,
    title: {
      chinese: "长老",
      english: "Elder",
    },
    color: "text-orange-400",
    perks: ["Can see analytics previews early"],
  },
  {
    minScore: 700,
    title: {
      chinese: "客卿",
      english: "Advisor",
    },
    color: "text-purple-400",
    perks: ["Highlighted in comment threads"],
  },
  {
    minScore: 1000,
    title: {
      chinese: "宗师",
      english: "Grandmaster of Yī Bāng",
    },
    color: "text-red-500",
    perks: ["Red username", "Leaderboard fame"],
  },
  {
    minScore: -1, // Special case for admins
    title: {
      chinese: "管理员",
      english: "Yī Bāng Court Official",
    },
    color: "text-amber-500",
    isAdmin: true,
    perks: ["Full admin rights", "Override score", "Moderate users"],
  },
]

// Prestige actions and their values
export const prestigeActions: Record<string, PrestigeAction> = {
  POST_LIKE: {
    type: "POST_LIKE",
    value: 2,
    description: "+1 like on user's post",
  },
  COMMENT_LIKE: {
    type: "COMMENT_LIKE",
    value: 1,
    description: "+1 like on user's comment",
  },
  POST_POPULAR: {
    type: "POST_POPULAR",
    value: 5,
    description: "Post receives 5+ likes",
  },
  CREATE_POST: {
    type: "CREATE_POST",
    value: 10,
    description: "Create a post",
  },
  CREATE_COMMENT: {
    type: "CREATE_COMMENT",
    value: 1,
    description: "Comment on someone else's post",
  },
  POST_TRENDING: {
    type: "POST_TRENDING",
    value: 25,
    description: "Post reaches trending",
  },
  POST_FLAGGED: {
    type: "POST_FLAGGED",
    value: -3,
    description: "Post is flagged/downvoted",
  },
  POST_DELETED: {
    type: "POST_DELETED",
    value: -10,
    description: "Spam/deleted post",
  },
  VIOLATION: {
    type: "VIOLATION",
    value: -30,
    description: "Violation or ban",
  },
  DAILY_LOGIN: {
    type: "DAILY_LOGIN",
    value: 1,
    description: "Daily login",
  },
}

// Get rank based on prestige score
export function getRankByScore(score: number, isAdmin = false): PrestigeRank {
  if (isAdmin) {
    return prestigeRanks[prestigeRanks.length - 1] // Admin rank
  }

  // Find the highest rank the user qualifies for
  for (let i = prestigeRanks.length - 2; i >= 0; i--) {
    if (score >= prestigeRanks[i].minScore) {
      return prestigeRanks[i]
    }
  }

  return prestigeRanks[0] // Default to lowest rank
}

// Format prestige score with commas
export function formatPrestigeScore(score: number): string {
  return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Generate reputation bar based on score
export function generateReputationBar(score: number): string {
  const maxStars = 10
  const filledStars = Math.min(Math.floor(score / 100), maxStars)
  return "✦".repeat(filledStars) + "·".repeat(Math.max(0, maxStars - filledStars))
}

// Check if user can perform an action based on their prestige rank
export function canPerformAction(action: string, userRank: PrestigeRank): boolean {
  switch (action) {
    case "CREATE_POST":
      // Commoners can only post once per 24 hours (would need timestamp checking in real implementation)
      return userRank.minScore >= 50 || userRank.isAdmin === true
    case "ADD_EXTERNAL_LINK":
      // Disciples cannot add external links
      return userRank.minScore >= 100 || userRank.isAdmin === true
    case "JOIN_INVITE_THREAD":
      // Only Stewards and above can join invite-only threads
      return userRank.minScore >= 200 || userRank.isAdmin === true
    case "VIEW_ANALYTICS":
      // Only Elders and above can see analytics previews
      return userRank.minScore >= 400 || userRank.isAdmin === true
    case "HIGHLIGHT_COMMENTS":
      // Only Advisors and above get highlighted comments
      return userRank.minScore >= 700 || userRank.isAdmin === true
    case "ACCESS_ADMIN":
      // Only admins can access admin features
      return userRank.isAdmin === true
    default:
      return true
  }
}

// Calculate prestige change for an action
export function calculatePrestigeChange(actionType: string, count = 1): number {
  const action = prestigeActions[actionType]
  if (!action) return 0
  return action.value * count
}
