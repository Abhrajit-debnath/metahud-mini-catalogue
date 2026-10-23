import { generateToken } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const { email, password } = await request.json();

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = generateToken({ email });
        const res = NextResponse.json({ token });



        res.cookies.set('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        return res;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });


}