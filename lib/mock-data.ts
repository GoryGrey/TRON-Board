import { Bitcoin, Cpu, Gamepad2, Globe, Landmark, Layers, Rocket, ShieldAlert, Wallet, Briefcase } from "lucide-react"

// Boards
export const boards = [
  {
    id: "crypto",
    name: "Crypto General",
    chinese: "加密货币综合",
    description: "General discussion about cryptocurrencies, blockchain technology, and the market.",
    icon: Bitcoin,
    postCount: 1243,
  },
  {
    id: "defi",
    name: "DeFi",
    chinese: "去中心化金融",
    description: "Discuss decentralized finance protocols, yield farming, liquidity mining, and more.",
    icon: Landmark,
    postCount: 856,
  },
  {
    id: "nft",
    name: "NFTs & Collectibles",
    chinese: "非同质化代币",
    description: "Share and discuss NFT projects, digital art, and collectibles in the blockchain space.",
    icon: Layers,
    postCount: 721,
  },
  {
    id: "dao",
    name: "DAOs & Governance",
    chinese: "去中心化自治组织",
    description: "Discussions about decentralized autonomous organizations and governance models.",
    icon: ShieldAlert,
    postCount: 324,
  },
  {
    id: "tech",
    name: "Blockchain Tech",
    chinese: "区块链技术",
    description: "Technical discussions about blockchain development, protocols, and infrastructure.",
    icon: Cpu,
    postCount: 567,
  },
  {
    id: "gaming",
    name: "Crypto Gaming",
    chinese: "加密游戏",
    description: "Talk about blockchain games, play-to-earn, and the future of gaming in Web3.",
    icon: Gamepad2,
    postCount: 432,
  },
  {
    id: "metaverse",
    name: "Metaverse",
    chinese: "元宇宙",
    description: "Discussions about virtual worlds, digital identity, and the metaverse ecosystem.",
    icon: Globe,
    postCount: 289,
  },
  {
    id: "wallet",
    name: "Wallets & Security",
    chinese: "钱包与安全",
    description: "Tips, questions, and discussions about crypto wallets and security best practices.",
    icon: Wallet,
    postCount: 178,
  },
  {
    id: "new-projects", // Changed from "projects" to "new-projects" to avoid duplicate ID
    name: "New Projects",
    chinese: "新项目",
    description: "Discover and discuss new and upcoming blockchain projects and tokens.",
    icon: Rocket,
    postCount: 412,
  },
  {
    id: "projects",
    name: "Projects",
    chinese: "项目",
    description: "Share and discuss your projects with the community",
    icon: Briefcase,
    postCount: 42,
    color: "bg-blue-500",
  },
]

// Posts
export const posts = [
  {
    id: "post1",
    title: "The Future of DeFi: Trends to Watch in 2025",
    content:
      "Decentralized Finance (DeFi) has evolved significantly since its inception. As we move into 2025, several key trends are emerging that could reshape the landscape.\n\nFirst, we're seeing increased institutional adoption of DeFi protocols. Major financial institutions are no longer just experimenting with blockchain technology but are actively integrating DeFi solutions into their operations.\n\nSecond, cross-chain interoperability is becoming a reality. Projects that enable seamless asset transfers between different blockchains are gaining traction, reducing friction and expanding the possibilities for DeFi applications.\n\nThird, regulatory clarity is slowly emerging in major jurisdictions, providing a more stable environment for innovation while protecting users.\n\nWhat trends are you most excited about in the DeFi space?",
    author: {
      id: "user1",
      name: "CryptoVisionary",
      avatar: "/placeholder.svg?height=40&width=40",
      prestigeScore: 1245,
      isAdmin: false,
    },
    board: {
      id: "defi",
      name: "DeFi",
      chinese: "去中心化金融",
    },
    createdAt: new Date("2025-03-15T10:30:00"),
    commentCount: 24,
    likeCount: 78,
    tags: ["defi", "trends", "finance", "blockchain"],
  },
  {
    id: "post2",
    title: "Getting Started with NFT Creation: A Beginner's Guide",
    content:
      "Creating your first NFT can seem intimidating, but it's actually quite accessible even for beginners. Here's a simple guide to get you started.\n\nFirst, choose your blockchain. Ethereum is the most popular for NFTs, but alternatives like Solana or Tezos offer lower fees and environmental impact.\n\nNext, prepare your digital asset. This could be artwork, music, a video, or any digital file you want to tokenize. Make sure you own the rights to the content!\n\nThen, select an NFT marketplace. Platforms like OpenSea, Rarible, or Foundation each have their own benefits and target audiences.\n\nFinally, connect your wallet, upload your file, set your pricing, and mint your NFT.\n\nHas anyone here recently created their first NFT? What was your experience like?",
    author: {
      id: "user2",
      name: "ArtisticCoder",
      avatar: "/placeholder.svg?height=40&width=40",
      prestigeScore: 450,
      isAdmin: false,
    },
    board: {
      id: "nft",
      name: "NFTs & Collectibles",
      chinese: "非同质化代币",
    },
    createdAt: new Date("2025-03-10T14:45:00"),
    commentCount: 15,
    likeCount: 42,
    tags: ["nft", "art", "creation", "guide"],
  },
  {
    id: "post3",
    title: "DAO Governance Models: Comparing Different Approaches",
    content:
      "Decentralized Autonomous Organizations (DAOs) have experimented with various governance models, each with its own strengths and weaknesses.\n\nToken-weighted voting is the most common approach, where voting power is proportional to token holdings. This is simple but can lead to plutocracy where wealthy members dominate decision-making.\n\nQuadratic voting attempts to address this by making each additional vote more expensive, giving more voice to smaller holders while still rewarding larger stakeholders.\n\nReputation-based systems assign voting power based on contributions and participation rather than token holdings, potentially creating more meritocratic governance.\n\nMulti-signature (multisig) approaches require approval from multiple designated key holders, offering security but potentially sacrificing decentralization.\n\nWhat governance model do you think strikes the best balance between efficiency, security, and true decentralization?",
    author: {
      id: "user3",
      name: "GovExpert",
      avatar: "/placeholder.svg?height=40&width=40",
      prestigeScore: 780,
      isAdmin: false,
    },
    board: {
      id: "dao",
      name: "DAOs & Governance",
      chinese: "去中心化自治组织",
    },
    createdAt: new Date("2025-03-05T09:15:00"),
    commentCount: 31,
    likeCount: 56,
    tags: ["dao", "governance", "voting", "decentralization"],
  },
  {
    id: "post4",
    title: "Layer 2 Scaling Solutions: A Technical Comparison",
    content:
      "As Ethereum and other Layer 1 blockchains continue to face scaling challenges, Layer 2 solutions have emerged as critical infrastructure. Let's compare the main approaches:\n\nOptimistic Rollups (like Optimism and Arbitrum) batch transactions off-chain and post only the transaction data to the main chain. They assume transactions are valid by default but allow for fraud proofs if someone detects an invalid state transition. They offer good compatibility with existing smart contracts but have longer withdrawal periods.\n\nZK-Rollups (like zkSync and StarkNet) also batch transactions off-chain but use zero-knowledge proofs to validate state transitions. This provides faster finality and potentially better security, but with more complex technology and sometimes limited smart contract compatibility.\n\nValidiums use zero-knowledge proofs but store data off-chain, offering even higher throughput at the cost of some data availability guarantees.\n\nState channels and Plasma are earlier scaling solutions that still have specific use cases but haven't seen as wide adoption as rollups.\n\nWhich scaling solution do you think will dominate in the coming years?",
    author: {
      id: "user4",
      name: "ScalingWizard",
      avatar: "/placeholder.svg?height=40&width=40",
      prestigeScore: 620,
      isAdmin: false,
    },
    board: {
      id: "tech",
      name: "Blockchain Tech",
      chinese: "区块链技术",
    },
    createdAt: new Date("2025-02-28T16:20:00"),
    commentCount: 19,
    likeCount: 67,
    tags: ["layer2", "scaling", "ethereum", "rollups", "zk"],
  },
  {
    id: "post5",
    title: "Play-to-Earn: Sustainable Game Economies in Blockchain",
    content:
      "The play-to-earn (P2E) gaming model exploded in popularity with games like Axie Infinity, but many early projects faced sustainability challenges. As the space matures, what makes for a sustainable P2E economy?\n\nBalanced token economics is crucial. Games need mechanisms to remove tokens from circulation (sinks) that match or exceed the rate of new token creation (sources).\n\nReal gameplay value is essential. Games that are fun to play regardless of earning potential attract a more diverse player base beyond pure profit-seekers.\n\nMultiple revenue streams help reduce dependence on continuous new player inflow. This might include cosmetic NFTs, battle passes, or tournament entry fees.\n\nSkill-based rewards rather than pure grinding can create more engaging experiences and reward player development.\n\nWhat P2E games do you think have the most sustainable economic models?",
    author: {
      id: "user5",
      name: "GameTheory",
      avatar: "/placeholder.svg?height=40&width=40",
      prestigeScore: 320,
      isAdmin: false,
    },
    board: {
      id: "gaming",
      name: "Crypto Gaming",
      chinese: "加密游戏",
    },
    createdAt: new Date("2025-02-25T11:10:00"),
    commentCount: 27,
    likeCount: 49,
    tags: ["gaming", "p2e", "gamefi", "economy"],
  },
]

// Trending Posts
export const trendingPosts = [
  posts[0],
  posts[2],
  posts[4],
  {
    id: "post6",
    title: "Virtual Land Ownership: The Economics of Digital Real Estate",
    content:
      "Digital land in metaverse platforms has become a significant investment category, with some parcels selling for millions of dollars. What drives these valuations, and is there fundamental value behind them?\n\nLocation remains important even in virtual worlds. Proximity to high-traffic areas, popular brands, or celebrity-owned parcels can significantly impact value.\n\nScarcity is artificially created by platform developers who limit the total supply of land, creating a market dynamic similar to physical real estate.\n\nUtility varies widely between platforms. Some virtual lands are purely speculative, while others allow owners to monetize through advertising, experiences, or games.\n\nInteroperability between metaverse platforms could dramatically change valuations if assets become portable across different virtual worlds.\n\nAre you investing in metaverse real estate? What factors do you consider most important?",
    author: {
      id: "user6",
      name: "MetaInvestor",
      avatar: "/placeholder.svg?height=40&width=40",
      prestigeScore: 510,
      isAdmin: false,
    },
    board: {
      id: "metaverse",
      name: "Metaverse",
      chinese: "元宇宙",
    },
    createdAt: new Date("2025-02-20T13:25:00"),
    commentCount: 22,
    likeCount: 38,
    tags: ["metaverse", "land", "investment", "virtual"],
  },
]

// Recent Posts
export const recentPosts = [
  {
    id: "post7",
    title: "Hardware Wallet Comparison: Security vs. Convenience",
    content:
      "Hardware wallets are considered the gold standard for crypto security, but they vary significantly in features and user experience. Let's compare some popular options.\n\nLedger offers devices with secure elements and supports a wide range of cryptocurrencies, but has faced criticism after their customer database was leaked (though crypto assets remained secure).\n\nTrezor provides open-source hardware and software with good transparency but lacks a secure element chip, relying instead on their security model.\n\nGridPlus Lattice1 brings innovations like SafeCards and MetaMask integration but has a higher price point and a steeper learning curve.\n\nKeystone offers air-gapped security with QR code communication, eliminating USB attack vectors at the cost of some convenience.\n\nWhat hardware wallet do you use, and what factors were most important in your decision?",
    author: {
      id: "user7",
      name: "SecurityFirst",
      avatar: "/placeholder.svg?height=40&width=40",
      prestigeScore: 920,
      isAdmin: false,
    },
    board: {
      id: "wallet",
      name: "Wallets & Security",
      chinese: "钱包与安全",
    },
    createdAt: new Date("2025-03-18T08:40:00"),
    commentCount: 14,
    likeCount: 31,
    tags: ["security", "hardware", "wallet", "comparison"],
  },
  {
    id: "post8",
    title: "Tokenomics Red Flags: What to Watch Out For",
    content:
      "When evaluating new crypto projects, tokenomics can reveal a lot about a project's potential longevity and fairness. Here are some red flags to watch for:\n\nExcessive team/investor allocations, especially with short or no vesting periods, can lead to dumping and misaligned incentives.\n\nUnclear utility for the token within the ecosystem might indicate it exists primarily for fundraising rather than as a necessary component.\n\nHyperinflation through excessive emissions without adequate token sinks can continuously dilute holder value and create unsustainable price pressure.\n\nComplex or obscure tokenomics documentation might be hiding problematic mechanics that wouldn't stand up to scrutiny.\n\nCentralized control over token supply or protocol parameters undermines the decentralization ethos and creates single points of failure.\n\nWhat other tokenomics red flags have you encountered in your research?",
    author: {
      id: "user8",
      name: "TokenAnalyst",
      avatar: "/placeholder.svg?height=40&width=40",
      prestigeScore: 1100,
      isAdmin: false,
    },
    board: {
      id: "new-projects",
      name: "New Projects",
      chinese: "新项目",
    },
    createdAt: new Date("2025-03-17T15:55:00"),
    commentCount: 29,
    likeCount: 63,
    tags: ["tokenomics", "research", "investing", "analysis"],
  },
  {
    id: "post9",
    title: "Bitcoin's Role in a Multi-Chain Future",
    content:
      "As the blockchain ecosystem diversifies with specialized Layer 1s and Layer 2 solutions, Bitcoin's role continues to evolve. How do you see Bitcoin fitting into this multi-chain future?\n\nStore of value remains Bitcoin's primary use case, with its fixed supply and security through proof-of-work establishing it as 'digital gold' and a hedge against inflation.\n\nPayment networks built on top of Bitcoin, like Lightning Network, are improving its utility for everyday transactions while maintaining security.\n\nBitcoin as collateral is growing through wrapped Bitcoin (WBTC) and other representations on smart contract platforms, enabling Bitcoin holders to participate in DeFi without selling.\n\nSidechain and Layer 2 innovations like Rootstock (RSK) and Stacks are bringing smart contract functionality to Bitcoin, though adoption has been slower than competing ecosystems.\n\nDo you think Bitcoin will remain primarily a store of value, or will its utility expand significantly through these additional layers?",
    author: {
      id: "user9",
      name: "BitcoinMaxi",
      avatar: "/placeholder.svg?height=40&width=40",
      prestigeScore: 1350,
      isAdmin: false,
    },
    board: {
      id: "crypto",
      name: "Crypto General",
      chinese: "加密货币综合",
    },
    createdAt: new Date("2025-03-16T12:05:00"),
    commentCount: 42,
    likeCount: 81,
    tags: ["bitcoin", "multichain", "layer2", "future"],
  },
  posts[1],
  posts[3],
]

// Board Posts
export const boardPosts: Record<string, any[]> = {
  crypto: [
    recentPosts[2],
    {
      id: "post10",
      title: "Crypto Adoption in Emerging Markets: Case Studies",
      content:
        "While much of the crypto discourse focuses on developments in North America and Europe, some of the most interesting adoption stories are happening in emerging markets. Let's look at some case studies.\n\nIn Nigeria, high inflation and currency controls have driven significant peer-to-peer Bitcoin trading volume as citizens seek to preserve value and facilitate remittances.\n\nEl Salvador's Bitcoin legal tender experiment has faced mixed results but represents an unprecedented national-level embrace of cryptocurrency.\n\nArgentina's persistent inflation problems have made stablecoins particularly popular for savings, with even non-technical users turning to crypto to preserve purchasing power.\n\nIn the Philippines, play-to-earn gaming exploded during the pandemic, providing alternative income sources when traditional employment was limited.\n\nWhat other emerging market crypto adoption stories have caught your attention?",
      author: {
        id: "user10",
        name: "GlobalCrypto",
        avatar: "/placeholder.svg?height=40&width=40",
        prestigeScore: 280,
        isAdmin: false,
      },
      board: {
        id: "crypto",
        name: "Crypto General",
        chinese: "加密货币综合",
      },
      createdAt: new Date("2025-03-14T17:30:00"),
      commentCount: 18,
      likeCount: 45,
      tags: ["adoption", "emerging", "global", "case-study"],
    },
  ],
  defi: [
    posts[0],
    {
      id: "post11",
      title: "Real-World Assets (RWAs) in DeFi: Progress and Challenges",
      content:
        "The tokenization of real-world assets (RWAs) on blockchain is often cited as a multi-trillion dollar opportunity. What progress has been made, and what challenges remain?\n\nReal estate tokenization projects are creating fractional ownership of properties, increasing liquidity and lowering barriers to entry, though regulatory frameworks are still developing.\n\nPrivate market securities are being brought on-chain by platforms like Maple Finance and Centrifuge, enabling DeFi lending against traditionally illiquid assets.\n\nCommodity tokenization is allowing for more efficient trading and settlement of physical goods, with projects focusing on precious metals, carbon credits, and agricultural products.\n\nRegulatory clarity remains the biggest hurdle, with questions around securities laws, KYC/AML requirements, and legal recognition of on-chain ownership.\n\nTechnical challenges include oracle reliability for real-world data and creating standardized frameworks for diverse asset types.\n\nWhat RWA use cases are you most excited about?",
      author: {
        id: "user11",
        name: "RWAexplorer",
        avatar: "/placeholder.svg?height=40&width=40",
        prestigeScore: 850,
        isAdmin: false,
      },
      board: {
        id: "defi",
        name: "DeFi",
        chinese: "去中心化金融",
      },
      createdAt: new Date("2025-03-12T10:15:00"),
      commentCount: 23,
      likeCount: 52,
      tags: ["rwa", "tokenization", "defi", "regulation"],
    },
  ],
  nft: [
    posts[1],
    {
      id: "post12",
      title: "Beyond Art: Utility-Focused NFT Projects",
      content:
        "While NFTs are often associated with digital art and collectibles, many projects are exploring utility-focused applications. Here are some interesting examples:\n\nMembership and access NFTs grant holders special privileges, community access, or voting rights, functioning as blockchain-verified keys to exclusive experiences.\n\nGaming NFTs represent in-game assets with real ownership, allowing players to truly own, trade, and sometimes use items across different games.\n\nIdentity and credential NFTs are being explored for verifiable credentials, professional certifications, and reputation systems that users control.\n\nIntellectual property and licensing NFTs enable creators to maintain ownership while granting specific usage rights, potentially revolutionizing content licensing.\n\nWhat utility-focused NFT projects have you found most compelling?",
      author: {
        id: "user12",
        name: "NFTutility",
        avatar: "/placeholder.svg?height=40&width=40",
        prestigeScore: 680,
        isAdmin: false,
      },
      board: {
        id: "nft",
        name: "NFTs & Collectibles",
        chinese: "非同质化代币",
      },
      createdAt: new Date("2025-03-09T14:20:00"),
      commentCount: 16,
      likeCount: 37,
      tags: ["nft", "utility", "use-case", "innovation"],
    },
  ],
  projects: [
    {
      id: "proj1",
      title: "Launching my first dApp on TRON",
      content: "I'm excited to share my first decentralized application built on the TRON blockchain...",
      author: {
        id: "user5",
        name: "DevBuilder",
        avatar: "/placeholder.svg?height=40&width=40",
        prestigeScore: 320,
        isAdmin: false,
      },
      board: {
        id: "projects",
        name: "Projects",
        chinese: "项目",
      },
      createdAt: new Date("2023-03-15T14:30:00Z"),
      commentCount: 18,
      likeCount: 42,
      tags: ["development", "dapp", "tron"],
      isSticky: true,
      isHot: true,
    },
    {
      id: "proj2",
      title: "Open source blockchain analytics tool",
      content: "I've been working on an open source tool for analyzing blockchain data...",
      author: {
        id: "user8",
        name: "DataWizard",
        avatar: "/placeholder.svg?height=40&width=40",
        prestigeScore: 1100,
        isAdmin: false,
      },
      board: {
        id: "projects",
        name: "Projects",
        chinese: "项目",
      },
      createdAt: new Date("2023-03-10T09:15:00Z"),
      commentCount: 14,
      likeCount: 36,
      tags: ["analytics", "open-source", "tools"],
      isSticky: false,
      isHot: true,
    },
    {
      id: "proj3",
      title: "Looking for collaborators on a DeFi project",
      content: "I'm building a new DeFi protocol and looking for smart contract developers...",
      author: {
        id: "user12",
        name: "DeFiBuilder",
        avatar: "/placeholder.svg?height=40&width=40",
        prestigeScore: 680,
        isAdmin: false,
      },
      board: {
        id: "projects",
        name: "Projects",
        chinese: "项目",
      },
      createdAt: new Date("2023-03-05T16:45:00Z"),
      commentCount: 22,
      likeCount: 28,
      tags: ["defi", "collaboration", "development"],
      isSticky: false,
      isHot: false,
    },
  ],
  "tron-general": [
    // existing posts...
  ],
  "tron-defi": [
    // existing posts...
  ],
}

// Comments
export const comments = {
  post1: [
    {
      id: "comment1",
      content:
        "I think institutional adoption is the most significant trend. Once traditional finance fully embraces DeFi, we'll see unprecedented capital inflows and mainstream legitimacy.",
      author: {
        id: "user5",
        name: "GameTheory",
        avatar: "/placeholder.svg?height=32&width=32",
        prestigeScore: 320,
        isAdmin: false,
      },
      createdAt: new Date("2025-03-15T11:05:00"),
      likeCount: 12,
      replyCount: 2,
      isLoggedIn: false,
    },
    {
      id: "comment2",
      content:
        "Cross-chain interoperability is definitely the key. The future isn't one chain to rule them all, but specialized chains that can seamlessly work together. Projects like Polkadot and Cosmos are laying important groundwork here.",
      author: {
        id: "user3",
        name: "GovExpert",
        avatar: "/placeholder.svg?height=32&width=32",
        prestigeScore: 780,
        isAdmin: false,
      },
      createdAt: new Date("2025-03-15T12:30:00"),
      likeCount: 8,
      replyCount: 1,
      isLoggedIn: false,
    },
    {
      id: "comment3",
      content:
        "I'm concerned about regulatory overreach. While some clarity is good, too much regulation could stifle innovation and undermine the decentralized ethos of DeFi.",
      author: {
        id: "user8",
        name: "TokenAnalyst",
        avatar: "/placeholder.svg?height=32&width=32",
        prestigeScore: 1100,
        isAdmin: false,
      },
      createdAt: new Date("2025-03-15T14:15:00"),
      likeCount: 15,
      replyCount: 3,
      isLoggedIn: false,
    },
  ],
  post2: [
    {
      id: "comment4",
      content:
        "I created my first NFT last month! Used Polygon to avoid the high Ethereum gas fees. The process was surprisingly straightforward, though marketing it effectively has been the real challenge.",
      author: {
        id: "user6",
        name: "MetaInvestor",
        avatar: "/placeholder.svg?height=32&width=32",
        prestigeScore: 510,
        isAdmin: false,
      },
      createdAt: new Date("2025-03-10T15:20:00"),
      likeCount: 6,
      replyCount: 1,
      isLoggedIn: false,
    },
    {
      id: "comment5",
      content:
        "Great guide! I'd add that choosing the right marketplace for your specific type of content is crucial. OpenSea is great for general NFTs, but platforms like Sound.xyz for music or Art Blocks for generative art might be better for specific creators.",
      author: {
        id: "user12",
        name: "NFTutility",
        avatar: "/placeholder.svg?height=32&width=32",
        prestigeScore: 680,
        isAdmin: false,
      },
      createdAt: new Date("2025-03-10T16:45:00"),
      likeCount: 9,
      replyCount: 0,
      isLoggedIn: false,
    },
  ],
}

// Users
export const users = [
  {
    id: "user1",
    name: "CryptoVisionary",
    avatar: "/placeholder.svg?height=96&width=96",
    bio: "DeFi researcher and writer. Exploring the future of finance one block at a time.",
    joinedAt: new Date("2023-05-10"),
    reputation: 1250,
    level: 8,
    badges: ["Top Contributor", "DeFi Expert"],
    postCount: 47,
    commentCount: 183,
    prestigeScore: 1245,
    isAdmin: false,
  },
  {
    id: "user2",
    name: "ArtisticCoder",
    avatar: "/placeholder.svg?height=96&width=96",
    bio: "Digital artist and smart contract developer. Creating at the intersection of art and technology.",
    joinedAt: new Date("2023-07-22"),
    reputation: 890,
    level: 6,
    badges: ["NFT Creator", "Code Contributor"],
    postCount: 31,
    commentCount: 124,
    prestigeScore: 450,
    isAdmin: false,
  },
  {
    id: "user3",
    name: "GovExpert",
    avatar: "/placeholder.svg?height=96&width=96",
    bio: "Specializing in DAO governance and tokenomics. Former traditional finance, now full crypto.",
    joinedAt: new Date("2023-03-15"),
    reputation: 1420,
    level: 9,
    badges: ["Governance Guru", "Top Voter"],
    postCount: 52,
    commentCount: 267,
    prestigeScore: 780,
    isAdmin: false,
  },
]

// Current User
export const currentUser = {
  id: "current",
  name: "CryptoExplorer",
  avatar: "/placeholder.svg?height=96&width=96",
  bio: "Crypto enthusiast learning and sharing knowledge about Web3 and blockchain technology.",
  joinedAt: new Date("2024-01-05"),
  reputation: 340,
  level: 4,
  badges: ["Active Participant"],
  postCount: 12,
  commentCount: 48,
  prestigeScore: 95,
  isAdmin: false,
}

// User Posts
export const userPosts = [
  {
    id: "userpost1",
    title: "My Experience with Different DEXs: A Comparison",
    content:
      "After using various decentralized exchanges for the past year, I wanted to share my experiences and compare them across different aspects like fees, user experience, and liquidity...",
    author: {
      id: "current",
      name: "CryptoExplorer",
      avatar: "/placeholder.svg?height=40&width=40",
      prestigeScore: 95,
      isAdmin: false,
    },
    board: {
      id: "defi",
      name: "DeFi",
      chinese: "去中心化金融",
    },
    createdAt: new Date("2025-03-01T09:45:00"),
    commentCount: 8,
    likeCount: 21,
    tags: ["defi", "dex", "comparison", "trading"],
  },
  {
    id: "userpost2",
    title: "Beginner's Guide to Crypto Security",
    content:
      "After learning some security lessons the hard way, I've compiled this guide for newcomers to help them protect their crypto assets and avoid common pitfalls...",
    author: {
      id: "current",
      name: "CryptoExplorer",
      avatar: "/placeholder.svg?height=40&width=40",
      prestigeScore: 95,
      isAdmin: false,
    },
    board: {
      id: "wallet",
      name: "Wallets & Security",
      chinese: "钱包与安全",
    },
    createdAt: new Date("2025-02-15T14:20:00"),
    commentCount: 12,
    likeCount: 34,
    tags: ["security", "beginner", "guide", "wallet"],
  },
]

// User Comments
export const userComments = [
  {
    id: "usercomment1",
    content:
      "I've been using ZK-rollups for a few months now and the speed improvement is remarkable. The only downside is that some dApps I use haven't deployed there yet.",
    author: {
      id: "current",
      name: "CryptoExplorer",
      avatar: "/placeholder.svg?height=32&width=32",
      prestigeScore: 95,
      isAdmin: false,
    },
    createdAt: new Date("2025-03-10T11:25:00"),
    likeCount: 5,
    replyCount: 2,
    isLoggedIn: true,
  },
  {
    id: "usercomment2",
    content:
      "Great analysis! I'd add that community governance is also a critical factor in a project's long-term success. Projects with engaged communities tend to adapt better to market changes.",
    author: {
      id: "current",
      name: "CryptoExplorer",
      avatar: "/placeholder.svg?height=32&width=32",
      prestigeScore: 95,
      isAdmin: false,
    },
    createdAt: new Date("2025-03-05T16:40:00"),
    likeCount: 7,
    replyCount: 1,
    isLoggedIn: true,
  },
]

// User Posts by User ID
export const userPostsByUserId = {
  user1: [
    {
      id: "user1post1",
      title: "Analyzing Yield Farming Strategies for Bear Markets",
      content:
        "In volatile market conditions, yield farming strategies need to be adjusted. Here's my analysis of approaches that can maintain returns while minimizing downside risk...",
      author: {
        id: "user1",
        name: "CryptoVisionary",
        avatar: "/placeholder.svg?height=40&width=40",
        prestigeScore: 1245,
        isAdmin: false,
      },
      board: {
        id: "defi",
        name: "DeFi",
        chinese: "去中心化金融",
      },
      createdAt: new Date("2025-03-05T10:15:00"),
      commentCount: 14,
      likeCount: 42,
      tags: ["defi", "yield", "farming", "strategy"],
    },
    {
      id: "user1post2",
      title: "The Evolution of DeFi: From Yield Farming to Real Utility",
      content:
        "DeFi has evolved significantly from the 'yield farming' era. This post examines how the sector is maturing toward sustainable models with genuine utility...",
      author: {
        id: "user1",
        name: "CryptoVisionary",
        avatar: "/placeholder.svg?height=40&width=40",
        prestigeScore: 1245,
        isAdmin: false,
      },
      board: {
        id: "defi",
        name: "DeFi",
        chinese: "去中心化金融",
      },
      createdAt: new Date("2025-02-20T13:30:00"),
      commentCount: 19,
      likeCount: 56,
      tags: ["defi", "evolution", "utility", "sustainability"],
    },
  ],
}

// User Comments by User ID
export const userCommentsByUserId = {
  user1: [
    {
      id: "user1comment1",
      content:
        "The integration of traditional finance with DeFi is inevitable, but it will require significant regulatory clarity. I expect we'll see regulated DeFi platforms emerge as a bridge between these worlds.",
      author: {
        id: "user1",
        name: "CryptoVisionary",
        avatar: "/placeholder.svg?height=32&width=32",
        prestigeScore: 1245,
        isAdmin: false,
      },
      createdAt: new Date("2025-03-12T09:20:00"),
      likeCount: 11,
      replyCount: 3,
      isLoggedIn: false,
    },
    {
      id: "user1comment2",
      content:
        "Excellent analysis. I'd add that liquidity fragmentation across too many chains could become a significant issue as the multi-chain ecosystem expands. We need better cross-chain liquidity solutions.",
      author: {
        id: "user1",
        name: "CryptoVisionary",
        avatar: "/placeholder.svg?height=32&width=32",
        prestigeScore: 1245,
        isAdmin: false,
      },
      createdAt: new Date("2025-03-08T14:45:00"),
      likeCount: 8,
      replyCount: 2,
      isLoggedIn: false,
    },
  ],
}

// Add the "projects" board to the mock data
export const newBoards = [
  {
    id: "general",
    name: "General Discussion",
    chinese: "综合讨论",
    description: "General discussion about crypto, blockchain, and Web3 topics.",
    icon: "💬",
    postCount: 1243,
    userCount: 567,
  },
  {
    id: "tron-general",
    name: "TRON General",
    chinese: "波场综合",
    description: "Discussions about TRON blockchain, news, and ecosystem.",
    icon: "🌐",
    postCount: 876,
    userCount: 432,
  },
  {
    id: "tron-defi",
    name: "TRON DeFi",
    chinese: "波场金融",
    description: "Discussions about DeFi projects and protocols on TRON.",
    icon: "💰",
    postCount: 543,
    userCount: 321,
  },
  {
    id: "nft",
    name: "NFT Gallery",
    chinese: "NFT 画廊",
    description: "Share and discuss NFTs, digital art, and collectibles.",
    icon: "🖼️",
    postCount: 432,
    userCount: 234,
  },
  {
    id: "trading",
    name: "Trading & Markets",
    chinese: "交易与市场",
    description: "Discussions about trading, market analysis, and price predictions.",
    icon: "📈",
    postCount: 765,
    userCount: 345,
  },
  {
    id: "projects",
    name: "Projects & Development",
    chinese: "项目与开发",
    description: "Showcase your blockchain projects and discuss development topics.",
    icon: "🛠️",
    postCount: 321,
    userCount: 178,
  },
]

// Add posts for the "projects" board
export const newBoardPosts = {
  crypto: [
    recentPosts[2],
    {
      id: "post10",
      title: "Crypto Adoption in Emerging Markets: Case Studies",
      content:
        "While much of the crypto discourse focuses on developments in North America and Europe, some of the most interesting adoption stories are happening in emerging markets. Let's look at some case studies.\n\nIn Nigeria, high inflation and currency controls have driven significant peer-to-peer Bitcoin trading volume as citizens seek to preserve value and facilitate remittances.\n\nEl Salvador's Bitcoin legal tender experiment has faced mixed results but represents an unprecedented national-level embrace of cryptocurrency.\n\nArgentina's persistent inflation problems have made stablecoins particularly popular for savings, with even non-technical users turning to crypto to preserve purchasing power.\n\nIn the Philippines, play-to-earn gaming exploded during the pandemic, providing alternative income sources when traditional employment was limited.\n\nWhat other emerging market crypto adoption stories have caught your attention?",
      author: {
        id: "user10",
        name: "GlobalCrypto",
        avatar: "/placeholder.svg?height=40&width=40",
        prestigeScore: 280,
        isAdmin: false,
      },
      board: {
        id: "crypto",
        name: "Crypto General",
        chinese: "加密货币综合",
      },
      createdAt: new Date("2025-03-14T17:30:00"),
      commentCount: 18,
      likeCount: 45,
      tags: ["adoption", "emerging", "global", "case-study"],
    },
  ],
  defi: [
    posts[0],
    {
      id: "post11",
      title: "Real-World Assets (RWAs) in DeFi: Progress and Challenges",
      content:
        "The tokenization of real-world assets (RWAs) on blockchain is often cited as a multi-trillion dollar opportunity. What progress has been made, and what challenges remain?\n\nReal estate tokenization projects are creating fractional ownership of properties, increasing liquidity and lowering barriers to entry, though regulatory frameworks are still developing.\n\nPrivate market securities are being brought on-chain by platforms like Maple Finance and Centrifuge, enabling DeFi lending against traditionally illiquid assets.\n\nCommodity tokenization is allowing for more efficient trading and settlement of physical goods, with projects focusing on precious metals, carbon credits, and agricultural products.\n\nRegulatory clarity remains the biggest hurdle, with questions around securities laws, KYC/AML requirements, and legal recognition of on-chain ownership.\n\nTechnical challenges include oracle reliability for real-world data and creating standardized frameworks for diverse asset types.\n\nWhat RWA use cases are you most excited about?",
      author: {
        id: "user11",
        name: "RWAexplorer",
        avatar: "/placeholder.svg?height=40&width=40",
        prestigeScore: 850,
        isAdmin: false,
      },
      board: {
        id: "defi",
        name: "DeFi",
        chinese: "去中心化金融",
      },
      createdAt: new Date("2025-03-12T10:15:00"),
      commentCount: 23,
      likeCount: 52,
      tags: ["rwa", "tokenization", "defi", "regulation"],
    },
  ],
  nft: [
    posts[1],
    {
      id: "post12",
      title: "Beyond Art: Utility-Focused NFT Projects",
      content:
        "While NFTs are often associated with digital art and collectibles, many projects are exploring utility-focused applications. Here are some interesting examples:\n\nMembership and access NFTs grant holders special privileges, community access, or voting rights, functioning as blockchain-verified keys to exclusive experiences.\n\nGaming NFTs represent in-game assets with real ownership, allowing players to truly own, trade, and sometimes use items across different games.\n\nIdentity and credential NFTs are being explored for verifiable credentials, professional certifications, and reputation systems that users control.\n\nIntellectual property and licensing NFTs enable creators to maintain ownership while granting specific usage rights, potentially revolutionizing content licensing.\n\nWhat utility-focused NFT projects have you found most compelling?",
      author: {
        id: "user12",
        name: "NFTutility",
        avatar: "/placeholder.svg?height=40&width=40",
        prestigeScore: 680,
        isAdmin: false,
      },
      board: {
        id: "nft",
        name: "NFTs & Collectibles",
        chinese: "非同质化代币",
      },
      createdAt: new Date("2025-03-09T14:20:00"),
      commentCount: 16,
      likeCount: 37,
      tags: ["nft", "utility", "use-case", "innovation"],
    },
  ],
  projects: [
    {
      id: "proj1",
      title: "Launching my first dApp on TRON",
      content: "I'm excited to share my first decentralized application built on the TRON blockchain...",
      author: {
        id: "user5",
        name: "DevBuilder",
        avatar: "/placeholder.svg?height=40&width=40",
        prestigeScore: 320,
        isAdmin: false,
      },
      board: {
        id: "projects",
        name: "Projects",
        chinese: "项目",
      },
      createdAt: new Date("2023-03-15T14:30:00Z"),
      commentCount: 18,
      likeCount: 42,
      tags: ["development", "dapp", "tron"],
      isSticky: true,
      isHot: true,
    },
    {
      id: "proj2",
      title: "Open source blockchain analytics tool",
      content: "I've been working on an open source tool for analyzing blockchain data...",
      author: {
        id: "user8",
        name: "DataWizard",
        avatar: "/placeholder.svg?height=40&width=40",
        prestigeScore: 1100,
        isAdmin: false,
      },
      board: {
        id: "projects",
        name: "Projects",
        chinese: "项目",
      },
      createdAt: new Date("2023-03-10T09:15:00Z"),
      commentCount: 14,
      likeCount: 36,
      tags: ["analytics", "open-source", "tools"],
      isSticky: false,
      isHot: true,
    },
    {
      id: "proj3",
      title: "Looking for collaborators on a DeFi project",
      content: "I'm building a new DeFi protocol and looking for smart contract developers...",
      author: {
        id: "user12",
        name: "DeFiBuilder",
        avatar: "/placeholder.svg?height=40&width=40",
        prestigeScore: 680,
        isAdmin: false,
      },
      board: {
        id: "projects",
        name: "Projects",
        chinese: "项目",
      },
      createdAt: new Date("2023-03-05T16:45:00Z"),
      commentCount: 22,
      likeCount: 28,
      tags: ["defi", "collaboration", "development"],
      isSticky: false,
      isHot: false,
    },
  ],
}

export const allBoards = [...boards, ...newBoards]
export const allBoardPosts = { ...boardPosts, ...newBoardPosts }
