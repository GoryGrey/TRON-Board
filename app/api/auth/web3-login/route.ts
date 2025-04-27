import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { ethers } from "ethers"
import { TronWeb } from "tronweb"

export async function POST(request: Request) {
  try {
    const { address, signature, message, provider } = await request.json()

    if (!address || !signature || !message || !provider) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Verify the signature
    let isValidSignature = false

    if (provider === "metamask") {
      // Verify Ethereum signature
      const recoveredAddress = ethers.verifyMessage(message, signature)
      isValidSignature = recoveredAddress.toLowerCase() === address.toLowerCase()
    } else if (provider === "tronlink") {
      // Verify Tron signature
      const tronWeb = new TronWeb({
        fullHost: "https://api.trongrid.io",
      })
      isValidSignature = tronWeb.trx.verifySignature(tronWeb.toHex(message), address, signature)
    }

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Create or get user in Supabase
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Check if user exists
    const { data: existingUser } = await supabase.from("profiles").select("*").eq("wallet_address", address).single()

    if (existingUser) {
      // User exists, sign them in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: existingUser.email,
        password: process.env.WEB3_USER_PASSWORD || "web3-default-password",
      })

      if (error) throw error

      return NextResponse.json({ success: true, user: data.user })
    } else {
      // Create new user
      const email = `${address.substring(0, 8)}@web3.user`
      const password = process.env.WEB3_USER_PASSWORD || "web3-default-password"

      // Sign up user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            wallet_address: address,
            wallet_provider: provider,
          },
        },
      })

      if (error) throw error

      // Create profile
      await supabase.from("profiles").insert({
        id: data.user?.id,
        email,
        wallet_address: address,
        wallet_provider: provider,
        username: `${provider}_${address.substring(0, 6)}`,
      })

      return NextResponse.json({ success: true, user: data.user })
    }
  } catch (error) {
    console.error("Web3 login error:", error)
    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 500 })
  }
}
