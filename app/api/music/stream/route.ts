import { searchSaavnDirect } from '@/lib/saavan';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: 'No id provided' }, { status: 400 });
    }
     try {
            const response = await searchSaavnDirect(id);
            return NextResponse.json(response);
        } catch (error) {
            console.error('Error fetching data:', error);
            return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
        }
    }