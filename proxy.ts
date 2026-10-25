import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {

    const restrictedMethods = ["POST", "PUT", "DELETE"];
    const token = req.cookies.get("token")?.value;
    const isApiWrite = req.nextUrl.pathname.startsWith('/api') && restrictedMethods.includes(req.method);
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin') && !req.nextUrl.pathname.startsWith('/admin/login');

    if (isApiWrite || isAdminPage) {
        if (!token) {

            if (isApiWrite) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }


            return NextResponse.redirect(new URL('/admin/login', req.url));


        }
        try {
            await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        } catch (error) {

            const res = isApiWrite ? NextResponse.json({ error: 'Token Expired' }, { status: 401 }) : NextResponse.redirect(new URL('/admin/login', req.url));
            res.cookies.delete("token");
            return res;
        }

    }



    return NextResponse.next();

}

//  matcher on routes that should be protected by the middleware 
export const config = {
    matcher: ["/api/products/:path*",
        "/admin/:path*",
    ],

};