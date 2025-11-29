import { searchSaavnTrack } from '@/lib/saavan';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get('query');
    
    if (!query) {
        return NextResponse.json({ error: 'No query provided' }, { status: 400 });
    }

    try {
        const response = await searchSaavnTrack(query);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}