'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! I'm your Feasts AgriJobs assistant for Uganda. How can I help you find the perfect agricultural opportunity today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState('')

    const handleSendMessage = () => {
        if (!inputValue.trim()) return

        const newMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, newMessage])
        setInputValue('')

        // Simulate bot response
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                text: getBotResponse(inputValue),
                sender: 'bot',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, botResponse])
        }, 1000)
    }

    const getBotResponse = (userMessage: string) => {
        const message = userMessage.toLowerCase()

        if (message.includes('job') || message.includes('work')) {
            return "I can help you find agricultural jobs in Uganda! What type of work are you looking for? (e.g., coffee farming, dairy, organic vegetables, tractor operation)"
        } else if (message.includes('employer') || message.includes('hire')) {
            return "Are you looking to hire agricultural workers? I can help you find qualified candidates across Uganda. What type of position are you looking to fill?"
        } else if (message.includes('skill') || message.includes('experience')) {
            return "Great! Based on your skills, I can recommend relevant job opportunities. What specific agricultural skills do you have? (e.g., coffee processing, livestock management, irrigation)"
        } else if (message.includes('location') || message.includes('where')) {
            return "I can help you find jobs in your area! Which region are you in? (Central, Eastern, Western, or Northern Uganda)"
        } else if (message.includes('salary') || message.includes('pay')) {
            return "I can show you salary ranges for different agricultural positions in Uganda. What type of role are you interested in?"
        } else if (message.includes('coffee')) {
            return "Coffee farming is very popular in Uganda! I can help you find coffee-related jobs in regions like Masaka, Mukono, or other coffee-growing areas."
        } else if (message.includes('dairy') || message.includes('cattle')) {
            return "Dairy farming opportunities are available in Eastern Uganda and other regions. I can help you find dairy farm jobs or workers."
        } else {
            return "I'm here to help with agricultural job matching in Uganda! You can ask me about finding jobs, hiring workers, skills matching, locations, or salary information."
        }
    }

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Button
                        onClick={() => setIsOpen(true)}
                        className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
                    >
                        <MessageCircle className="w-6 h-6 text-white" />
                    </Button>
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-80 h-96">
                    <Card className="h-full flex flex-col shadow-xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b bg-green-600 text-white rounded-t-lg">
                            <div className="flex items-center space-x-2">
                                <Bot className="w-5 h-5" />
                                <span className="font-semibold">Feasts AgriJobs Assistant</span>
                            </div>
                            <Button
                                onClick={() => setIsOpen(false)}
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-green-700"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs px-3 py-2 rounded-lg ${message.sender === 'user'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                            }`}
                                    >
                                        <div className="flex items-start space-x-2">
                                            {message.sender === 'bot' && (
                                                <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            )}
                                            {message.sender === 'user' && (
                                                <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            )}
                                            <p className="text-sm">{message.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>

                        {/* Input */}
                        <div className="p-4 border-t">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type your message..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    size="sm"
                                    className="px-3"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </>
    )
}
