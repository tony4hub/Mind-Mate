import { NextRequest, NextResponse } from 'next/server';
import { crisisDetectionService, CrisisDetectionResult } from '@/utils/crisisDetection';

interface CrisisDetectionRequest {
  message: string;
  conversationHistory?: string[];
  sessionId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CrisisDetectionRequest = await request.json();
    
    if (!body.message || !body.sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      );
    }

    const result: CrisisDetectionResult = crisisDetectionService.detectCrisis(
      body.message,
      body.conversationHistory
    );

    // Log crisis detection (without personal details)
    if (result.isCrisis) {
      console.log(`Crisis detected - Session: ${body.sessionId.substring(0, 8)}..., Severity: ${result.severity}, Keywords: ${result.detectedKeywords.length}`);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Crisis detection error:', error);
    
    // In case of error, err on the side of caution
    return NextResponse.json({
      isCrisis: true,
      severity: 'high',
      detectedKeywords: ['system_error'],
      confidence: 0.5,
      recommendedAction: 'show_resources'
    } as CrisisDetectionResult);
  }
}

export async function GET() {
  try {
    const keywords = crisisDetectionService.getKeywords();
    return NextResponse.json({ keywords });
  } catch (error) {
    console.error('Error fetching crisis keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.keywords) {
      return NextResponse.json(
        { error: 'Keywords are required' },
        { status: 400 }
      );
    }

    crisisDetectionService.updateKeywords(body.keywords);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Keywords updated successfully' 
    });
  } catch (error) {
    console.error('Error updating crisis keywords:', error);
    return NextResponse.json(
      { error: 'Failed to update keywords' },
      { status: 500 }
    );
  }
}