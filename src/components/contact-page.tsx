
"use client";

import { useState, useMemo, useEffect } from "react";
import type { Contact } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { ContactForm } from "./contact-form";
import { ContactList } from "./contact-list";
import { Logo } from "./icons";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
} from "firebase/firestore";
import { Input } from "@/components/ui/input";

export function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(collection(db, "contacts"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contactsData = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Contact)
      );
      setContacts(contactsData);
    });
    return () => unsubscribe();
  }, []);

  const handleAddContact = () => {
    setContactToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setContactToEdit(contact);
    setIsFormOpen(true);
  };

  const handleDeleteContact = async (contactId: string) => {
    await deleteDoc(doc(db, "contacts", contactId));
  };

  const handleSaveContact = async (contact: Contact) => {
    const isEditing = contacts.some((c) => c.id === contact.id);
    if (isEditing) {
      const docRef = doc(db, "contacts", contact.id);
      await updateDoc(docRef, { ...contact });
    } else {
      await addDoc(collection(db, "contacts"), {
        ...contact,
      });
    }
  };
  
  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredAndSortedContacts = useMemo(() => {
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phoneNumber.includes(searchTerm)
    );

    return [...filtered].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }, [contacts, sortOrder, searchTerm]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Logo />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Contact Keeper
          </h1>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-4">
           <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleAddContact} className="shrink-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </header>

      <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm">
        <ContactList
          contacts={filteredAndSortedContacts}
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
