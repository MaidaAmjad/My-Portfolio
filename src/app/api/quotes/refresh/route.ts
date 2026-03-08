import { NextResponse } from 'next/server'
import { fetchAndSaveNewQuote, cleanupExpiredQuotes } from '@/services/quotes'

export async function POST() {
  try {
    // First, cleanup expired quotes
    await cleanupExpiredQuotes()
    
    // Then fetch and save a new quote
    const success = await fetchAndSaveNewQuote()
    
    if (success) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Quote refreshed successfully',
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to refresh quote',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error refreshing quote:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Just cleanup expired quotes on GET request
    await cleanupExpiredQuotes()
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Expired quotes cleaned up',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error cleaning up quotes:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
