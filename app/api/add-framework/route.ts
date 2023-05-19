import { NextResponse, NextRequest } from "next/server";
import { tursoClient } from "@/utils/tursoClient";
import { Framework } from "@/app/page";

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const {name, language, url, stars} = Object.fromEntries(formData)

  if(!name || !language || !url || !stars){
    NextResponse.json({ message: "Some fields are missing!"}, {status: 422})
  }
  
  const frameworkExists = await getFramework(name as string, url as string);

  // Create redirect url
  const addNewUrl = req.nextUrl.clone()
  addNewUrl.pathname = '/add-new'

  if(frameworkExists !== null){
    return NextResponse.redirect(addNewUrl, {status: 302})
  }
  
  const add = await tursoClient.execute({
    sql: "insert into frameworks(name, language, url, stars) values(?, ?, ?, ?);",
    args: [name as string, language as string, url as string, stars as unknown as number]
  });

  return NextResponse.redirect(addNewUrl, {status: 302})
}

/**
 * @description Gets framework from the database by filtering the name and url columns
 * @param name Name of the framework being fetched
 * @param url GitHub url of the framework being fetched
 * @returns {Promise<Framework|null>}
 */
async function getFramework(name: string, url: string): Promise<Framework|null> {
  const response = await tursoClient.execute({
    sql: "select * from frameworks where url = ? or name = ?",
    args: [url, name]
  })
  
  if(response.rows.length){
    return response.rows[0] as unknown as Framework
  }
  return null

}