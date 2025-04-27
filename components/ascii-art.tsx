interface AsciiArtProps {
  type: "header" | "divider" | "footer" | "box"
  text?: string
  className?: string
}

export default function AsciiArt({ type, text, className }: AsciiArtProps) {
  const getAsciiArt = () => {
    switch (type) {
      case "header":
        return (
          <div className={`text-center my-4 ${className}`}>
            <div className="text-primary/70 font-mono text-xs">
              <pre className="overflow-x-auto">
                {`
+----------------------------------------------+
|                                              |
|             ${text || "WELCOME TO TRON BOARD"}             |
|                                              |
+----------------------------------------------+
`}
              </pre>
            </div>
          </div>
        )
      case "divider":
        return (
          <div className={`text-center my-4 ${className}`}>
            <div className="text-primary/50 font-mono text-xs">
              <pre className="overflow-x-auto">
                {`
o=================================================o
`}
              </pre>
            </div>
          </div>
        )
      case "footer":
        return (
          <div className={`text-center my-4 ${className}`}>
            <div className="text-primary/50 font-mono text-xs">
              <pre className="overflow-x-auto">
                {`
+----------------+----------------+----------------+
|    ABOUT US    |    CONTACT     |     LEGAL      |
+----------------+----------------+----------------+
`}
              </pre>
            </div>
          </div>
        )
      case "box":
        return (
          <div className={`text-center my-4 ${className}`}>
            <div className="text-primary/70 font-mono text-xs">
              <pre className="overflow-x-auto">
                {`
+----------------------------------------------+
|                                              |
|  ${text || "BBS STYLE BOX"}                                 |
|                                              |
+----------------------------------------------+
`}
              </pre>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return getAsciiArt()
}
