'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'

interface DatePickerProps {
    value: string
    onChange: (value: string) => void
    max?: string
    placeholder?: string
    required?: boolean
}

export function DatePicker({ value, onChange, max, placeholder, required }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(() => {
        if (value) {
            const date = new Date(value)
            return {
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate()
            }
        }
        return {
            year: new Date().getFullYear() - 25, // Default to 25 years ago
            month: 0,
            day: 1
        }
    })

    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const formatDate = (year: number, month: number, day: number) => {
        // Use local date to avoid timezone issues
        const date = new Date(year, month, day)
        const yearStr = date.getFullYear()
        const monthStr = String(date.getMonth() + 1).padStart(2, '0')
        const dayStr = String(date.getDate()).padStart(2, '0')
        return `${yearStr}-${monthStr}-${dayStr}`
    }

    const handleDateSelect = (year: number, month: number, day: number) => {
        const dateString = formatDate(year, month, day)

        // Check if date is valid and not in the future
        const maxDate = max ? new Date(max) : new Date()
        const selectedDateObj = new Date(year, month, day)

        if (selectedDateObj <= maxDate) {
            setSelectedDate({ year, month, day })
            onChange(dateString)
            setIsOpen(false)
        } else {
            alert('Please select a date that is not in the future.')
        }
    }

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getYears = () => {
        const currentYear = new Date().getFullYear()
        const maxYear = max ? new Date(max).getFullYear() : currentYear
        const minYear = maxYear - 80 // Allow up to 80 years ago
        const years = []

        for (let year = maxYear; year >= minYear; year--) {
            years.push(year)
        }
        return years
    }

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const displayValue = value ? new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : placeholder || 'Select date'

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
            >
                <span className={value ? 'text-gray-900' : 'text-gray-500'}>
                    {displayValue}
                </span>
                <Calendar className="w-4 h-4 text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4">
                    <div className="mb-3">
                        <h3 className="text-sm font-semibold text-gray-800 mb-1">Select Your Date of Birth</h3>
                        <p className="text-xs text-gray-600">Choose year, month, and day, then click "OK - Save Date" to confirm</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {/* Year Selector */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
                            <select
                                value={selectedDate.year}
                                onChange={(e) => setSelectedDate(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                            >
                                {getYears().map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        {/* Month Selector */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Month</label>
                            <select
                                value={selectedDate.month}
                                onChange={(e) => setSelectedDate(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                            >
                                {months.map((month, index) => (
                                    <option key={index} value={index}>{month}</option>
                                ))}
                            </select>
                        </div>

                        {/* Day Selector */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Day</label>
                            <select
                                value={selectedDate.day}
                                onChange={(e) => setSelectedDate(prev => ({ ...prev, day: parseInt(e.target.value) }))}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                            >
                                {Array.from({ length: getDaysInMonth(selectedDate.year, selectedDate.month) }, (_, i) => i + 1).map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Selected Date Preview */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                        <div className="text-sm text-gray-600 mb-1">Selected Date:</div>
                        <div className="text-lg font-medium text-gray-900">
                            {months[selectedDate.month]} {selectedDate.day}, {selectedDate.year}
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDateSelect(selectedDate.year, selectedDate.month, selectedDate.day)}
                            className="px-6 py-2 text-base font-semibold text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            style={{ backgroundColor: '#d4b327' }}
                        >
                            ✓ OK - Save Date
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
