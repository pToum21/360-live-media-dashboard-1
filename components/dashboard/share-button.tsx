'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { ShareLinkDialog } from '@/components/forms/share-link-dialog';

interface ShareButtonProps {
  clientId: string;
  clientName: string;
}

export function ShareButton({ clientId, clientName }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share Dashboard
      </Button>

      <ShareLinkDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        clientId={clientId}
        clientName={clientName}
      />
    </>
  );
}
