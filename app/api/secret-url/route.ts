import { NextResponse } from "next/server";

export async function GET(){
    return NextResponse.json({secret_url:"https://www.ieee-jaduniv.in/"})
}