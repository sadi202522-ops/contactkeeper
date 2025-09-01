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
import { Sparkles, LoaderCircle, Phone, User, StickyNote, Image as ImageIcon, FileText } from "lucide-react";
import { generateContactNickname } from "@/ai/flows/generate-contact-nickname";
import { generateContactPhoto } from "@/ai/flows/generate-contact-photo";
import { generateContactBio } from "@/ai/flows/generate-contact-bio";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(
      /^\+?[0-9\s-()]+$/,
      "Invalid phone number format"
    ),
  nickname: z.string().min(1, "Nickname is required"),
  photoUrl: z.string().optional(),
  bio: z.string().optional(),
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
  const [isGeneratingNickname, setIsGeneratingNickname] = useState(false);
  const [isGeneratingPhoto, setIsGeneratingPhoto] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      nickname: "",
      photoUrl: "",
      bio: "",
    },
  });

  const photoUrl = form.watch("photoUrl");

  useEffect(() => {
    if (contactToEdit) {
      form.reset(contactToEdit);
    } else {
      form.reset({ name: "", phoneNumber: "", nickname: "", photoUrl: "", bio: "" });
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

    setIsGeneratingNickname(true);
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
      setIsGeneratingNickname(false);
    }
  };
  
  const handleGeneratePhoto = async () => {
    const name = form.getValues("name");
    if (!name) {
      toast({
        title: "Name Required",
        description: "Please enter a name to generate a photo.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingPhoto(true);
    try {
      const result = await generateContactPhoto({ name });
      form.setValue("photoUrl", result.photoUrl, { shouldValidate: true });
    } catch (error) {
      console.error("Error generating photo:", error);
      toast({
        title: "Photo Generation Failed",
        description: "Could not generate a photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPhoto(false);
    }
  };
  
  const handleGenerateBio = async () => {
    const { name, nickname } = form.getValues();
    if (!name || !nickname) {
      toast({
        title: "Name and Nickname Required",
        description: "Please enter a name and nickname to generate a bio.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingBio(true);
    try {
      const result = await generateContactBio({ name, nickname });
      form.setValue("bio", result.bio, { shouldValidate: true });
    } catch (error) {
      console.error("Error generating bio:", error);
      toast({
        title: "Bio Generation Failed",
        description: "Could not generate a bio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingBio(false);
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
             <div className="flex flex-col items-center gap-4">
               <div className="relative">
                {isGeneratingPhoto ? (
                  <Skeleton className="h-24 w-24 rounded-full" />
                ) : photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt="Contact photo"
                    width={96}
                    height={96}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                 <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full"
                    onClick={handleGeneratePhoto}
                    disabled={isGeneratingPhoto}
                    aria-label="Generate Photo"
                  >
                   {isGeneratingPhoto ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                  </Button>
               </div>
            </div>
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
                      disabled={isGeneratingNickname}
                      aria-label="Generate Nickname"
                    >
                      {isGeneratingNickname ? (
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
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                       <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <FormControl>
                        <Textarea placeholder="A short bio about the contact" {...field} className="pl-10 min-h-[60px]" />
                       </FormControl>
                    </div>
                     <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleGenerateBio}
                      disabled={isGeneratingBio}
                      aria-label="Generate Bio"
                    >
                      {isGeneratingBio ? (
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
