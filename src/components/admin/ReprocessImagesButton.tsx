import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const ReprocessImagesButton = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReprocess = async () => {
    setIsProcessing(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Você precisa estar autenticado');
      }

      toast({
        title: 'Processamento iniciado',
        description: 'Otimizando todas as imagens antigas. Isso pode levar alguns minutos...',
      });

      const response = await fetch(
        `https://cpqcdrchuzrcgswfhmdo.supabase.co/functions/v1/reprocess-gallery-images`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao processar imagens');
      }

      toast({
        title: 'Processamento concluído!',
        description: `Total: ${result.results.total} | Processadas: ${result.results.processed} | Já otimizadas: ${result.results.skipped} | Erros: ${result.results.errors}`,
      });

      // Reload the page to show updated images
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      console.error('Erro ao reprocessar imagens:', error);
      toast({
        title: 'Erro ao processar imagens',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Otimizar Imagens Antigas
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Otimizar todas as imagens antigas?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação irá:
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li>Redimensionar todas as imagens para máximo 600x600px</li>
              <li>Comprimir para reduzir o tamanho para menos de 200KB</li>
              <li>Adicionar marca d'água "Popular Vet"</li>
              <li>Substituir as imagens antigas pelas otimizadas</li>
            </ul>
            <p className="mt-2 font-semibold">
              Este processo pode levar vários minutos dependendo da quantidade de imagens.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleReprocess}>
            Sim, otimizar todas
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
