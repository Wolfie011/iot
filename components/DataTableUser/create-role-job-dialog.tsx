"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { roleSchema, roleSchemaInput } from "@/types/permission/schema";
import { toast } from "@/hooks/use-toast";
import emitter from "@/lib/eventBus";
import { createRoleJob } from "@/app/actions/role-job.action";

export function RoleJobDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<roleSchemaInput>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      roleName: "",
      roleDescription: "",
    },
  });

  const onSubmit = useCallback(
    async (values: roleSchemaInput) => {
      try {
        const result = await createRoleJob({
          name: values.roleName,
          description: values.roleDescription,
        });

        if (result.state === "error") {
          toast({
            variant: "destructive",
            description: result.error || "Błąd podczas tworzenia roli",
          });
          return;
        }

        toast({
          description: result.success || "Rola została utworzona",
        });

        if (result.data) {
          emitter.emit("roleCreated", result.data);
        }

        form.reset();
        setOpen(false);
      } catch (error) {
        console.error("Unexpected error:", error);
        toast({
          variant: "destructive",
          description: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie.",
        });
      }
    },
    [form]
  );

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Dodaj Rolę
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Utwórz Nową Rolę (Prace)</DialogTitle>
          <DialogDescription>Dodaj nową rolę dla pracownika.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa Roli</FormLabel>
                  <FormControl>
                    <Input placeholder="Doktor, Administrator, Pielęgniarka, Dyrektor..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Unikalna nazwa roli w systemie.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis Roli</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Zakres odpowiedzialności..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Krótki opis, co ta rola może robić.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Anuluj
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Tworzenie..." : "Utwórz Rolę"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
