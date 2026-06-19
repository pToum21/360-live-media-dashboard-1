'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Copy, Trash2, ExternalLink, Eye, Clock, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ShareLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
}

interface ShareLink {
  id: string;
  clientId: string;
  isActive: boolean;
  expiresAt: string | null;
  viewCount: number;
  lastViewedAt: string | null;
  createdAt: string;
  createdBy: {
    id: string;
    name: string | null;
    email: string;
  };
}

export function ShareLinkDialog({
  open,
  onOpenChange,
  clientId,
  clientName,
}: ShareLinkDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [selectedExpiration, setSelectedExpiration] = useState<string>('never');
  const [loadingLinks, setLoadingLinks] = useState(true);

  useEffect(() => {
    if (open) {
      loadShareLinks();
    }
  }, [open, clientId]);

  const loadShareLinks = async () => {
    try {
      setLoadingLinks(true);
      const response = await fetch(`/api/share/client/${clientId}`);
      if (response.ok) {
        const links = await response.json();
        setShareLinks(links);
      }
    } catch (error) {
      console.error('Error loading share links:', error);
    } finally {
      setLoadingLinks(false);
    }
  };

  const handleCreateLink = async () => {
    setLoading(true);
    try {
      // Calculate expiration date
      let expiresAt = null;
      if (selectedExpiration !== 'never') {
        const days = parseInt(selectedExpiration);
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);
      }

      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          expiresAt: expiresAt?.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create share link');
      }

      const newLink = await response.json();
      
      toast({
        title: 'Success',
        description: 'Share link created successfully',
      });

      // Reload links
      loadShareLinks();
    } catch (error) {
      console.error('Error creating share link:', error);
      toast({
        title: 'Error',
        description: 'Failed to create share link. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (linkId: string) => {
    const url = `${window.location.origin}/share/${linkId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copied!',
      description: 'Share link copied to clipboard',
    });
  };

  const handleRevokeLink = async (linkId: string) => {
    try {
      const response = await fetch(`/api/share/${linkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to revoke link');
      }

      toast({
        title: 'Success',
        description: 'Share link revoked successfully',
      });

      loadShareLinks();
    } catch (error) {
      console.error('Error revoking link:', error);
      toast({
        title: 'Error',
        description: 'Failed to revoke link. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const activeLinks = shareLinks.filter(link => link.isActive);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Dashboard - {clientName}</DialogTitle>
          <DialogDescription>
            Create a shareable link that allows clients to view the dashboard without signing in.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Create New Link Section */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <h3 className="font-medium">Create New Share Link</h3>
            
            <div className="space-y-2">
              <Label htmlFor="expiration">Link Expiration</Label>
              <Select value={selectedExpiration} onValueChange={setSelectedExpiration}>
                <SelectTrigger id="expiration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="never">Never expires</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleCreateLink} disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Share Link
            </Button>
          </div>

          {/* Existing Links Section */}
          <div className="space-y-4">
            <h3 className="font-medium">Active Share Links ({activeLinks.length})</h3>
            
            {loadingLinks ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : activeLinks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No active share links. Create one to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {activeLinks.map((link) => (
                  <div
                    key={link.id}
                    className="p-4 border rounded-lg space-y-3 hover:bg-muted/30 transition-colors"
                  >
                    {/* Link URL */}
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={`${window.location.origin}/share/${link.id}`}
                        className="flex-1 font-mono text-xs"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyLink(link.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/share/${link.id}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRevokeLink(link.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{link.viewCount} views</span>
                      </div>
                      {link.lastViewedAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Last viewed {formatDistanceToNow(new Date(link.lastViewedAt), { addSuffix: true })}</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="text-xs text-muted-foreground">
                      Created {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
                      {link.expiresAt && (
                        <> • Expires {formatDistanceToNow(new Date(link.expiresAt), { addSuffix: true })}</>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
