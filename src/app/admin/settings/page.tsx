'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Navigation } from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    Settings,
    Shield,
    Mail,
    Bell,
    Database,
    Download,
    Upload
} from 'lucide-react'

export default function AdminSettings() {
    const { user, isAuthenticated } = useAuth()
    const [settings, setSettings] = useState({
        platformName: 'Feasts AgriJobs',
        platformEmail: 'admin@feasts.co.ug',
        maxJobDuration: 12,
        autoApproveJobs: false,
        requireEmailVerification: true,
        allowSelfRegistration: true
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            window.location.href = '/'
            return
        }

        fetchSettings()
    }, [isAuthenticated, user])

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/admin/settings')
            if (response.ok) {
                const data = await response.json()
                setSettings(data.settings || settings)
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const saveSettings = async () => {
        setSaving(true)
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            })

            if (response.ok) {
                alert('Settings saved successfully!')
            } else {
                alert('Failed to save settings')
            }
        } catch (error) {
            console.error('Error saving settings:', error)
            alert('Error saving settings')
        } finally {
            setSaving(false)
        }
    }

    const exportData = async () => {
        try {
            const response = await fetch('/api/admin/export')
            if (response.ok) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `agrijobs-export-${new Date().toISOString().split('T')[0]}.json`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            }
        } catch (error) {
            console.error('Error exporting data:', error)
            alert('Error exporting data')
        }
    }

    if (!isAuthenticated || user?.role !== 'admin') {
        return null
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading settings...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
                    <p className="text-gray-600 mt-2">Configure platform-wide settings and preferences</p>
                </div>

                <div className="space-y-6">
                    {/* General Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Settings className="w-5 h-5" />
                                <span>General Settings</span>
                            </CardTitle>
                            <CardDescription>Basic platform configuration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                                <Input
                                    value={settings.platformName}
                                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                                    placeholder="Platform Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Platform Email</label>
                                <Input
                                    value={settings.platformEmail}
                                    onChange={(e) => setSettings({ ...settings, platformEmail: e.target.value })}
                                    placeholder="admin@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Job Duration (months)</label>
                                <Input
                                    type="number"
                                    value={settings.maxJobDuration}
                                    onChange={(e) => setSettings({ ...settings, maxJobDuration: parseInt(e.target.value) })}
                                    placeholder="12"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Job Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Shield className="w-5 h-5" />
                                <span>Job Management</span>
                            </CardTitle>
                            <CardDescription>Job posting and approval settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Auto-approve Jobs</label>
                                    <p className="text-xs text-gray-500">Automatically approve job postings without manual review</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.autoApproveJobs}
                                    onChange={(e) => setSettings({ ...settings, autoApproveJobs: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Require Email Verification</label>
                                    <p className="text-xs text-gray-500">Users must verify their email before posting jobs</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.requireEmailVerification}
                                    onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Allow Self Registration</label>
                                    <p className="text-xs text-gray-500">Allow users to register without admin approval</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.allowSelfRegistration}
                                    onChange={(e) => setSettings({ ...settings, allowSelfRegistration: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Database className="w-5 h-5" />
                                <span>Data Management</span>
                            </CardTitle>
                            <CardDescription>Export and manage platform data</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Export Platform Data</label>
                                    <p className="text-xs text-gray-500">Download all platform data as JSON</p>
                                </div>
                                <Button variant="outline" onClick={exportData}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Data
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Import Data</label>
                                    <p className="text-xs text-gray-500">Import data from a JSON file</p>
                                </div>
                                <Button variant="outline" disabled>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Import Data
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button onClick={saveSettings} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
