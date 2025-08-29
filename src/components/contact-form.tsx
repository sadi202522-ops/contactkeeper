"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Contact } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Sparkles, LoaderCircle, Phone, User, StickyNote } from "lucide-react";
import { generateContactNickname } from "@/ai/flows/generate-contact-nickname";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(
      /^\+?[0-9\s-()]+$/,
      "Invalid phone number format"
    ),
  nickname: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
  contactToEdit: Contact | null;
}

export function ContactForm({
  isOpen,
  onClose,
  onSave,
  contactToEdit,
}: ContactFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      nickname: "",
    },
  });

  useEffect(() => {
    if (contactToEdit) {
      form.reset(contactToEdit);
    } else {
      form.reset({ name: "", phoneNumber: "", nickname: "" });
    }
  }, [contactToEdit, form]);

  const handleGenerateNickname = async () => {
    const { name, phoneNumber } = form.getValues();
    if (!name || !phoneNumber) {
      toast({
        title: "Name and Phone Required",
        description: "Please enter a name and phone number to generate a nickname.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateContactNickname({ name, phoneNumber });
      form.setValue("nickname", result.nickname, { shouldValidate: true });
    } catch (error) {
      console.error("Error generating nickname:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate a nickname. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = (data: ContactFormValues) => {
    onSave({
      id: contactToEdit?.id || crypto.randomUUID(),
      ...data,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {contactToEdit ? "Edit Contact" : "Add New Contact"}
          </DialogTitle>
          <DialogDescription>
            {contactToEdit
              ? "Update the details for this contact."
              : "Fill in the details to add a new contact to your list."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="e.g. Jane Doe" {...field} className="pl-10"/>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                   <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="e.g. (123) 456-7890" {...field} className="pl-10" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                      <StickyNote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="e.g. JD" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleGenerateNickname}
                      disabled={isGenerating}
                      aria-label="Generate Nickname"
                    >
                      {isGenerating ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Contact</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
