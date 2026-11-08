"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteAccount } from "./actions";

export function DeleteAccount() {
  const [pending, startTransition] = useTransition();

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" />}>Hesabımı sil</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hesabın silinsin mi?</DialogTitle>
          <DialogDescription>
            Hesabın, ilerlemen, serin ve oluşturduğun düellolar kalıcı olarak silinir. Bu işlem
            geri alınamaz.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Vazgeç</DialogClose>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={() => startTransition(() => deleteAccount())}
          >
            {pending ? "Siliniyor…" : "Evet, sil"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
