import { NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {

    const restrictedMethods = ["POST", "PUT", "DELETE"];
    const isApiWrite = req.nextUrl.pathname.startsWith('/api') && restrictedMethods.includes(req.method);
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin') && !req.nextUrl.pathname.startsWith('/admin/login');
    if (!req.cookies.get("token")?.value) {

        if (isApiWrite) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (isAdminPage) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
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