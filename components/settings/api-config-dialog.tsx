'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Key, ExternalLink } from 'lucide-react'

interface ApiConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  connection: {
    id: string
    name: string
    description: string
  }
}

export function ApiConfigDialog({ open, onOpenChange, connection }: ApiConfigDialogProps) {
  const [apiKey, setApiKey] = useState('')
  const [saving, setSaving] = useState(false)

  const getConfigFields = () => {
    switch (connection.id) {
      case 'google-analytics':
        return {
          fields: [
            { id: 'property_id', label: 'Property ID', placeholder: 'GA-XXXXXXXXX', type: 'text' },
            { id: 'credentials', label: 'Service Account JSON', placeholder: 'Paste JSON credentials', type: 'textarea' }
          ],
          docsUrl: 'https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries'
        }
      case 'mailchimp':
        return {
          fields: [
            { id: 'api_key', label: 'API Key', placeholder: 'xxxxxxxxxxxxxxxxxxxx-us1', type: 'password' },
            { id: 'list_id', label: 'Audience ID (List ID)', placeholder: 'abc123xyz', type: 'text' }
          ],
          docsUrl: 'https://mailchimp.com/developer/marketing/guides/quick-start/#generate-your-api-key'
        }
      case 'linkedin':
        return {
          fields: [
            { id: 'organization_id', label: 'Organization ID', placeholder: '12345678', type: 'text' },
            { id: 'access_token', label: 'Access Token', placeholder: 'AQxxxxxxxxxxxxxx', type: 'password' }
          ],
          docsUrl: 'https://learn.microsoft.com/en-us/linkedin/marketing/getting-started'
        }
      case 'instagram':
        return {
          fields: [
            { id: 'account_id', label: 'Instagram Business Account ID', placeholder: '17841XXXXXXXXXX', type: 'text' },
            { id: 'access_token', label: 'Access Token', placeholder: 'EAAxxxxxxxxxxxxxx', type: 'password' }
          ],
          docsUrl: 'https://developers.facebook.com/docs/instagram-api/getting-started'
        }
      default:
        return { fields: [], docsUrl: '' }
    }
  }

  const config = getConfigFields()

  const handleSave = async () => {
    setSaving(true)
    const toastId = toast.loading('Saving configuration...')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success(`${connection.name} configured successfully!`, { id: toastId })
      onOpenChange(false)
      setApiKey('')
    } catch (error) {
      toast.error('Failed to save configuration', { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass-card border-0">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Key className="w-5 h-5 text-green-600 dark:text-green-400" />
            Configure {connection.name}
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            {connection.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {config.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="text-gray-900 dark:text-gray-100">
                {field.label}
              </Label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  className="w-full min-h-[120px] px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none"
                />
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                />
              )}
            </div>
          ))}

          {config.docsUrl && (
            <a
              href={config.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              View setup documentation
            </a>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="dark:border-gray-600 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#2E8741] hover:bg-[#236933]"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
