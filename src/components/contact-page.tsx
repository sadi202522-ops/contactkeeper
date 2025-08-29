"use client";

import { useState, useMemo } from "react";
import type { Contact } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ContactForm } from "./contact-form";
import { ContactList } from "./contact-list";
import { Logo } from "./icons";

const initialContacts: Contact[] = [
  {
    id: "1",
    name: "Alice Johnson",
    phoneNumber: "555-0101",
    nickname: "AJ",
  },
  {
    id: "2",
    name: "Charlie Brown",
    phoneNumber: "555-0103",
    nickname: "Chuck",
  },
  {
    id: "3",
    name: "Bob Smith",
    phoneNumber: "555-0102",
    nickname: "Bobby",
  },
];

export function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleAddContact = () => {
    setContactToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setContactToEdit(contact);
    setIsFormOpen(true);
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter((c) => c.id !== contactId));
  };

  const handleSaveContact = (contact: Contact) => {
    const isEditing = contacts.some((c) => c.id === contact.id);
    if (isEditing) {
      setContacts(contacts.map((c) => (c.id === contact.id ? contact : c)));
    } else {
      setContacts([...contacts, contact]);
    }
  };

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }, [contacts, sortOrder]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Logo />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Contact Keeper
          </h1>
        </div>
        <Button onClick={handleAddContact}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </header>

      <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm">
        <ContactList
          contacts={sortedContacts}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          onSort={handleSort}
          sortOrder={sortOrder}
        />
      </div>

      <ContactForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveContact}
        contactToEdit={contactToEdit}
      />
    </div>
  );
}
