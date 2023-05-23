import { serialize } from "cookie"
import { NextResponse, NextRequest } from "next/server";
import { tursoClient } from "@/utils/tursoClient";
import { User } from "@/utils/types";
import { v4 as uuidv4} from "uuid"

export const runtime = 'edge'

export async function POST(req: NextRequest, res: NextResponse) {
  const formData = await req.formData();
  const {_action, email, name, password} = Object.fromEntries(formData)

  const redirectUrl = req.nextUrl.clone()

  // TODO: Implement SCRF token

  // * Validate email
  const emailRgx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g

  // * Get user data if user exists
  let userData;
  if(_action === "login" || _action === "register"){
    userData = await getUser(email as string)
  }

  if(_action === "register"){
    // Create redirect url
    redirectUrl.pathname = '/register'

    if(!emailRgx.test(email as string)){
      redirectUrl.searchParams.set("error", "Provide a valid email!")
      return NextResponse.redirect(redirectUrl, {status: 302})
    }

    if(!name || !email){
      redirectUrl.searchParams.set("error", "Fill in all fields!")
      return NextResponse.redirect(redirectUrl, {status: 302})
    }
  
    if(!userData){
      // create user account
      if(await createAccount(name as string, email as string)){
        redirectUrl.pathname = '/log-in'
        return NextResponse.redirect(redirectUrl, {status: 302})
      }
      redirectUrl.searchParams.set("error", "Failed to create account!")
      return NextResponse.redirect(redirectUrl, {status: 302})
    } else {
      redirectUrl.searchParams.set("error", "Account exists!")
      return NextResponse.redirect(redirectUrl, {status: 302})
    }
  }

  if(_action === "login"){
    // Create redirect url
    redirectUrl.pathname = '/log-in'

    if(!emailRgx.test(email as string)){
      redirectUrl.searchParams.set("error", "Provide a valid email!")
      return NextResponse.redirect(redirectUrl, {status: 302})
    }

    if(!email || !password){
      redirectUrl.searchParams.set("error", "Fill in all fields!")
      return NextResponse.redirect(redirectUrl, {status: 302})
    }
    if(userData){
      redirectUrl.pathname = '/add-new'
      const cookieData = serialize("userId", String(userData.id), {
        httpOnly: true,
        path: "/"
      })
      return new Response("", {
        status: 307,
        headers: {
          'Set-Cookie': cookieData,
          'Refresh': "0;url=" + redirectUrl.href
        }
      })
    }
    redirectUrl.searchParams.set("error", "Account doesn't exist!")
    return NextResponse.redirect(redirectUrl, {status: 302})
  }

  if(_action === "logout"){
    // Create redirect url
    redirectUrl.pathname = '/log-in'
    const userId = req.cookies.get("userId")

    redirectUrl.pathname = '/log-in'
    const cookieData = serialize("userId", String(userId), {
      httpOnly: true,
      path: "/",
      maxAge: -1
    })
    return new Response("", {
      status: 307,
      headers: {
        'Set-Cookie': cookieData,
        'Refresh': "0;url=" + redirectUrl.href
      },
    })
  }
}

/**
 * @description Gets user from the database by filtering the email
 * @param name Email of the user being queried
 * @returns {Promise<User|null>}
 */
async function getUser(email: string): Promise<User|null> {
  const response = await tursoClient.execute({
    sql: "select * from users where email = ?",
    args: [email]
  })
  
  return response.rows[0] as unknown as User || null;
}

/**
 * @description Gets user from the database by filtering the email
 * @param name Email of the user being queried
 * @returns {Promise<User|null>}
 */
async function createAccount(name: string, email: string): Promise<string|null> {
  await tursoClient.execute({
    sql: "insert into users(id, name, email) values(?, ?, ?)",
    args: [uuidv4(), name, email]
  })

  const response = await tursoClient.execute({
    sql: "select email from users where email = ?",
    args: [email]
  })
  
  return response.rows[0]["email"] as string || null;
}