'use client'

import React, { useState, useEffect } from 'react'
import type { Message } from '@/types/database'

export default function MessagesManagement() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages')
      if (!res.ok) return
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: messageId, status: 'read' })
      })
      if (!res.ok) return
      setMessages(messages.map(msg =>
        msg.id === messageId ? { ...msg, status: 'read' as const } : msg
      ))
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const handleDelete = async (message: Message) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const res = await fetch(`/api/admin/messages?id=${encodeURIComponent(message.id)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Delete failed')
      setMessages(messages.filter(msg => msg.id !== message.id))
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border-b border-slate-200 dark:border-slate-700 pb-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Messages</h2>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {messages.filter(m => m.status === 'unread').length} unread
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 text-center">
          <div className="text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-4">email</span>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm mt-2">Messages from your contact form will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-6 ${
                  message.status === 'unread' 
                    ? 'bg-blue-50 dark:bg-blue-900/20' 
                    : 'bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        message.status === 'unread'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400'
                      }`}>
                        {message.status}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleMarkAsRead(message.id)}
                        disabled={message.status === 'read'}
                        className="text-primary hover:text-primary/80 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Mark as Read
                      </button>
                      
                      <button
                        onClick={() => handleDelete(message)}
                        className="text-red-500 hover:text-red-700 text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {message.name}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {message.email}
                    </div>
                  </div>

                  <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {message.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
