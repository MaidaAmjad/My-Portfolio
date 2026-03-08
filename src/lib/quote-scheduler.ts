import { fetchAndSaveNewQuote, cleanupExpiredQuotes } from '@/services/quotes'

// This function can be called by a cron job or scheduled task
export async function scheduleQuoteRefresh() {
  try {
    console.log('Starting scheduled quote refresh...')
    
    // First cleanup expired quotes
    await cleanupExpiredQuotes()
    
    // Then fetch a new quote
    const success = await fetchAndSaveNewQuote()
    
    if (success) {
      console.log('✅ Quote refreshed successfully')
    } else {
      console.log('❌ Failed to refresh quote')
    }
    
    return success
  } catch (error) {
    console.error('❌ Error in scheduled quote refresh:', error)
    return false
  }
}

// Function to be called every 10 minutes
export async function periodicQuoteRefresh() {
  console.log('🔄 Running periodic quote refresh...')
  return await scheduleQuoteRefresh()
}

// Function to be called daily for cleanup
export async function dailyCleanup() {
  try {
    console.log('🧹 Running daily cleanup...')
    await cleanupExpiredQuotes()
    console.log('✅ Daily cleanup completed')
    return true
  } catch (error) {
    console.error('❌ Error in daily cleanup:', error)
    return false
  }
}
